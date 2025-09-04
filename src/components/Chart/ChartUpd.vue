<template>

  <trading-vue ref="tradingChart" v-on:legend-button-click="on_button_click" v-on:range-changed="handleChartRange"
    v-on:data-len-changed="dataLengthChanges" @grid-mousedown="onmousedown" :data="chart" :titleTxt="titleTxt"
    :exchangeTxt="exchangeTxt" :colorBack="colorBack" :colorGrid="colorGrid" :colorText="colorText" :decimalPlace="3"
    :roundOffVolume="roundOffVolume" :colorTitle="colorTitle" :colorWickUp="colorWickUp" :colorWickDw="colorWickDw"
    :colorVolDw="colorVolDw" :colorCandleDw="colorCandleDw" :colorCandleUp="colorCandleUp" :colorCross="colorCross"
    :colorTextHL="colorTextHL" :colorPanel="colorPanel" :colorVolUp="colorVolUp" :enableCrosshair="enableCrosshair"
    :indexBased="indexBased" :ignoreNegativeIndex="ignoreNegativeIndex" :enableZoom="true" :extensions="extensions"
    :legend-buttons="['display', 'settings', 'remove']" :overlays="overlays" :ignore_OHLC="['CompareChartMain']"
    :showSettingsButton="[]" :height="height" :width="width" :id="`${chartIndex}-trading-vue-chart`" :x-settings="xsett"
    :showTitleChartLegend="true" :isOverlayCollapsed="isOverlayCollapsed" :collpaseButton="true"
    v-on:on-collapse-change="onChangeCollapse">
  </trading-vue>
</template>
<script>
import moment from "moment/moment";
import TradingVue, { DataCube } from 'trading-vue-js';
import { mapActions, mapGetters } from "vuex";
import { chartEvents } from "../../chartEvents";
import { getDrawingDataV1 } from '../../services/drawing';
import { GetIterationData } from "../../settings/TimeRangeConfig";
import { DaysDiffByTimeStamp, FormatUnixDate } from "../../utils/candle";
import { debounce } from "../../utils/helper";
import { getTimeCalculation } from "../../utils/timeCalculation";
import ChartAdding from "../ChartAdding";

