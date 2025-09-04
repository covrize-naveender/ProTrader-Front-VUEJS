<script>
// Renedrer for ohlcbar + volume (optional)
// It can be used as the main chart or an indicator
import XOhlcBar from './primitives/xcandle.js'
import XVolbar from './primitives/xvolbar.js'
import { Overlay, layout_cnv } from 'trading-vue-js'
import { mapGetters } from "vuex";
export default {
  name: 'HeikenAshi',
  mixins: [Overlay],
  methods: {
    heikenAshi(data) {
      let newMap = [];




      for (const ikey in data) {

        try {

          let i = Number(ikey)

          const [time, open, high, low, close, volume] = data[i].raw

          const prevOpen = i === 0 ? data[0].raw[1] : newMap[i - 1].raw[1]
          const prevClose = i === 0 ? data[0].raw[4] : newMap[i - 1].raw[4]

          const hOpen = (prevOpen + prevClose) / 2
          const hClose = (open + close + low + close) / 4
          const hHigh = Math.max(hOpen, hClose, high)
          const hLow = Math.max(hOpen, hClose, low)




          newMap.push({
            ...data[i],
            x: data[i].x,
            c: this.$props.layout.$2screen(hClose),
            h: this.$props.layout.$2screen(hHigh),
            l: this.$props.layout.$2screen(hLow),
            o: this.$props.layout.$2screen(hOpen),
            raw: [
              time, // time
              hOpen, // open
              hHigh, // high
              hLow, // low
              hClose, // close
              volume // volume
            ]
          })
        } catch (e) {
          console.error(e.message)
        }

      }


      return newMap;
      // return barData.map((data, i) => this.rawMapper(barData, i))
    },
    rawMapper(data, i) {
      const [time, open, high, low, close, volume] = data[i].raw
      const prevOpen = data[Math.max(i - 1, 0)].raw[1]
      const prevClose = data[Math.max(i - 1, 0)].raw[4]

      const hOpen = (prevOpen + prevClose) / 2
      const hClose = (open + close + low + close) / 4
      const hHigh = Math.max(hOpen, hClose, high)
      const hLow = Math.max(hOpen, hClose, low)

      return {
        ...data[i],
        x: data[i].x,
        c: this.$props.layout.$2screen(hClose),
        h: this.$props.layout.$2screen(hHigh),
        l: this.$props.layout.$2screen(hLow),
        o: this.$props.layout.$2screen(hOpen),
        raw: [
          time, // time
          hOpen, // open
          hHigh, // high
          hLow, // low
          hClose, // close
          volume // volume
        ]
      }
    },
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.3.0',
        desc: 'HeikenAshi Chart'
      }
    },
    init() {
      //this.price = new Price(this) // TODO:
    },
    draw(ctx) {
      // render as main chart:
      let cnv
      if (this.$props.sub === this.$props.data) {
        cnv = {
          ohlcbars: this.heikenAshi(this.$props.layout.candles),
          volume: this.$props.layout.volume
        }
        // Else, as offchart / onchart indicator:
      } else {
        cnv = layout_cnv(this)
      }

      if (this.show_volume) {
        for (let i = 0; i < cnv.volume.length; i++) {
          let volumeData = cnv.volume[i]
          let barData = cnv.ohlcbars[i]
          new XVolbar(this, ctx, volumeData, barData)
        }
      }
      for (var barData of cnv.ohlcbars) {
        new XOhlcBar(this, ctx, barData, this.themeDarkMode)
      }
      //if (this.price_line) this.price.draw(ctx)  // TODO:
    },
    use_for() {
      return ['HeikenAshi']
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
      return this.sett.upBarColor || '#23a776'
    },
    downBarColor() {
      return this.sett.downBarColor || '#e54150'
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
    }
  },
  data() {
    return { price: {} }
  }
}
</script>
