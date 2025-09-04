<script>
import { Overlay } from 'trading-vue-js'
export default {
  name: 'VWAP',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'VWAP indicator',
        preset: {
          name: 'VWAP',
          side: 'offchart',
          settings: {
            lineWidth: 1,
            color: 'rgba(39, 128, 227, 1)'
          }
        }
      }
    },
    use_for() {
      return ['VWAP']
    },

    draw(ctx) {
      const { t2screen, $2screen } = this.$props.layout
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      ctx.beginPath()
      for (const p of this.$props.data) {
        const x = t2screen(p[0])
        const y = $2screen(p[1])
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    legend(values) {
      let xs = values.slice(1).map(x => {
        return x.toFixed(3)       //(Math.abs(x) > 0.001 ? 4 : 8)
      })
      return [{ value: xs[0], color: this.color }]
    },
    calc() {
      return {
        props: {},
        init: `
            this.vv = []
            for(const candle of ohlcv) {
              this.vv.push([candle[0], candle[7]/candle[5]])
            }
        `,
        update: `
          let data = ts(this.vv[iter][1])
          return data[0]
        `
      }
    }
  },
  computed: {
    /** @returns {Object} */
    sett() {
      return this.$props.settings
    },
    /** @returns {Number} */
    lineWidth() {
      return this.sett.lineWidth
    },
    /** @returns {String} */
    color() {
      return this.sett.color
    }
  }
}

/**
 * study(title="VWAP", shorttitle="VWAP", overlay=true)
 src = input(title = "Source", type = input.source, defval = hlc3)
 t = time("D")
 start = na(t[1]) or t > t[1]
 sumSrc = src * volume
 sumVol = volume
 sumSrc := start ? sumSrc : sumSrc + sumSrc[1]
 sumVol := start ? sumVol : sumVol + sumVol[1]
 // You can use built-in vwap() function instead.
 plot(sumSrc / sumVol, title="VWAP", color=color.blue)
 *
 */
</script>
