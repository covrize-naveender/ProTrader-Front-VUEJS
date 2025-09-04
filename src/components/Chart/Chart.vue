<template>
  <div ref="chartContainer" id="chartContainer" class="f-wh inner-chart" style="overflow: hidden;position: relative;">
    
    <div style="z-index: 1; position: absolute; right: 10px; top: 3px;">
      <div class="p-d-flex">

        <p-button class="p-button-secondary p-button-sm" icon="pi pi-expand" v-if="getLayout !== '1tab'"
        v-tooltip.bottom="`${isFullScreen ? 'Split Screen' : 'Full Screen'}`" @click="onClickFullScreen" />
        <span class="p-d-flex p-ai-center p-m-2" v-if="getCountryCode">
          {{ getCountryCode }}
          <i class="pi pi-angle-down p-ml-1"></i>
        </span>
      </div>
    </div>
    
    <ChartUpd v-on:legend-button-click="on_button_click" @ChartLoad="ChartLoad" @chartUpdate="chartUpdate"
      @updatChartRange="updatChartRange"
      :data="(isTrainingMode && selectedTab == chartIndex) ? trainingModeDataRaw : multiOhlcv[chartIndex]"
      ref="chartWrapper" :titleTxt="symbolName(chartIndex)" :exchangeTxt="`${exchangeName(chartIndex) ? `: ${exchangeName(chartIndex)}` : ''}`" :colorBack="colors.back" :colorGrid="colors.grid"
      :colorText="themeFontColor.color" :colorTitle="themeFontColor.color" :colorWickUp="settings.colorWickUp"
      :colorWickDw="settings.colorWickDw" :colorVolDw="settings.colorVolDw" :roundOffVolume="roundOffVolume"
      :colorCandleDw="generalSettingSet('chart', 'downColor', 'colorCandleDw')"
      :colorCandleUp="generalSettingSet('chart', 'upColor', 'colorCandleUp')" :colorCross="generalCrossHairSettingSet(
        'crossHair',
        'lineColor',
        'colorCrossHairLine'
      )
        " :colorTextHL="generalCrossHairSettingSet(
          'crossHair',
          'textColor',
          'colorCrossHairText'
        )
          " :colorPanel="generalCrossHairSettingSet('crossHair', 'boxColor', 'colorCrossHairBox')
            " colorVolUp="#FF0039" :enableCrosshair="true" :indexBased="true" :ignoreNegativeIndex="true"
      :extensions="extensions" :overlays="overlays" :height="chartHeightTemp" :width="chartWidthTemp" :xsett="xsett"
      :chartIndex="chartIndex" />


  </div>
</template>

<script>

import Loader from 'BaseComponents/Loader'
import dataJson from 'Data/data.json'
import Overlays from 'Overlays'
import TradingVue, { DataCube } from 'trading-vue-js'
import { mapActions, mapGetters } from 'vuex'
import { chartEvents } from '../../chartEvents'
import Extensions from '../../extensions'
import { TimeRangesConfig } from '../../utils/TimeRangesConfig'
import ChartUpd from './ChartUpd'

