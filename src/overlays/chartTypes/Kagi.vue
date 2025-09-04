<script>
import { Overlay } from 'trading-vue-js'
import { isDefined } from 'Utils'
import kagi from './calculators/kagiCalculator'
import XVolbar from './primitives/xvolbar.js'
import { mapGetters } from 'vuex'
import moment from "moment/moment";
import {FormatUnixDate} from "../../utils/candle";

export default {
  name: 'Kagi',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Kagi Chart'
      }
    },
    init() {
      if (this.ohlcv) {
        this.originalData = this.ohlcv
        this.wholeData = this.originalData.map(arr => ({
          date: arr[0],
          open: arr[1],
          high: arr[2],
          low: arr[3],
          close: arr[4],
          volume: arr[5]
        }))
        // this.tv.goto(this.originalData.length - 1)
      }
    },
    draw(ctx) {
      
      if (!this.wholeData || !this.wholeData.length) return
      
      const strokeWidth = this.line_width * 3
      ctx.strokeStyle = this.color

      const layout = this.$props.layout
      const xScale = layout.t2screen
      const yScale = layout.$2screen
      const formattedData = this.wholeData
      const kagiAlgo = kagi()
      const processedData = kagiAlgo(formattedData)
      const stroke = { yin: 'green', yang: 'red' }
      const currentValueStroke = 'black'
      let begin = true
      
      processedData.forEach(each => {
        ctx.strokeStyle = stroke[each.type]
        ctx.lineWidth = strokeWidth

        ctx.beginPath()
        let prevX
        each.plot.forEach(d => {
          const [x, y] = [xScale(d[0]), yScale(d[1])]
          
          if (begin) {
            ctx.moveTo(x, y)
            begin = false
          } else {
            if (isDefined(prevX)) {
              ctx.lineTo(prevX, y)
            }
            ctx.lineTo(x, y)
          }
          prevX = x
        })
        ctx.stroke()
      })
      const lastPlot = processedData[processedData.length - 1].plot
      const last = lastPlot[lastPlot.length - 1]
      ctx.beginPath()
      // ctx.strokeStyle = "black";
      ctx.lineWidth = 1

      const [x, y1, y2] = [xScale(last[0]), yScale(last[2]), yScale(last[3])]
      
      ctx.moveTo(x, y1)
      ctx.lineTo(x + 10, y1)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = currentValueStroke
      ctx.moveTo(x - 10, y2)
      ctx.lineTo(x, y2)
      ctx.stroke()

      
      if (this.show_volume) {
        for (let i = 0; i < this.$props.layout.volume.length; i++) {
          let volumeData = this.$props.layout.volume[i]
          let barData = this.$props.layout.candles[i]
          new XVolbar(this, ctx, volumeData, barData)
        }
      }
    },
    use_for() {
      return ['Kagi']
    },
    data_colors() {
      return [this.color]
    },
    // In case it's added as offchart overlay
    y_range() {
      var hi = -Infinity,
          lo = Infinity;
      for (var i = 0, n = this.sub.length; i < n; i++) {
        let x = this.sub[i];
        if (x[2] > hi) hi = x[2];
        if (x[3] < lo) lo = x[3];
      }
      if (this.isRSSelected && this.rsLineData?.[this.chartIndex]?.length > 0) {
        let reqRsData = this.rsLineData[this.chartIndex].slice(this.$props.data[0][0]-1 ,this.$props.data[this.$props.data.length-1][0])
        if (reqRsData) {
          let rsMin = Math.min(...reqRsData)
          let rsMax = Math.max(...reqRsData)
          return [Math.max(hi, rsMax), Math.min(lo, rsMin)]
        }

      }
      return [hi, lo];
    },
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters(['tv', 'multiOhlcv', 'isRSSelected', 'rsLineData']),
    sett() {
      return this.$props.settings
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    color() {
      const n = this.$props.num % 5
      return this.sett.color || this.COLORS[n]
    },
    data_index() {
      return this.sett.dataIndex || 1
    },
    // Don't connect separate parts if true
    skip_nan() {
      return this.sett.skipNaN
    },
    show_volume() {
      return false
    },
    upVolBarColor() {
      return this.sett.upBarColor || '#23a77655'
    },
    downVolBarColor() {
      return this.sett.downBarColor || '#e5415055'
    },
    chartIndex(){
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    ohlcv(){
      return this.multiOhlcv[this.chartIndex]
    }
  },
  watch:{
    ohlcv(n,o){
      
      if (n) {
        this.originalData = n
        this.wholeData = this.originalData.map(arr => ({
          date: arr[0],
          open: arr[1],
          high: arr[2],
          low: arr[3],
          close: arr[4],
          volume: arr[5]
        }))
        // this.tv.goto(this.originalData.length - 1)
      }
    }
  },
  data() {
    return {
      COLORS: ['#42b28a', '#5691ce', '#612ff9', '#d50b90', '#ff2316']
    }
  },
  mounted() {
    const parent = this.$el;
  }
}
</script>
