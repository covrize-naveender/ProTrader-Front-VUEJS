import symbolService from '../services/symbol'
import moment from "moment";
import {chartEvents} from "../chartEvents";
import {CompareSymbolColorMap} from "../constants";
import Overlays from "../overlays";
import {getTimeCalculation} from "../utils/timeCalculation";
import {TimeRangesConfig} from "../utils/TimeRangesConfig";
import { parseToChartCandleData } from '../utils'

const timeCloseVolumeMapper = sym => {
  return {
    symbol: sym.symbol,
    timeFrame: sym.timeFrame,
    data: sym.data.map(d => ({
      date: d.date,
      close: d.close,
      volume: d.volume,
      value: d.value
    }))
  }
}
const symbol1 = localStorage.getItem('symbol1') || ""; 
const symbol2 = localStorage.getItem('symbol2') || ""; 
const symbol3 = localStorage.getItem('symbol3') || ""; 
const symbol4 = localStorage.getItem('symbol4') || ""; 
export default {
  state: () => ({
    chartStartingTime: 0,
    chartEndingTime: 0,
    // symbol1: 'BHP.au~ASX',
    // symbol2: 'RIO.au~ASX',
    // symbol3: 'CBA.au~ASX',
    // symbol4: 'ANZ.au~ASX',
    symbol1: symbol1,
    symbol2: symbol2,
    symbol3: symbol3,
    symbol4: symbol4,
    data: [],
    MultipleSymbolData:{},
  }),
  mutations: {
    deleteSymbol(state,payload){
      state[payload] = "";
      localStorage.setItem(payload,"")
    },

    changeSymbol(state, payload) {
      localStorage.setItem(payload.propName,payload?.propValue || "")
      state[payload.propName] = payload?.propValue || ""
    },
    setSymbolDataMultiple(state, data) {
      state.data = data
    },
    setChartStartingTime(state, startingTime) {
      state.chartStartingTime = startingTime
    },
    setChartEndingTime(state, endingTime) {
      state.chartEndingTime = endingTime
    },
    setMultiSymbolData(state, MultipleSymbolData) {
      state.MultipleSymbolData = MultipleSymbolData
    }
  },
  actions: {
    async retrieveMultipleSymbolData(context,payload) {
      const symbolList = Object.values(
        context.getters.getSelectedMultipleSymbols
      ).filter(str => str)
      const timeFrame = context.rootGetters.timeFrame
      await context.dispatch('setChartLoadingStatus', true)
      const symbolName =payload?.symbol ? payload.symbol : context.rootGetters.symbolName
      let config = TimeRangesConfig[timeFrame]
      let rangeMap = config.map(d => d.range)
      const result = await symbolService.getMultipleSymbolData(
          symbolList,
          timeFrame,
          symbolName,
          rangeMap
      )
      
      await context.dispatch("updateMultipleSymbolData2",result)
      await context.dispatch('setChartLoadingStatus', false)
      const symbolData = result?.main
      let symIdentifier =symbolData.symbol + '~' + symbolData.metaData.exchange
      context.commit('SET_CURRENT_SYMBOL', symbolData)
      chartEvents.$emit('setChartRange',undefined,'MultipleSymbols',(chart) => {
        
      })
    },
    async updateMultipleSymbolData2(context,payload){
      let getChartVisibleRange = context.rootGetters.getChartVisibleRange
      let result = payload.data
      let rangeMap = payload.rangeMap
      
      if(!getChartVisibleRange){
        let visibleRange = localStorage.getItem("LastChartVisibleRange")
        if(visibleRange){
          getChartVisibleRange = visibleRange
        }
      }
      if(!rangeMap.includes(getChartVisibleRange)){
        getChartVisibleRange = rangeMap[0]
      }
  
      const dc = context.rootGetters.dc
      let overlay_tv = Object.values(Overlays)
      let ComparisionOverlays = overlay_tv.find(n => n.name.toUpperCase() === "CompareChartSub".toUpperCase());
      let updatedConfigForChart
      if (result?.main?.data && ComparisionOverlays && result.sub?.comparisionSymbolByRange) {
        let dataRangeWise = result.sub?.comparisionSymbolByRange[getChartVisibleRange]
        if(dataRangeWise){
          let namingLegend = []
          let COMPARE_CHART_SYMBOLS = []
          let compareSymbol = []
          let compareChart =dc.get('onchart.CompareChartSub')
          let chartSettings =dc.get_one('chart.settings')
          const presetSettings = ComparisionOverlays.methods.meta_info().preset.settings;
          for (let i in dataRangeWise.data) {
            let symbolData = dataRangeWise.data[i]
            
            let newOverlay = {
              name: `CompareChartSub-${symbolData.symbol}`,
              type: 'CompareChartSub',
              data:symbolData.data,
              settings: {
                ...presetSettings,recordId:i,comparisionIndex:symbolData.index
              }
            }
            compareSymbol.push(newOverlay)
            namingLegend.push({name:symbolData.symbol,style:{color:CompareSymbolColorMap.SubColors[i]}})
            COMPARE_CHART_SYMBOLS.push(symbolData.symbol)
          }
          let [parsedData,ohlcvMap] = parseToChartCandleData(result.main.data)
          context.commit('SET_OHLCV', parsedData)
          context.commit('SET_CANDLE_DATA_TIME_MAP', ohlcvMap)
          updatedConfigForChart = {...chartSettings,comparisionIndex:dataRangeWise.index,upper:dataRangeWise.max,lower:dataRangeWise.min}
          localStorage.removeItem('legendTxtConfig')
          context.commit('COMPARE_CHART_SYMBOLS',COMPARE_CHART_SYMBOLS)
          context.commit('SET_CHART_YRANGE_UPPER',dataRangeWise.max)
          context.commit('SET_CHART_YRANGE_LOWER',dataRangeWise.min)
          context.commit('SET_COMPARISION_INDEX',dataRangeWise.index)
          localStorage.setItem('legendTxtConfig',JSON.stringify(namingLegend))
          if(compareChart.length === compareSymbol.length){
            for (const c in compareChart) {
              // dc.add('onchart',c)
              let com = compareChart[c]
              com.settings = compareSymbol[c].settings
              com.data = compareSymbol[c].data
              dc.set(com.id,compareSymbol[c])
              // dc.set(`onchart.${com.id}.data`,compareSymbol[c].data)
            }

          }else{
            if(compareChart.length > 0)
              dc.del('onchart.CompareChartSub')
            // await this.$nextTick()
            for (const c of compareSymbol) {
              dc.add('onchart',c)
            }
          }
        }
        return updatedConfigForChart
      }
    },
    async updateMultipleSymbolData(context,payload){
      const getChartVisibleRange = context.rootGetters.getChartVisibleRange
  
      let result = payload.data
      let updateOHLC = payload.update
      const dc = context.rootGetters.dc
      let overlay_tv = Object.values(Overlays)
      let ComparisionOverlays = overlay_tv.find(n => n.name.toUpperCase() === "CompareChartSub".toUpperCase());
      let updatedConfigForChart;
      if (result?.main?.data && ComparisionOverlays) {

        localStorage.removeItem('legendTxtConfig')
        
        
        context.commit('COMPARE_CHART_SYMBOLS',[result.main.symbol,...result.sub.map(d => d.symbol)])
        let namingLegend = []
        const mainDataArray = result.main.data;
        
        let mainTime = getTimeCalculation({range:getChartVisibleRange},mainDataArray[mainDataArray.length - 1].date)
    
        let comparisionIndex = 0
        for (const datum of mainDataArray) {
          if (moment(datum.date).valueOf() > mainTime) break
          comparisionIndex++
        }
        context.commit('SET_CHART_YRANGE_UPPER',result.max)
        context.commit('SET_CHART_YRANGE_LOWER',result.min)
        context.commit('SET_COMPARISION_INDEX',comparisionIndex)
    
        // namingLegend.push({name:result.main.symbol,style:{color:CompareSymbolColorMap.MainColor}})
        const presetSettings = ComparisionOverlays.methods.meta_info().preset.settings;
        const mainData = {
          symbol : result.main.symbol,
          timeFrame :result.main.timeFrame,
          data:result.main.data
        };
        let max = 0
        let min = 0
        let initCloseMap = []
        let higherHigh = new Array(result.main.data.length)
        let lowerLow = new Array(result.main.data.length)
        const dataSetForCompare = [mainData,...result.sub];
        const compareSymbol = dataSetForCompare.map((d, i) => {
          
          namingLegend.push({name:d.symbol,style:{color:CompareSymbolColorMap.SubColors[i]}})
          
          return {
            name: `CompareChartSub-${d.symbol}`,
            type: 'CompareChartSub',
            data: d.data.map((c,k) =>
            {
              
              let initClose = d.data[comparisionIndex].close;
              
              let currVal = c.close;
              let pricePct = (currVal - initClose) * 100 / initClose;
              
              let adjustYScale  =k >= comparisionIndex
              // Higher High Map by id
              /*if(higherHigh[k]){
                if(pricePct > higherHigh[k]){
                  higherHigh[k] = pricePct
                }
              }else{
                higherHigh[k] = pricePct
              }*/
              if( pricePct > max){
               
                
                if(adjustYScale){
                  max = pricePct
                }
              }
              // lower low map by id
              /*if(lowerLow[k]){
                if(pricePct < higherHigh[k]){
                  higherHigh[k] = pricePct
                }
              }else{
                lowerLow[k] = pricePct
              }*/
              if(pricePct < min && adjustYScale){
                min = pricePct
              }
              const resposneVal = [moment(c.date).valueOf(),pricePct];
              if(k === comparisionIndex)
                initCloseMap.push({symbol:d.symbol,data:d.data[comparisionIndex],comparisionIndex,resposneVal})
              
              return resposneVal
            }),
            settings: {
              ...presetSettings,recordId:i,comparisionIndex
            },
          }
        })

    
        localStorage.setItem('legendTxtConfig',JSON.stringify(namingLegend))
        let compareChart =dc.get('onchart.CompareChartSub')
        let chartSettings =dc.get_one('chart.settings')
       
    
        context.commit('SET_CHART_YRANGE_UPPER',max)
        context.commit('SET_CHART_YRANGE_LOWER',min)
        // context.commit('SET_COMPARISION_HIGHEST_HIGH',higherHigh)
        // context.commit('SET_COMPARISION_LOWEST_LOW',lowerLow)
        let [parsedData,ohlcvMap] = parseToChartCandleData(result.main.data)
        context.commit('SET_OHLCV', parsedData)
        context.commit('SET_CANDLE_DATA_TIME_MAP', ohlcvMap)
        updatedConfigForChart = {...chartSettings,comparisionIndex,upper:max,lower:min}
       
        // setTimeout(() => {
        //   dc.merge(`chart.settings`,{...chartSettings,comparisionIndex,upper:max,lower:min})
        // },10)
        // debugger;
        if(compareChart.length === compareSymbol.length){
          for (const c in compareChart) {
            // dc.add('onchart',c)
            let com = compareChart[c]
            com.settings = compareSymbol[c].settings
            com.data = compareSymbol[c].data
            dc.set(com.id,compareSymbol[c])
            // dc.set(`onchart.${com.id}.data`,compareSymbol[c].data)
          }
          
        }else{
          if(compareChart.length > 0)
          dc.del('onchart.CompareChartSub')
          // await this.$nextTick()
          for (const c of compareSymbol) {
            dc.add('onchart',c)
          }
        }
        
        
        return updatedConfigForChart
        // chartEvents.$emit("reset_chart")
        // context.commit('setSymbolDataMultiple', result)
      }
    },
    updateChartStartingTime(context, startingTime) {
      context.commit('setChartStartingTime', startingTime)
    },
    updateChartEndingTime(context, endingTime) {
      context.commit('setChartEndingTime', endingTime)
    }
  },
  getters: {
    getSelectedMultipleSymbols(state) {
      return {
        symbol1: state.symbol1,
        symbol2: state.symbol2,
        symbol3: state.symbol3,
        symbol4: state.symbol4
      }
    },
    getChartStartingTime(state) {
      return state.chartStartingTime
    },
    getChartEndingTime(state) {
      return state.chartEndingTime
    },
    getMultipleSymbolDataNew(state) {
      return state.MultipleSymbolData
    }
  }
}
