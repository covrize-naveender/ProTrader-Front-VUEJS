<script>
import { Overlay } from 'trading-vue-js'
import {mapGetters} from "vuex";
export default {
  name: 'VolumeOBV',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.2',
        desc: 'Volume OBV Indicator',
        preset: {
          name: 'Volume',
          side: 'offchart',
          settings: {
            legend: true,
            legendButtons: false,
            hideBarValues: true,
            histWidth: 2,
            lineWidth: 1,
            // signalWidth: 1,
            // color: 'rgba(39, 128, 227, 1)',
            // lineColor: '#000',
            // volumeColor: 'rgba(39, 128, 227, 1)'  //'#000' 
          }
        }
      }
    },
    draw(ctx) {
      const layout = this.$props.layout

      // VOLUME HISTOGRAM
      const base = layout.$2screen(0) + 0.5
      const off = this.histWidth % 2 ? 0 : 0.5
      ctx.lineWidth = this.histWidth
      ctx.strokeStyle = this.color
      let userDefineUp;
      let userDefineDown;
      let userDefineSame;
      let ovbLineColor;
      let multiColor = false;
      let userSettings = this.getGeneralUserSettings?.chart;
      if(userSettings){
        if(userSettings['barChangeVolume'] && userSettings['barChangeVolume']['value']){
          multiColor = true
          if(userSettings['downColorVolume'] && userSettings['downColorVolume']['value']) {
             userDefineDown=userSettings['downColorVolume']['value']
          }
          if(userSettings['upColorVolume'] && userSettings['upColorVolume']['value']) {
            userDefineUp=userSettings['upColorVolume']['value']
          }          
        }else{
          if(userSettings['volumeColor'] && userSettings['volumeColor']['value']) {
            userDefineSame = userSettings['volumeColor']['value']
          }
          
        } 
        if(userSettings['obvColor'] && userSettings['obvColor']['value']) {
          ovbLineColor=userSettings['obvColor']['value']
        }
      }
      
      ctx.beginPath()
      for (const i in this.$props.data) {
        const p = this.$props.data[i]
        let pp = undefined
        if(i > 0)
         pp = this.$props.data[i-1]
        const x = layout.t2screen(p[0]) - off
        const y = layout.$2screen(p[1]) - 0.5
        let defVolColor = this.sett.volumeColor
        if(pp && multiColor){
          if(pp[2] > p[2]){
            defVolColor = userDefineDown
          }else if(pp[2] < p[2]){
            defVolColor = userDefineUp
          }else{
            defVolColor = userDefineSame
          }          
        }else{
          defVolColor = userDefineSame
        }

        ctx.strokeStyle = defVolColor
        ctx.beginPath()
        ctx.moveTo(x, base)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // OBV LINE
      // ctx.beginPath()
      // ctx.lineWidth = this.lineWidth
      // ctx.strokeStyle = ovbLineColor ? ovbLineColor : this.lineColor

      // // vol min-max
      // this.volMinMax = this.getMinMax(1)
      // // obv min-max
      // this.obvMinMax = this.getMinMax(2) || this.volMinMax

      // for (const p of this.$props.data) {
      //   const x = layout.t2screen(p[0])
      //   const y = layout.$2screen(this.mapObv(p[2]))
      //   if(!isNaN(p[1]))ctx.lineTo(x, y)
      // }
      // ctx.stroke()
    },
    use_for() {
      return ['VolumeOBV']
    },
    legend(values) {
      let xs = values.slice(1).map(x => {
        return x.toLocaleString('en-US')       //.toFixed(0)        //(2)
      })
      return [
        { value: xs[0], color: this.volumeColor }
        // { value: this.mapObv(xs[1])?.toFixed(3), color: this.lineColor }
      ]
    },
    y_range(hi, lo) {
      const [high, low] = this.getMinMax(1)
      return [Math.min(high, hi), Math.max(low, lo)]
    },
    mapObv(value) {
      const vmax = this.volMinMax[0]
      const vmin = this.volMinMax[1]
      const omax = this.obvMinMax[0]
      const omin = this.obvMinMax[1]
      const delta = (vmax - vmin) / (omax - omin)
      return vmin + (value - omin) * delta
    },
    getMinMax(index = 1, xdata = null) {
      try {
        // accessing from main chart data?
        const accessingFromMain =
          (this.$props.data.length === 0 && this.mainData.length) || index === 1

        const data = accessingFromMain
          ? this.mainData
          : xdata || this.$props.data
        let max = -Infinity,
          min = Infinity

        const i = accessingFromMain ? 5 : Math.min(index, data[0].length - 1)
        for (const d of data) {
          if(!isNaN(d[i])){
          max = Math.max(d[i], max)
          min = Math.min(d[i], min)
          }
        }

        // set
        if (index === 1) {
          this.volMinMax = [max, min]
        } else {
          this.obvMinMax = [max, min]
        }

        return [max, min]
      } catch {
        return null
      }
    },
    calc() {
      return {
        props: {
          period: { def: 1, text: 'Period' }
        },
        init: `
          this.prev = 0
        `,
        update: `
                const volOffset = (close[0] > close[1] ?  vol[0] : (close[0] < close[1] ? -vol[0]:0))
                const obv = ts(this.prev + volOffset)
                this.prev = obv[0]
                return [vol[0], sma(obv, period)[0]]
        `
      }
    }
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters(['getGeneralUserSettings']),
    /** @returns {Object} */
    sett() {
      return this.$props.settings
    },
    /** @returns {Number} */
    histWidth() {
      return this.sett.histWidth || 4
    },
    /** @returns {Number} */
    lineWidth() {
      return this.sett.lineWidth || 1
    },
    /** @returns {String} */
    color() {
      return this.sett.color || '#42b28a'
    },
    /** @returns {String} */
    lineColor() {
      return this.sett.lineColor || '#42b28a'
    },
    /** @returns {String} */
    volumeColor() {
      return this.sett.volumeColor || '#42b28a'
    },
    /** @returns {[]} */
    mainData() {
      return this.sub
    }
  }
}
</script>