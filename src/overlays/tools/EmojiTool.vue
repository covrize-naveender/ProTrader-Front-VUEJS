<script>

import ToolSavingMixins from 'Tools/ToolSavingMixins'
import { Overlay, Tool } from 'trading-vue-js'
import { mapGetters, mapActions } from 'vuex'
import EmojiPin from './primitives/emojiPin.js'
import Math2 from './primitives/math.js'
import { debounce } from "../../utils/helper";

export default {
  name: 'EmojiTool',
  mixins: [Overlay, Tool, ToolSavingMixins],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.0.0' }
    },
    tool() {
      let prevSettings = localStorage.getItem('EmojiTool')
      if (prevSettings) {
        prevSettings = JSON.parse(prevSettings)
      }
      const defaultColor = prevSettings?.color || '#d75800'

      return {
        // Descriptor for the tool
        group: 'Emoji',
        type: 'Label',
        hint: 'Emoji label',
        data: [], // Default data
        settings: {
          text: '',
          color: defaultColor,
          undo: 1,
          settingsList: ['color'],
        }, // Default settings
      }
    },
    // Called after overlay mounted
    init() {
      this.pins.push(new EmojiPin(this, 'p1', { offset: 0 }))
      this.pins.push(new EmojiPin(this, 'p2', { offset: 3, isFixedPin: true, }))

      this.updateSettingsState(this)
      this.set_state('finished')
      this.$emit('drawing-mode-off')
      this.registerMouseEvent(this)
      this.mouse.on('mousemove', this.updateMousePosition)
      window.addEventListener('click', this.handleMouseClick) // Register global click event listener
    },
    beforeDestroy() {
      window.removeEventListener('click', this.handleMouseClick) // Clean up the event listener
    },
    updateMousePosition(e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    },
    handleMouseClick(e) {
      let layout = this.$props.layout
      let x1 = layout.t2screen(this.p1[0])
      let x2 = layout.t2screen(this.p2[0])
      let y1 = layout.$2screen(this.p1[1])

      let emojiSize = Math.abs(x2 - x1)
      if (this.isMouseOverEmoji(x1, x2, y1, emojiSize)) {
        this.isEmojiClicked = true
      } else {
        this.isEmojiClicked = false
      }


    },
    draw(ctx) {

      if (!this.p1 || !this.p2) return
      ctx.strokeStyle = this.color
      ctx.fillStyle = this.color
      const layout = this.$props.layout

      ctx.beginPath()

      let x1 = layout.t2screen(this.p1[0])
      let x2 = layout.t2screen(this.p2[0])
      let y1 = layout.$2screen(this.p1[1])

      let midPoint = (x2 - x1) / 2

      this.collisions.push(this.make([x1, y1 + midPoint], [x2, y1 - midPoint]))
      let centerX = (x1 + x2) / 2
      let centerY = y1 + midPoint * 0.18
      let squareWidth = Math.abs(x2 - x1)
      let emojiSize = Math.abs(squareWidth)
      let emoji = this.sett.text
      ctx.font = `${emojiSize}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (!(this.pins[0].state == "settled" && this.pins[1].state == "settled") || this.isMouseOverEmoji(x1, x2, y1, emojiSize) || this.isEmojiClicked) {

        ctx.moveTo(x1, y1 + midPoint)
        ctx.lineTo(x2, y1 + midPoint)
        ctx.lineTo(x2, y1 - midPoint)
        ctx.lineTo(x1, y1 - midPoint)
        ctx.closePath()
        ctx.stroke()
      }
      ctx.fillText(emoji, centerX, centerY)
      this.render_pins(ctx)
    },
    isMouseOverEmoji(x1, x2, y1, size) {
      const mid = (x2 - x1) / 2
      return (
        this.mouseY >= y1 &&
        this.mouseY <= y1 + 2 * mid &&
        this.mouseX <= x2 &&
        this.mouseX >= x1
      )
    },
    make(p1, p2) {
      return (x, y) => {
        return Math2.is_within_rectangle([x, y], p1, p2)
      }
    },
    use_for() {
      return ['EmojiTool']
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
      'getSelectedEmoji',
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

    color() {
      return this.sett.color || '#42b28a'
    },

    text() {
      return this.sett.text || ''
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
      isEmojiClicked: false
    }
  },
  created() {
    this.updateSettingsState(this)
    this.sett.text = this.sett.text || this.getSelectedEmoji
  }
}
</script>
