<script>
import { Overlay } from 'trading-vue-js'

export default {
  name: 'SMAOBV',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'SMA(OBV)',
        preset: {
          name: 'SMA(OBV) $period',
          side: 'offchart',
          settings: {
            lineWidth: 1.5,
            color: 'red'
          }
        }
      }
    },
    use_for() {
      return ['SMAOBV']
    },
    init() {},
    draw(ctx) {
      const layout = this.$props.layout
      // OBV LINE
      ctx.beginPath()
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.lineColor

      // vol min-max
      this.volMinMax = this.getMinMax(0)
      // obv min-max
      this.obvMinMax = this.getMinMax(1) || this.volMinMax

      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0])
        const y = layout.$2screen(this.mapObv(p[1]))
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    legend(values) {
      // let xs = values.slice(1).map(x => {
      //   return x.toFixed(Math.abs(x) > 0.001 ? 4 : 8)
      // })
      // return [{ value: xs[0], color: this.lineColor }]
      return []
    },
    y_range(hi, lo) {
      return this.getMinMax() || [hi, lo]
    },
    mapObv(value) {
      const vmax = this.volMinMax[0]
      const vmin = this.volMinMax[1]
      const omax = this.obvMinMax[0]
      const omin = this.obvMinMax[1]
      const delta = (vmax - vmin) / (omax - omin)
      return vmin + (value - omin) * delta
    },
    getMinMax(index = 0, xdata = null) {
      try {
        // accessing from main chart data?
        const accessingFromMain =
          index === 0 || (this.$props.data.length === 0 && this.sub.length)

        const data = accessingFromMain ? this.sub : xdata || this.$props.data
        let max = -Infinity,
          min = Infinity

        const i = accessingFromMain ? 5 : Math.min(index, data[0].length - 1)
        for (const d of data) {
          max = Math.max(d[i], max)
          min = Math.min(d[i], min)
        }

        // set
        if (index === 0) {
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
          period: { def: 5, text: 'Period' }
        },
        init: `
          this.prev = 0
        `,
        update: `
            const volOffset = (close[0] > close[1] ?  vol[0] : (close[0] < close[1] ? -vol[0]:0))
            const obv = ts(this.prev + volOffset)
            this.prev = obv[0]            
            return sma(obv, period)[0]
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
      return this.sett.lineWidth || 1
    },
    /** @returns {String} */
    lineColor() {
      return this.sett.color || 'red'
    }
  }
}
</script>
