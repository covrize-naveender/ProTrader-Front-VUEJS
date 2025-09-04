<script>
// Price/Time measurment tool
import { Overlay, Tool } from 'trading-vue-js'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
// import Icons from '../../stuff/icons.json'
import Pin from './primitives/pinTrade.js'
import FixedPinX from './primitives/fixedPinXTrade.js'
import Seg from './primitives/seg.js'
import Math2 from './primitives/math.js'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from "../../utils/helper";

export default {
  name: 'TradeVisualizerTool',
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
          price: true,
          time: true,
          upColor: '#e54150',
          downColor: '#23a776',
          lineWidthTrade: 2,
          lineStyleTrade: 'solid',
          undo: 1,
          settingsList: [
            'upColor',
            'downColor',
            'lineWidthTrade',
            'lineStyleTrade',
          ],
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
      this.initialDrawFinished = false
      // First pin is settled at the mouse position
      this.pins.push(
        new Pin(this, 'p1', {
          hidden: this.shift,
        })
      )
      // Second one is following mouse until it clicks
      this.pins.push(
        new Pin(this, 'p2', {
          state: 'tracking',
          hidden: this.shift,
        })
      )

      this.pins.push(
        new FixedPinX(this, 'p3', {
          hidden: true,
          isFixedPin: true,
          fixedX: this.pins[1].x,
          fixedTime: this.pins[1].t,
        })
      )

      this.pins[1].on('settled', () => {
        if (!this.initialDrawFinished) {
          this.pins[2].hidden = false
          this.pins[2].state = 'tracking'
          this.updateSettingsState(this)
        }
      })

      this.pins[2].on('settled', () => {
        this.initialDrawFinished = true
        this.set_state('finished')
        this.updateSettingsState(this)
        this.$emit('drawing-mode-off')
        // Deselect the tool in shiftMode
        if (this.shift) {
          this._$emit('custom-event', {
            event: 'object-selected',
            args: [],
          })
        } else {
          this.$emit('object-selected')
        }
      })
      if (this.p3 && this.p3.length) {
        this.pins[2].hidden = false
        this.initialDrawFinished = true
      }

      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (!this.p1 || !this.p2) return
      const dir = Math.sign(this.p2[1] - this.p1[1])
      const layout = this.$props.layout
      const xm = layout.t2screen((this.p1[0] + this.p2[0]) * 0.5)
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      // Background
      ctx.globalAlpha = 0.3
      let x1 = layout.t2screen(this.p1[0])
      let y1 = layout.$2screen(this.p1[1])
      let x2 = layout.t2screen(this.p2[0])
      let y2 = layout.$2screen(this.p2[1])

      if (this.pins[2]) {
        this.pins[2].firstPinsX = Math.min(x1, x2) // + Math.abs(x2 - x1) / 2;
        this.pins[2].firstPinsTime = this.layout.screen2t(
          this.pins[2].firstPinsX
        )
        this.pins[2].x = this.pins[2].firstPinsX
        this.pins[2].t = this.pins[2].firstPinsTime
      }

      const mid = this.p3
        ? layout.$2screen(this.p3[1])
        : layout.$2screen(
          Math.min(this.p1[1], this.p2[1]) +
          Math.abs(this.p2[1] - this.p1[1]) / 2
        )

      ctx.fillStyle = this.up_color
      ctx.fillRect(x1, y1, x2 - x1, mid - y1)

      ctx.fillStyle = this.down_color
      ctx.fillRect(x1, mid, x2 - x1, y2 - mid)

      if (this.price) this.vertical(ctx, x1, y1, x2, y2, xm)
      if (this.time) this.horizontal(ctx, x1, y1, x2, y2, xm)
      ctx.globalAlpha = 1
      this.draw_value(ctx, dir, xm, y2, y2 - y1)

      this.collisions.push(this.make([x1, y1], [x2, y2]))

      this.render_pins(ctx)
    },
    vertical(ctx /*x1, y1, x2, y2, xm*/) {
      //   const layout = this.$props.layout;
      //   const dir = Math.sign(this.p2[1] - this.p1[1]);
      ctx.beginPath()
      if (!this.shift) {
        // Top
        // this.strokeStyle = "#23a776";
        new Seg(this, ctx).draw(
          [this.p1[0], this.p2[1]],
          [this.p2[0], this.p2[1]]
        )
        // Bottom
        new Seg(this, ctx).draw(
          [this.p1[0], this.p1[1]],
          [this.p2[0], this.p1[1]]
        )
      }
    },
    horizontal(ctx, x1, y1, x2 /*y2, xm*/) {
      const layout = this.$props.layout
      //   const xdir = Math.sign(this.p2[0] - this.p1[0]);
      const ym = this.p3
        ? layout.$2screen(this.p3[1])
        : (layout.$2screen(this.p1[1]) + layout.$2screen(this.p2[1])) / 2
      ctx.beginPath()
      if (!this.shift) {
        // Left
        new Seg(this, ctx).draw(
          [this.p1[0], this.p1[1]],
          [this.p1[0], this.p2[1]]
        )
        // Right
        new Seg(this, ctx).draw(
          [this.p2[0], this.p1[1]],
          [this.p2[0], this.p2[1]]
        )
      }
      // Horizontal Arrow
      ctx.strokeStyle = '#23a776'
      //   ctx.moveTo(x2 - 5 * xdir, ym - 4);
      //   ctx.lineTo(x2, ym);
      //   ctx.lineTo(x2 - 5 * xdir, ym + 4);
      //   ctx.stroke();
      // Horizontal Line
      ctx.beginPath()
      //   ctx.setLineDash([5, 5]);
      ctx.moveTo(x1, ym)
      ctx.lineTo(x2, ym)
      ctx.stroke()
      ctx.setLineDash([])
    },
    // WTF? I know dude, a lot of shitty code here
    draw_value(ctx, dir, xm, y, totalHeight) {
      //   let dtstr = this.t2str(dt);
      ctx.font = this.new_font
      const pctProfit =
        (Math.abs(this.p2?.[1] - this.p3?.[1]) * 100.0) / this.p3?.[1]
      const pctLoss =
        (Math.abs(this.p1?.[1] - this.p3?.[1]) * 100.0) / this.p3?.[1]
      let text = []
      let potential_gain = Math.round(pctProfit * 100) / 100
      text.push(
        `TP ${Math.round((this.p2?.[1] + Number.EPSILON) * 100) / 100} (${potential_gain} %)`
      )
      //   text.push(`xm: ${xm}  DIR: ${dir}`);
      //   text.push(`y ${y} price: ${this.layout.screen2$(y).toPrecision(2)}`);
      text = text.join('\n')
      // "Multiple" fillText
      let lines = text.split('\n')
      let w = Math.max(...lines.map((x) => ctx.measureText(x).width + 20), 100)
      let n = lines.length
      let h = 20 * n
      ctx.fillStyle = this.value_back
      ctx.fillRect(xm - w * 0.5, y - (10 + h) * dir, w, h * dir)
      ctx.fillStyle = this.value_color
      ctx.textAlign = 'center'
      lines.forEach((l, i) => {
        ctx.fillText(l, xm, y + (dir > 0 ? 20 * i - 20 * n + 5 : 20 * i + 25))
      })

      text = []
      let potential_loss = Math.round(pctLoss * 100) / 100
      text.push(
        `SL ${Math.round((this.p1?.[1] + Number.EPSILON) * 100) / 100} (${potential_loss} %)`
      )
      //   text.push(`y ${y} price: ${this.layout.screen2$(y)}`);
      text = text.join('\n')

      lines = text.split('\n')
      w = Math.max(...lines.map((x) => ctx.measureText(x).width + 20), 100)
      n = lines.length
      h = 20 * n

      ctx.font = this.new_font
      ctx.fillStyle = this.value_back
      ctx.fillRect(xm - w * 0.5, y - (10 + h) * -dir - totalHeight, w, h * -dir)
      ctx.fillStyle = this.value_color
      ctx.textAlign = 'center'
      lines.forEach((l, i) => {
        ctx.fillText(
          l,
          xm,
          y - totalHeight + (-dir > 0 ? 20 * i - 20 * n + 5 : 20 * i + 25)
        )
      })
      let risk_reward_string = `Risk/Reward Ratio: ${this.calc_risk_reward_ratio(
        potential_loss,
        potential_gain
      )}`
      ctx.fillText(risk_reward_string, xm, (-dir > 0 ? y - totalHeight - 40 : y - 40));
    },
    make(p1, p2) {
      return (x, y) => {
        return Math2.is_within_rectangle([x, y], p1, p2)
      }
    },
    use_for() {
      return ['TradeVisualizerTool']
    },
    data_colors() {
      return [this.color]
    },
    calc_risk_reward_ratio(potentialLoss, potentialGain) {

      let ratio = potentialLoss / potentialGain;
      let reward = (1 / ratio).toFixed(2);

      // Remove .00 if it's a whole number
      reward = reward.endsWith(".00") ? reward.slice(0, -3) : reward;

      return `1 : ${reward}`;
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
    p3() {
      return this.$props.settings.p3
    },
    line_width() {
      return this.sett.lineWidth || 0.9
    },
    color() {
      return this.sett.color || this.$props.colors.cross
    },
    up_color() {
      return this.sett.upColor || '#e54150'
    },
    down_color() {
      return this.sett.downColor || '#23a776'
    },
    value_back() {
      return this.sett.valueBack || '#9b9ba316'
    },
    value_color() {
      return this.sett.valueColor || this.$props.colors.text
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
    return {}
  },
  created() {
    this.updateSettingsState(this)
  },
}
</script>
