<script>
// Line drawing tool
// TODO: make an angle-snap when "Shift" is pressed
import { Overlay, Tool } from 'trading-vue-js'
import Pin from './primitives/pin.js'
import Seg from './primitives/seg.js'
import { mapGetters, mapActions } from 'vuex'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { debounce } from "../../utils/helper";

export default {
  name: 'TrendLine',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.1.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('TrendLine')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      const defaultColor = prevSettings?.color || '#d75800'
      const defaultLineWidth = prevSettings?.lineWidth || 2
      const defaultLineStyle = prevSettings?.lineStyle || 'solid'
      const defaultLineHeadStyle = prevSettings?.lineHeadStyle || 'normal'
      return {
        // Descriptor for the tool
        group: 'Lines',
        type: 'Trend',
        hint: 'This hint will be shown on hover',
        data: [], // Default data
        settings: {
          color: defaultColor,
          lineWidth: defaultLineWidth,
          lineStyle: defaultLineStyle,
          lineHeadStyle: defaultLineHeadStyle,
          settingsList: ['color', 'lineWidth', 'lineStyle', 'lineHeadStyle'],
          undo: 1
        }, // Default settings
        gridRef: null,
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
      this.pins[0].on('settled', () => {
        // Call when current tool drawing is finished
        // (Optionally) reset the mode back to 'Cursor'

        this.updateSettingsState(this, '0')
        this.set_state('finished')
        this.$emit('drawing-mode-off')
        this.$emit('object-selected')
      })
      this.pins[1].on('settled', () => {
        // Call when current tool drawing is finished
        // (Optionally) reset the mode back to 'Cursor'

        this.updateSettingsState(this, '1')
        this.set_state('finished')
        this.$emit('drawing-mode-off')
        this.$emit('object-selected')
      })
      if (
        this.savedSettings?.timeFrame &&
        this.savedSettings?.timeFrame !== this.timeFrameData
      ) {
        // const { t_magnet } =
        // const p1Node = Math.round( this.layout.ti_map.t2i(this.p1[2]))
        // const p2Node = Math.round( this.layout.ti_map.t2i(this.p2[2]))
        // if(this.p1[0] !== p1Node){
        //   this.p1[0] = p1Node
        // }
        //
        // if(this.p2[0] !== p2Node){
        //   this.p2[0] = p2Node
        // }
      }
      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (!this.p1 || !this.p2) return
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.fillStyle = this.color

      ctx.beginPath()

      if (this.sett.lineStyle === 'dashed') {
        ctx.setLineDash([5, 10])
      } else if (this.sett.lineStyle === 'dotted') {
        ctx.setLineDash([3, 4])
      }
      new Seg(this, ctx).draw(this.p1, this.p2)

      ctx.stroke()
      ctx.setLineDash([])

      if (this.lineHeadStyle === 'arrow') this.drawArrowhead(ctx)
      this.render_pins(ctx)
    },
    /**
     * @param {CanvasRenderingContext2D} ctx canvas context
     */
    drawArrowhead(ctx) {
      const { t2screen, $2screen } = this.layout
      const x1 = t2screen(this.p1[0])
      const y1 = $2screen(this.p1[1])
      const x = t2screen(this.p2[0])
      const y = $2screen(this.p2[1])

      let radians = Math.atan((y - y1) / (x - x1))
      const addRad = ((x >= x1 ? 90 : -90) * Math.PI) / 180
      radians += addRad
      const xPct = (x - x1) / Math.max(x, x1)
      const yPct = (y - y1) / Math.max(y, y1)
      const xOffset = 5 * xPct
      const yOffset = 5 * yPct

      ctx.save()
      ctx.beginPath()
      ctx.translate(x + xOffset, y + yOffset)
      ctx.rotate(radians)
      ctx.moveTo(0, 0)
      ctx.lineTo(5 * this.line_width, 5 * this.line_width)
      ctx.lineTo(-5 * this.line_width, 5 * this.line_width)
      ctx.closePath()
      ctx.restore()
      ctx.fill()
    },
    use_for() {
      return ['TrendLine']
    },
    data_colors() {
      return [this.color]
    },
    ...mapActions('action', ['saveUndoAction'])
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters([
      'themePrimaryColor',
      'themeSecondaryColor',
      'themeFontColor',
      'timeFrame',
      'dc'
    ]),
    ...mapGetters('action', [
      'currentUndoValue',
      'currentRef'
    ]),
    sett() {
      return { ...this.$props.settings, timeFrame: this.timeFrameComp }
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
    lineHeadStyle() {
      return this.$props.settings.lineHeadStyle
    },
    undo() {
      return this.$props.settings.undo
    }
  },
  data() {
    return {}
  },
  created() {
    this.updateSettingsState(this)
  },
  mounted() {
  },
  beforeDestroy() {
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
  }
}
</script>
