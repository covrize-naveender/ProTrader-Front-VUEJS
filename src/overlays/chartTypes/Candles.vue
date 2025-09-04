<script>
// Renedrer for candlesticks + volume (optional)
// It can be used as the main chart or an indicator

import { Overlay } from 'trading-vue-js'
import Candle from './primitives/candle'
import Volbar from './primitives/xvolbar.js'
import Price from './primitives/price.js'
import { mapGetters } from "vuex";

export default {
  name: 'Candles',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return { author: 'ShrutiPatel', version: '1.2.1' }
    },
    init() {
      this.price = new Price(this)

    },
    draw(ctx) {
      // If data === main candlestick data
      // render as main chart:
      if (this.$props.sub === this.$props.data) {
        var cnv = {
          candles: this.$props.layout.candles,
          volume: this.$props.layout.volume
        }
      }

      if (this.show_volume) {
        var cv = cnv.volume
        for (var i = 0, n = cv.length; i < n; i++) {
          new Volbar(this, ctx, cv[i])
        }
      }

      var cc = cnv.candles
      for (var i = 0, n = cc.length; i < n; i++) {
        new Candle(this, ctx, cc[i], this.themeDarkMode)
      }

      if (this.price_line) this.price.draw(ctx)
    },
    use_for() {
      return ['Candles']
    },

    // In case it's added as offchart overlay
    y_range() {
      var hi = -Infinity,
        lo = Infinity
      for (var i = 0, n = this.sub.length; i < n; i++) {
        let x = this.sub[i]
        if (x[2] > hi) hi = x[2]
        if (x[3] < lo) lo = x[3]
      }
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
    ...mapGetters(['themeDarkMode', 'isRSSelected', 'rsLineData']),
    chartIndex() {
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    sett() {
      return this.$props.settings
    },
    show_volume() {
      return false
    },
    price_line() {
      return 'priceLine' in this.sett ? this.sett.priceLine : true
    },
    colorCandleUp() {
      return this.sett.colorCandleUp || this.$props.colors.candleUp
    },
    colorCandleDw() {
      return this.sett.colorCandleDw || this.$props.colors.candleDw
    },
    colorWickUp() {
      return this.sett.colorWickUp || this.$props.colors.wickUp
    },
    colorWickDw() {
      return this.sett.colorWickDw || this.$props.colors.wickDw
    },
    colorWickSm() {
      return this.sett.colorWickSm || this.$props.colors.wickSm
    },
    colorVolUp() {
      return this.sett.colorVolUp || this.$props.colors.volUp
    },
    colorVolDw() {
      return this.sett.colorVolDw || this.$props.colors.volDw
    }
  },
  data() {
    return { price: {} }
  }
}
</script>
