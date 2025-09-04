<script>
import { Overlay } from 'trading-vue-js'
export default {
  name: 'WMA',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'StdSquad',
        version: '1.0.0',
        desc: 'Symmetrically Weighted Moving Average',
        preset: {
          name: 'WMA $period',
          side: 'onchart',
          settings: {
            lineWidth: 1,
            color: '#e57440'
          }
        }
      }
    },
    use_for() {
      return ['WMA']
    },
    calc() {
      return {
        props: {
          period: { def: 12, text: 'Period' }
        },
        conf: { renderer: 'SplineExt' },
        update: `
        let a = wma(close, period)
        // let dataValue1
        // let lastClose
        // if(data && data.length){
        //   dataValue1  = new Date(data[data.length - 1][0]); 
        //   lastClose  = close[close.length - 1]; 
        // }
        // if(dataValue1)
                    return a[0]
                `
      }
    }
  }
}
</script>