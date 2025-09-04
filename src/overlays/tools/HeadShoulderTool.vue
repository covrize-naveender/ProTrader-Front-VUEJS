<script>
import { Overlay, Tool } from 'trading-vue-js'
import Pin from './primitives/pin.js'
import Seg from './primitives/seg.js'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from "../../utils/helper";
import ToolSavingMixins from 'Tools/ToolSavingMixins'

export default {
  name: 'HeadShoulderTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.1.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('HeadShoulderTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      const defaultColor = prevSettings?.color || 'rgba(215, 88, 0, 0.3)'
      const defaultLineColor = prevSettings?.lineColor || '#d75800'
      const defaultLineWidth = prevSettings?.lineWidth || 2
      return {
        // Descriptor for the tool
        group: 'Lines',
        type: 'HS',
        hint: 'This hint will be shown on hover',
        data: [], // Default data
        settings: {
          color: defaultColor,
          lineColor: defaultLineColor,
          lineWidth: defaultLineWidth,
          undo: 1,
          settingsList: ['color', 'lineColor', 'lineWidth'],
        }, // Default settings
        gridRef: null,
      }
    },
    // Called after overlay mounted
    init() {
      this.isCreation = true;

      this.pins.push(new Pin(this, 'p1'))

      this.pins.push(
        new Pin(this, 'p2', {
          state: 'tracking',
          isFixedPin: true,
        })
      )

      this.pins[1].on('settled', () => {

        this.updateSettingsState(this, '1')
        if (!this.pins[2]) {
          this.createThirdPin(2)
        }
      })

      if (this.sett.$state === 'finished') {
        for (let i = 2; i <= 6; i++) {
          this.createThirdPin(i)
        }
      }

      this.registerMouseEvent(this)
    },

    createThirdPin(pinNumber) {
      if (this.isCreation) {
        this.pins.push(
          new Pin(this, `p${pinNumber + 1}`, {
            state: 'tracking',
            isFixedPin: true,
          })
        )

        this.pins[pinNumber].on('settled', () => {
          this.updateSettingsState(this, `${pinNumber}`)
          if (pinNumber == 6) {
            this.set_state('finished')
            this.$emit('drawing-mode-off')
            this.$emit('object-selected')
            this.isCreation = false;

          }
          else {
            if (!this.pins[pinNumber + 1]) {
              this.createThirdPin(pinNumber + 1)
              this.isCreation = true;
            }
          }
        })
      }
    },

    draw(ctx) {
      if (this.pins.length < 2) return
      let pins = this.pins
      let layout = this.layout

      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.fillStyle = this.color

      let solidLines = [];

      for (let i = 0; i < pins.length; i++) {
        if (pins[i] && pins[i + 1]) {
          let p1 = [pins[i].t, pins[i].y$]
          let p2 = [pins[i + 1].t, pins[i + 1].y$]
          ctx.beginPath();
          ctx.setLineDash([]);
          let text = ""
          if (i == 0) {
            text = "Left Shoulder"
          }
          else if (i == 2) {
            text = "Head"
          }
          else if (i == 4) {
            text = "Right Shoulder"
          }
          new Seg(this, ctx, text, true).draw(p1, p2);
          ctx.stroke();
          solidLines.push([p1, p2]);
        }

      }
      if (pins[2] != undefined && pins[4] != undefined) {
        this.drawInfiniteDashedLine(ctx, this.pinsToAxis(pins[2], layout), this.pinsToAxis(pins[4], layout), solidLines);
      }

      if (pins[4] != undefined) {
        this.fillTriangle(this.pinsToAxis(pins[3], layout), this.pinsToAxis(pins[4], layout), this.pinsToAxis(pins[2], layout), ctx)
      }
      this.render_pins(ctx)
    },

    drawInfiniteDashedLine(ctx, p1, p2, solidLines) {
      let pins = this.pins
      let layout = this.layout
      let x1 = p1[0]
      let y1 = p1[1]
      let x2 = p2[0]
      let y2 = p2[1]
      let canvasWidth = ctx.canvas.width;
      let canvasHeight = ctx.canvas.height;

      // Calculate slope (m) and y-intercept (b) of the line
      let m = (y2 - y1) / (x2 - x1);
      let b = y1 - m * x1;

      // Calculate intersections with canvas edges
      let yAtX0 = b;
      let yAtXMax = m * canvasWidth + b;
      let xAtY0 = -b / m;
      let xAtYMax = (canvasHeight - b) / m;

      // Get the intersection points
      let startX, startY, endX, endY;

      if (yAtX0 >= 0 && yAtX0 <= canvasHeight) {
        startX = 0;
        startY = yAtX0;
      } else {
        startX = xAtY0;
        startY = 0;
      }

      if (yAtXMax >= 0 && yAtXMax <= canvasHeight) {
        endX = canvasWidth;
        endY = yAtXMax;
      } else {
        endX = xAtYMax;
        endY = canvasHeight;

      }


      let intersection_start = this.getLineIntersection([startX, startY], [endX, endY], this.pinsToAxis(pins[0], layout), this.pinsToAxis(pins[1], layout));
      if (intersection_start) {
        startX = intersection_start[0];
        startY = intersection_start[1];
        this.fillTriangle(this.pinsToAxis(pins[1], layout), this.pinsToAxis(pins[2], layout), [startX, startY], ctx)
      }


      if (pins[5] != undefined && pins[6] != undefined) {
        let intersection = this.getLineIntersection([startX, startY], [endX, endY], this.pinsToAxis(pins[5], layout), this.pinsToAxis(pins[6], layout));
        if (intersection) {
          endX = intersection[0];
          endY = intersection[1];
          this.fillTriangle(this.pinsToAxis(pins[5], layout), [endX, endY], this.pinsToAxis(pins[4], layout), ctx)
        }
      }

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
    },


    getLineIntersection(p1, p2, p3, p4) {

      const x1 = p1[0], y1 = p1[1];
      const x2 = p2[0], y2 = p2[1];
      const x3 = p3[0], y3 = p3[1];
      const x4 = p4[0], y4 = p4[1];

      const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

      if (denominator === 0) return null; // Lines are parallel or coincident

      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
      const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const intersectionX = x1 + t * (x2 - x1);
        const intersectionY = y1 + t * (y2 - y1);
        return [intersectionX, intersectionY];
      }

      return null; // No valid intersection
    },
    pinsToAxis(p, layout) {
      return [layout.t2screen(p.t), layout.$2screen(p.y$)]
    },
    fillTriangle(p1, p2, p3, ctx) {
      // Draw and fill the shape
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.closePath();
      ctx.fillStyle = this.fillColor; // Set the fill style before filling
      ctx.fill();
      ctx.strokeStyle = this.color; // Set the stroke style to the desired color

      // Draw the first solid line
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();

      // Draw the second dashed line
      ctx.beginPath();
      ctx.setLineDash([5, 5]); // [dash length, gap length]
      ctx.moveTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.stroke();

      // Reset the dash pattern to solid lines
      ctx.setLineDash([]);

      // Draw the third solid line
      ctx.beginPath();
      ctx.moveTo(p3[0], p3[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.stroke();


    },
    use_for() {
      return ['HeadShoulderTool']
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
    undo() {
      return this.$props.settings.undo
    },
    sett() {
      return { ...this.$props.settings, timeFrame: this.timeFrameComp }
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
    fillColor() {
      return this.sett.color || 'rgba(35, 167, 118, 0.3)'
    },
    color() {
      return this.sett.lineColor || '#42b28a'
    }
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
  mounted() {
  },
  beforeDestroy() {
  },
}
</script>
