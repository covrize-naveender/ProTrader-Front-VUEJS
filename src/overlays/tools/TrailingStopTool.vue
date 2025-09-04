<script>
import { Overlay, Tool } from 'trading-vue-js'
import Pin from './primitives/pin.js'
import FixedPinX from './primitives/fixedPinX.js'
import Seg from './primitives/seg.js'
import Ray from './primitives/ray.js'
import { mapActions, mapGetters } from 'vuex'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { chartEvents } from "../../chartEvents";
import { debounce } from "../../utils/helper";
import moment from 'moment/moment'
const HIGH = 2
const CLOSE = 4
const LOW = 3

export default {
  name: 'TrailingStopTool',
  mixins: [Overlay, Tool, ToolSavingMixins],

  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.0.0' }
    },
    tool() {
      return {
        // Descriptor for the tool
        group: 'Measurements',
        type: 'PL',
        hint: 'Price Range',
        data: [], // Default data
        settings: {
          price: true, time: true, showTrailingStop: false,
          isOnChart: false,
          isDialogBoxOpened: false,
          entryPrice: 0,
          stopPrice: 0,
          trailingType: '',
          stepPrice: 0.01,
          positionSize: 1000,
          riskValueInCash: 50,
          riskValueInPct: 10,
          atrPeriod: 14,
          atrMultiplier: 5,
          undo: 1
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
      let uuidRef = this.$props?.settings?.$uuid;
      this.localMap = this.keys.map
      delete this.keys.map.Backspace
      delete this.keys.map.Delete
      // this.$emit('object-selected', false)

      //--- dispatch action to show the dialog box

      let text = JSON.stringify(this.$props?.settings);
      let modalSettings = JSON.parse(text)

      this.pins.push(
        new Pin(this, 'p1', {
          hidden: this.shift,
        })
      )

      // Second one is following mouse until it clicks

      let mousePosition = this.mouse.y$;
      let stopPrice;
      let fixedTime = this.pins[0].t;
      if (mousePosition) {
        let updatedSettings = {
          entryPrice: parseFloat(mousePosition.toFixed(3)),
          isDialogBoxOpened: true,
          isOnChart: true
        }
        stopPrice = parseFloat((
          updatedSettings.entryPrice -
          updatedSettings.entryPrice * 0.01
        ).toFixed(3))
        updatedSettings.stopPrice = stopPrice
        this.$emit("change-settings", updatedSettings);
        modalSettings.startClickTime = this.$props.layout.ti_map.i2t(fixedTime)
        modalSettings = { ...modalSettings, ...updatedSettings }
        chartEvents.$emit('updateTrailingStopModal', modalSettings)

      } else {
        stopPrice = parseFloat(modalSettings.p2?.[1]);

      }

      let fixedX = stopPrice;

      this.pins.push(
        new FixedPinX(this, 'p2', {
          state: 'settled',
          hidden: (this.trailingType == 'atr' || this.trailingType == '%value' || this.trailingType == 'value') ? true : this.shift,
          isFixedPin: true,
          fixedX: fixedX,
          fixedTime: fixedTime,
        })
      )

      let stepValue = parseFloat(modalSettings.stepPrice);

      this.stepValue = stepValue


      // First pin is settled at the mouse position
      this.pins[0].on('settled', () => {
        // this.$emit('change-settings', {
        //   entryPrice: this.pins[0].y$.toFixed(3)
        // })
        // let props = {
        //   stopPrice: parseFloat(this.stopPrice),
        //   stepPrice: this.stepPrice,
        //   entryPrice: parseFloat(this.pins[0].y$.toFixed(3))
        // }
        // this.updatePointsData(props)
      })
      this.pins[1].on('settled', () => {
        // let props = {
        //   stopPrice: parseFloat(this.pins[1].y$.toFixed(3)),
        //   stepPrice: this.stepPrice,
        //   entryPrice: parseFloat(this.entryPrice)
        // }
        // this.updatePointsData(props)
        // this.$emit('change-settings', {          
        //   stopPrice: this.pins[1].y$.toFixed(3)
        // })        
      })
      this.pins[1].y$ = stopPrice
      this.pins[1].y = this.$props.layout.$2screen(this.pins[1].y$)
      this.pins[1].x = fixedX
      this.pins[1].t = fixedTime

      this.pins[1].update_settings('p2', this.$props.cursor.t, this.pins[1].y$)
      // end drawing mode
      this.set_state('finished')
      this.$emit('drawing-mode-off')
      // Deselect the tool in shiftMode
      /*if (this.shift) {
        this._$emit('custom-event', {
          event: 'object-selected',
          args: [],
        })
      }*/

      this.tGap =
        this.$props.layout.candles[1].raw[0] -
        this.$props.layout.candles[0].raw[0]
      // this.pins[0].update()
      // this.pins[1].update()
      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (!this.p1 || !this.p2) return
      const layout = this.$props.layout
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      // Background
      ctx.globalAlpha = 1

      ctx.beginPath()
      ctx.strokeStyle = '#23a776'
      this.pins[1].t = this.p1[0]
      new Ray(this, ctx).draw(this.p1, [this.p1[0] + this.tGap, this.p1[1]])
      ctx.stroke()

      ctx.globalAlpha = 0
      new Seg(this, ctx).draw(this.p1, this.p2)
      ctx.stroke()
      ctx.globalAlpha = 1

      if (this.trailingType == 'atr') {
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        const entryPrice = this.p1[1]
        let lastHighestPoint = 0,
          lastSLPosition = this.p2[1],
          lastPosition = null
        let first = true,
          slChanged = false
        const candles = this.$props.layout.candles;
        let checkAtr
        // console.log(candles, "candle");
        for (let i = 0; i < candles.length; i++) {

          const candle = candles[i];
          const nextCandle = candles[i + 1] ? candles[i + 1] : null
          const pointWithNext = nextCandle?.x ? nextCandle.x : candle.x + candle.w

          if (candle.raw[0] < this.p1[0]) continue;
          let atrVal = this.$props.data.find(x => x[0] == candle.raw[0])[1]
          if (first) {
            checkAtr = candle.raw[CLOSE] - atrVal
            ctx.moveTo(candle.x, layout.$2screen(checkAtr));
            ctx.lineTo(pointWithNext, layout.$2screen(checkAtr));
            // lastSLPosition += this.atrVal;
            first = false;
            continue;
          }
          checkAtr = checkAtr > candle.raw[CLOSE] - atrVal ? checkAtr : candle.raw[CLOSE] - atrVal
          if (candle.raw[HIGH] > lastHighestPoint) {
            lastHighestPoint = candle.raw[HIGH];
            // lastSLPosition += this.atrVal;
          }

          if (!slChanged && checkAtr > entryPrice && lastPosition) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.moveTo(lastPosition.x, lastPosition.y);
          }

          ctx.lineTo(candle.x, layout.$2screen(checkAtr));
          ctx.lineTo(pointWithNext, layout.$2screen(checkAtr));
          lastPosition = {
            x: pointWithNext,
            y: layout.$2screen(checkAtr),
          };

          //--- check for SL hits
          // if (candle.raw[LOW] < lastSLPosition) break;
        }

        ctx.stroke()

      }
      else if (this.trailingType == 'value') {
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        let entryPrice = this.p1[1]
        let lastHighestPoint = entryPrice
        let lastPosition = null
        let first = true, slChanged = false
        let dollerVal = this.riskValueInCash

        const candles = this.$props.layout.candles
        for (let i = 0; i < candles.length; i++) {
          const candle = candles[i];
          const nextCandle = candles[i + 1] ? candles[i + 1] : null
          const pointWithNext = nextCandle?.x ? nextCandle.x : candle.x + candle.w

          if (candle.raw[0] < this.p1[0]) continue;
          if (candle.raw[HIGH] > lastHighestPoint) {
            lastHighestPoint = candle.raw[HIGH];
          }
          if (first) {

            ctx.moveTo(candle.x, layout.$2screen(lastHighestPoint - dollerVal))
            ctx.lineTo(pointWithNext, layout.$2screen(lastHighestPoint - dollerVal));

            first = false;
            continue;
          }
          if (!slChanged && (lastHighestPoint - dollerVal) > entryPrice && lastPosition) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.moveTo(lastPosition.x, lastPosition.y);
          }
          ctx.lineTo(candle.x, layout.$2screen(lastHighestPoint - dollerVal));
          ctx.lineTo(pointWithNext, layout.$2screen(lastHighestPoint - dollerVal));
          lastPosition = {
            x: pointWithNext,
            y: layout.$2screen(lastHighestPoint - dollerVal),
          };
        }
        ctx.stroke()

      }
      else if (this.trailingType == '%value') {
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        let entryPrice = this.p1[1]
        let lastHighestPoint = entryPrice
        let lastPosition = null
        let first = true, slChanged = false
        let percentValue = (1 - this.riskValueInPct / 100)

        const candles = this.$props.layout.candles
        for (let i = 0; i < candles.length; i++) {
          const candle = candles[i];
          const nextCandle = candles[i + 1] ? candles[i + 1] : null
          const pointWithNext = nextCandle?.x ? nextCandle.x : candle.x + candle.w

          if (candle.raw[0] < this.p1[0]) continue;
          if (candle.raw[HIGH] > lastHighestPoint) {
            lastHighestPoint = candle.raw[HIGH];
          }
          if (first) {

            ctx.moveTo(candle.x, layout.$2screen(lastHighestPoint * percentValue))
            ctx.lineTo(pointWithNext, layout.$2screen(lastHighestPoint * percentValue));

            first = false;
            continue;
          }
          if (!slChanged && (lastHighestPoint * percentValue) > entryPrice && lastPosition) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.moveTo(lastPosition.x, lastPosition.y);
          }
          ctx.lineTo(candle.x, layout.$2screen(lastHighestPoint * percentValue));
          ctx.lineTo(pointWithNext, layout.$2screen(lastHighestPoint * percentValue));
          lastPosition = {
            x: pointWithNext,
            y: layout.$2screen(lastHighestPoint * percentValue),
          };
        }
        ctx.stroke()

      }
      else {
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        const entryPrice = this.p1[1]
        let lastHighestPoint = 0,
          lastSLPosition = this.p2[1],
          lastPosition = null
        let first = true,
          slChanged = false
        const candles = this.$props.layout.candles;
        let candleClose

        for (let i = 0; i < candles.length; i++) {
          const candle = candles[i];
          const nextCandle = candles[i + 1] ? candles[i + 1] : null
          const preCandle = i != 0 ? candles[i-1]:null
          const pointWithNext = nextCandle?.x ? nextCandle.x : candle.x + candle.w

          if (candle.raw[0] < this.p1[0]) continue;

          if (first) {
            candleClose = candle.raw[CLOSE];
            ctx.moveTo(candle.x, layout.$2screen(lastSLPosition));
            ctx.lineTo(pointWithNext, layout.$2screen(lastSLPosition));
            lastSLPosition += this.stepValue;
            first = false;
            continue;
          }

          if (preCandle && candle.raw[CLOSE] > preCandle.raw[CLOSE]) {
            candleClose = candle.raw[CLOSE]
            lastHighestPoint = candle.raw[HIGH];
            lastSLPosition += this.stepValue;
          }

          if (!slChanged && lastSLPosition > entryPrice && lastPosition) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.moveTo(lastPosition.x, lastPosition.y);
          }

          ctx.lineTo(candle.x, layout.$2screen(lastSLPosition));
          ctx.lineTo(pointWithNext, layout.$2screen(lastSLPosition));
          lastPosition = {
            x: pointWithNext,
            y: layout.$2screen(lastSLPosition),
          };

          //--- check for SL hits
          if (candle.raw[LOW] < lastSLPosition) break;
        }

        ctx.stroke()
      }

      this.render_pins(ctx)
    },
    calc() {
      return {
        props: {
          atrPeriod: { def: 15, text: 'atrPeriod' },
          atrMultiplier: { def: 1, text: 'atrMultiplier' },
        },
        conf: { renderer: 'Spline' },
        update: `
                    return (atr(atrPeriod)[0]* atrMultiplier)
                `
      }
    },
    use_for() {
      return ['TrailingStopTool']
    },
    data_colors() {
      return [this.color]
    },
    updatePointsData(props) {
      let { stopPrice, stepPrice, entryPrice, trailingType, atrPeriod, atrMultiplier, riskValueInPct, positionSize, riskValueInCash, periodStartDate } = props
      if (trailingType == 'atr' || trailingType == '%value' || trailingType == 'value') {
        this.pins[1].hidden = true
      }
      else {
        this.pins[1].hidden = false
      }
      stepPrice = parseFloat(stepPrice)
      stopPrice = parseFloat(stopPrice)
      entryPrice = parseFloat(entryPrice)

      this.stepValue = stepPrice
      if (!this.pins[0]) return
      this.pins[0].y$ = entryPrice
      this.pins[0].y = this.$props.layout.$2screen(this.pins[0].y$)
      let timeStamp = this.$props.layout.ti_map.i2t(this.p1[0])


      if (!this.pins[1] || !stopPrice) return
      this.pins[1].y$ = stopPrice
      this.pins[1].y = this.$props.layout.$2screen(stopPrice)
      if (moment(timeStamp).format('YYYY-MM-DD').toString() != moment(periodStartDate).format('YYYY-MM-DD').toString()) {

        let xVal = Math.round(this.$props.layout.ti_map.t2i(periodStartDate))
        let timeVal = this.$props.layout.ti_map.i2t(xVal)

        this.pins[0].t = xVal
        this.pins[1].t = xVal

        this.$emit('change-settings', {
          p1: [this.pins[0].t, this.pins[0].y$, timeVal],
          p2: [this.pins[0].t, stopPrice, timeVal],
          stepPrice: stepPrice,
          stopPrice: stopPrice,
          entryPrice: entryPrice,
          atrMultiplier: atrMultiplier,
          atrPeriod: atrPeriod,
          trailingType: trailingType,
          riskValueInPct: riskValueInPct,
          riskValueInCash: riskValueInCash,
          positionSize: positionSize
        })
      }
      else {

        this.$emit('change-settings', {
          p1: [this.p1[0], this.pins[0].y$, timeStamp],
          p2: [this.p1[0], stopPrice, timeStamp],
          stepPrice: stepPrice,
          stopPrice: stopPrice,
          entryPrice: entryPrice,
          atrMultiplier: atrMultiplier,
          atrPeriod: atrPeriod,
          trailingType: trailingType,
          riskValueInPct: riskValueInPct,
          riskValueInCash: riskValueInCash,
          positionSize: positionSize
        })
      }
      this.saveSettings(this)

    },
    ...mapActions('action', ['saveUndoAction'])
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters([
      'themePrimaryColor',
      'themeSecondaryColor',
      'themeFontColor',
      'dc'
    ]),
    ...mapGetters('action', [
      'currentUndoValue',
      'currentRef'
    ]),
    undo() {
      return this.$props.settings.undo
    },
    sett() {
      return this.$props.settings
    },
    p1() {
      return this.$props.settings.p1
    },
    p2() {
      return this.$props.settings.p2
    },
    line_width() {
      return this.sett.lineWidth || 2
    },
    color() {
      return this.sett.color || this.$props.colors.cross
    },
    back_color() {
      return this.sett.backColor || '#9b9ba316'
    },
    value_back() {
      return this.sett.valueBack || '#9b9ba316'
    },
    value_color() {
      return this.sett.valueColor || this.$props.colors.text
    },
    isDialogBoxOpened() {
      return this.sett.isDialogBoxOpened || false
    },
    stopPrice() {
      return this.sett.stopPrice || 0
    },
    entryPrice() {
      return this.sett.entryPrice || 0
    },
    trailingType() {
      return this.sett.trailingType || 'step-price'
    },
    stepPrice() {
      return this.sett.stepPrice || 0.01
    },
    positionSize() {
      return this.sett.positionSize || 1000
    },
    riskValueInCash() {
      return this.sett.riskValueInCash || 50
    },
    riskValueInPct() {
      return this.sett.riskValueInPct || 10
    },
    atrPeriod() {
      return this.sett.atrPeriod || 14
    },
    atrMultiplier() {
      return this.sett.atrMultiplier || 5
    },
    prec() {
      return this.sett.precision || 2
    },
    new_font() {
      return '12px ' + this.$props.font.split('px').pop()
    },
    price() {
      return 'price' in this.sett ? this.sett.price : true
    },
    time() {
      return 'time' in this.sett ? this.sett.time : false
    },
    shift() {
      return this.sett.shiftMode
    },
  },
  watch: {
    undo(newVal, oldVal) {
      if (newVal != oldVal) {
        if (this.$props.settings?.$uuid == this.currentRef?.drawingRef) {
          this.pins.forEach((x, i) => x.update_from(
            this.currentUndoValue[x.name], true
          ))
          this.$nextTick(debounce(() => {
            this.saveUndoAction({
              chartIndex: this.currentRef?.chartIndex,
              val: this.currentRef?.drawingRef,
              data: this.currentUndoValue
            })
          }))
        }
      }
    }
  },
  data() {
    return {
      localMap: null
    }
  },
  mounted() {
    let event = 'UpdateTrailingStopSettings' + this.sett?.$uuid;
    // let event = 'UpdateTrailingStopSettings';
    chartEvents.$on(event, this.updatePointsData)
  },
  beforeDestroy() {
    let event = 'UpdateTrailingStopSettings' + this.sett?.$uuid;
    // let event = 'UpdateTrailingStopSettings';
    chartEvents.$off(event)
  },
  created() {
    this.updateSettingsState(this)
  }
}
</script>
