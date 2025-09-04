<script>
// Line renderer. (SMAs, EMAs, TEMAs...
// you know what I mean)
// TODO: make a real Line, not a bunch of lines...
// Adds all necessary stuff for you.
import { Overlay } from 'trading-vue-js'
import XVolbar from './primitives/xvolbar.js'
import {  mapGetters } from 'vuex'
export default {
  name: 'LineChart',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.1.2' }
    },
    // Here goes your code. You are provided with:
    // { All stuff is reactive }
    // $props.layout -> positions of all chart elements +
    //  some helper functions (see layout_fn.js)
    // $props.interval -> candlestick time interval
    // $props.sub -> current subset of candlestick data
    // $props.data -> your indicator's data subset.
    //  Comes "as is", should have the following format:
    //  [[<timestamp>, ... ], ... ]
    // $props.colors -> colors (see TradingVue.vue)
    // $props.cursor -> current position of crosshair
    // $props.settings -> indicator's custom settings
    //  E.g. colors, line thickness, etc. You define it.
    // $props.num -> indicator's layer number (of All
    // layers in the current grid)
    // $props.id -> indicator's id (e.g. EMA_0)
    // ~
    // Finally, let's make the canvas dirty!
    draw(ctx) {
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.beginPath()
      const layout = this.$props.layout
      const i = this.data_index
      const data = this.$props.data
      if (!this.skip_nan) {
        for (let k = 0, n = data.length; k < n; k++) {
          let p = data[k]
          let x = layout.t2screen(p[0])
          let y = layout.$2screen(p[i])
          ctx.lineTo(x, y)
        }
      } else {
        var skip = false
        for (let k = 0, n = data.length; k < n; k++) {
          let p = data[k]
          let x = layout.t2screen(p[0])
          let y = layout.$2screen(p[i])
          if (p[i] == null || y !== y) {
            skip = true
          } else {
            if (skip) ctx.moveTo(x, y)
            ctx.lineTo(x, y)
            skip = false
          }
        }
      }

      if (this.show_volume) {
        for (let i = 0; i < this.$props.layout.volume.length; i++) {
          let volumeData = this.$props.layout.volume[i]
          let barData = this.$props.layout.candles[i]
          new XVolbar(this, ctx, volumeData, barData, false)
        }
      }

      ctx.stroke()
    },
    // For all data with these types overlay will be
    // added to the renderer list. And '$props.data'
    // will have the corresponding values. If you want to
    // redefine the default behviour for a prticular
    // indicator (let's say EMA),
    // just create a new overlay with the same type:
    // e.g. use_for() { return ['EMA'] }.
    use_for() {
      return ['LineChart']
    },
    // Colors for the legend, should have the
    // same dimention as a data point (excl. timestamp)
    data_colors() {
      return [this.color]
    },
    y_range(){
      let hi = Math.max(...this.$props.sub.map(x => x[4]))
      let lo = Math.min(...this.$props.sub.map(x => x[4]))
      if (this.isRSSelected && this.rsLineData?.[this.chartIndex]?.length > 0) {
        let reqRsData = this.rsLineData[this.chartIndex].slice(this.$props.data[0][0]-1 ,this.$props.data[this.$props.data.length-1][0])
        if (reqRsData) {
          let rsMin = Math.min(...reqRsData)
          let rsMax = Math.max(...reqRsData)
          return [Math.max(hi, rsMax), Math.min(lo, rsMin)]
        }

      }
      return [hi, lo]
    }
    
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters(['getGeneralUserSettings', 'isRSSelected', 'rsLineData']),
    chartIndex() {
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    sett() {
      return this.$props.settings
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    color() {
      const n = this.$props.num % 5
      // return this.sett.color || this.COLORS[n]
      if(this.getGeneralUserSettings){
        if(this.getGeneralUserSettings.chart['lineColor'] && this.getGeneralUserSettings.chart['lineColor']['value']){
          return this.getGeneralUserSettings.chart['lineColor']['value']
        }
      }
      return this.sett.color
    },
    data_index() {
      return this.sett.dataIndex || 4
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
    }
  },
  data() {
    return {
      COLORS: ['#42b28a', '#5691ce', '#612ff9', '#d50b90', '#ff2316']
    }
  }
}
</script>
