<script>
import { Overlay, Tool } from 'trading-vue-js'
import Pin from './primitives/pin'
import Math2 from './primitives/math.js'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from "../../utils/helper";
import ToolSavingMixins from 'Tools/ToolSavingMixins'

export default {
  name: 'TextTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.0.0' }
    },
    tool() {

      let prevSettings = localStorage.getItem('TextTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      const defaultColor = prevSettings?.color || '#d75800'
      const defaultFontSize = prevSettings?.fontSize || 20
      return {
        // Descriptor for the tool
        group: 'Text', //icon: Icons['segment.png'],
        type: 'Label',
        hint: 'Text label',
        data: [], // Default data
        settings: {
          text: '',
          x: 50,
          y: 50,
          color: defaultColor,
          fontSize: defaultFontSize,
          undo: 1,
          settingsList: ['color', 'fontSize', 'settings'],
          firstRun: true,
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
      delete this.keys.map.Backspace
      this.pins.push(new Pin(this, 'p1'))
      this.registerMouseEvent(this)
      this.set_state('finished')
      this.$emit('drawing-mode-off')


      if (this.$props.settings.firstRun) {
        // this.$emit('object-selected')
      }
      // this.$emit('object-selected')
    },

    draw(ctx) {
      if (!this.p1) return;

      const { t2screen, $2screen } = this.layout;
      const fontSize = this.sett.fontSize || 20;
      const fontColor = this.sett.color || 'dodgerblue';
      const bgColor = this.sett.bgColor || 'rgba(0, 0, 0, 0.2)';
      const fontFamily = 'Arial';
      const offset = 5;
      const x = t2screen(this.p1[0]) || this.sett.x;
      const y = ($2screen(this.p1[1]) || this.sett.y) + fontSize + offset;

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.strokeStyle = fontColor;
      ctx.fillStyle = fontColor;

      let editableText = this.sett.text || '';

      if (this.selected) {

        // Editable mode
        if (!this._boundInputHandler) {
          this._boundInputHandler = (event) => {

            if (event.key === 'Enter') {
              editableText += '\n';
            } else if (event.key === 'Backspace') {
              editableText = editableText.slice(0, -1);
            } else if (event.key.length === 1) {
              editableText += event.key;
            }
            this.sett.text = editableText;

          };
          // if (this.sett.text == '') {
          this.isTyping = true;
          if (!this._cursorBlinking) {
            this.cursorVisible = true;
          }
          window.addEventListener('keydown', this._boundInputHandler);
          // }
        }

        const lines = editableText.split('\n');
        let lineHeight = fontSize;
        let width = 0;



        for (let i = 0; i < lines.length; i++) {
          const textMetrics = ctx.measureText(lines[i]);
          width = Math.max(width, textMetrics.width);
        }

        // Draw background
        if (this.isTyping) {
          let addTextStr = '+ Add Text'
          let reactLen = lines.length
          if (editableText.length == 0) {
            ctx.globalAlpha = 0.5
            ctx.fillText(addTextStr, x, y)
            // reactLen = addTextStr.length
            // const textMetricsTemp = ctx.measureText(lines[i]);
            // width = Math.max(width, textMetricsTemp.width);
            ctx.globalAlpha = 1;
          }
          // ctx.globalAlpha = 0.2;
          // ctx.fillStyle = bgColor;
          // ctx.fillRect(
          //   x - offset,
          //   y - fontSize - offset,
          //   width + 2 * offset,
          //   (lineHeight + offset) * reactLen
          // );
          // ctx.globalAlpha = 1;

          if (this.cursorVisible) {
            const lastLine = lines[lines.length - 1] || '';
            const textWidth = ctx.measureText(lastLine).width;
            const cursorX = x + textWidth + 1;
            const cursorY = y + (lines.length - 1) * lineHeight;

            ctx.beginPath();
            ctx.moveTo(cursorX, cursorY - fontSize + 5);
            ctx.lineTo(cursorX, cursorY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.stroke();
          }
        }
        ctx.strokeStyle = fontColor;

        // Draw editable text
        ctx.fillStyle = fontColor;

        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], x, y + i * lineHeight);
        }

      }
      else {
        if (this._boundInputHandler) {
          this.isTyping = false;
          if (this._cursorBlinking) {
            // clearInterval(this._cursorBlinking);
            this._cursorBlinking = null;
            this.cursorVisible = false;
          }
          window.removeEventListener('keydown', this._boundInputHandler);
          this._boundInputHandler = null;
        }
        // Non-editable mode
        const text = this.sett.text;
        const lines = text.split('\n');
        let lineHeight = fontSize;
        let width = 0;

        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], x, y + i * lineHeight);
          const textMeasures = ctx.measureText(lines[i]);
          width = Math.max(textMeasures.width, width);
        }

        // Draw background panel if enabled
        if (this.showBackPanel) {
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = bgColor;
          ctx.fillRect(
            x - offset,
            y - lineHeight - offset,
            width + offset,
            (lineHeight + offset) * lines.length
          );
          ctx.globalAlpha = 1; // Reset transparency
        }

        // Add collision boundaries
        this.collisions.push(
          this.make(
            [x - offset, y - lineHeight - offset],
            [x + width, y + (lineHeight + offset) * Math.max(lines.length - 1, 0)]
          )
        );
      }

      this.render_pins(ctx);
    },

    use_for() {
      return ['TextTool']
    },
    make(p1, p2) {
      return (x, y) => {
        return Math2.is_within_rectangle([x, y], p1, p2)
      }
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
    color() {
      return this.sett.color || '#42b28a'
    },
    text() {
      return this.sett.text || 'Text goes here'
    },
    showBackPanel() {
      return false
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
  created() {
    this.updateSettingsState(this)
  },
}
</script>
