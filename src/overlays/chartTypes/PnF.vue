<script>
import { Overlay } from 'trading-vue-js'
import pointAndFigure from './calculators/pnfCalculator'
import { mapGetters } from 'vuex'
import { dataAccessors } from '../../utils'
import {FormatUnixDate} from "../../utils/candle";
import {chartEvents} from "../../chartEvents";

function getUnitVolumeSizeInPx(
  props,
  maxVolVal = null,
  data = null,
  volAccessor = null
) {
  const { config, layout } = props
  const maxVol =
    maxVolVal ||
    (volAccessor && data && Math.max(...data.map(volAccessor))) ||
    1
  return (config.VOLSCALE * layout.height) / maxVol
}

export class VolbarExt {
  constructor(overlay, ctx, data, offsetX) {
    this.ctx = ctx
    this.$p = overlay.$props
    this.self = overlay
    this.style = this.self
    this.offsetX = offsetX
    this.draw(data)
  }

  draw(data) {
    let y0 = this.$p.layout.height
    let w = data.width
    let h = Math.floor(data.volume)

    this.ctx.fillStyle = data.green
      ? this.style.upVolBarColor
      : this.style.downVolBarColor

    this.ctx.fillRect(
      Math.floor(this.offsetX),
      Math.floor(y0 - h - 0.5),
      Math.floor(w),
      Math.floor(h + 1)
    )
  }
}

