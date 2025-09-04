<script>
import { Overlay } from 'trading-vue-js'
import {mapGetters} from "vuex";
export default {
  name: 'MACD',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.2',
        desc: 'Moving Average Convergence/Divergence',
        preset: {
          name: 'MACD $fast $slow $smooth',
          side: 'offchart',
          settings: {
            histWidth: 4,
            macdWidth: 1,
            signalWidth: 1,
            // defColor: '#42b28a',
            macdColor: '#3782f2',
            signalColor: '#f48709',
            histColor: '#9954bb'
          }
        }
      }
    },
    draw(ctx) {
      
      const layout = this.$props.layout
      const settings = this.sett
      // HISTOGRAM
      
      /*if(this.getSingleIndicator && this.getSingleIndicator.macd){
        
        this.$props.settings.fast = this.getSingleIndicator.macd.parameters && this.getSingleIndicator.macd.parameters.fastPeriod  ?
            this.getSingleIndicator.macd.parameters.fastPeriod.value :  14;
        this.$props.settings.slow = this.getSingleIndicator.macd.parameters && this.getSingleIndicator.macd.parameters.slowPeriod  ?
            this.getSingleIndicator.macd.parameters.slowPeriod.value :  26;
        this.$props.settings.smooth = this.getSingleIndicator.macd.parameters && this.getSingleIndicator.macd.parameters.signalPeriod  ?
            this.getSingleIndicator.macd.parameters.signalPeriod.value :  9;
      }else{
        
      }*/
      const base = layout.$2screen(0) + 0.5
      const off = this.hist_width % 2 ? 0 : 0.5
      ctx.lineWidth = this.hist_width
      ctx.strokeStyle = this.color
      ctx.beginPath()
      let prevP = this.$props.data[0]
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]) - off
        const y = layout.$2screen(p[1]) - 0.5
        let color = 0
        const hist = p[1]
        const prevHist = prevP[1]
        if (hist >= 0) {
          color = 0
          if (hist < prevHist) color = 1
        } else {
          color = 2
          if (hist > prevHist) color = 3
        }
        ctx.strokeStyle = settings.histColor
        ctx.beginPath()
        ctx.moveTo(x, base)
        ctx.lineTo(x, y)
        ctx.stroke()
        prevP = p
      }
      // MACD LINE
      ctx.beginPath()
      ctx.lineWidth = this.macd_width
      
      ctx.strokeStyle = settings.macdColor
      // ctx.strokeStyle = this.macd_color
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0])
        const y = layout.$2screen(p[2])
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      // SIGNAL LINE
      ctx.beginPath()
      
      ctx.lineWidth = this.signal_width
      // ctx.strokeStyle = this.signal_color
      ctx.strokeStyle = settings.signalColor
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0])
        const y = layout.$2screen(p[3])
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    use_for() {
      return ['MACD']
    },
    legend(values) {
      let xs = values.slice(1, 4).map(x => {
        return x.toFixed(3)  //(Math.abs(x) > 0.001 ? 4 : 8)
      // let xs = values.slice(1, 4).map(x => {
      // return x.toFixed(Math.abs(x) > 0.0 ? 2 : 3)
      })

      return [
        { value: xs[0], color: this.histColor },
        { value: xs[1], color: this.macd_color },
        { value: xs[2], color: this.signal_color }
      ]
    },
    y_range(hi, lo) {
      return [hi, lo]
    },    
    calc() {
    
      let fast1 = 14;
      let slow1 = 26;
      let smooth1 = 9;
      
      
      
      return {
        props: {
          fast: { def: fast1, text: 'Fast Length' },
          slow: { def: slow1, text: 'Slow Length' },
          smooth: { def: smooth1, text: 'Signal EMA' }
        },
        update: `
                    let [macd, signal, hist] =
                        macd(close, fast, slow, smooth)
                    if (hist[0] >= 0) {
                         var color = 0
                         if (hist[0] < hist[1]) color = 1
                    } else {
                        color = 2
                        if (hist[0] > hist[1]) color = 3
                    }
                    return [hist[0], macd[0], signal[0]]
                `
      }
    },

    getColor(colorProp,defaultProp){
      if(this.getSingleIndicator.macd){
        if(this.getSingleIndicator.macd.series){
          for (let series of this.getSingleIndicator.macd.series) {
            if(series.forProp === colorProp){
              return series.color
            }
          }
        }
      }
      return this.sett[defaultProp]
    }
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters(["getSingleIndicator"]),
    /** @returns {Object} */
    sett() {
      
      return this.$props.settings
    },
    /** @returns {Number} */
    hist_width() {
      return this.sett.histWidth || 4
    },
    /** @returns {Number} */
    macd_width() {
      if(this.sett.macdWidth){
        return  this.sett.macdWidth
      }else{
        return 1
      }
       
    },
    /** @returns {Number} */
    signal_width() {
      return this.sett.signalWidth || 1
    },
    /** @returns {String} */
    color() {
      return this.sett.defColor || '#42b28a'
    },
    /** @returns {Number} */
    // macd_color() {
    //   let macdColor = this.getColor("fastPeriod","macdColor")
    //   return macdColor || '#f24737'
    // },
    /** @returns {Number} */
    // signal_color() {
    //   let signalColor = this.getColor("slowPeriod","signalColor")
    //   return signalColor || '#f48709'
    // },
    /** @returns {String} */
    hist_colors() {
      return ['#35a776', '#79e0b3', '#e54150', '#ea969e']
    },
    /** @returns {String} */
    // histColor() {
    //   return this.getColor("signalPeriod","histColor")
    //  
    // }
  },
  watch:{
    // getSingleIndicator(){
    //   this.calc()
    // }
  }
}
</script>