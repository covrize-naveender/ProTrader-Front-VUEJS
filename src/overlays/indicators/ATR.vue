<script>
import { Overlay } from 'trading-vue-js'
import atr from './calculators/atr'
import { mapGetters } from 'vuex'
export default {
  name: 'ATR',
  mixins: [Overlay],
  computed: {
    ...mapGetters(['timeFrame', 'multiOhlcv', 'selectedTab', 'multiChartSymbol']),
    sett() {
      return this.$props.settings
    },
    lineWidth() {
      return this.sett.lineWidth || 1
    },
    color() {
      return this.sett.color || 'rgba(39, 128, 227, 1)'
    },
    bandColor() {
      return this.sett.bandColor || 'rgba(39, 128, 227, 0.1)'
    },
    period() {
      return this.sett.period || 34
    },
    symId() {
      return `tci-${this.getSymbolName}-${this.timeFrame}-${this.period}`
    },
    symbolData() {
      return this.multiOhlcv[this.selectedTab]
    },
    getSymbolName() {
      return this.multiChartSymbol[this.selectedTab]?.symbol
    }
  },
  methods: {
    meta_info() {
      return {
        author: 'StdSquad',
        version: '1.0.0',
        desc: 'Average True Range',
        preset: {
          name: 'ATR $length',
          side: 'offchart',
          settings: {
            multiplier: 1,
            lineWidth: 1,
            color: '#e52468'
          }
        }
      }
    },
    use_for() {
      return ['ATR']
    },
    init() {
      if (this.symbolData) {
        this.wholeData = this.symbolData.map(arr => ({
          date: arr[0],
          open: arr[1],
          high: arr[2],
          low: arr[3],
          close: arr[4],
          volume: arr[5]
        }))
        this.prevSymId = this.symId
        // this.rsi = atr(this.wholeData)
      }
    },
    /**
     * @param {CanvasRenderingContext2D} ctx
     */

    calc() {
      return {
        props: {
          length: { def: 15, text: 'Length' },
          multiplier: { def: 1, text: 'Multiplier' },
        },
        conf: { renderer: 'Spline' },
        update: `
                    return (atr(length)[0]* multiplier)
                `
      }
    }
  }
}
</script>