export default {
  name: 'PnF',
  mixins: [Overlay],
  mounted() {
    setTimeout(() => {
        this.onMount()
      }, 1000)
    chartEvents.$on('PnfValueUpdate',this.PnfValueUpdate)
    chartEvents.$emit('PnfValueSetterToModal',{boxSize:this.boxSize,reversal:this.reversal})
  },
  beforeDestroy() {
    localStorage.removeItem("showLegendProps")
    this.multiTv[this.chartIndex].data.set('chart.data', this.ohlcvTest)
    chartEvents.$off('PnfValueUpdate');
  },
  methods: {
    PnfValueUpdate(data){
      this.boxSize = data.boxSize
      this.reversal = data.reversal
      setTimeout(() => {
        this.onMount()
      }, 100)
      // this.updateData = 'render'
    },
    meta_info() {
      return {
        author: 'LakshanPerera',
        version: '1.0.0',
        desc: 'Point and Figures Chart'
      }
    },
    onMount() {
      const boxSizes = [
        [0, 0.001],
        [0.2, 0.002],
        [0.5, 0.005],
        [1, 0.01],
        [2, 0.02],
        [5, 0.05],
        [10, 0.1],
        [20, 0.2],
        [50, 0.5],
        [100, 1],
        [200, 2],
        [500, 5],
        [1e3, 10]
      ]

      if (!this.ohlcvTest) {
        // alert('Not enough data')
        return
      }

      
      // for (const boxSizePair of boxSizes) {
      //   if (close < boxSizePair[0]) break
      //   boxSize = boxSizePair[1]
      // }
    let dataSet = this.ohlcvTest
      // if(this.layout?.ti_map?.sub_i){
      //   dataSet = this.layout?.ti_map?.sub_i
      // }
      const close = dataSet[dataSet.length -1][4]
      const divVal = close / 50
      const bxSize =
          this.boxSize ? this.boxSize : 
          close > 50
              ? +divVal.toFixed(0)
              : close > 25
                  ? +divVal.toFixed(1)
                  : close > 2.5
                      ? +divVal.toFixed(2)
                      : +divVal.toFixed(3)
      let boxSize = bxSize || boxSizes[0],
          reversal = this.reversal
      const legenedProps = [
        {k:"Box size",v:boxSize},
        {k:"Reversal",v:reversal},
      ];
      localStorage.setItem("showLegendProps",JSON.stringify(legenedProps))
      
      this.formattedData = dataSet.map(arr => ({
        date: dataAccessors.date(arr),
        open: dataAccessors.open(arr),
        high: dataAccessors.high(arr),
        low: dataAccessors.low(arr),
        close: dataAccessors.close(arr),
        volume: dataAccessors.volume(arr),
        value: dataAccessors.value(arr)
      }))
      
      // debugger
      const pnfAlgo = pointAndFigure()
      this.columns = pnfAlgo(
        this.$props.layout,
        this.formattedData,
        boxSize,
        reversal
      )
      this.boxSize = boxSize
      if (!this.columns || !this.columns.length) {
        // alert('Not enough data')
        return
      }
      
      this.altData = this.columns.map(col => [
        col.date,
        col.max,
        col.max,
        col.min,
        col.min,
        col.volume,
        null,
        col.value
      ])
      let datesMap = this.columns.map(col => [
        FormatUnixDate(this.layout.ti_map.i2t(col.offset[0]))
      ])
      
      this.multiTv[this.chartIndex].data.set('chart.data', this.altData)
      this.updateData = 'done'
      if (this.altData) {
        this.$nextTick(_ => {
          chartEvents.$emit('setChartRange',undefined,'PNF Recalculate')
        })
      }
      
      
    },
    init() {
      this.onMount()
    },
    draw(ctx) {
      if (!this.columns || !this.columns.length) {
        ctx.font = "30px Arial";
        ctx.fillText("Not enough data", 500, 300);
        return
      }

      ctx.lineWidth = 1
      ctx.strokeStyle = this.color
      let maxVol = 0
      const layout = this.$props.layout
      const columnWidth = layout.t2screen(1) - layout.t2screen(0)
      this.columns?.forEach(col => {
        let [offsetXInitial, offsetY] = col.offset

        const offsetX =
          layout.t2screen(offsetXInitial) -
          (layout.t2screen(1) - layout.t2screen(0)) / 2

        col.boxes.forEach(box => {
          offsetY = Math.abs(
            layout.$2screen(box.open) - layout.$2screen(box.close)
          )
          if (box.open && box.close) {
            if (col.direction > 0) {
              ctx.fillStyle = this.upVolBarColor
              ctx.strokeStyle = this.upVolBarColor

              ctx.beginPath()
              ctx.moveTo(offsetX, offsetY + layout.$2screen(box.open))
              ctx.lineTo(
                offsetX + columnWidth,
                offsetY + layout.$2screen(box.close)
              )
              ctx.moveTo(offsetX, offsetY + layout.$2screen(box.close))
              ctx.lineTo(
                offsetX + columnWidth,
                offsetY + layout.$2screen(box.open)
              )

              ctx.stroke()
            } else {
              ctx.fillStyle = this.downVolBarColor
              ctx.strokeStyle = this.downVolBarColor

              ctx.beginPath()

              const [x, y] = [
                offsetX + columnWidth / 2,
                layout.$2screen(box.open) + offsetY / 2
              ]
              const [rx, ry] = [columnWidth / 2, offsetY / 2]

              ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI)
              ctx.stroke()
            }
          }
        })

        //--- update the max vol
        if (
          offsetX > -(col.width + 10) &&
          offsetX < layout.width + (col.width + 10)
        ) {
          maxVol = Math.max(maxVol, col.volume)
        }
      })

      //--- show volume
      if (this.show_volume) {
        this.columns?.forEach(col => {
          const offsetX = col.offset[0]
          const volumHeight =
            getUnitVolumeSizeInPx(this.$props, maxVol) * col.volume
          new VolbarExt(
            this,
            ctx,
            {
              volume: volumHeight,
              width: col.width,
              h: layout.height,
              green: col.direction > 0
            },
            offsetX
          )
        })
      }
    },
    use_for() {
      return ['PnF']
    },
    data_colors() {
      return [this.color]
    }
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters(['ohlcv', 'tv','getGeneralUserSettings', 'multiOhlcv', 'multiTv']),
    sett() {
      return this.$props.settings
    },
    chartIndex() {
      return Number(this.$attrs.tv_id?.split('-')[0])
    },
    ohlcvTest(){
      return this.multiOhlcv[this.chartIndex]
    },
    line_width() {
      return this.sett.lineWidth || 0.75
    },
    color() {
      const n = this.$props.num % 5
      return this.sett.color || this.COLORS[n]
    },
    data_index() {
      return this.sett.dataIndex || 1
    },
    // Don't connect separate parts if true
    skip_nan() {
      return this.sett.skipNaN
    },
    show_volume() {
      return false
    },
    upVolBarColor() {
      let upBarColorStr = '#23a776'
      if(this.getGeneralUserSettings){
        if(this.getGeneralUserSettings.chart['upColor'] && this.getGeneralUserSettings.chart['upColor']['value']) {
          upBarColorStr = this.getGeneralUserSettings.chart['upColor']['value']
        }
      }
      return upBarColorStr
    },
    downVolBarColor() {
      let downBarColorStr = "#e54150";
      
      if(this.getGeneralUserSettings){
        if(this.getGeneralUserSettings.chart['downColor'] && this.getGeneralUserSettings.chart['downColor']['value']){
          downBarColorStr =  this.getGeneralUserSettings.chart['downColor']['value']
        }
      }
      return downBarColorStr
    }
  },
  watch: {
    multiOhlcv:{
      handler(n,o){
        if (n[this.chartIndex]) {
          
          this.boxSize=undefined
          this.reversal=2
          setTimeout(() => {
            this.onMount()
            chartEvents.$emit('PnfValueSetterToModal',{boxSize:this.boxSize,reversal:this.reversal})
          }, 100)
        }
      },
      // deep:true
    },
  },
  data() {
    return {
      COLORS: ['#42b28a', '#5691ce', '#612ff9', '#d50b90', '#ff2316'],
      boxSize:null,
      reversal:2,
      updateData:'',
    }
  },
}
</script>
