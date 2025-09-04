<script>
import {Overlay} from 'trading-vue-js'
import {mapActions, mapGetters} from 'vuex'
import moment from 'moment'
import {chartEvents} from "../../chartEvents";

export default {
  name: 'CompareChart',
  mixins: [Overlay],
  mounted() {
    
    
    this.onMount('mount')
  },
  beforeDestroy() {
    localStorage.removeItem('legendTxtConfig')
  },
  methods: {
    meta_info() {
      return { author: 'LakshanPerera', version: '1.1.2' }
    },
    init() {
      this.onMount('init')
    },
    async onMount(e) {
      // this.dc.hide('onchart')
      // if(e === 'mount' || e === 'update')
      // this.hideCandles(e)
      // utils
      const s2t = (str) => moment(str).valueOf()
      const toDate = (str) => moment(str).toDate()

      let startingDate = 0
      let maxSize = 0
      for (const sym of this.getMultipleSymbolData) {
        if (s2t(sym.data[0].date) > startingDate) {
          startingDate = s2t(sym.data[0].date)
        }
        maxSize = Math.max(maxSize, sym.data.length)
      }

      // set the starting point to the max of current chart starting point(3M, Y etc.)
      
      startingDate = Math.max(startingDate, this.getChartStartingTime)

      // for storing actual data for each symbol
      this.symbol0 = [] // current symbol
      this.symbol1 = []
      this.symbol2 = []
      this.symbol3 = []
      this.symbol4 = []
      this.symbolNames = {}

      this.initialPrices = [-1, -1, -1, -1, -1]
      // start adding data
      for (let i = 0; i < maxSize; i++) {
        for (let c = 0; c < this.getMultipleSymbolData.length; c++) {
          const symbol = this.getMultipleSymbolData[c]
          let identifier = `symbol${c}`;
          if(!this.symbolNames.hasOwnProperty(identifier)){
            this.symbolNames[identifier]=symbol.symbol
          }
          
          if (i >= symbol.data.length) continue
          if (s2t(symbol.data[i].date) >= startingDate) {
            // set the initial price for the percentage correction
            if (this.initialPrices[c] < 0) {
              this.initialPrices[c] = symbol.data[i].close
            }

            const pricePct =
              ((symbol.data[i].close - this.initialPrices[c]) * 100.0) /
              this.initialPrices[c]
            const d = [s2t(symbol.data[i].date), pricePct]

            // add volume to the current chart symbol data
            if (c === 0) {
              d.push(symbol.data[i].volume)
              d.push(symbol.data[i].value)
            }

            
            this[identifier].push(d)
          }
        }
        
        
        
        
      }

      // percentage correction
      const maxIndex = Math.max(
        this.symbol0.length,
        this.symbol1.length,
        this.symbol2.length,
        this.symbol3.length,
        this.symbol4.length
      )

      // set the alt data
      this.altData = []
      
      for (let i = 0; i < maxIndex; i++) {
        const date =
          this.symbol0[i]?.[0] ||
          this.symbol1[i]?.[0] ||
          this.symbol2[i]?.[0] ||
          this.symbol3[i]?.[0] ||
          this.symbol4[i]?.[0]

        const close0 = this.symbol0[i]?.[1] ?? 0
        const close1 = this.symbol1[i]?.[1] ?? 0
        const close2 = this.symbol2[i]?.[1] ?? 0
        const close3 = this.symbol3[i]?.[1] ?? 0
        const close4 = this.symbol4[i]?.[1] ?? 0

        const max = Math.max(close0, close1, close2, close3, close4)
        const min = Math.min(close0, close1, close2, close3, close4)
        this.altData.push([
          date,
          max,
          max,
          min,
          min,
          this.symbol0[i]?.[2] ?? 0,
          null,
          this.symbol0[i]?.[3] ?? 0,
        ])
      }

      // for the left v-line
      
      this.startingDate = this.altData[0][0]
      let symbolList = this.Config
      let namingLegend = []
      if (this.symbol0.length) {
        namingLegend.push({name:this.symbolName,style:{color:"#2780E3"}})
      }
      for (const key in symbolList) {
        if (this[key] && this[key].length) {
          let listElement = symbolList[key];
          let color = listElement.color;
          let selectedMultipleSymbol = this.symbolNames[key];
          
          if(selectedMultipleSymbol && selectedMultipleSymbol.length){
            // let name = selectedMultipleSymbol.split("~")[0];
            namingLegend.push({name:selectedMultipleSymbol,style:{color}})           
          } 
        }
      }
      localStorage.setItem('legendTxtConfig',JSON.stringify(namingLegend))
      this.tv.data.set('chart.data', this.altData)
      await this.$nextTick()
      chartEvents.$emit('setChartRange',this.getChartVisibleRange,'ComparisionMount')
      // this.showCandles()      
    },
    onMountNew(e) {
      // this.dc.hide('onchart')
      // if(e === 'mount' || e === 'update')
      // this.hideCandles(e)
      // utils
      const s2t = (str) => moment(str).valueOf()

      let startingDate = 0
      let maxSize = 0


      this.symbol0 = [] // current symbol
      this.symbol1 = []
      this.symbol2 = []
      this.symbol3 = []
      this.symbol4 = []


      let multipleSymbolData = this.getMultipleSymbolData;
      let startDate = moment().utc(this.getChartStartingTime).startOf('day');
      let multipleData = multipleSymbolData.getMultipleData;
      
      let hasDataKeys = []
      for (const dataKey in multipleData) {
        
        if(multipleData[dataKey].length > 0){
          hasDataKeys.push(dataKey)
        }
      }
      let hasFirstPrice;
      let priceMap = {};
      for (let i = 1; i < 10; i++) {
        let dateKey = startDate.format();
        
        let symbolData = {}


        for (const key of hasDataKeys) {
          if(multipleData[key] && multipleData[key]['data'] && multipleData[key]['data'][dateKey]){
            // hasDataKeys
            let initialPrice = -1
            let dataSym = multipleData[key]['data'][dateKey]
            if (priceMap[key]) {
              initialPrice = dataSym.close
            }
            const pricePct = ((dataSym.close - initialPrice) * 100.0) / initialPrice
            const d = [s2t(dataSym.date), pricePct]
            d.push(dataSym.volume)
            d.push(dataSym.value)
            symbolData[key]=d
          }
        }
        let validMap = hasDataKeys.length === Object.keys(symbolData).length;
        if(validMap){
          for (const key of hasDataKeys) {
            this[key]=symbolData[key]
          }

          if(!hasFirstPrice){
            hasFirstPrice = true
            // priceMap = {}
            for (const key of hasDataKeys) {
              priceMap[key]=symbolData[key][0]
            }
          }
        }
        startDate = startDate.subtract(1,'day')
      }
      


      
      /* for (const sym of multipleSymbolData) {
         if (s2t(sym.data[sym.data.length -1].date) > startingDate) {
           startingDate = s2t(sym.data[sym.data.length -1].date)
         }
         // maxSize = Math.max(maxSize, sym.data.length)
         maxSize = 10
       }*/
      

      // set the starting point to the max of current chart starting point(3M, Y etc.)
      // startingDate = Math.max(startingDate, this.getChartStartingTime)

      // for storing actual data for each symbol


      // this.initialPrices = [-1, -1, -1, -1, -1]
      // start adding data
      /*  for (let i = 0; i < maxSize; i++) {
          for (let c = 0; c < multipleSymbolData.length; c++) {
            const symbol = multipleSymbolData[c]
            
            if (i >= symbol.data.length) continue
            if (s2t(symbol.data[i].date) >= startingDate) {
              // Kia karun idhar 
              
              // set the initial price for the percentage correction
              if (this.initialPrices[c] < 0) {
                this.initialPrices[c] = symbol.data[i].close
              }
  
              const pricePct =
                ((symbol.data[i].close - this.initialPrices[c]) * 100.0) /
                this.initialPrices[c]
              const d = [s2t(symbol.data[i].date), pricePct]
  
              // add volume to the current chart symbol data
              if (c === 0) {
                d.push(symbol.data[i].volume)
                d.push(symbol.data[i].value)
              }
  
              this[`symbol${c}`].push(d)
            }
          }
          
        }
  */

      
      
      
      
      
      // percentage correction
      const maxIndex = Math.max(
          this.symbol0.length,
          this.symbol1.length,
          this.symbol2.length,
          this.symbol3.length,
          this.symbol4.length
      )

      // set the alt data
      this.altData = []
      for (let i = 0; i < maxIndex; i++) {
        const date =
            this.symbol0[i]?.[0] ||
            this.symbol1[i]?.[0] ||
            this.symbol2[i]?.[0] ||
            this.symbol3[i]?.[0] ||
            this.symbol4[i]?.[0]

        const close0 = this.symbol0[i]?.[1] ?? 0
        const close1 = this.symbol1[i]?.[1] ?? 0
        const close2 = this.symbol2[i]?.[1] ?? 0
        const close3 = this.symbol3[i]?.[1] ?? 0
        const close4 = this.symbol4[i]?.[1] ?? 0

        const max = Math.max(close0, close1, close2, close3, close4)
        const min = Math.min(close0, close1, close2, close3, close4)
        this.altData.push([
          date,
          max,
          max,
          min,
          min,
          this.symbol0[i]?.[2] ?? 0,
          null,
          this.symbol0[i]?.[3] ?? 0,
        ])
      }

      // for the left v-line
      this.startingDate = this.altData[0][0]
      

      this.tv.data.set('chart.data', this.altData)
      // this.setChartRange(this.getChartVisibleRange)
      // await this.$nextTick()
      // this.showCandles()      
    },
    draw(ctx) {
      
      let drawingData = {}
      if (this.symbol0.length) {
        drawingData[this.symbolName] = this.drawLineChart(ctx, '#2780E3', this.symbol0, this.symbolName)
      }
      let symbolList = this.Config
      for (const key in symbolList) {
        if (this[key] && this[key].length) {
          let listElement = symbolList[key];
          let color = listElement.color;
          let name = this.getSelectedMultipleSymbols[key].split("~")[0];
          drawingData[name] = this.drawLineChart(ctx, color, this[key], name)
          
          // this.getSelectedMultipleSymbols.symbol1
        }
      }
      
      // 
      
      
      // draw the vertical line
      const layout = this.$props.layout
      ctx.lineWidth = this.verticalLineWidth
      ctx.strokeStyle = this.verticalLineColor
      ctx.beginPath()
      const x = layout.t2screen(this.startingDate) // x - Mapping
      ctx.setLineDash([10, 10])
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.layout.height)
      ctx.stroke()
      
    },
    drawLineChart(ctx, color, data,flag) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = color
      ctx.beginPath()
      let res = []
      const { t2screen, $2screen } = this.$props.layout
      for (let k = 0, n = data.length; k < n; k++) {
        let p = data[k]
        
        let x = t2screen(p[0])
        let y = $2screen(p[1])
        ctx.lineTo(x, y)
        if(flag)
        {
          let isoDate = moment(p[0]).toISOString();
          
          res.push({isoDate,x,y,p0:p[0],p1:p[1],})
        }
      }
      ctx.stroke()
      return res
    },
    use_for() {
      return ['CompareChart']
    },
    data_colors() {
      return [this.color]
    },
  },
  // Define internal setting & constants here
  computed: {
    ...mapGetters([
      'getMultipleSymbolData',
      'getSelectedMultipleSymbols',
      'tv',
      'dc',
      'symbolName',
      'getChartVisibleRange',
      'getChartStartingTime',
      'getChartEndingTime',
    ]),
    sett() {
      return this.$props.settings
    },
    lineWidth() {
      return this.sett.lineWidth || 1
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
    verticalLineWidth() {
      return this.sett.verticalLineWidth || 2.0
    },
    verticalLineColor() {
      return this.sett.verticalLineColor || '#ccc'
    },
  },
  data() {
    return {
      COLORS: ['#42b28a', '#5691ce', '#612ff9', '#d50b90', '#ff2316'],
      Config:{
        // "symbol0": {color: "#2780E3",id:"0"},
        "symbol1": {color: "#FF7518",id:"1"},
        "symbol2": {color: "#9954BB",id:"2"},
        "symbol3": {color: "#3FB632",id:"3"},
        "symbol4": {color: "#FF0039",id:"4"}
      },
    }
  },

  watch: {
    getMultipleSymbolData(newValue, oldValue) {
      if (newValue.length !== oldValue.length) {
        this.onMount("length changes")
      } else {
        for (let i = 0; i < newValue.length; i++) {
          if (
            newValue[i].symbol !== oldValue[i].symbol ||
            newValue[i].timeFrame !== oldValue[i].timeFrame
          ) {
            this.onMount("symbol change")
            return
          }
        }
      }
    },
    getChartStartingTime(newValue,oldValue) {
      if (newValue !== oldValue) {
        this.onMount("chart_time_change")
      }
    },
  },
}
</script>