export default {
  name: 'Chart',
  props: {
    chartHeightTemp: {
      type: Number,
      required: true
    },
    chartWidthTemp: {
      type: Number,
      required: true
    },
    chartIndex: {
      type: Number,
      required: true
    },
    chartSymbolTitle: {
      type: String,
      required: true
    },
    chartOHLCV: {
      type: Array,
      required: true
    },
  },
  components: {
    ChartUpd,
    TradingVue,
    Loader,
  },

  data() {
    return {
      candleData: [],
      chartData: new DataCube(dataJson),
      chartWidth: 1,
      chartHeight: 0,
      roundOffVolume: true,
      toolHeight: 0,
      overlays: Object.values(Overlays),
      names: Object.keys(Overlays),
      extensions: Extensions,
      xsett: {},
      colors: {
        back: '',
        border: '#d6d5d5',
        cmAttribute: '#5a5a5a',
        cmBack: '#fff',
        cmCode: '#8e8e8e',
        cmComment: '#b3b3b3',
        cmKeyword: '#30ad77',
        cmLineNumber: '#42465642',
        cmNumber: '#c08a57',
        cmProperty: '#5a5a5a',
        file: 'transparent',
        fileName: 'black',
        fileSelected: '#e8a63e',
        grid: '#eee',
        logo: '#888888',
        selection: '#efefef',
        splitter: '#35a776c4',
        tabBack: '#f1f1f1',
        tabBackHL: '#dadada',
        text: '#333',
        textHL: '#111',
        textHLBack: '#eeeeee88',
        title: '#333', //"#c5c5c5",
        tvTitle: '#333',

        colorCross: '#2780E3',
        colorTextHL: '#23a77688',
        colorPanel: '#242425',
      },
    }
  },
  async mounted() {
    window.addEventListener('resize', this.resize)
    this.resize()
    this.setGridLine()

    this.$store.commit('SET_TRADING_BRUSH_REFERENCE', {
      brushChartReference: this.$refs.brushChart,
    })
    // this.$store.commit('SET_DATA_CUBE', { dc: this.chartData })
    const currentChartInfo = this.multiChartSymbol[this.chartIndex]
    const tf = currentChartInfo?.timeFrame || this.userData.timeFrame || 'D'
    let symbolName = ''
    if (currentChartInfo) {
      symbolName = currentChartInfo.symbol + "~" + currentChartInfo.metaData.exchange
    }

    this.setSymbolData({ symbolName: symbolName, timeFrame: tf || 'D', chartIndex: this.chartIndex }).then((d) => {
      const rangeExists = Object.keys(this.userData).includes(`${tf}_range`)
      let config = TimeRangesConfig[tf]
      let rangeMap = config.map((d) => d.range)
      let _index = 0;
      if (rangeExists) {
        const _range = this.userData[`${tf}_range`]
        _index = rangeMap.findIndex((x) => { return x == _range })
      }
      if (_index < 0) _index = 0;
      chartEvents.$emit('setChartRange', rangeMap[_index], 'Chart Mounted')
      chartEvents.$emit('loadDrawingData', false, this.chartIndex)
    })

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    setGridLine(val) {
      let theme = val || this.themeSettings
      let color = '#eee'
      if (theme.id) {

        theme.id == 'dark' ? this.colors.grid = '#2C2929' : this.colors.grid = '#eee'
      }
      else {
        color = theme.settings.primary
        this.colors.grid = `color-mix(in srgb, ${color} 75%, white)`
      }
    },
    onClickFullScreen() {
      if (!this.isFullScreen) {
        this.$store.commit('SET_FULLSCREEN', this.chartIndex)
        // chartEvents.$emit('loadDrawingData',false,this.chartIndex)
      }
      else {
        this.$store.commit('SET_FULLSCREEN', null)
        // chartEvents.$emit('loadDrawingData',false,this.chartIndex)
      }
    },
    updatChartRange(timeBased, indexBased) {


      if (
        this.$refs.brushChart &&
        this.$refs.brushChart.setBrushed &&
        this.$refs?.brushChart?.outside
      ) {
        this.$refs.brushChart.setBrushed(timeBased, 'chart mounted')
      }
    },
    async updateAllOverlay() {
      const allChartOverlays = this.allChartOverlays
      const userChartlist = this.chartIDList
      const overlays = this.overlays
      setTimeout(async () => {
        if (this.chartWrapper && this.chartWrapper.addOverlaysAfterLoading) {
          await this.chartWrapper.addOverlaysAfterLoading(
            userChartlist,
            allChartOverlays,
            overlays
          )
        }
      }, 300)
    },
    chartUpdate() {
      this.$nextTick(async () => {
        await this.updateAllOverlay()
      })
    },
    ChartLoad(compRef, dataCube) {


      this.$store.commit('SET_DATA_CUBE', { dc: dataCube })
      this.$store.commit('SET_MULTI_DATA_CUBE', { dc: dataCube, index: this.chartIndex })
      this.$store.commit('SET_TRADING_CHART_REFERENCE', {
        tradingChartReference: compRef,
      })

      this.$store.commit('SET_TRADING_MULTI_CHART_REFERENCE', {
        tradingChartReference: compRef,
        index: this.chartIndex
      })
      this.addVolume()
      // this.chartUpdate()
      if (this.chartToggleVolume) {
      }
    },
    addVolume() {
      const volumeOBV = 'VolumeOBV'
      let overlay = this.overlays.find((n) => n.name === volumeOBV)
      chartEvents.$emit(
        'add_overlay_new',
        overlay,
        volumeOBV,
        {},
        false,
        true,
        { hideValues: false }
      )
      // this.$store.dispatch('toggleVolumeChart')
    },
    ...mapActions(['setSymbolData']),
    generalSettingSet(base, prop, backProp) {
      return this.getGeneralUserSettingsWithProp({ base, prop, backProp })
    },
    generalCrossHairSettingSet(base, prop, backProp) {
      return this.getGeneralUserSettingsForCrossHair({ base, prop, backProp })
    },
    rangeFunction(event) {
      let rangeObj = {
        start: event[0],
        end: event[1],
        range: this.$store.state.chartVisibleRange,
      }


      if (event[0] != null && event[1] != null && event[0] !== event[1]) {
        let prevTimeRange = localStorage.getItem('TimeRange')
        let prevTimeRangeObj = null
        let updateBrush = true
        if (prevTimeRange) {
          prevTimeRangeObj = JSON.parse(prevTimeRange)
        }

        if (this.$store.state.chartPredineRangeUpdates) {
        }


        if (updateBrush) {
          if (!this.inside) {
            this.$refs.brushChart.setBrushed(event, '{chart range function}')
          } else {
            this.inside = false
          }
        }
      }
    },
    on_button_click(event) {
      if (event.button === 'remove') {
        let refChart = `${event.type}.${event.overlay.replace('_', '')}`

        if ('offchart.VolumeOBV0' === refChart) {
          this.$store.dispatch('toggleVolumeChart')
        } else {
          // this.dc.del(refChart)
          this.multiTv[this.chartIndex]?.data?.del(refChart)
        }
      }
    },

    setScreenWidth(width, height) {
      if (width >= 1400) {
        return 0.95
      }
      else if (width >= 700 && width < 1400) {
        return 0.93
      }
      else if (width < 700) {
        return 0.88
      }
      else {
        return 0.88
      }
    },

    resize() {
      this.chartWidth = 0
      this.chartHeight = 0
      this.$nextTick(() => {
        // this.chartHeight =
        // this.chartContainerRef?.clientHeight.classList.add('chart-height')

        const width = window?.screen?.width
        const height = window?.screen?.height
        this.chartHeight = this.chartContainerRef?.clientHeight
        this.toolHeight = this.chartContainerRef?.clientHeight * 0.05
        this.chartWidth = this.chartContainerRef?.clientWidth
      })
    },
    add_overlay(name, height, noDuplicate = false) {
      const e = { type: name, side: 'auto' }
      let preset = this.get_preset(e.type) || {}
      if (preset.side) e.side = preset.side
      // let offchart = this.dc.data.offchart
      let offchart = this.multiTv[this.chartIndex]?.data?.data.offchart

      if (e.side === 'onchart') {
        this.multiTv[this.chartIndex]?.data?.add('onchart', {
          name: preset.name,
          type: e.type,
          data: [],
          settings: preset.settings || {},
        })
        // this.dc.add('onchart', {
        //   name: preset.name,
        //   type: e.type,
        //   data: [],
        //   settings: preset.settings || {},
        // })
      } else {
        // if the overlay is already added, do not add again(no duplicates)
        if (noDuplicate && offchart.find((indi) => indi.type === e.type)) return

        const h = height || this.avg_grid_h(offchart)
        this.multiTv[this.chartIndex]?.data?.add('offchart', {
          name: preset.name,
          type: e.type,
          data: [],
          settings: preset.settings || {},
          grid: { height: h },
        })
        // this.dc.add('offchart', {
        //   name: preset.name,
        //   type: e.type,
        //   data: [],
        //   settings: preset.settings || {},
        //   grid: { height: h },
        // })

        this.addingChartDrawings(e, this)
      }
    },
    get_preset(type) {
      let proto = this.tradingChart.overlays.find((x) => x.name === type)
      if (proto && proto.methods.meta_info) {
        let meta = proto.methods.meta_info()
        return meta.preset
      }
    },
    avg_grid_h(ovs) {
      if (!ovs.length) return 0.25
      let gh = 0
      for (var ov of ovs) {
        if (ov.grid && typeof ov.grid.height === 'number') {
          gh += ov.grid.height
        }
      }
      return gh / ovs.length
    },
    setTrading(timestamp1, timestamp2, callback) {
      this.inside = true

      if (this.chartWrapper && this.chartWrapper.setTrading) {
        if (typeof this.chartWrapper.setTrading === 'function') {

          this.chartWrapper.setTrading(timestamp1, timestamp2).then((d) => {
            callback()
          })
        }
      }
    },
  },
  updated() {

  },

  computed: {
    ...mapGetters([
      'dc',
      'chartToggleVolume',
      'getUserSettingData',
      'protraderGeneralSettings',
      'chartSettings',
      'themeSettings',
      'chartIDList',
      'userChartlist',
      'allChartOverlays',
      'userGeneralSettings',
      'themeFontColor',
      'ohlcv',
      'isTrainingMode',
      'trainingModeData',
      'trainingModeDataRaw',
      'settingUpdatesForCharts',
      'themeDarkMode',
      'userData',
      'multiOhlcv',
      'multiChartSymbol',
      'multiTv',
      'selectedTab',
      'symbolName',
      'getLayout',
      'isFullScreen',
      'exchangeName'
    ]),
    getCountryCode() {
      let code = this.multiChartSymbol?.[this.chartIndex]?.countryCode?.toUpperCase()
      return code == "AU" ? "AUD"
        : code == "US" ? "USD"
          : code
    },
    getOhlcv() {

      return this.isTrainingMode ? this.trainingModeDataRaw : this.chartOHLCV
    },
    getSymbolName() {
      return this.multiChartSymbol[this.chartIndex]?.symbol
    },
    getGeneralUserSettingsWithProp() {
      return (payload) => {
        //upColor
        const { base, prop, backProp } = payload

        let protraderGeneralSettings = this.userGeneralSettings
        if (
          protraderGeneralSettings[base] &&
          protraderGeneralSettings[base][prop]
        ) {

          return protraderGeneralSettings[base][prop].value
        }
        return this.chartSettings[backProp]
      }
    },
    getGeneralUserSettingsForCrossHair() {
      return (payload) => {
        //upColor
        const { base, prop, backProp } = payload

        let protraderGeneralSettings = this.userGeneralSettings

        if (
          protraderGeneralSettings[base] &&
          protraderGeneralSettings[base]['enabled'] &&
          protraderGeneralSettings[base]['enabled'].value &&
          protraderGeneralSettings[base][prop]
        ) {

          return protraderGeneralSettings[base][prop].value
        }
        return this.chartSettings[backProp]
      }
    },
    settings() {
      return this.$store.state.chartSettings
    },

    /** @returns {Object} */
    chartContainerRef() {
      return this.$refs.chartContainer
    },
    /** @returns {Object} */
    tradingChart() {
      return this.$refs.tradingChart
    },
    /** @returns {Object} */
    chart() {
      // return this.dc|| this.chartData
      return this.multiTv[this.chartIndex]?.data || this.chartData
    },
    /** @returns {Boolean} */
    showLoader() {
      return false
    },
    chartWrapper() {
      return this.$refs.chartWrapper
    },
    getBrushData() {
      if (this.isTrainingMode) {

      }
      return this.isTrainingMode
        ? this.trainingModeDataRaw.map((d) => [
          d[0],
          Number.isNaN(d[4]) ? 0 : d[4],
        ])
        : this.ohlcv.map((d) => [d[0], d[4]])
    },
  },
  watch: {
    async settingUpdatesForCharts(n, o) {
      if (n.length) {
        await this.updateAllOverlay()
        this.$store.commit('USER_SET_UPDATE_CHARTS', [])
      }
    },
    themeSettings(val) {
      this.setGridLine(val)
    },
    symbolName(newSymbolName, oldSymbolName) {
      if (newSymbolName !== oldSymbolName) {
        this.chartData = new DataCube(dataJson)
      }
    },
    chartToggleVolume(chartToggleVolumn_new, chartToggleVolumn_old) {

      if (chartToggleVolumn_new) {
        this.addVolume()
      } else {

        if (this.chartWrapper && this.chartWrapper.deleteByID) {
          this.chartWrapper.deleteByID('offchart.VolumeOBV0')
        }
      }
    },
  },
}
</script>

<style>
canvas {
  /* all four are needed to support the most browsers */
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.t-vue-lspan {
  font-variant-numeric: tabular-nums;
  font-size: 0.95em;
  color: #7c7c7c !important;
  /* TODO: move => params */
  margin-left: 0.1em;
  margin-right: 0.2em;
}

/* .chart-height {
  height: 88% !important;
} */
</style>
