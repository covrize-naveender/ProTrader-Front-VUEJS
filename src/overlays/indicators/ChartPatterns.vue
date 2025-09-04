<script>
// Data section splitters (with labels)
import { Overlay } from "trading-vue-js";
import moment from 'moment'

export default {
  name: 'ChartPatterns',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return { 
        author: 'LakshanPerera', 
        version: '1.0.1',
        desc: 'ChartPatterns',
        preset: {
          name: 'ChartPatterns-$symName',
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
      const { t2screen, $2screen } = this.$props.layout
      const data = this.$props.last
      const {drawData} = data

      for (const drawElement of drawData) {

      const { points, shape } = drawElement

      // Background
      const time1 = t2screen(moment(points[0].timeStamp).valueOf())
      const time2 = t2screen(moment(points[1].timeStamp).valueOf())
      const price1 = $2screen(points[0].value)
      const price2 = $2screen(points[1].value)

      // line styles
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2

      // draw
      ctx.beginPath()

      if(shape === 0){
        ctx.moveTo(time1, price1)
        ctx.lineTo(time2, price2)
      }
      else if(shape === 1) {
        const time3 = t2screen(moment(points[2].timeStamp).valueOf())
        const price3 = $2screen(points[2].value)
        const midX = time2
        const midY = price2 - (Math.min(price1, price3) - price2)
        ctx.moveTo(time1, price1)
        ctx.quadraticCurveTo(midX, midY, time3, price3)
      }

      // finish drawing
      ctx.stroke()
      }
    },
   use_for() { return ['ChartPatterns'] }
  },
  // Define internal setting & constants here
  computed: {
    sett() {
      return {...this.settings,...this.$props.settings}
    },
    new_font() {
      return this.sett.font ||
        '18px ' + this.$props.font.split('px').pop()
    },
    flag_color() {
      return this.sett.flagColor || '#4285f4'
    },
    label_color() {
      return this.sett.labelColor || '#000'
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
  data() {
    return {
    }
  }
}
</script>
