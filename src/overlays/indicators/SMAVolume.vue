<script>
import { Overlay } from 'trading-vue-js'
export default {
  name: 'SMAVolume',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'SMA(Volume)',
        preset: {
          name: 'SMA(Volume) $period',
          side: 'offchart',
          settings: {
            lineWidth: 1.5,
            color: 'dodgerblue'
          }
        }
      }
    },
    use_for() {
      return ['SMAVolume']
    },
    draw(ctx) {
      const layout = this.$props.layout
      // SMA Line
      ctx.beginPath()
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.lineColor
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0])
        const y = layout.$2screen(p[1])
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    legend(values) {
      let xs = values.slice(1).map(x => {
        return  x.toFixed(3)           //x.toLocaleString('en-US')     //       //(Math.abs(x) > 0.001 ? 4 : 8)
      })
      return [{ value: xs[0], color: this.lineColor }]
    },
    
    calc() {
      return {
        props: {
          period: { def: 14, text: 'Period' }
        },
        update: `
            return sma(vol, period)[0];
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
      return this.sett.color || 'dodgerblue'
    }
  }
}
</script>
