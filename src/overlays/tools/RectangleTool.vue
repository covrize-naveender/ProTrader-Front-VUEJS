<script>
// Price/Time measurment tool
import { Overlay, Tool } from 'trading-vue-js'
import Pin from './primitives/pin.js'
import Math2 from './primitives/math.js'
import { mapGetters, mapActions } from 'vuex'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { debounce } from "../../utils/helper";

export default {
  name: 'RectangleTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  mounted() {
  },
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.0.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('RectangleTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      //{"color":"#2346A757","lineWidth":2,"lineStyle":"dashed","lineColor":"#6BA8ECFF"}
      const defaultColor = prevSettings?.color || 'rgba(215, 88, 0, 0.3)' //  '#23a776FF'
      const defaultLineColor = prevSettings?.lineColor || 'rgba(215, 88, 0, 1)' //'#23a776'
      const defaultLineWidth = prevSettings?.lineWidth || 2
      const defaultLineStyle = prevSettings?.lineStyle || 'solid'
      return {
        // Descriptor for the tool
        group: 'Shape',
        type: 'Shape',
        hint: 'Rectangle Tool',
        data: [], // Default data
        settings: {
          color: defaultColor, //'#23a776'  
          lineColor: defaultLineColor, //'#23a776'
          lineWidth: defaultLineWidth,
          lineStyle: defaultLineStyle,
          undo: 1,
          settingsList: ['color', 'lineWidth', 'lineStyle', 'lineColor'],
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
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
      this.pins[1].on('settled', () => {
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
      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (!this.p1 || !this.p2) return
      const layout = this.$props.layout
      // Background
      // ctx.globalAlpha = 0.3
      let x1 = layout.t2screen(this.p1[0])
      let y1 = layout.$2screen(this.p1[1])
      let x2 = layout.t2screen(this.p2[0])
      let y2 = layout.$2screen(this.p2[1])

      ctx.fillStyle = this.color

      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.line_color
      ctx.beginPath()
      //--- line style
      const lineStyle = this.line_style
      if (lineStyle === 'dashed') {
        ctx.setLineDash([10, 10])
      } else if (lineStyle === 'dotted') {
        ctx.setLineDash([1, 1])
      } else {
        ctx.setLineDash([])
      }

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y1)
      ctx.lineTo(x2, y2)
      ctx.lineTo(x1, y2)
      ctx.closePath()

      ctx.fill()

      ctx.stroke()


      // for collisions and moving the object
      this.collisions.push(this.make([x1, y1], [x2, y2]))

      ctx.globalAlpha = 1
      this.render_pins(ctx)
    },
    make(p1, p2) {
      return (x, y) => {
        return Math2.is_within_rectangle([x, y], p1, p2)
      }
    },
    use_for() {
      return ['RectangleTool']
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
    preferedColor() {
      return this.colorSetting?.color || '#23a776'
    },
    preferedLineColor() {
      return this.colorSetting?.lineColor || '#23a776'
    },
    preferedLineStyle() {
      return this.colorSetting?.lineStyle || ''
    },
    p1() {
      return this.$props.settings.p1
    },
    p2() {
      return this.$props.settings.p2
    },
    line_width() {
      return this.sett.lineWidth || 1
    },
    line_color() {
      const computedLineColor = this.sett.lineColor || this.preferedLineColor;
      return computedLineColor
    },
    color() {
      const computedColor = this.sett.color || this.preferedColor;
      return computedColor
      // return   this.sett.color || this.preferedColor
    },
    line_style() {
      const computedColor = this.sett.lineStyle || this.preferedLineStyle;
      return computedColor
      // return   this.sett.color || this.preferedColor
    },
    borderColor() {
      return this.sett.borderColor || this.$props.colors.cross
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
      colorSetting: "",
      userLineColor: "",
      userColor: "",
    }
  },
  created() {
    let prevSettings = localStorage.getItem('RectangleTool');
    if (prevSettings) {
      prevSettings = JSON.parse(prevSettings)
      this.colorSetting = prevSettings
    }
    this.updateSettingsState(this)
  },
}
</script>
