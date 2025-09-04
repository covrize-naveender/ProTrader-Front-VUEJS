<script>
import { Overlay } from 'trading-vue-js'
export default {
  name: 'XMA',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Exponential Moving Average',
        preset: {
          name: 'XMA $period',
          side: 'onchart',
          settings: {
            lineWidth: 1,
            color: '#f7890c'
          }
        }
      }
    },
    use_for() {
      return ['XMA']
    },
    calc() {
      return {
        props: {
          period: { def: 12, text: 'Period' }
        },
        conf: { renderer: 'SplineExt' },
        update: `
                  let emaVal = ema(close, period)
                    return emaVal[0]
                `
      }
    }
  }
}
</script>
