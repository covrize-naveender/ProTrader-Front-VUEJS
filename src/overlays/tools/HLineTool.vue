<script>
// Line drawing tool
// TODO: make an angle-snap when "Shift" is pressed
import { Overlay, Tool } from 'trading-vue-js'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
import Pin from './primitives/fixedPin.js'
import Seg from './primitives/seg.js'
import Line from './primitives/line.js'
import Ray from './primitives/ray.js'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from "../../utils/helper";

export default {
  name: 'HLineTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.0.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('HLineTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      const defaultColor = prevSettings?.color || '#d75800'
      const defaultLineWidth = prevSettings?.lineWidth || 2
      const defaultLineStyle = prevSettings?.lineStyle || 'solid'
      const defaultLineHeadStyle = prevSettings?.lineHeadStyle || 'normal'
      return {
        // Descriptor for the tool
        group: 'Lines', //icon: Icons['segment.png'],
        type: 'Segment',
        hint: 'This hint will be shown on hover',
        data: [], // Default data
        settings: {
          color: defaultColor,
          lineWidth: defaultLineWidth,
          lineStyle: defaultLineStyle,
          lineHeadStyle: defaultLineHeadStyle,
          undo: 1,
          settingsList: ['color', 'lineWidth', 'lineStyle', 'lineHeadStyle'],
        }, // Default settings
      }
    },
    init() {
      this.pins.push(new Pin(this, 'p1'))
      this.pins.push(
        new Pin(this, 'p2', {
          state: 'tracking',
          isFixedPin: true,
        })
      )

      this.pins[1].on('settled', () => {
        this.updateSettingsState(this)
        this.set_state('finished')
        this.$emit('drawing-mode-off')
        this.pins[0].firstPinsY$ = this.pins[0].y$
        this.pins[0].firstPinsY = this.pins[0].y
        this.pins[0].isFixedPin = true
        this.$emit('object-selected')
      })
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

      if (this.sett.ray) {
        new Ray(this, ctx).draw(this.p1, this.p2)
      } else if (this.sett.extended) {
        new Line(this, ctx).draw(this.p1, this.p2)
      } else {
        new Seg(this, ctx).draw(this.p1, this.p2)
      }
      ctx.stroke()
      ctx.setLineDash([])
      if (this.lineHeadStyle === 'arrow') this.drawArrowhead(ctx)
      this.render_pins(ctx)
    },
    drawArrowhead(ctx) {
      const { t2screen, $2screen } = this.layout
      const x1 = t2screen(this.p1[0])
      const y1 = $2screen(this.p1[1])
      const x = t2screen(this.p2[0])
      const y = $2screen(this.p2[1])

      let radians = Math.atan((y - y1) / (x - x1))
      radians += ((x >= x1 ? 90 : -90) * Math.PI) / 180

      ctx.save()
      ctx.beginPath()
      ctx.translate(x + (x >= x1 ? 5 : -5), y)
      ctx.rotate(radians)
      ctx.moveTo(0, 0)
      ctx.lineTo(5 * this.line_width, 5 * this.line_width)
      ctx.lineTo(-5 * this.line_width, 5 * this.line_width)
      ctx.closePath()
      ctx.restore()
      ctx.fill()
    },
    use_for() {
      return ['HLineTool']
    },
    data_colors() {
      return [this.color]
    },
    ...mapActions('action', ['saveUndoAction'])
  },
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
      return this.sett.lineWidth || 0.9
    },
    color() {
      return this.sett.color || '#42b28a'
    },
    lineHeadStyle() {
      return this.$props.settings.lineHeadStyle
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
