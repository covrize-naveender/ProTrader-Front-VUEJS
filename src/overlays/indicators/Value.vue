<script>
import { Overlay } from 'trading-vue-js'
export default {
  name: 'Value',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Value Indicator',
        preset: {
          name: 'Value',
          side: 'offchart',
          settings: {
            lineWidth: 1,
            color: '#e52468'
          }
        }
      }
    },
    use_for() {
      return ['Value']
    },
    calc() {
      return {
        conf: { renderer: 'Spline' },
        update: `
                return ohlcv[iter][7]
              `
      }
    }
  }
}
</script>
