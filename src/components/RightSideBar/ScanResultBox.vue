<template>
  <div class="side-bar-cardStyle" id="scan-result">
    <div class="p-d-flex p-jc-between">
      <span class="right-tool-title-text" :style="themeFontColor">
        Scan Results:
        {{
          resultsCount > 0
            ? `${resultsCount}`
            : '0'
        }}</span>

      <AutoPlay :disablePlayBackward="!(scanResults.length > 0) || autoPlayScan || shouldAllowBackSymbol"
        :disablePlayForward="!(scanResults.length > 0) || autoPlayScan || shouldAllowNextSymbol"
        :disablePause="!(scanResults.length > 0) || !autoPlayScan" :disableSpeed="!(scanResults.length > 0)"
        @startAutoPlay="startAutoPlay" @stopAutoPlay="stopAutoPlay" :isAutoPlay="autoPlayScan"
        :currentSpeed="playbackSpeed" @speedChange="handleSpeedChange" id="auto-play-scan" />
    </div>

    <div class="scan-result-first">
      <p-dropdown v-model="selectedScan" :options="scanResults" name="scanResultsList" id="scanResultsList"
        optionLabel="count" optionValue="scanId" :disabled="autoPlayScan" />
      <p-button icon="pi pi-clone" class="p-button-light p-button-secondary" :disabled="!scanResults.length"
        @click="ScanCopyBtn(), showCreateWatchList()" v-tooltip.left="'Create Watchlist'" id="watchlist-create" />
    </div>
    <div class="scan-result-second">

      <p-dropdown v-model="scanSearchSymbolName" :options="selectedScanResults" optionLabel="symbol"
        @change="onScanTickerChange">
        <template #value="slotProps">
          <div v-if="slotProps.value">
            <div class="scan-drp-down">
              <div>
                <img v-if="scanSearchTopImage" style="width: 10px" :src="scanSearchTopImage" alt="" />

                <span v-else-if="scanSearchTopText" style="font-size: 8.45px; font-weight: bold">{{ scanSearchTopText
                }}</span>
                <span v-else-if="scanSearchPatternName" style="font-size: 8.45px; font-weight: bold">{{
                  scanSearchPatternName.startsWith('Combo') ? 'Combo' : scanSearchPatternName }}</span>
              </div>
              <div>{{ slotProps.value }}</div>
            </div>
          </div>
          <span v-else> </span>
        </template>
        <template #option="slotProps">
          <div class="scan-drp-down">
            <div v-if="slotProps.option['patternName']">
              <img v-if="
                scanSearchImg[slotProps.option.patternName]?.key === 'icon'
              " style="width: 10px" :src="scanSearchImg[slotProps.option.patternName].img" alt="" />
              <span v-else-if="
                scanSearchImg[slotProps.option.patternName]?.key === 'text'
              " style="font-size: 8.45px; font-weight: bold">{{ scanSearchImg[slotProps.option.patternName].code
              }}</span>
              <span v-else-if="slotProps.option.patternName?.length" style="font-size: 8.45px; font-weight: bold">{{
                slotProps.option.patternName.startsWith('Combo') ? 'Combo' : slotProps.option.patternName }}</span>
            </div>
            <div>{{ slotProps.option.symbol }}</div>
          </div>
        </template>
      </p-dropdown>

      <p-button class="p-button-secondary" icon="pi pi-angle-left" @click="symbolSelectBack"
        :disabled="shouldAllowBackSymbol" />
      <p-button class="p-button-secondary" icon="pi pi-angle-right" @click="symbolSelectNext"
        :disabled="shouldAllowNextSymbol" />
      <p-button class="p-button-secondary p-button-outlined" icon="pi pi-cloud-download" @click="scanListDownload"
        :disabled="!scanResults.length" />
    </div>
  </div>
  <!-- </template>
    </p-card> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { chartEvents } from '../../chartEvents'
