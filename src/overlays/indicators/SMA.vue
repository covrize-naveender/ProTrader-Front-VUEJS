<script>
import {Overlay} from 'trading-vue-js'

export default {
  name: 'SMA',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'StdSquad',
        version: '1.0.0',
        desc: 'Simple Moving Average',
        preset: {
          name: 'SMA $period',
          side: 'onchart',
          settings: {
            lineWidth: 1,
            color: '#e57440'
          }
        }
      }
    },
    draw(ctx) {
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.beginPath()

      const layout = this.$props.layout
      const i = this.data_index
      const data = this.$props.data

      if (!this.skip_nan) {
        for (var k = 0, n = data.length; k < n; k++) {
          let p = data[k]
          let x = layout.t2screen(p[0])
          let y = layout.$2screen(p[i])
          ctx.lineTo(x, y)
        }
      } else {
        var skip = false
        for (var k = 0, n = data.length; k < n; k++) {
          let p = data[k]
          let x = layout.t2screen(p[0])
          let y = layout.$2screen(p[i])
          if (p[i] == null || y !== y) {
            skip = true
          } else {
            if (skip) ctx.moveTo(x, y)
            ctx.lineTo(x, y)
            skip = false
          }
        }
      }
      ctx.stroke()
    },

    use_for() {
      return ['SMA']
    },
    calc() {
      return {
        props: {
          period: {def: 15, text: 'Period'}
        },
        // conf: {renderer: 'SplineExt'},
        update: `
        return sma(close, period)[0]
                `
      }
    }
  },
  computed: {
    sett() {
      return this.$props.settings
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    color() {
      // const n = this.$props.num % 5
      return this.sett.color 
          // || this.COLORS[n]
    },
    data_index() {
      return this.sett.dataIndex || 1
    },
    // Don't connect separate parts if true
    skip_nan() {
      return this.sett.skipNaN
    }
  },
}
</script>