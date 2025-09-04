<script>
import { Overlay } from 'trading-vue-js'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'RS',
  mixins: [Overlay],
  computed: {
    ...mapGetters(['multiOhlcv', 'multiChartSymbol', 'selectedTab', 'timeFrame', "isTrainingMode", "trainingModeDataRaw", "getSPXSymbolData", 'tv', 'multiTv', 'spxData']),

    chartIndex() {
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    getOhlcv() {
      return this.multiOhlcv[this.chartIndex]
    },
    getSPX() {
      return this.getSPXSymbolData
    },
    getTimeframe() {
      return this.multiChartSymbol[this.chartIndex]?.timeFrame
    },
    sett() {
      return this.$props.settings
    },
    color() {
      return this.sett.color || '#0000ff'
    },
    bandColor() {
      return this.sett.bandColor || 'rgba(39, 128, 227, 0.1)'
    },
    period() {
      return this.sett.period || 1
    },
    symId() {
      return `rs-${this.getSymbolName}-${this.timeFrame}-${this.period}`
    },

    data_index() {
      return this.sett.dataIndex || 1
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    getSymbolName() {
      return this.multiChartSymbol[this.selectedTab]?.symbol
    },
  },
  watch: {
    getOhlcv: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return
        this.init()
      },
      deep: true
    },
  },
  methods: {
    ...mapActions(['setRSLineData']),
    meta_info() {
      return {
        author: 'ShrutiPatel',
        version: '1.0.0',
        desc: 'RS Rating',
        preset: {
          name: 'RS',
          side: 'onchart',
          settings: {
            // lineWidth: 1,
            // color: 'rgba(39, 128, 227, 1)',
            // bandColor: 'rgba(39, 128, 227, 0.1)'
          }
        }
      }
    },

    init() {

      if (this.spxData) {
        const spx_Data = this.spxData.map(arr => (
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
          .sort((a, b) => b.date - a.date);
        if (this.getOhlcv) {

          this.wholeData = this.getOhlcv.map((arr, i) => (
            {
              format: moment(arr[0]).format("yyyy-MM-DD"),
              date: arr[0],
              open: arr[1],
              high: arr[2],
              low: arr[3],
              close: arr[4],
              volume: arr[5],
              index: i
            }
          )).filter(d => !isNaN(d.high) || !isNaN(d.low))
            .sort((a, b) => b.date - a.date);

          const rsLineData = this.calculateRS(this.wholeData, spx_Data, 4200, 80, this.getTimeframe)
          this.rsLine = rsLineData.reverse()
          this.setRSLineData({ rsData: rsLineData.map(x => x.close), index: this.chartIndex })

          if (this.getTimeframe == "D") {

            this.rsRate = this.getRSR(this.wholeData, spx_Data)
          }

        }
      }
    },
    draw(ctx) {
      
      if (this.prevSymId !== this.symId) {
        this.init()
      }
      if (!this.getOhlcv) return
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.beginPath()


      const layout = this.$props.layout
      const i = this.data_index
      const data = this.$props.data
      let label_x
      let label_y
      if (this.rsLine && data?.[0]?.[0] && data?.[data.length - 1]?.[0] + 1) {
        const rs_line = this.rsLine.slice(data[0][0], data[data.length - 1][0] + 1);


        // const rs_line = this.rsLine.slice(0, data.length).reverse();
        // let max = layout.$_hi
        // let min = layout.$_lo
        for (var k = 0, n = data.length; k < n; k++) {
          if (rs_line[k]?.['close']) {
            let p = data[k]
            let x = layout.t2screen(p[0])
            let y = layout.$2screen(rs_line[k]['close'])
            ctx.lineTo(x, y)
            label_x = p[0]
            label_y = y
          }
          // max = Math.max(max, rs_line[k]['close'])
          // min = Math.min(min, rs_line[k]['close'])
        }
        ctx.stroke()
        ctx.font = "15px serif";
        ctx.fillStyle = this.color;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        // const max_l = max
        // const min_l = min
        // this.multiTv[this.chartIndex]?.data.tv.toggleSidebarCustomRange([max_l, min_l]);
      }
      if (label_x != undefined && label_y != undefined) {
        ctx.fillText('RS Rating', layout.t2screen(label_x), label_y - 25)
        if (this.getTimeframe == "D") {
          ctx.fillText(this.rsRate.toFixed(0), layout.t2screen(label_x), label_y - 10)
        }
      }


    },
    use_for() {
      return ['RS']
    },
    calc() {
      const updateScript = `
      return [sma(close, 1)[0]];
    `;
      return {
        props: {
          period: { def: 1, text: 'Period' }
        },
        update: updateScript
      };

    },
    getRSR(symbol_data, spx_data) {
      try {
        var isIntraDay = false
        var latestCandle
        const symbol_date = symbol_data[0]["format"]
        const spx_date = spx_data[0]["format"]
        while (symbol_data.length > 0 && symbol_data[0]["format"] !== spx_date) {
          if (new Date(symbol_data[0]["format"]) > new Date(spx_date)) {
            isIntraDay = true;
            if (latestCandle === undefined) {
              latestCandle = symbol_data.splice(0, 1);
            } else {
              symbol_data.splice(0, 1);
            }
          } else {
            break;
          }
        }

        const today_json = symbol_data[0]
        const json_63 = symbol_data[62]
        const json_126 = symbol_data[125]
        const json_189 = symbol_data[188]
        const json_252 = symbol_data[251]

        const today_date = symbol_data[0]["format"]
        const date_63 = symbol_data[62]["format"]
        const date_126 = symbol_data[125]["format"]
        const date_189 = symbol_data[188]["format"]
        const date_252 = symbol_data[251]["format"]

        let closeDa
        let closeDa_63
        let closeDa_126
        let closeDa_189
        let closeDa_252
        if (isIntraDay) {
          closeDa = latestCandle[0]["close"]
          closeDa_63 = symbol_data[61]["close"]
          closeDa_126 = symbol_data[125]["close"]
          closeDa_189 = symbol_data[187]["close"]
          closeDa_252 = symbol_data[250]["close"]
        }
        else {
          closeDa = today_json["close"]
          closeDa_63 = json_63["close"]
          closeDa_126 = json_126["close"]
          closeDa_189 = json_189["close"]
          closeDa_252 = json_252["close"]
        }

        const today_json_spx = this.findTheDataByDate(spx_data, today_date);
        const json_spx_63 = this.findTheDataByDate(spx_data, date_63);
        const json_spx_126 = this.findTheDataByDate(spx_data, date_126);
        const json_spx_189 = this.findTheDataByDate(spx_data, date_189);
        const json_spx_252 = this.findTheDataByDate(spx_data, date_252);

        const spxCloseDa = today_json_spx["close"]
        const spxCloseDa_63 = json_spx_63["close"]
        const spxCloseDa_126 = json_spx_126["close"]
        const spxCloseDa_189 = json_spx_189["close"]
        const spxCloseDa_252 = json_spx_252["close"]

        const perfTicker63 = closeDa / closeDa_63
        const perfTicker126 = closeDa / closeDa_126
        const perfTicker189 = closeDa / closeDa_189
        const perfTicker252 = closeDa / closeDa_252

        // SP500 of reference ticker
        const perfComp63 = spxCloseDa / spxCloseDa_63
        const perfComp126 = spxCloseDa / spxCloseDa_126
        const perfComp189 = spxCloseDa / spxCloseDa_189
        const perfComp252 = spxCloseDa / spxCloseDa_252

        const rs_stock = 0.4 * perfTicker63 + 0.2 * perfTicker126 + 0.2 * perfTicker189 + 0.2 * perfTicker252
        const rs_ref = 0.4 * perfComp63 + 0.2 * perfComp126 + 0.2 * perfComp189 + 0.2 * perfComp252
        const totalRsScore = (rs_stock) / (rs_ref) * 100
        var totalRsRating = -1

        const first = 195.93
        const scnd = 117.11
        const thrd = 99.04
        const frth = 91.66
        const ffth = 80.96
        const sxth = 53.64
        const svth = 24.86

        if (totalRsScore >= first) {

          totalRsRating = 99
        }
        if (totalRsScore <= svth) {
          totalRsRating = 1
        }
        const f_attributePercentile = (totalRsScore, tallerPerf, smallerPerf, rangeUp, rangeDn, weight) => {
          var sum = totalRsScore + (totalRsScore - smallerPerf) * weight
          if (sum > tallerPerf - 1) {
            sum = tallerPerf - 1
          }
          const k1 = smallerPerf / rangeDn
          const k2 = (tallerPerf - 1) / rangeUp
          const k3 = (k1 - k2) / (tallerPerf - 1 - smallerPerf)
          var Rsrating = sum / (k1 - k3 * (totalRsScore - smallerPerf))
          if (Rsrating > rangeUp) {
            Rsrating = rangeUp
          }
          if (Rsrating < rangeDn) {
            Rsrating = rangeDn
          }
          return Rsrating


        }
        if (totalRsScore < first && totalRsScore >= scnd)
          totalRsRating = f_attributePercentile(totalRsScore, first, scnd, 98, 90, 0.33)
        // Between 119 and 100 we have scores between 89 and 70.
        if (totalRsScore < scnd && totalRsScore >= thrd)
          totalRsRating = f_attributePercentile(totalRsScore, scnd, thrd, 89, 70, 2.1)
        // Between 100 && 91 we have scores between 69 && 50.
        if (totalRsScore < thrd && totalRsScore >= frth)
          totalRsRating = f_attributePercentile(totalRsScore, thrd, frth, 69, 50, 0)
        // Between 90 && 82 we have scores between 49 && 30.
        if (totalRsScore < frth && totalRsScore >= ffth)
          totalRsRating = f_attributePercentile(totalRsScore, frth, ffth, 49, 30, 0)
        // Between 81 && 56 we have scores between 29 && 10.
        if (totalRsScore < ffth && totalRsScore >= sxth)
          totalRsRating = f_attributePercentile(totalRsScore, ffth, sxth, 29, 10, 0)
        // Between 55 && 28 we have scores between 9 && 2.
        if (totalRsScore < sxth && totalRsScore >= svth)
          totalRsRating = f_attributePercentile(totalRsScore, sxth, svth, 9, 2, 0)
        return totalRsRating
      } catch (error) {
        console.log(error, "RS ERROR");
        return 0
      }

    },
    calculateRS(symbol_data, spx_data, SpxValue, offset, timeFrame) {
      const rsValues = [];
      for (let i = 0; i < symbol_data.length; i++) {
        const close = symbol_data[i]['close'];
        if (spx_data[i] != null) {
          const comparativeClose = spx_data[i]['close'];

          if (comparativeClose !== 0) { // Avoid division by zero
            const rsCurve = close / comparativeClose;
            const rsRatio = timeFrame == "W" ? SpxValue * (offset - 10) / 100 : SpxValue * offset / 100;
            const rs = rsCurve * rsRatio;

            rsValues.push({
              date: symbol_data[i]['date'],
              close: rs,
              index: symbol_data[i]['index']
            });
          } else {
            rsValues.push({
              date: symbol_data[i]['date'],
              close: null,
              index: symbol_data[i]['index']
            }); // or some default value in case of invalid data
          }
        }

      }
      return rsValues;
    },
    findTheDataByDate(data, targetDate) {
      // Convert targetDate to a Date object for comparison
      const targetDateObj = new Date(targetDate);

      // Sort the data array by date
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Find the exact match or the next available date
      for (let i = 0; i < sortedData.length; i++) {
        const currentDateObj = new Date(sortedData[i].date);
        if (currentDateObj >= targetDateObj) {
          return sortedData[i];
        }
      }

      // If no date is found (all dates are earlier), return null or handle accordingly
      return null;
    }

  }
}
</script>
