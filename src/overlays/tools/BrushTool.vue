<script>


import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { Overlay, Tool } from 'trading-vue-js'
import { mapActions, mapGetters } from 'vuex'
import { debounce } from "../../utils/helper"
import BrushPin from './primitives/brush-pin.js'
import Math2 from './primitives/math.js'
export default {
  name: 'BrushTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.1.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('BrushTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      const defaultColor = prevSettings?.color || '#d75800'
      const defaultLineWidth = prevSettings?.lineWidth || 2
      const defaultLineStyle = prevSettings?.lineStyle || 'solid'
      return {

        group: 'Brush',
        type: 'Brush',
        hint: 'This hint will be shown on hover',
        data: [],
        settings: {
          color: defaultColor,
          lineWidth: defaultLineWidth,
          lineStyle: defaultLineStyle,
          brushStrokes: [],
          settingsList: ['color', 'lineWidth', 'lineStyle', 'brushStrokes'],
          undo: 1,
        },
        gridRef: null,
      }
    },

    init() {

      this.pins.push(new BrushPin(this, 'p1'))
      this.pins.push(
        new BrushPin(this, 'p2', {
          state: 'tracking'
        })
      )
      this.pins[0].on('settled', () => {
        this.updateSettingsState(this, '0')
        this.set_state('finished')
        this.$emit('drawing-mode-off')
        this.$emit('object-selected')
        this.currentBrushStroke = null
      })
      this.pins[1].mouse.on("mousemove", (e) => {
        // If currently dragging and we have a brush to move
        if (this.drag && this.$props.settings.brushStrokes) {
          // Take snapshot only once at drag start
          if (!this.startBrushStroke) {
            this.startBrushStroke = this.$props.settings.brushStrokes.map(([x, y]) => [x, y])
            this.dragStart = [e.offsetX, e.offsetY]
          }

          const dx = this.$props.layout.screen2t(e.offsetX) - this.$props.layout.screen2t(this.dragStart[0])
          const dy = this.$props.cursor.y$ - this.drag.y$

          this.currentBrushStroke = this.startBrushStroke.map(([x, y]) => [x + dx, y + dy])
          this.$props.settings.brushStrokes = this.currentBrushStroke
          return
        }

        // Reset snapshot when not dragging
        if (!this.drag && this.startBrushStroke) {
          this.startBrushStroke = null
          this.dragStart = null
        }

        // Normal drawing logic
        if (this.pins[1].state == 'tracking') {
          let timeStamp = this.$props.layout.ti_map.i2t(this.$props.cursor.t)
          const newPoint = [this.$props.layout.screen2t(e.offsetX), this.$props.cursor.y$, timeStamp]
          if (!this.currentBrushStroke) {
            this.currentBrushStroke = []
            this.$props.settings.brushStrokes = this.currentBrushStroke
          }
          this.currentBrushStroke.push(newPoint)
        }
      });

      this.pins[1].on('settled', () => {

        this.updateSettingsState(this, '1')
        this.set_state('finished')
        this.$emit('drawing-mode-off')
        this.$emit('object-selected')
        setTimeout(() => {
          this.saveSettings(this)
        }, 100);
      })
      this.registerMouseEvent(this)
    },
    draw(ctx) {
      if (!this.p1 || !this.p2) return
      const layout = this.$props.layout


      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.fillStyle = this.color
      ctx.beginPath()

      let stroke = this.brushStrokes
      if (stroke.length > 0) {
        if (this.sett.lineStyle === 'dashed') {
          ctx.setLineDash([5, 10])
        } else if (this.sett.lineStyle === 'dotted') {
          ctx.setLineDash([3, 4])
        }
        ctx.lineWidth = this.line_width
        ctx.strokeStyle = this.color
        for (let i = 0; i < stroke.length; i++) {
          const point = stroke[i]
          const x = layout.t2screen(point[0])
          const y = layout.$2screen(point[1])

          const x1 = layout.t2screen(this.p1[0])
          const y1 = layout.$2screen(this.p1[1])
          const x2 = layout.t2screen(this.p2[0])
          const y2 = layout.$2screen(this.p2[1])

          if (point[0] != null) {
            if (i === 0) {
              ctx.moveTo(x1, y1)
            }

            ctx.lineTo(x, y)
            if (i === stroke.length - 1) {
              ctx.lineTo(x2, y2)
            }
          }
        }
      }
      const dotRadius = this.line_width / 2
      if (this.brushStrokes.length == 0) {
        ctx.lineWidth = this.line_width
        ctx.strokeStyle = this.color
        ctx.fillStyle = this.color
        // ctx.beginPath()
        ctx.arc(
          layout.t2screen(this.p1[0]),
          layout.$2screen(this.p1[1]),
          dotRadius,
          0,
          Math.PI * 2
        )
        ctx.fill()

        // ctx.beginPath()
        ctx.arc(
          layout.t2screen(this.p2[0]),
          layout.$2screen(this.p2[1]),
          dotRadius,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }

      ctx.stroke()

      ctx.setLineDash([])

      for (let i = 0; i < stroke.length - 1; i++) {
        const p1 = stroke[i];
        const p2 = stroke[i + 1];
        let x1 = layout.t2screen(p1[0])
        let y1 = layout.$2screen(p1[1])
        let x2 = layout.t2screen(p2[0])
        let y2 = layout.$2screen(p2[1])
        this.collisions.push(this.make([x1, y1], [x2, y2]));
      }
      this.render_pins(ctx)
    },
    use_for() {
      return ['BrushTool']
    },
    data_colors() {
      return [this.color]
    },
    make(p1, p2) {
      return (x, y) => {
        return Math2.point2seg([x, y], p1, p2) < 7
      }
    },
    ...mapActions('action', ['saveUndoAction'])
  },

  computed: {
    ...mapGetters([
      'themePrimaryColor',
      'themeSecondaryColor',
      'themeFontColor',
      'timeFrame',
      'multiChartSymbol',
      'dc'
    ]),
    ...mapGetters('action', [
      'currentUndoValue',
      'currentRef'
    ]),
    sett() {
      return { ...this.$props.settings }
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
    undo() {
      return this.$props.settings.undo
    },
    brushStrokes() {
      return this.sett.brushStrokes || []
    },
    chartIndex() {
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    getTimeframe() {
      return this.multiChartSymbol[this.chartIndex]?.timeFrame
    },

  },
  data() {
    return {
      currentBrushStroke: null,
      startBrushStroke: null,
      dragStart: null
    }
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
          this.$emit("change-settings", {
            brushStrokes: this.currentUndoValue.brushStrokes
          });
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
