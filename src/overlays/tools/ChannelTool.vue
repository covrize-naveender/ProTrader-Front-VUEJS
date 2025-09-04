<script>
// Line drawing tool
// TODO: make an angle-snap when "Shift" is pressed
import { Overlay, Tool } from 'trading-vue-js'

// import Icons from '../../stuff/icons.json'
import Pin from './primitives/pin.js'
import Seg from './primitives/seg.js'
import FixedPinX from './primitives/fixedPinX.js'
import { mapGetters, mapActions } from 'vuex'
import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { debounce } from "../../utils/helper";

export default {
  name: 'ChannelTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.1.0' }
    },
    tool() {

      let prevSettings = localStorage.getItem('ChannelTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      //{"color":"#2346A757","lineWidth":2,"lineStyle":"dashed","lineColor":"#6BA8ECFF"}
      const defaultColor = prevSettings?.color || '#d75800'
      const defaultLineWidth = prevSettings?.lineWidth || 1
      const defaultLineStyle = prevSettings?.lineStyle || 'solid'


      return {
        // Descriptor for the tool
        group: 'Lines',
        type: 'Segment',
        hint: 'This hint will be shown on hover',
        data: [], // Default data
        settings: {
          color: defaultColor,
          lineWidth: defaultLineWidth,
          lineStyle: defaultLineStyle,
          undo: 1,
          settingsList: ['color', 'lineWidth', 'lineStyle'],
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
      this.initialDrawFinished = false
      this.gap = 0
      // First pin is settled at the mouse position
      this.pins.push(new Pin(this, 'p1'))
      // Second one is following mouse until it clicks
      this.pins.push(
        new Pin(this, 'p2', {
          state: 'tracking',
        })
      )

      this.pins.push(
        new FixedPinX(this, 'p3', {
          state: 'settled',
          isFixedPin: true,
          fixedX: this.pins[1].x,
          fixedTime: this.pins[1].t,
          hidden: true,
        })
      )

      this.pins[1].on('settled', () => {
        // Call when current tool drawing is finished
        if (!this.initialDrawFinished) {
          this.pins[2].hidden = false
          this.pins[2].state = 'tracking'
        }
      })

      this.pins[2].on('settled', () => {
        // Call when current tool drawing is finished
        // (Optionally) reset the mode back to 'Cursor'
        this.set_state('finished')
        this.updateSettingsState(this)
        this.$emit('drawing-mode-off')
        this.initialDrawFinished = true
        this.$emit('object-selected')
      })
      if (this.p3 && this.p3.length) {
        this.pins[2].hidden = false
        this.initialDrawFinished = true
      }
      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (this.p1 && this.p2) {
        ctx.lineWidth = this.line_width
        ctx.strokeStyle = this.color
        ctx.beginPath()

        //--- line style
        if (this.sett.lineStyle === 'dashed') {
          ctx.setLineDash([5, 10])
        } else if (this.sett.lineStyle === 'dotted') {
          ctx.setLineDash([3, 4])
        }

        new Seg(this, ctx).draw(this.p1, this.p2)

        if (this.p3 && !this.pins?.[2].hidden) {
          let gapY = this.pins[1].y$ - this.pins[2].y$
          if (this.pins[1].state === 'dragging') {
            gapY = this.gap
          }

          this.pins[2].firstPinsTime = this.p2[0]
          this.pins[2].firstPinsX = this.layout.t2screen(this.p2[0])
          this.pins[2].t = this.p2[0]
          this.pins[2].x = this.layout.t2screen(this.p2[0])

          this.pins[2].y$ = this.p2[1] - gapY
          this.pins[2].y = this.layout.$2screen(this.p2[1] - gapY)

          new Seg(this, ctx).draw(
            [this.p1[0], this.p1[1] - gapY],
            [this.p2[0], this.p2[1] - gapY]
          )
          //   previous gap
          this.gap = gapY
        }

        ctx.stroke()
        ctx.setLineDash([])
        this.render_pins(ctx)
      }
    },
    use_for() {
      return ['ChannelTool']
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
      return this.sett.color || '#42b28a'
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
