<script>
// Line drawing tool
import { Overlay, Tool } from 'trading-vue-js'
import Pin from './primitives/pin.js'
import Seg from './primitives/seg.js'
import { mapGetters, mapActions } from 'vuex'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { convertToRGBA } from '../../utils/colors.js'
import { fibonacciLines } from '../../extensions/toolSettings/fibonacciLines.js'
import { debounce } from "../../utils/helper";
import math from './primitives/math.js'

export default {
  name: 'FibonacciRetrace',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'C451', version: '1.0.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('FibonacciRetrace')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      //{"color":"#2346A757","lineWidth":2,"lineStyle":"dashed","lineColor":"#6BA8ECFF"}
      const defaultColor = prevSettings?.color || '#23a776'
      const defaultLineWidth = prevSettings?.lineWidth || 1
      const defaultLineStyle = prevSettings?.lineStyle || 'solid'
      const defaultLog = prevSettings?.logSetting || false
      return {
        // Descriptor for the tool
        group: 'Fibonacci',
        type: 'Segment',
        hint: 'This hint will be shown on hover',
        data: [], // Default data
        settings: {
          color: defaultColor,
          lineWidth: defaultLineWidth,
          lineStyle: defaultLineStyle,
          fibSettings: fibonacciLines,
          logSetting: defaultLog,
          undo: 1,
          settingsList: ['color', 'lineWidth', 'lineStyle', 'fibSettings'],
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
      // First pin is settled at the mouse position
      this.pins.push(new Pin(this, 'p1'))
      // Second one is following mouse until it clicks
      this.pins.push(
        new Pin(this, 'p2', {
          state: 'tracking',
        })
      )
      this.pins[1].on('settled', () => {
        // Call when current tool drawing is finished
        // (Optionally) reset the mode back to 'Cursor'
        this.updateSettingsState(this)
        this.set_state('finished')
        this.$emit('drawing-mode-off')
        this.$emit('object-selected')
      })
      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (!this.p1 || !this.p2) return
      ctx.lineWidth = this.line_width * 3
      ctx.strokeStyle = this.color
      ctx.beginPath()

      //--- line style
      if (this.sett.lineStyle === 'dashed') {
        ctx.setLineDash([5, 10])
      } else if (this.sett.lineStyle === 'dotted') {
        ctx.setLineDash([3, 4])
      }

      const layout = this.$props.layout
      let xFrom = this.p2[0]
      let xTo = this.p1[0]
      let yTop = this.p2[1]
      let yBottom = this.p1[1]

      let x1Fill = layout.t2screen(xFrom)
      let x2Fill = layout.t2screen(xTo)
      let y1Fill = layout.$2screen(yTop)
      let y2Fill

      // Top
      new Seg(this, ctx, `(100.0%)`).draw([xFrom, yBottom], [xTo, yBottom])

      // Bottom
      new Seg(this, ctx, `${yTop.toFixed(3)} (0.0%)`).draw([xFrom, yTop], [xTo, yTop])

      ctx.stroke()



      // Inside

      for (const m of this.fibSettings) {
        if (m.enable) {

          ctx.beginPath()
          ctx.lineWidth = this.line_width
          let delta = yTop - yBottom
          ctx.strokeStyle = m.color
          let myResVal = (this.logScale && this.logSetting) ? (math.exp(math.log(yTop) + (math.log(yBottom) - math.log(yTop)) * m.val)).toFixed(3) : (yTop - delta * m.val).toFixed(3)
          new Seg(this, ctx, `${myResVal} (${(m.val * 100.0).toFixed(1)}%)`).draw(
            [xFrom, myResVal],
            [xTo, myResVal]
          )

          y2Fill = layout.$2screen(myResVal)
          ctx.fillStyle = convertToRGBA(m.color, 0.2)
          ctx.fillRect(x2Fill, y2Fill, x1Fill - x2Fill, y1Fill - y2Fill);
          y1Fill = y2Fill

          ctx.stroke()
        }
      }

      //dashed
      ctx.strokeStyle = this.color
      let x1Dash = layout.t2screen(xTo)
      let x2Dash = layout.t2screen(xFrom)
      let y1Dash = layout.$2screen(yBottom)
      let y2Dash = layout.$2screen(yTop)
      ctx.beginPath();
      ctx.setLineDash([5, 10]);
      ctx.moveTo(x1Dash, y1Dash)
      ctx.lineTo(x2Dash, y2Dash)
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.setLineDash([])
      this.render_pins(ctx)
    },
    use_for() {
      return ['FibonacciRetrace']
    },
    data_colors() {
      return [this.color, this.fontColor]
    },
    ...mapActions('action', ['saveUndoAction'])
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters([
      'themePrimaryColor',
      'themeSecondaryColor',
      'themeFontColor',
      'dc',
      'logScale'
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
      return this.sett.lineWidth || 0.9
    },
    color() {
      return this.sett.color || '#42b28a'
    },
    fibSettings() {
      return this.sett.fibSettings || fibonacciLines
    },
    logSetting() {
      return this.sett.logSetting || false
    },
    fontColor() {
      return this.sett.fontColor || '#40b28a'
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
