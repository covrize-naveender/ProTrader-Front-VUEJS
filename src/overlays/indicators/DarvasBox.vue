<script>
// Data section splitters (with labels)
import { Overlay } from "trading-vue-js";
import moment from 'moment'
import {chartEvents} from "../../chartEvents";
import { mapGetters } from 'vuex'

export default {
  name: 'DarvasBox',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return { 
        author: 'LakshanPerera', 
        version: '1.0.1',
        desc: 'Darvas Box',
        preset: {
          name: 'Darvas-$symName',
          side: 'onchart',
          settings: {
            symName:"",
            legend:false,
            legendButtons:false
          }
        }
      }
    },
    /**
     * Draw the darvas boxes
     * @param ctx {CanvasRenderingContext2D}
     */
    draw(ctx) {
      const layout = this.$props.layout;
      const data = this.$props.last;
      const isBullish = data[6]

      // Background
      const time1 = moment(data[1]).valueOf()
      const time2 = moment(data[2]).valueOf()
      const high = Math.max(data[3], data[4])
      const low = Math.min(data[3], data[4])

      const x1 = layout.t2screen(time1)
      const x2 = layout.t2screen(time2)
      const yHigh = layout.$2screen(high)
      const yLow = layout.$2screen(low)

      // Draw the outline
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000"
      ctx.beginPath()
      ctx.moveTo(x1, yHigh)
      ctx.lineTo(x2, yHigh)
      ctx.lineTo(x2, yLow)
      ctx.lineTo(x1, yLow)
      ctx.lineTo(x1, yHigh)
      ctx.stroke()

      ctx.fillStyle = data[5] || "#23a776"
      ctx.fillRect(x1, yHigh, x2 - x1, yLow - yHigh)

      // Text styling
      ctx.font = "bold 14px Roboto,'Open Sans',Arial,sans-serif"
      ctx.fillStyle = (this.themeDarkMode ? "#FFF" : "#000")
      ctx.textAlign = 'left'
      const textSmallSideOffset = 3
      const textLargeSideOffset = 13
      const textX = Math.min(x1, x2) + 3

      if(data[0] === "Main") {
        const text = (isBullish ? high : low).toFixed(3)
        const textY = isBullish ? yHigh - textSmallSideOffset : yLow + textLargeSideOffset
        ctx.fillText(text, textX, textY)

        if(!isBullish) {
          const textMid = high.toFixed(3)
          const textMidY = isBullish ? yLow - textSmallSideOffset : yHigh + textLargeSideOffset
          ctx.fillText(textMid, textX, textMidY)
        }
      } else {
        const text = (!isBullish ? high : low).toFixed(3)
        const textY = !isBullish ? yHigh - textSmallSideOffset : yLow + textLargeSideOffset
        ctx.fillText(text, textX, textY)

        if(isBullish) {
          const textMid = high.toFixed(3)
          const textMidY = isBullish ? yHigh - textSmallSideOffset  : yLow + textLargeSideOffset
          ctx.fillText(textMid, textX, textMidY)
        }
      }
    },
   use_for() { return ['DarvasBox'] }
  },
  // Define internal setting & constants here
  created() {
  },
  computed: {
    ...mapGetters(['themeDarkMode']),
    sett() {
      return this.$props.settings
    },
    new_font() {
      return this.sett.font ||
        '18px ' + this.$props.font.split('px').pop()
    },
    flag_color() {
      return this.sett.flagColor || '#4285f4'
    },
    label_color() {
      return this.sett.labelColor || (this.themeDarkMode ? "#FFF" : "#000")
    },
    line_color() {
      return this.sett.lineColor || '#4285f4'
    },
    line_width() {
      return this.sett.lineWidth || 1.0
    },
    y_position() {
      return this.sett.yPosition || 0.9
    }
  },
  mounted() {
    chartEvents.$on('removeDarvas',() => {
      debugger
      //removeDarvas
      // this.$destroy();
    })
  },
  data() {
    return {}
  }
}
</script>
