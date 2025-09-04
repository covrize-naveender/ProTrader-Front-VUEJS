<script>
// Line renderer. (SMAs, EMAs, TEMAs...
// you know what I mean)
// TODO: make a real Line, not a bunch of lines...
// Adds all necessary stuff for you.
import {Overlay} from 'trading-vue-js'
import {CompareSymbolColorMap} from "../../constants";

export default {
  name: 'CompareChartSub',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return { 
        author: 'LakshanPerera', 
        version: '1.1.2' ,
        desc: 'CompareChartSub',
        preset: {
          name: 'CompareChartSub-$symName',
          side: 'onchart',
          settings: {
            symName:"",
            legend:false,
            legendButtons:false
          }
        }
      }
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
      const layout = this.$props.layout
      ctx.strokeStyle = this.color
      ctx.beginPath()
      for (let p of this.$props.data) {

        let x = layout.t2screen(p[0])
        let y = layout.$2screen(p[this.data_index])
        ctx.lineTo(x, y)

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
      return ['CompareChartSub']
    },
    // Colors for the legend, should have the
    // same dimention as a data point (excl. timestamp)
    data_colors() {
      return [this.color]
    }
  },
  // Define internal setting & constants here
  computed: {
    sett() {
      return this.$props.settings
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    color() {
      return this.COLORS[this.sett.recordId] || this.sett.color
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
    }
  },
  data() {
    return {
      COLORS: CompareSymbolColorMap.SubColors
    }
  }
}
</script>