import AutoPlay from './AutoPlay.vue';
export default {
  name: 'ScanResultBox',
  components: {
    AutoPlay
  },
  data() {
    return {
      selectedScan: 'none',
      selectedSymbol: {
        patternName: null,
        symbol: '',
      },
      selectedScanResultIndex: 0,
      scanSearchPatternName: '',
      scanSearchTopText: '',
      scanSearchTopImage: null,
      scanSearchSymbolName: null,
      showCreateWatchModal: false,
      scanSearchImg: {
        // pattern icon
        SaucerBottom: {
          key: 'icon',
          img: '/images/patterns/saucer_bottom.svg',
        },
        DoubleBottom: {
          key: 'icon',
          img: '/images/patterns/double_bottom.svg',
        },
        BullishPennant: {
          key: 'icon',
          img: '/images/patterns/bullish_pennant.svg',
        },
        BearishFlag: {
          key: 'icon',
          img: '/images/patterns/bearish_flag.svg',
        },
        AscendingTriangle: {
          key: 'icon',
          img: '/images/patterns/ascending_triangle.svg',
        },
        DoubleTop: {
          key: 'icon',
          img: '/images/patterns/double_top.svg',
        },
        TriPointResistance: {
          key: 'icon',
          img: '/images/patterns/tri_point_resistance.svg',
        },
        BearishPennant: {
          key: 'icon',
          img: '/images/patterns/bearish_pennant.svg',
        },
        DescendingTriangle: {
          key: 'icon',
          img: '/images/patterns/descending_triangle.svg',
        },
        TriPointSupport: {
          key: 'icon',
          img: '/images/patterns/tri_point_support.svg',
        },
        BullishFlag: {
          key: 'icon',
          img: '/images/patterns/bullish_flag.svg',
        },

        // Candle stick icon

        Doji: {
          key: 'icon',
          img: '/images/candlesticks/doji.svg',
        },
        InvertedHammer: {
          key: 'icon',
          img: '/images/candlesticks/inverted-hammer.svg',
        },
        BullishEngulfing: {
          key: 'icon',
          img: '/images/candlesticks/bullish-engulfing.svg',
        },
        BullishHarami: {
          key: 'icon',
          img: '/images/candlesticks/bullish-harami.svg',
        },
        BearishEngulfing: {
          key: 'icon',
          img: '/images/candlesticks/bearish-engulfing.svg',
        },
        BearishHarami: {
          key: 'icon',
          img: '/images/candlesticks/bearish-harami.svg',
        },
        Hammer: {
          key: 'icon',
          img: '/images/candlesticks/hammer.svg',
        },
        HangingMan: {
          key: 'icon',
          img: '/images/candlesticks/hanging-man.svg',
        },
        Inside: {
          key: 'icon',
          img: '/images/candlesticks/inside.svg',
        },
        MultipleInside: {
          key: 'icon',
          img: '/images/candlesticks/multipleInside.svg',
        },
        GtMultipleInside: {
          key: 'icon',
          img: '/images/candlesticks/multipleInside.svg',
        },

        // Text / Events code

        TCIBreak: {
          key: 'text',
          code: 'TCI ',
        },
        TCITrend: {
          key: 'text',
          code: 'TCI ',
        },
        MacdSetting: {
          key: 'text',
          code: 'MACD ',
        },
        ObvAbove: {
          key: 'text',
          code: 'OBV ',
        },
        VolumeMore: {
          key: 'text',
          code: 'VOL ',
        },

        // Text / Indicator code
        Cross: {
          key: 'text',
          code: 'CROSS ',
        },
        Roc: {
          key: 'text',
          code: 'ROC ',
        },
        RSI: {
          key: 'text',
          code: 'RSI ',
        },
        Stoc: {
          key: 'text',
          code: 'STOCK ',
        },
        Bands: {
          key: 'text',
          code: 'BANDS ',
        },
        VolumeIncrease: {
          key: 'text',
          code: 'Vol-Inc ',
        },
        TrendLineCrossing: {
          key: 'text',
          code: 'TX',
        },
      },
      playInterval: null,
      directionForward: true,
      playbackSpeed: 1
    }
  },
  mounted() {
    chartEvents.$on(
      'symbolChangeVerifyScanDetails',
      this.symbolChangeVerifyScanDetails
    )
  },

  methods: {
    ...mapActions([
      'changeSymbolToScannedSymbol',
      'addDrawingForScannedSymbol'
    ]),
    ...mapActions('autoplay', [
      'changeAutoPlayScan',
      'setAutoPlaySpeedScan'
    ]),

    onScanTickerChange(event) {
      this.AssignSymbol(event.value, event.value.index, true)
    },
    ScanCopyBtn() {
      this.$store.commit('SCAN_COPY_BUTTON', true)
      this.$store.commit('SELECTED_SCAN_ID', this.selectedScan)
    },
    AssignSymbol(sym, index = 0, setIndex = false) {
      this.selectedSymbol = sym
      //this method is used a lot and not everyone using this method has index
      //setIndex is a check key, false by default only true when select box for symbol list
      //calls this method.
      if (setIndex) {
        this.selectedScanResultIndex = index
        //this.selectedScanResults.findIndex((s)=>s.symbol===sym.symbol)
      }
      this.scanSearchTopImage = null
      this.scanSearchTopText = null
      this.scanSearchSymbolName = null
      if (sym) {
        this.scanSearchSymbolName = sym.symbol
        let patternName = sym.patternName
        if (patternName && patternName.length) {
          let scanSearchImgElement = this.scanSearchImg[patternName]
          let key = scanSearchImgElement?.key
          let isText = key === 'text'
          let isIcon = key === 'icon'
          if (isIcon) {
            this.scanSearchTopImage = scanSearchImgElement.img
          } else if (isText) {
            this.scanSearchTopText = scanSearchImgElement.code
          } else {
            this.scanSearchPatternName = patternName
          }
        } else {
          this.scanSearchPatternName = ''
        }
      }
    },
    showCreateWatchList() {
      this.showCreateWatchModal = true
      this.$store.dispatch('toggleWatchesModal', true)
    },

    scanListDownload() {
      let scans = this.getScans()[0]
      let results = scans.results
      let symbolList = this.getSymbolsList
      // symbolList.filter(d=> d.startsWith(scans.results[0].symbol))
      let symbolInfoList = []
      for (let result of results) {
        let symbolInfo = symbolList.find((d) => d.startsWith(result.symbol))
        symbolInfoList.push(symbolInfo)
      }

      // debugger
      //
      let resData = []
      for (let info of symbolInfoList) {
        let symbolArray = info.split('~')
        if (symbolArray && symbolArray.length === 2) {
          let symbolName = symbolArray[0]
          let marketId = symbolArray[1]
          resData.push(`${symbolName},${marketId}\n`)
        }
      }
      let blob = new Blob(resData, { type: 'text/txt;charset=utf-8' })
      saveAs(
        blob,
        `${scans.scanType.toUpperCase()}-${scans.createdDate.valueOf()}.txt`
      )
    },
    getScans() {
      return this.scanResults.filter(
        (scan) =>
          `${scan.scanType} - ${scan.timeFrame} - ${scan.date}` ===
          this.selectedScan
      )
    },
    symbolSelectNext() {
      if (this.selectedScanResultIndex >= this.selectedScanResults.length - 1)
        return
      this.selectedScanResultIndex++
      this.selectedSymbol =
        this.selectedScanResults[this.selectedScanResultIndex]
      this.AssignSymbol(this.selectedSymbol)
    },
    symbolSelectBack() {
      if (this.selectedScanResultIndex <= 0) return
      this.selectedScanResultIndex--
      this.selectedSymbol =
        this.selectedScanResults[this.selectedScanResultIndex]
      this.AssignSymbol(this.selectedSymbol)
    },
    showSymbolScanDetails(symbolName) {
      const { timeFrame, isDrawing, scanType, settings } = this.getScans()[0]
      this.changeSymbolToScannedSymbol({
        symbolData: symbolName,
        timeFrame,
        isDrawing,
        scanType,
        settings,
      }).then((d) => { })
    },
    async symbolChangeVerifyScanDetails() {
      const scans = this.getScans()

      if (
        scans &&
        scans.length > 0 &&
        this.getSymbolName === this.selectedSymbol?.symbol
      ) {
        const { scanType, settings } = scans[0]
        const symbolData = this.selectedSymbol
        await this.addDrawingForScannedSymbol({ symbolData, scanType, settings })
      }
    },
    startAutoPlay(isForward) {
      this.directionForward = isForward
      this.changeAutoPlayScan(true)
      this.startPlayback()
    },
    stopAutoPlay() {
      this.changeAutoPlayScan(false)
      this.stopPlayback()
      this.setAutoPlaySpeedScan(this.playbackSpeed)
    },
    startPlayback() {
      if (this.playInterval) {
        clearInterval(this.playInterval)
      }

      const interval = 2000 / this.playbackSpeed // Adjust interval based on speed
      this.playInterval = setInterval(() => {
        if (this.directionForward) {
          this.symbolSelectNext()
        } else {
          this.symbolSelectBack()
        }
      }, interval)
    },
    stopPlayback() {
      if (this.playInterval) {
        clearInterval(this.playInterval)
        this.playInterval = null
      }
    },
    handleSpeedChange(speed) {
      this.playbackSpeed = speed
      if (this.autoPlayScan) {
        this.startPlayback() // Restart playback with new speed
      }
    },
  },
  computed: {
    ...mapGetters([
      'getSymbolsList',
      'scanResults',
      'multiChartSymbol',
      'selectedTab',
      'scanCopyBtn',
      'themeFontColor'
    ]),
    ...mapGetters('autoplay', [
      'autoPlayScan',
      'autoPlaySpeedScan'
    ]),
    playSpeed() {
      return this.autoPlaySpeedScan;
    },
    getSymbolName() {
      return this.multiChartSymbol?.[this.selectedTab]?.symbol
    },
    selectedScanResults() {
      if (this.selectedScan === 'none' || this.selectedScan === '') return []

      return this.getScans()[0].results.map((res, index) => ({ ...res, index: index }))
    },
    resultsCount() {
      return this.selectedScanResults.length > 0
        ? this.selectedScanResults?.length
        : 0
    },
    shouldAllowNextSymbol() {
      return (
        this.resultsCount === 0 ||
        this.selectedScanResultIndex >= this.selectedScanResults.length - 1
      )
    },
    shouldAllowBackSymbol() {
      return this.resultsCount === 0 || this.selectedScanResultIndex <= 0
    },
  },
  watch: {
    playSpeed(val) {
      this.playbackSpeed = val
    },
    selectedScan(val) {
      // this.selectedScanResultIndex = 0
      if (this.autoPlayScan) {
        this.stopAutoPlay()
      }
      this.selectedSymbol =
        this.selectedScanResults[this.selectedScanResultIndex]
      this.AssignSymbol(this.selectedSymbol)
    },
    scanResults(newVal) {
      if (newVal.length === 0) return

      const latest = newVal[newVal.length - 1]
      this.selectedScan = `${latest?.scanType} - ${latest?.timeFrame} - ${latest?.date}`
      if (latest.results.length > 0) {
        this.selectedScanResultIndex = 0
        this.selectedSymbol = latest.results[0]
        this.AssignSymbol(latest.results[0])
      }
    },
    selectedSymbol(symbolName) {
      if (!symbolName) return
      this.showSymbolScanDetails(symbolName)
    },

    shouldAllowNextSymbol(n, o) {
      if (n == true) {
        this.stopAutoPlay()
      }
    },
    shouldAllowBackSymbol(n, o) {
      if (n == true) {
        this.stopAutoPlay()
      }
    },
    autoPlayScan(n, o) {
      if (n == true) {
        this.startPlayback()
      }
      else {
        this.stopAutoPlay()
      }
    }
  },
  beforeDestroy() {
    this.stopPlayback()
  }
}
</script>

<style lang="scss" scoped></style>
