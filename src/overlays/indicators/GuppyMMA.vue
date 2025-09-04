<script>
import { Overlay } from 'trading-vue-js'
export default {
  name: 'GuppyMMA',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Multiple Moving Average',
        preset: {
          name: 'GuppyMMA',
          side: 'onchart',
          settings: {
            lineWidth: 1,
            // color: '#f7890c',
          }
        }
      }
    },
    draw(ctx) {
      // console.log("guppy log", this.periodList, this.$props.data);
      // for (let index = 1; index <= this.periodList.length; index++) {
      //   const element = this.periodList[index];

      // }
      const layout = this.$props.layout
      for (let index = 0; index < this.periodList.length; index++) {
        ctx.beginPath()
        ctx.strokeStyle = this.periodList[index].color

        for (var p of this.$props.data) {
          
          // t2screen & $2screen - special functions that
          // map your data coordinates to grid coordinates
          let timeStamp = this.$props.layout.ti_map.i2t(p[0])
          
            let x = layout.t2screen(p[0])
            let y = layout.$2screen(p[index + 1])
  
            ctx.lineTo(x, y)
        }

        ctx.stroke()
      }
    },
    use_for() {
      return ['GuppyMMA']
    },
    calc() {
      return {
        props: {
          periodList: { def: [12], text: 'PeriodList' }
        },
        conf: { renderer: 'SplineExt' },
        update: `
          let res = []
          for (const element of periodList) {
            res.push(ema(close, element.period)[0])
          }
          return res
        `
      }
    }
  },
  computed: {
    sett() {
      return this.$props.settings
    },
    periodList() {
      return this.sett.periodList
    }
  }
}
</script>
