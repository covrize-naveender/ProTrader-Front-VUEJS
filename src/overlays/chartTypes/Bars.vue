<script>
// Renedrer for ohlcbar + volume (optional)
// It can be used as the main chart or an indicator
import XOhlcBar from './primitives/xohlcbar.js'
import XVolbar from './primitives/xvolbar.js'
import { Overlay, layout_cnv } from 'trading-vue-js'
import {  mapGetters } from 'vuex'
export default {
  name: 'Bars',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Bar Chart'
      }
    },
    init() {},
    draw(ctx) {
      // render as main chart:
      if (this.$props.sub === this.$props.data) {
        var cnv = {
          ohlcbars: this.$props.layout.candles,
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
        new XOhlcBar(this, ctx, barData)
      }
      //if (this.price_line) this.price.draw(ctx)  // TODO:
    },
    use_for() {
      return ['Bars']
    },
    // When added as offchart overlay
    y_range() {
      let hi =  Math.max(...this.$props.sub.map(x => x[2]))
      let lo =  Math.min(...this.$props.sub.map(x => x[3]))
      if (this.isRSSelected && this.rsLineData?.[this.chartIndex]?.length > 0) {
        let reqRsData = this.rsLineData[this.chartIndex].slice(this.$props.data[0][0]-1 ,this.$props.data[this.$props.data.length-1][0])
        if (reqRsData) {
          let rsMin = Math.min(...reqRsData)
          let rsMax = Math.max(...reqRsData)
          return [Math.max(hi, rsMax), Math.min(lo, rsMin)]
        }

      }
      return [hi,lo]
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
    show_volume() {
      return false
    },
    price_line() {
      return 'priceLine' in this.sett ? this.sett.priceLine : true
    },
    upVolBarColor() {
      return this.sett.upBarColor || '#6F378B'
    },
    downVolBarColor() {
      return this.sett.downBarColor || '#6F378B'
    },
    volBarWidth() {
      return this.sett.barWidth || 2
    },
    upBarColor() {
      let upBarColorStr = '#6F378B'
      if(this.getGeneralUserSettings){
        if(this.getGeneralUserSettings.chart['barChange'] && this.getGeneralUserSettings.chart['barChange']['value']){
          if(this.getGeneralUserSettings.chart['upColor'] && this.getGeneralUserSettings.chart['upColor']['value']) {
            upBarColorStr = this.getGeneralUserSettings.chart['upColor']['value']
          }
        }
      }
      
      return upBarColorStr
    },
    downBarColor() {
      let downBarColorStr = "#6F378B";
      
      if(this.getGeneralUserSettings){
        if(this.getGeneralUserSettings.chart['barChange'] && this.getGeneralUserSettings.chart['barChange']['value']){
          if(this.getGeneralUserSettings.chart['downColor'] && this.getGeneralUserSettings.chart['downColor']['value']){
            downBarColorStr =  this.getGeneralUserSettings.chart['downColor']['value']
          }
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
    }
  },
  data() {
    return { price: {} }
  }
}
</script>