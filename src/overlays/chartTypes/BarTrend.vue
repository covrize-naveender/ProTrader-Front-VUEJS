<script>
// Renedrer for ohlcbar + volume (optional)
// It can be used as the main chart or an indicator
import TCI, { ETrend } from '../indicators/calculators/tci'
import XOhlcBar from './primitives/xohlcbar.js'
import XVolbar from './primitives/xvolbar.js'
import { Overlay } from 'trading-vue-js'
import { mapGetters } from "vuex";
import moment from 'moment'
import XOhlcBarTrend from './primitives/xohlcbartrend'
export default {
  name: 'BarTrend',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.3.0',
        desc: 'Bar Trend',
        preset: {
          name: 'BarTrend',
          side: 'onchart'
        }
      }
    },
    init() {
      this.sma = []
      this.period = 21
      this.barSymbol = this.getSymbolName
      if (this.$store.state.multiDc[this.chartIndex]) {
        this.timeFrame = this.$store.state.multiDc[this.chartIndex]?.data.chart.tf
        this.wholeData = this.$store.state.multiDc[this.chartIndex]?.data.chart.data

        this.wholeData.forEach((data, index) => {
          let sum = 0
          for (let i = index; i > Math.max(0, index - this.period); i--) {
            sum += this.wholeData[i][4]
          }
          this.sma[data[0]] = sum / this.period
        })


        this.tci = new TCI()
        const _data = this.wholeData.map(arr => (
          {
            format: moment(arr[0]).format("yyyy-MM-DD"),
            date: arr[0],
            open: arr[1],
            high: arr[2],
            low: arr[3],
            close: arr[4],
            volume: arr[5]
          }
        )).filter(d => !isNaN(d.high) || !isNaN(d.low))
        this.tci.Calculate(
          _data,
          _data.length - 1,
          this.period
        )

      }
    },
    draw(ctx) {
      // render as main chart:
      if (
        this.$store.state.multiDc[this.chartIndex] &&
        (this.$store.state.multiDc[this.chartIndex]?.data.chart.tf !== this.timeFrame
          || this.wholeData?.length !== this.getOhlcv?.length
          || this.getSymbolName !== this.barSymbol
        )
      ) {

        this.init()
      }

      if (this.$props.sub === this.$props.data) {
        var cnv = {
          ohlcbars: this.$props.layout.candles,
          volume: this.$props.layout.volume
        }
      }

      if (this.show_volume) {
        for (let i = 0; i < cnv.volume.length; i++) {
          let volumeData = cnv.volume[i]
          let barData = cnv.ohlcbars[i]
          new XVolbar(this, ctx, volumeData, barData)
        }
      }

      const layout = this.$props.layout

      //--- always set to false
      if (this.show_sma) {
        ctx.strokeStyle = 'green'
        ctx.lineWidth = this.line_width * 3
        ctx.strokeStyle = this.color
        ctx.moveTo(0, 0)
        ctx.beginPath()
        for (const key in this.sma) {
          const x = layout.t2screen(key)
          const y = layout.$2screen(this.sma[key])
          ctx.lineTo(x, y)
        }

        ctx.stroke()
      }
      for (const i in cnv.ohlcbars) {
        let ohlcbar = cnv.ohlcbars[i]
        let barData = this.tci.Trend[ohlcbar?.raw?.[0]]

        let color = '#000'
        if (barData !== null) {
          if (ETrend.Down === barData) {
            color = this.downBarColor //"#e54150"
          } else if (ETrend.Up === barData) {
            color = this.upBarColor //'#23a776'
          }
        }
        new XOhlcBarTrend(this, ctx, ohlcbar, color)
      }


    },
    use_for() {
      return ['BarTrend']
    },
    // When added as offchart overlay
    y_range() {
      let hi = Math.max(...this.$props.sub.map(x => x[2]))
      let lo = Math.min(...this.$props.sub.map(x => x[3]))
      if (this.isRSSelected && this.rsLineData?.[this.chartIndex]?.length > 0) {
        let reqRsData = this.rsLineData[this.chartIndex].slice(this.$props.data[0][0] - 1, this.$props.data[this.$props.data.length - 1][0])
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
    ...mapGetters(['getGeneralUserSettings', 'isTrainingMode', 'trainingModeDataRaw', 'multiOhlcv', 'selectedTab', 'multiTv', 'multiChartSymbol', 'isRSSelected', 'rsLineData']),
    getSymbolName() {
      return this.multiChartSymbol[this.selectedTab]?.symbol
    },
    sett() {
      return this.$props.settings
    },
    getTCI() {
      return this.tci
    },
    getOhlcv() {
      return this.isTrainingMode ? this.trainingModeDataRaw : this.ohlcv
    },
    show_volume() {
      return false
    },
    price_line() {
      return 'priceLine' in this.sett ? this.sett.priceLine : true
    },
    upVolBarColor() {
      return this.sett.upBarColor || '#23a77655'
    },
    downVolBarColor() {
      return this.sett.downBarColor || '#e5415055'
    },
    volBarWidth() {
      return this.sett.barWidth || 2
    },
    upBarColor() {
      let upBarColorStr = '#23a776'
      if (this.getGeneralUserSettings) {
        if (this.getGeneralUserSettings.chart['upColor'] && this.getGeneralUserSettings.chart['upColor']['value']) {
          upBarColorStr = this.getGeneralUserSettings.chart['upColor']['value']
        }
      }
      return upBarColorStr
    },
    downBarColor() {
      let downBarColorStr = "#e54150";
      if (this.getGeneralUserSettings) {
        if (this.getGeneralUserSettings.chart['downColor'] && this.getGeneralUserSettings.chart['downColor']['value']) {
          downBarColorStr = this.getGeneralUserSettings.chart['downColor']['value']
        }
      }
      return downBarColorStr
    },
    barWidth() {
      return this.sett.barWidth || 1
    },
    hlcOnly() {
      return this.sett.hlcOnly || false
    },
    lineWidth() {
      return this.sett.lineWidth || 1
    },
    chartIndex() {
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    ohlcv() {
      return this.multiOhlcv[this.chartIndex]
    }
  },
  data() {
    return { timeFrame: 'D', price: {} }
  }
}
</script>