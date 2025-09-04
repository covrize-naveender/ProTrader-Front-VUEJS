<script>
import { Overlay } from 'trading-vue-js'
import { mapGetters } from 'vuex'
import TCI from './calculators/tci'
import moment from 'moment'
export default {
  name: 'TCI',
  mixins: [Overlay],
  computed: {
    ...mapGetters(['multiOhlcv', 'selectedTab', "isTrainingMode", "trainingModeDataRaw", "multiChartSymbol"]),
    getOhlcv() {
      return this.isTrainingMode ? this.trainingModeDataRaw : this.multiOhlcv[this.chartIndex]
    },
    getTCI(){
      return this.tci
    },
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
      return `tci-${this.getSymbolName}-${this.multiChartSymbol[this.chartIndex]}-${this.period}`
    },
    getSymbolName() {
      return this.multiChartSymbol[this.chartIndex]?.symbol
    },
    chartIndex(){
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
  },
  watch: {
    getOhlcv: {
      handler(newValue,oldValue) {
        if(newValue === oldValue) return
        this.init()
      },
      deep: true
    }
  },
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Trend Channel Indicator',
        preset: {
          name: 'TCI $period',
          side: 'onchart',
          settings: {
            lineWidth: 1,
            color: 'rgba(39, 128, 227, 1)',
            bandColor: 'rgba(39, 128, 227, 0.1)'
          }
        }
      }
    },

    init() {
      if (this.getOhlcv) {
        this.wholeData = this.getOhlcv.map(arr => (
          {
            format: moment(arr[0]).format("yyyy-MM-DD"),
            date: arr[0],
          open: arr[1],
          high: arr[2],
          low: arr[3],
          close: arr[4],
          volume: arr[5]
          }
        )).filter(d => !isNaN(d.high)|| !isNaN(d.low))

        this.tci = new TCI()
        this.prevSymId = this.symId
        this.tci.Calculate(
          this.wholeData,
          this.wholeData.length - 1,
          this.period
        )
      }
    },
    draw(ctx) {
      if (this.prevSymId !== this.symId) {
        this.init()
      }
      const { t2screen, $2screen } = this.$props.layout
      if (!this.getOhlcv || this.tci.Turns?.length === 0) return
      for (const turn of this.tci.Turns) {
        // const shouldSkip = !Object.values(turn).every(curr => Boolean(curr) && isFinite(curr))
        // if (shouldSkip) {
        //   continue
        // }

        const { start, end, startHigh, endHigh, startLow, endLow,startIndex } = turn

        if(isNaN(start)|| isNaN(end)|| isNaN(startHigh)|| isNaN(endHigh)|| isNaN(startLow)|| isNaN(endLow)){
          continue;
        }
        let secondToLastVal = 0;
        let secondToLast = this.wholeData?.[startIndex+1]
        if(secondToLast?.date){
          secondToLastVal = secondToLast?.date
        }
        const xStart = secondToLastVal ? t2screen(secondToLastVal):t2screen(start)
        const xEnd = t2screen(end)

        const yStartHigh = $2screen(startHigh)
        const yEndHigh = $2screen(endHigh)
        const yStartLow = $2screen(startLow)
        const yEndLow = $2screen(endLow)

        ctx.beginPath()
        ctx.fillStyle = this.bandColor
        ctx.moveTo(xStart, yStartHigh)
        ctx.lineTo(xEnd, yEndHigh)
        ctx.lineTo(xEnd, yEndLow)
        ctx.lineTo(xStart, yStartLow)
        ctx.fill()

        ctx.beginPath()
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.color
        ctx.moveTo(xStart, yStartHigh)
        ctx.lineTo(xEnd, yEndHigh)

        ctx.moveTo(xStart, yStartLow)
        ctx.lineTo(xEnd, yEndLow)

        ctx.stroke()
      }
    },
    use_for() {
      return ['TCI']
    },
    calc() {
      return {
        props: {
          period: { def: 34, text: 'Period' }
        }
      }
    },

  }
}
</script>
