<script>
// Line renderer. (SMAs, EMAs, TEMAs...
// you know what I mean)
// TODO: make a real Line, not a bunch of lines...
// Adds all necessary stuff for you.
import { Overlay } from 'trading-vue-js'
import { mapGetters } from 'vuex'
import { CompareSymbolColorMap } from "../../constants";
import { chartEvents } from "../../chartEvents";
import { TimeRangesConfig } from "../../utils/TimeRangesConfig";

export default {
  name: 'CompareChartMain',
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

      const layout = this.$props.layout
      ctx.lineWidth = this.verticalLineWidth
      ctx.strokeStyle = this.verticalLineColor
      ctx.beginPath()
      const x = layout.t2screen(this.sett.comparisionIndex) // x - Mapping
      ctx.setLineDash([10, 10])
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.layout.height)
      ctx.stroke()
      /*const layout = this.$props.layout
      ctx.strokeStyle = this.color
      ctx.beginPath()

      for (var p of this.$props.data) {

        let x = layout.t2screen(p[0])
        let y = layout.$2screen(p[this.data_index])

        ctx.lineTo(x, y)

      }

      ctx.stroke()*/
    },
    y_range(hi, lo) {
      const upperBand = this.settings.upper;
      const lowerBand = this.settings.lower;

      return [
        upperBand,
        lowerBand
      ]
    },
    // For all data with these types overlay will be
    // added to the renderer list. And '$props.data'
    // will have the corresponding values. If you want to
    // redefine the default behviour for a prticular
    // indicator (let's say EMA),
    // just create a new overlay with the same type:
    // e.g. use_for() { return ['EMA'] }.
    use_for() {
      return ['CompareChartMain']
    },
    // Colors for the legend, should have the
    // same dimention as a data point (excl. timestamp)
    data_colors() {
      return [this.color]
    }
  },
  beforeDestroy() {
    chartEvents.$emit("remove_comparision_overlays")
    localStorage.removeItem('legendTxtConfig')
    localStorage.removeItem('isComparisonChart')
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters(['dc', 'getGeneralUserSettings', 'chartLowerRange', 'chartUpperRange'
      , 'getChartVisibleRange'
      , 'timeFrame'
      , 'getMultipleSymbolDataNew', 'selectedTab', 'multiTv', 'multiChartSymbol'
    ]),
    sett() {
      return this.$props.settings
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    color() {
      return CompareSymbolColorMap.MainColor
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
    },
    verticalLineColor() {
      return this.sett.verticalLineColor || '#ccc'
    },
    verticalLineWidth() {
      return this.sett.verticalLineWidth || 2.0
    },
    getTimeFrame() {
      return this.multiChartSymbol?.[this.selectedTab]?.timeFrame
    }
  },
  data() {
    return {
      COLORS: ['#42b28a', '#5691ce', '#612ff9', '#d50b90', '#ff2316']
    }
  },
  mounted() {
    let config = TimeRangesConfig[this.getTimeFrame]
    let rangeMap = config.map(d => d.range)
    this.$store.dispatch("updateMultipleSymbolData2", { data: this.getMultipleSymbolDataNew, rangeMap })
      .then(async d => {
        await this.$nextTick()
        if (d) {

          this.multiTv[this.selectedTab]?.data.merge('chart.settings', d)
        }
      })
    chartEvents.$on("update_compare_chart", (sid, range) => {
      let subSet = this.getMultipleSymbolDataNew?.sub?.comparisionSymbolByRange
      let visibleRange = localStorage.getItem("LastChartVisibleRange")

      if (visibleRange && subSet && subSet[visibleRange] && subSet[visibleRange].data) {
        let lastIndex = this.$props.data[0][0]
        let maxIndex = 0;
        let minIndex = 0;
        for (const dataSets of subSet[visibleRange].data) {
          let dataSetSlice = dataSets.data.slice(lastIndex, dataSets.data.length)

          for (const dataSetSliceElement of dataSetSlice) {
            if (dataSetSliceElement[1] > maxIndex) {
              maxIndex = dataSetSliceElement[1]
            }
            if (dataSetSliceElement[1] < minIndex) {
              minIndex = dataSetSliceElement[1]
            }
          }
        }
        let chartSettings = this.multiTv[this.selectedTab]?.data.get_one('chart.settings')
        this.multiTv[this.selectedTab]?.data.merge('chart.settings', { ...chartSettings, upper: maxIndex, lower: minIndex })

      }
    })
  },
  watch: {
    getTimeFrame(newVal) {
      let config = TimeRangesConfig[newVal]

      let rangeMap = config.map(d => d.range)
      this.$store.dispatch("updateMultipleSymbolData2", { data: this.getMultipleSymbolDataNew, rangeMap })
        .then(async d => {
          await this.$nextTick()
          if (d) {

            this.multiTv[this.selectedTab]?.data.merge('chart.settings', d)
          }
        })

    },
    getChartVisibleRange(c, o) {
      if (c && c !== o) {
        let config = TimeRangesConfig[this.getTimeFrame]
        let rangeMap = config.map(d => d.range)
        this.$store.dispatch("updateMultipleSymbolData2", { data: this.getMultipleSymbolDataNew, rangeMap })
          .then(async d => {
            await this.$nextTick()
            if (d) {

              this.multiTv[this.selectedTab]?.data.merge('chart.settings', d)
            }
          })
      }

    },
    settings: function () { // watch it
      this._$emit('layer-meta-props', {
        grid_id: this.$props.grid_id,
        layer_id: this.$props.id,
        legend: this.legend,
        data_colors: this.data_colors,
        y_range: this.y_range
      })
    }
  }
}
</script>