export default {
  name: "ChartUpd",
  mixins: [ChartAdding],
  components: {
    TradingVue
  },
  props: {
    titleTxt: { type: String },
    exchangeTxt: { type: String },
    colorBack: { type: String },
    colorGrid: { type: String },
    colorText: { type: String },
    colorTitle: { type: String },
    colorWickUp: { type: String },
    colorWickDw: { type: String },
    colorVolDw: { type: String },
    colorCandleDw: { type: String },
    colorCandleUp: { type: String },
    colorCross: { type: String },
    colorTextHL: { type: String },
    colorPanel: { type: String },
    colorVolUp: { type: String },
    roundOffVolume: { type: Boolean },

    enableCrosshair: { type: Boolean },
    indexBased: { type: Boolean },
    ignoreNegativeIndex: { type: Boolean },


    height: { type: Number },
    width: { type: Number },
    xsett: { type: [Array, Object] },
    overlays: { type: [Array, Object] },
    extensions: { type: [Array, Object] },
    data: {
      type: [Array, Object], default() {
        return []
      }
    },
    onchart: {
      type: [Array, Object], default() {
        return []
      }
    },
    offchart: {
      type: [Array], default() {
        return []
      }
    },
    chartIndex: { type: Number, required: true },
  },
  methods: {
    ...mapActions(["saveChartSettings", "deleteAllDrawing", "deleteDrawing"]),
    onmousedown() {

      if (!this.isCtrlPressed)
        return

      let cursorDecide = this.$refs?.tradingChart?.getCursor()
      if (cursorDecide?.t) {
        let time = cursorDecide.t
        let index = cursorDecide.i

        const SET_CANDLE_INDEX_UPD = "SET_CANDLE_INDEX_UPD";
        const SET_CANDLE_INDEX_UPD_TRAINING = "SET_CANDLE_INDEX_UPD_TRAINING";
        const trainingModeDataLength = this.trainingModeDataRaw.length;
        const actualDataLength = this.trainingModeSelected.length;
        let checkIfEmitChartChange = this.isTrainingMode ? index >= 0 && index <= trainingModeDataLength : index >= 0 && index <= actualDataLength

        if (checkIfEmitChartChange)
          this.$store.commit(this.isTrainingMode ? SET_CANDLE_INDEX_UPD_TRAINING : SET_CANDLE_INDEX_UPD, { time, index, chartHit: true })
        // this.$store.commit(SET_CANDLE_INDEX_UPD_TRAINING,{time:null,index:value,chartHit:false})
        // let grid_id = cursorDecide.data
        // chartEvents.$emit('mouseHits',event)
        // debugger
      }
    },
    async addOverlaysAfterLoading(userChartlist, allChartOverlays, overlays) {

      for (const overlayType of userChartlist) {

        let config = allChartOverlays.find(n => n.name === overlayType)
        let overlay = overlays.find(n => n.name.toUpperCase() === overlayType.toUpperCase());
        if (overlay && overlay.methods.meta_info && config) {
          let grid = {}


          const userSettings = config.getData();

          let isArray = Array.isArray(userSettings)
          if (isArray) {
            for (const settings of userSettings) {
              settings['chartId'] = config.chartId
              settings['tool_type'] = config.tool_type
            }
          } else {
            userSettings['chartId'] = config.chartId
            userSettings['tool_type'] = config.tool_type
          }


          // chartEvents.$emit('add_overlay_new',overlay,overlayType,userSettings)
          if (config.childRef === 'VolumeOVB') {
            // grid.id =1
            setTimeout(() => {
              let gridMap = this.multiTv[this.chartIndex]?.data?.dcgl
              // let gridMap = this.$store.state?.dc?.dcgl
              const volumeKey = "offchart.VolumeOBV0";
              if (gridMap && volumeKey in gridMap) {
                let gridID = gridMap[volumeKey].split("_")[0].slice(1)
                grid.id = Number(gridID)
              } else {
                return
              }
              this.addOverlay(overlay, overlayType, userSettings, false, true, grid)
            }, 300)

          } else {
            this.addOverlay(overlay, overlayType, userSettings, false, true, grid)
          }

        }
      }
    },
    avg_grid_h(ovs) {
      if (!ovs.length) return 0.18
      let gh = 0
      for (var ov of ovs) {
        if (ov.grid && typeof ov.grid.height === 'number') {
          gh += ov.grid.height
        }
      }
      return gh / ovs.length
    },
    addOverlay(overlay, type, userSettings, scanResults = false, manuallyAddedFromTools = false, grid = {}, isScanned = false, chartIndex = null) {
      if ((isScanned && chartIndex == this.chart.data.chart.chartIndex) || !isScanned) {

        let meta = overlay.methods.meta_info()
        let side = meta.preset?.side || 'onchart'

        let isArray = Array.isArray(userSettings)
        let settings = isArray ? userSettings : [userSettings]

        const query = `${side}.${type}`;
        let overlayExist = this.chart.get(query)
        for (const key in settings) {
          const overlaySettings = settings[key]
          const settingsData = { ...meta?.preset?.settings, ...overlaySettings, legendButtons: !scanResults };
          let overlayExistRef = scanResults ? overlayExist.find(d => d.scanResults) : overlayExist.filter(d => !d.scanResults).length > key ? overlayExist.filter(d => !d.scanResults)[key] : undefined

          if (!overlayExistRef) {
            if (scanResults) {
              overlaySettings['scanResults'] = true
            }

            // let offchart = this.dc.data.offchart
            let offchart = this.multiTv[this.chartIndex]?.data?.data.offchart
            let h = this.avg_grid_h(offchart)
            grid.height = h;//0.17;
            const oveylay_tv = {
              type,
              name: meta.preset.name,
              settings: settingsData,
              scanResults,
              side,
              grid,
              // data: manuallyAddedFromTools ? chartData : []
              data: []
            };

            let id = this.chart.add(side, oveylay_tv)
            if (manuallyAddedFromTools) {
              // this.chart.tv.resetChart()
              // let sideData = this.chart.data[side]

              // this.chart.data[side].push(oveylay_tv)
              this.addingChartDrawings({ side, type }, this)
            }


          } else {
            const previousSettings = JSON.stringify(overlayExistRef.settings);
            const currentSettings = JSON.stringify(settingsData);
            const settingsChanged = this.isSettingsChanged(overlayExistRef.settings, settingsData);

            if (settingsChanged) {
              overlayExistRef.settings = settingsData
              this.chart.merge(overlayExistRef.id, overlayExistRef)

              this.chart.tv.resetChart()
            }

          }

        }
      }

    },
    dataLengthChanges() {

    },
    handleChartRange(timeBased, indexBased) {
      // timeBased[0]
      // timeBased[1]
      // moment().unix(timeBased[0])

      this.$nextTick(debounce(() => {
        let payload = {
          startRange: FormatUnixDate(timeBased[0]),
          endRange: FormatUnixDate(timeBased[1]),
          daysCount: DaysDiffByTimeStamp(timeBased[1], timeBased[0]),
          startIndex: indexBased[0],
          endIndex: indexBased[1],
          count: indexBased[1] - indexBased[0],
        }
        this.$store.commit('SET_ChartRangeObj', payload)


        this.$emit('updatChartRange', timeBased, indexBased)
      }))
    },
    getChartData() {
      return this.chart.get('chart.data')
    },
    removeIchiData() {
      // ichi has two childs we have to remove them
      // isPartOfIchi
      let splineData = this.chart.get(`onchart.Splines`);
      let splineData2 = this.chart.get(`onchart.Spline`);

      for (const spd of splineData) {

        if (spd?.settings?.isPartOfIchi) {
          this.deleteByID(spd.id)
        }
      }
      for (const spd of splineData2) {

        if (spd?.settings?.isPartOfIchi) {
          this.deleteByID(spd.id)
        }
      }
    },
    async on_button_click(event) {
      if (event.button === 'remove') {
        let refChart = `${event.type}.${event.overlay.replace('_', '')}`

        if ('offchart.VolumeOBV0' === refChart) {
          this.$store.dispatch('toggleVolumeChart')
        } else {
          //chartId
          // Splines
          //Spline
          const refChartObj = this.chart.get_one(refChart);
          let chartId = refChartObj?.settings?.chartId;

          if (chartId) {
            if (chartId == "Ichi") {
              this.removeIchiData()
              // this.deleteByID(overlay.id)
            }
            if (await this.saveChartSettings({ tool_type: refChartObj?.settings?.tool_type, selected: true, chartId: chartId })) {
              let chartList = this.userChartlist;
              let ind = chartList.indexOf(chartId)
              if (ind > -1) {
                let overlayData = this.chart.get(`${refChartObj.side}.${refChartObj.type}`)
                this.deleteAllByOverlayData(overlayData)
                chartList.splice(ind, 1);
                // chartEvents.$emit('remove_overlay_new', overlay, name)
                this.$store.commit('SET_USER_CHART_LIST', { data: chartList })
              }
              else {
                let overlayData = this.chart.get(`${refChartObj.side}.${refChartObj.type}`)
                overlayData.map((data) => {

                  this.chart.del(data.id)
                })
              }
            }
            else {
              this.chart.del(refChartObj.id)
            }

          }

        }
      }
    },
    onChangeCollapse(val) {
      this.isOverlayCollapsed = val
    },
    deleteAllByOverlayData(overlayData) {
      if (overlayData && overlayData.length > 0) {
        let widgetKeys = Object.keys(this.chart.tv.ws)
        let idsToRemove = []
        for (const overlay of overlayData) {
          if (!overlay.scanResults) {
            idsToRemove.push(`${overlay.id}-SettingsWin`)
            this.deleteByID(overlay.id)
          }
        }
        setTimeout(() => {
          this.tv.custom_event({
            event: 'remove-settings-popup',
            args: [widgetKeys, idsToRemove]
          })
        })
      }
    },
    deleteByID(id) {
      let offChartList = this.chart.get('offchart')
      let currentId = this.findGridId(id, this)

      let volumeChartDrawings = []
      if (offChartList.length) {
        for (const offChartListElement of offChartList) {

          if (offChartListElement.grid?.id && offChartListElement.grid.id === currentId) {
            volumeChartDrawings.push(offChartListElement)
          }
        }
      }

      if (volumeChartDrawings.length) {
        for (let volumeChartDrawing of volumeChartDrawings) {
          this.chart.del(volumeChartDrawing.id)
        }
      }
      this.chart.del(id)
    },
    getRange() {
      return this.chart.tv.getRange()
    },
    async setTrading(timestamp1, timestamp2) {


      if (this.chart && this.chart.data && this.chart.data.chart && this.chart.data.chart.data) {

        let dataset = this.chart.data.chart.data
        let startingTime = timestamp1
        let firstCandleTimeObj = moment(dataset[0][0])
        let startingTimeObj = moment(timestamp1)
        let lastCandleTimeObj = moment(dataset[dataset.length - 1][0])
        let timestamp2Obj = moment(timestamp2)
        let diffInDaysFromFirstCandle = startingTimeObj.diff(
          firstCandleTimeObj,
          'day'
        )

        let endingTimeDiff = timestamp2Obj.diff(lastCandleTimeObj, 'day')
        let startingDaysInControls = diffInDaysFromFirstCandle < 0;

        const { iterations } = GetIterationData(this.$store.state.timeFrame)
        let rangeObj = { range: '', start: startingDaysInControls ? timestamp1 : startingTime, end: timestamp2 }
        let eventStr = JSON.stringify(rangeObj)
        localStorage.setItem('TimeRange', eventStr)
        this.$store.commit('CHART_VISIBLE_RANGE', '')

        this.chart.tv.setRange(startingDaysInControls
          ? 0
          : startingTime,
          endingTimeDiff > 0 ? dataset.length + iterations : timestamp2)
        await this.$nextTick()
      }
      return

    },
    async onDeleteButtonClick() {
      const selectedTool = this.chart.tv.data.data.selected;
      if (!selectedTool) {
        await this.deleteAllTools()
      } else {
        // this.selectTool('System:Remove')remove-tool
        let res = await this.deleteDrawing({ t: selectedTool, e: 'ChartUpd', index: this.chartIndex })
        if (res) {
          this.tv.custom_event({
            event: 'remove-tool',
            args: [0, 0, selectedTool]
          })
          this.chart.del(selectedTool)
        }

      }
    },
    async onDeleteDarvasBoxDrawing() {
      this.chart.del('DarvasBox')
    },
    deleteAllChartTools() {
      this.chart.del('Tool')
      this.chart.del('Fibonacci')
      this.chart.del('Trend')
      this.chart.del('TrendLine')
      this.chart.del('DarvasBox')

      this.chart.tv.custom_event({
        event: 'remove-all-tools-event',
        args: []
      })
    },
    isSettingsChanged(prev, curr) {
      let keysArray = Object.keys(curr)
      for (const key of keysArray) {
        if (curr[key] !== prev[key]) {
          return true
        }
      }
      return false
    },
    async deleteAllTools() {
      if (await this.deleteAllDrawing()) {
        this.deleteAllChartTools()
      }
    },
    setChartRange(range, event, callback) {

      const $store = this.$store;
      const state = $store.state;

      let rangeObj = { range: range ? range : state.chartVisibleRange, start: null, end: null }
      /**
       * isRangeChange shows whether the user clicked on 3M,6M,YTD,1Y,5Y... (buttons on the top)
       */
      let isRangeChange = rangeObj.range !== state.chartVisibleRange
      if (isRangeChange) {
        let eventStr = JSON.stringify(rangeObj)
        localStorage.setItem('TimeRange', eventStr)
      }
      let hasStoreRange = localStorage.getItem('TimeRange')
      if (hasStoreRange) {
        rangeObj = JSON.parse(hasStoreRange)
      }

      const candleData = this.chart.get_one('chart.data')



      if (candleData.length) {
        $store.commit('CHART_VISIBLE_RANGE', rangeObj.range)
        if (
          (isRangeChange && state.chartPredineRangeUpdates) ||
          (rangeObj && rangeObj.range && rangeObj.range.length)
        ) {

          if (state.chartPredineRangeUpdates)
            $store.commit('CHART_PREDEFINE_RANGE_UPDATES')
          const endingTime = candleData[candleData.length - 1][0]
          let startingTime = candleData[0][0]
          startingTime = getTimeCalculation(rangeObj, endingTime)
          const { iterations, type } = GetIterationData(state.timeFrame)
          let startingTimeObj = moment(startingTime)
          let firstCandleTimeObj = moment(candleData[0][0])
          let lastCandleTimeObj = moment(candleData[0][candleData.length - 1])
          let diffInDaysFromFirstCandle = startingTimeObj.diff(
            firstCandleTimeObj,
            type
          )
          let startIndex = this.chart.tv.getTimeIndex(candleData[0][0])
          if (startIndex < 0) {
            startIndex = startingTime
          } else {
            startIndex = Math.floor(startIndex)
          }
          $store.dispatch('updateChartStartingTime', startingTime)
          $store.dispatch('updateChartEndingTime', endingTime)

          this.chart.tv.setRange(
            diffInDaysFromFirstCandle < 0
              ? 0
              : startingTime,
            candleData.length + iterations
          )

          if (!this.chart?.tv?.$refs?.chart?.auto_y_axis) {
            this.chart.tv.toggleSideBarYAxis()
          }
        } else {
          state.chartVisibleRange = rangeObj.range
          if (rangeObj.range) {

          } else {
            let startingTime = rangeObj.start
            let firstCandleTimeObj = moment(candleData[0][0])
            let startingTimeObj = moment(rangeObj.start)
            let lastCandleTimeObj = moment(candleData[candleData.length - 1][0])
            let timestamp2Obj = moment(rangeObj.end)
            let diffInDaysFromFirstCandle = startingTimeObj.diff(
              firstCandleTimeObj,
              'day'
            )

            let endingTimeDiff = timestamp2Obj.diff(lastCandleTimeObj, 'day')
            let startingDaysInControls = diffInDaysFromFirstCandle < 0;
            const { iterations } = GetIterationData(state.timeFrame)
            this.chart.tv.setRange(
              startingDaysInControls
                ? 0
                : startingTime,
              endingTimeDiff > 0 ? candleData.length + iterations : rangeObj.end
            )
          }
        }
        if (callback) {
          callback(this.chart)
        }
      }
    },

    async loadDrawingData(isForce, chartIndex) {

      const symbolNames = [...new Set(this.multiChartSymbol.map(x => x.symbol))]
      let apiRes = []
      for (let i = 0; i < symbolNames.length; i++) {
        const element = symbolNames[i];

        let symbolDrawingData = null
        let symbolDrawingDataV1 = await getDrawingDataV1(
          element,
          this.$store.state.userId
        )

        if (symbolDrawingDataV1 && symbolDrawingDataV1.drawing) {
          symbolDrawingData = symbolDrawingDataV1.drawing
        }
        if (
          symbolDrawingData &&
          symbolDrawingData.symbolName &&
          symbolDrawingData.data &&
          Object.values(symbolDrawingData.data).length
        ) {
          apiRes.push({
            symbolName: element,
            drawingData: symbolDrawingData.data
          })
        } else {
          apiRes.push({
            symbolName: element,
            drawingData: {}
          })
        }
      }
      this.$store.commit('SET_SAVED_DRAWING', apiRes)
      let resArr = []
      for (let i = 0; i < this.multiChartSymbol.length; i++) {
        const element = this.multiChartSymbol[i];

        const drawingData = apiRes.find(x => x.symbolName == element?.symbol)?.drawingData || {}
        if (i == chartIndex) {
          resArr.push(drawingData)
        }
        else {
          resArr.push(this.$store.getters.multiDrawingData[i] || {})
        }
      }
      await this.$store.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', resArr)

    }
  },
  data() {
    return {
      chart: new DataCube({
        chart: { data: this.data, type: this.$store?.state?.type || 'Candles', chartIndex: this.chartIndex }, onchart: [{
          "name": "CurrentCandle",
          "type": "Splitters",
          "data": [
            [1588780800000]
          ],
          "settings": {
            "legend": false,
            "lineColor": "#79999e42",
            "lineWidth": 2
          }
        }], offchart: []
      }),
      isOverlayCollapsed: false,
    }

  },
  mounted() {
    window.chartRef = this.chart
    const addOverlayByObject = (overlayData, type) => {

      let isEditChart = this.chartIndex === this.selectedTab

      let isArray = Array.isArray(overlayData)

      for (const overlayDatum of overlayData) {
        overlayDatum.settings['legendButtons'] = false
        // overlayDatum['scanResults'] = true
        // overlayDatum['id'] = generateUUID()
      }
      // this.chart.data.onchart.push(overlayData)
      const query = `onchart`;

      let overlayExist = this.chart.get(query)

      overlayExist = overlayExist.filter(d => d.type === type)
      if (overlayExist && overlayExist.length > 0) {
        for (const removeSetting of overlayExist) {
          // debugger

          if (removeSetting.scanResults && removeSetting.name) {

            isEditChart && this.chart.del(removeSetting.name)
          }
        }
      }
      this.$nextTick(() => {

        for (const overlayDatum of overlayData) {


          isEditChart && this.chart.data.onchart.push(overlayDatum)
        }
      })
    }

    const removeOverlay = (overlay, type) => {

      let meta = overlay.methods.meta_info()
      let side = meta.preset?.side || 'onchart'
      let overlayData = this.chart.get(`${side}.${type}`)
      this.deleteAllByOverlayData(overlayData)
    }
    const removeOverlayScan = (type, forceDel = false) => {

      let removeSettings = [...this.chart.get(`onchart`), ...this.chart.get(`offchart`)]


      for (const removeSetting of removeSettings) {
        // if('ChartPatterns' === removeSetting.type){
        //
        //   // this.chart.del(removeSetting.id)
        // }else{
        if (removeSetting && (removeSetting.scanResults) && removeSetting.id) {

          if (forceDel) {
            // this.chart.del('ChartPatterns')
            this.chart.del(removeSetting.id)
            // this.chart.tv.resetChart()
          } else {
            if (type !== removeSetting.type) {

              this.chart.del(removeSetting.id)
              // this.chart.tv.resetChart()
            }

          }
        }
        // }

      }
      // let meta = overlay.methods.meta_info()
      // let side=meta.preset?.side || 'onchart'
      // let overlayData = this.chart.get(`${side}.${type}`)
      // if (overlayData && overlayData.length > 0) {
      //   for (const overlay of overlayData) {
      //     // this.chart.del('')
      //   }
      // }
    }


    const setChartType = (type) => {

      // this.chart.data.chart.type = type
      this.chart.set('chart.type', type)
      // this.chart.tv.resetChart()
    }
    const deleteAllTools = () => {

      this.deleteAllChartTools()
    }
    const onDeleteButtonClick = () => {

      this.onDeleteButtonClick()
    }
    const onDeleteDarvasBoxDrawing = () => {
      this.onDeleteDarvasBoxDrawing()
    }

    const generateCustomEvent = (event, args) => {
      const customEvent = {
        event,
        args
      };

      this.chartIndex === this.selectedTab && this.chart.tv.custom_event(customEvent)
    }
    const bindComponentEvent = (name, event) => {

      this.chart.tv.$on(
        name, event
      )
    }
    chartEvents.$on("add_overlay_new", this.addOverlay)
    chartEvents.$on("add_overlay_object", addOverlayByObject)

    chartEvents.$on("remove_overlay_new", removeOverlay)
    chartEvents.$on("removeIchiData", this.removeIchiData)
    chartEvents.$on("reset_chart", () => {

      this.chart.tv.resetChart()
    })
    chartEvents.$on("remove_scan_overlay_new", removeOverlayScan)

    chartEvents.$on("deleteAllTools", deleteAllTools)

    chartEvents.$on("setChartType", setChartType)
    chartEvents.$on("setChartRange", this.setChartRange)

    chartEvents.$on("generateCustomEvent", generateCustomEvent)
    chartEvents.$on("bindComponentEvent", bindComponentEvent)
    chartEvents.$on("onDeleteButtonClick", onDeleteButtonClick)
    chartEvents.$on("onDeleteDarvasBoxDrawing", onDeleteDarvasBoxDrawing)
    chartEvents.$on("loadDrawingData", (isForce, chartIndex) => {
      (this.chartIndex == chartIndex && this.getUserId != null && this.$store?.getters['user/subscriptionList']?.length > 0) && this.loadDrawingData(isForce, chartIndex);
    });
    chartEvents.$on("remove_comparision_overlays", (param) => {
      this.chart.del('onchart.CompareChartSub')
      if (param) {

        param()
      }
    })
    chartEvents.$on("removeBB", () => {

      this.chart.del('onchart.BB0')
    })
    // this.$store.commit('SET_TRADING_CHART_REFERENCE', {
    //   tradingChartReference: this.$refs.tradingChart
    // })

    document.addEventListener('keydown', (event) => {
      let name = event.key;
      let code = event.code;
      // Alert the key name and key code on keydown
      if (name === "Control") {
        if (!this.isCtrlPressed) {
          this.isCtrlPressed = true
        }
      } else {
        this.isCtrlPressed = false
      }

    }, false);
    document.addEventListener('keyup', (event) => {
      let name = event.key;
      let code = event.code;
      // Alert the key name and key code on keydown
      if (name === "Control") {
        if (this.isCtrlPressed) {
          this.isCtrlPressed = false
        }
      }
    }, false);
    this.$emit('ChartLoad', this.$refs.tradingChart, this.chart)
  },
  computed: {
    ...mapGetters([
      "symbolName",
      "trainingModeDataRaw",
      "userChartlist",
      "timeFrame",
      "isTrainingMode",
      "candleIndexJumpSelected",
      'multiTv',
      'logScale',
      'chartLowerRange',
      'chartUpperRange',
      'comparisionIndex',
      'dc',
      'selectedTab',
      'multiChartSymbol',
      'multiDrawingData',
      'savedDrawingData',
      'getUserId',
      'gridHeight',
    ]),
    trainingModeSelected() {
      return this.multiChartSymbol[this.selectedTab]?.data
    },
    isCtrlPressed: {
      get() {
        return this.$store.state.chartControlPressed
      },
      set(val) {

        this.$store.state.chartControlPressed = val
      }
    }
  },
  watch: {
    data: {

      async handler(val) {
        const settings = { upper: this.chartUpperRange, lower: this.chartLowerRange, comparisionIndex: this.comparisionIndex };
        this.chart.merge('chart', { data: val, tf: this.timeFrame, settings: settings, grid: { logScale: this.logScale, height: this.gridHeight[this.chartIndex] || 1 } })
        await this.$nextTick()
        if (this.isTrainingMode) {
          this.$nextTick(() => {
            let val = this.$props.data

            const startingTimeFrame = val[0][0];
            const endingTimeStamp = val[val.length - 1][0];
            let totalCandles = val.length;
            let currentIndex = this.candleIndexJumpSelected?.index;
            let remainingDays = 60 - totalCandles;

            let dateAfterAddingRemainingDays = moment(endingTimeStamp).add(remainingDays, 'days').valueOf();


            // this.chart.tv.setRange(startingTimeFrame,dateAfterAddingRemainingDays)
            let firstIndex = 0;
            let lastIndex = this.trainingModeDataRaw.length
            const t2 = currentIndex >= lastIndex - 5 ? currentIndex + 5 : lastIndex;

            this.chart.tv.setRange(0, t2)
          })
        }
        this.$emit("chartUpdate")
        // let ranges = this.chart.tv.getRange()

      },
      deep: true
    },
    logScale(val) {
      this.chart.merge('chart', { grid: { logScale: val } })
    }
  }
}
</script>