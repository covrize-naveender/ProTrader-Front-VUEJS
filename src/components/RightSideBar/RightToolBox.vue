<template>
  <div class="side-bar f-wh small-font" style="overflow-y: auto !important" id="toggleSidebar">

    <div class="p-d-flex p-jc-between company-title" id="company-title">
      <div style="">
        <span class="right-tool-title-text" :style="!isThemePrimary && themeFontColor">
          {{
            multiChartSymbol?.[selectedTab]?.companyName.length <= 29 ? multiChartSymbol?.[selectedTab]?.companyName :
              multiChartSymbol?.[selectedTab]?.companyName.slice(0, 26) + '...' }} </span>
      </div>
      <div>
        <a :href="`https://www.google.com/search?q=${multiChartSymbol?.[selectedTab]?.companyName}`" target="_blank">
          <i class="pi pi-link" style="color: red"></i>
        </a>
      </div>
    </div>

    <div class="comapnyDtlStyle" id="comapnyDtlStyle" :style="getMarketId !== 'FX' && metaDataStyle">
      <div v-if="getMarketId !== 'FX'">
        <div v-for="metadata of metaData" :key="metadata.left">
          <div class="p-d-flex p-jc-between">
            <div class="info-cell right-tool-title-text" :style="!isThemePrimary && themeFontColor">
              {{ metadata.left }}
            </div>
            <div :title="metadata.right.length > 22 ? metadata.right : ''" :style="!isThemePrimary && themeFontColor"
              class="info-cell right-tool-title-text">
              {{
                metadata.right.length <= 22 ? metadata.right : metadata.right.slice(0, 19) + '...' }} </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ohlcv and time data -->
      <div class="ohlcvStyle">
        <p-divider class="company-detail-divider" />
        <div class="candle-date">
          <p-inputText type="text" v-model="selectedCandle" readonly placeholder="Current Candle"
            class="p-inputtext-sm" />
          <p-button class="p-button-secondary" icon="pi pi-angle-left" :disabled="isTrainingMode ? traningModeIndex === 0 : candleIndex === 0
            " @click="decreaseIndex" ref="decreasecandleref" :style="trainingModeStyles" />
          <p-button class="p-button-secondary" icon="pi pi-angle-right" :disabled="isTrainingMode
            ? traningModeIndex >= maxLength - 1
            : candleIndex >= maxLength - 1
            " @click="increaseIndex" :style="trainingModeStyles" ref="increasecandleref" />
        </div>
        <div v-for="symData of ohlcvData" :key="symData.left">
          <div class="p-d-flex p-jc-between">
            <div class="info-cell right-tool-title-text" :style="!isThemePrimary && themeFontColor">
              {{ symData.left }}
            </div>
            <div class="info-cell right-tool-title-text" :style="!isThemePrimary && themeFontColor">
              {{ symData.right }}
            </div>
          </div>
        </div>
      </div>

      <!-- Scan Result -->
      <ScanResultBox />

      <!-- Watchlist -->
      <WatchList />

      <!-- Health Bar  -->
      <HealthBarBox />

      <!-- Intraday toggle  -->
      <IntradayBox />
    </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import { chartEvents } from '../../chartEvents'
import { handleButtonClick } from '../../handleRestrictFeature'
import HealthBarBox from './HealthBarBox.vue'
import IntradayBox from './IntradayBox.vue'
import ScanResultBox from './ScanResultBox.vue'
import WatchList from './WatchList.vue'

export default {
  name: 'RightToolBox',
  components: {
    ScanResultBox,
    WatchList,
    HealthBarBox,
    IntradayBox,
  },
  mounted() {
    setInterval(() => {
      this.$store.commit('UPDATE_SCAN_RESULTS', ++this.counterValue)
    }, 1000)
    this.resize()
    window.addEventListener('resize', this.resize)
    chartEvents.$on('setTimeFrameToSplitter', this.setTimeStampToSplitter)
    // chartEvents.$on(
    //   'symbolChangeVerifyScanDetails',
    //   this.symbolChangeVerifyScanDetails
    // )
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('keydown', this.handleKeyDown)
    this.stopPlaying()
    this.stopPlayingWatchlist()
    // chartEvents.removeEventListener('setTimeStampToSplitter', this.setTimeStampToSplitter)
  },
  data() {
    return {
      isActive: false,
      showrighttoolbox: true,
      chartWidth: 0,
      chartHeight: 0,
      watchListItemId: 0,
      watchListMainId: 0,
      counterValue: 0,
      isPlaying: false,
      playInterval: null,
      clickTimeout: null,
      isPlayingWatchlist: false,
      playIntervalWatchlist: null,
    }
  },

  methods: {
    handleButtonClick,
    ...mapActions([
      'exitElementColor',
      'enterThemehoverColor',
      'setSelectedWatch',
      'addNewSymbolToList',
      'setSelectedWatchCode',
      'removeCurrentSymbolFromList',
      'toggleWatchesDeleteModal',
      'toggleWatchesImportModal',
      'updateTrainingModeState',
    ]),

    increaseIndex() {
      if (this.$refs?.increasecandleref?.disabled) return
      if (this.isTrainingMode) {
        this.$store.commit('SET_CANDLE_INDEX_UPD_TRAINING', {
          time: null,
          index: this.candleIndexJumpSelected.index + 1,
          chartHit: false,
        })
      } else {
        this.candleIndex++
      }
    },
    decreaseIndex() {
      if (this.$refs?.decreasecandleref?.disabled) return
      if (this.isTrainingMode) {
        this.$store.commit('SET_CANDLE_INDEX_UPD_TRAINING', {
          time: null,
          index: this.candleIndexJumpSelected.index - 1,
          chartHit: false,
        })
      } else {
        this.candleIndex--
      }
    },
    resize() {
      this.chartWidth = window.innerWidth
      this.chartHeight = window.innerHeight
    },
    formatMillions(value) {
      if (value >= 1000) {
        return (value / 1000.0).toFixed(3) + 'B'
      }
      return value.toFixed(3) + 'M'
    },

    startPlayingWatchlist(callback) {
      if (this.isPlaying) {
        this.stopPlaying()
      }
      if (this.isPlayingWatchlist) {
        this.stopPlayingWatchlist()
      }
      this.isPlayingWatchlist = true
      this.playIntervalWatchlist = setInterval(() => {
        callback()
      }, 2000) // 10 seconds
    },
    stopPlayingWatchlist() {
      this.isPlayingWatchlist = false
      clearInterval(this.playIntervalWatchlist)
      this.playIntervalWatchlist = null
    },
    handleClick(callback) {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout)
        this.clickTimeout = null
      } else {
        this.clickTimeout = setTimeout(() => {
          callback()
          this.clickTimeout = null
        }, 300) // Adjust the delay as needed
      }
    },
    startPlaying(callback) {
      if (this.isPlayingWatchlist) {
        this.stopPlayingWatchlist()
      }
      if (this.isPlaying) {
        this.stopPlaying()
      }
      this.isPlaying = true
      this.playInterval = setInterval(() => {
        callback()
      }, 2000) // 10 seconds
    },
    stopPlaying() {
      this.isPlaying = false
      clearInterval(this.playInterval)
      this.playInterval = null
    },
    setTimeStampToSplitter(timeStamp, indexBased = false) {
      if (indexBased) {
        // Checking For Mouse Clisk Event which always send indexBased Param as true
        const chartData =
          this.multiTv[this.selectedTab]?.data?.get_one(`chart.data`)
        // debugger
        if (chartData.length && chartData.length >= timeStamp) {
          let candleData = chartData[timeStamp]
          if (candleData && candleData[0]) {
            timeStamp = candleData[0]
          }
        } else {
          return
        }
      }
      const splitters =
        this.multiTv[this.selectedTab]?.data?.get(`onchart.Splitters`)
      if (splitters) {
        splitters.forEach((splitter) => {
          if (splitter.name === 'CurrentCandle') {
            return this.multiTv[this.selectedTab]?.data?.set(
              `${splitter.id}.data`,
              [[timeStamp]]
            )
          }
        })
      }
    },
    handleKeyDown(event) {
      if (event.code === 'Space' || event.key === ' ') {
        if (this.isPlaying) {
          this.stopPlaying()
        }
        if (this.isPlayingWatchlist) {
          this.stopPlayingWatchlist()
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'candleIndexSelected',
      'candleIndexJumpSelected',
      'trainingOffset',
      'formattedSymbolData',
      'symbolMetaData',
      'dc',
      'isTrainingMode',
      'trainingModeStartingIndex',
      'trainingModeStartingIndexSubset',
      'trainingModeDataRaw',
      'trainingModeData',
      'getMarketId',
      'timeFrame',
      'themeSettings',
      'themePrimaryColor',
      'themeFontColor',
      'watchLists',
      'watchListsData',
      'selectedWatch',
      'selectedWatchCode',
      'selectedWatchSymbolCode',
      'symbolClassificationInfo',
      'themeDarkMode',
      'isThemePrimary',
      'selectedWatchData',
      'multiChartSymbol',
      'selectedTab',
      'multiOhlcv',
      'multiTv',
    ]),
    trainingModeSelected() {
      return this.multiChartSymbol?.[this.selectedTab]?.data
    },
    getCompanyName() {
      return this.multiChartSymbol?.[this.selectedTab]?.companyName
    },
    dropDownColor() {
      return this.themeDarkMode
        ? {
          background: '#505050 !important',
          borderColor: '#505050',
          color: '#A2A2A2',
        }
        : this.themeFontColor
    },
    candleIndex: {
      get() {
        return this.candleIndexSelected?.index
      },
      set(value) {
        this.$store.commit('SET_CANDLE_INDEX_UPD', {
          time: null,
          index: value,
          chartHit: false,
        })
      },
    },
    traningModeIndex: {
      get() {
        return (
          this.trainingModeStartingIndex +
          (this.candleIndexJumpSelected?.index - this.trainingOffset)
        )
      },
      set(value) {
        this.$store.commit('SET_CANDLE_INDEX_UPD_TRAINING', {
          time: null,
          index: value,
          chartHit: false,
        })
      },
    },
    fieldColor() {
      return this.themeDarkMode
        ? {
          background: '#505050 !important',
          borderColor: '#505050',
          color: '#A2A2A2',
        }
        : {}
    },
    metaData() {
      let classificationInfo =
        this.multiChartSymbol?.[this.selectedTab]?.classificationInfo
      let metaDataInfo = this.multiChartSymbol?.[this.selectedTab]?.metaData
      return [
        { left: 'Sector', right: classificationInfo?.sector || '' },
        {
          left: 'Industry',
          right: classificationInfo?.industry || '',
        },
        {
          left: 'Sub Industry',
          right: classificationInfo?.subIndustry || '',
        },
        {
          left: 'Issued',
          right: metaDataInfo?.issue
            ? this.formatMillions(metaDataInfo?.issue / 1000000.0)
            : '',
        },
        {
          left: 'Market Cap',
          right: metaDataInfo?.marketCap
            ? this.formatMillions(metaDataInfo?.marketCap)
            : '',
        },
        {
          left: 'PE Ratio',
          right: metaDataInfo?.peRatio?.toFixed(3) || '',
        },
        {
          left: 'EPS',
          right: metaDataInfo?.eps?.toFixed(3) || '',
        },
        {
          left: 'Earning Yields',
          right:
            metaDataInfo?.earningYield?.toFixed(3) == null
              ? 'N/A'
              : metaDataInfo?.earningYield?.toFixed(3) + '%',
        },

        {
          left: 'Trading Basis',
          right: metaDataInfo?.tradingBasis || '',
        },
        {
          left: 'Dividend Rate',
          right: metaDataInfo?.dividendRate?.toFixed(3) || '',
        },
        {
          left: 'Dividend Yield',
          right:
            metaDataInfo?.dividendYield?.toFixed(3) == null
              ? 'N/A'
              : metaDataInfo?.dividendYield?.toFixed(3) + '%',
        },
        {
          left: 'Franking %',
          right: metaDataInfo?.frankedPct
            ? metaDataInfo?.frankedPct?.toFixed(3) + '%'
            : '0%',
        },
        {
          left: '1m Return',
          right:
            metaDataInfo?.return1m?.toFixed(3) == null
              ? 'N/A'
              : metaDataInfo?.return1m?.toFixed(3) + '%',
        },
        {
          left: '3m Return',
          right:
            metaDataInfo?.return3m?.toFixed(3) == null
              ? 'N/A'
              : metaDataInfo?.return3m?.toFixed(3) + '%',
        },
        {
          left: '6m Return',
          right:
            metaDataInfo?.return6m?.toFixed(3) == null
              ? 'N/A'
              : metaDataInfo?.return6m?.toFixed(3) + '%',
        },
        {
          left: '12m Return',
          right:
            metaDataInfo?.return12m?.toFixed(3) == null
              ? 'N/A'
              : metaDataInfo?.return12m?.toFixed(3) + '%',
        },
      ]
    },
    maxLength() {
      return this.trainingModeSelected?.length
    },
    selectedCandle() {
      let symbolData = this.trainingModeSelected
      return this.isTrainingMode
        ? moment(
          this.trainingModeSelected?.[this.traningModeIndex]?.date
        ).format('Do MMM YYYY')
        : moment(symbolData?.[this.candleIndex]?.date).format('Do MMM YYYY')
    },
    ohlcvData() {
      let symbolDataInfo = this.trainingModeSelected
      return [
        {
          left: 'Open',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[this.traningModeIndex]?.open?.toFixed(
              3
            )
            : symbolDataInfo?.[this.candleIndex]?.open?.toFixed(3),
        },
        {
          left: 'High',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[this.traningModeIndex]?.high?.toFixed(
              3
            )
            : symbolDataInfo?.[this.candleIndex]?.high?.toFixed(3),
        },
        {
          left: 'Low',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[this.traningModeIndex]?.low?.toFixed(
              3
            )
            : symbolDataInfo?.[this.candleIndex]?.low?.toFixed(3),
        },
        {
          left: 'Close',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[
              this.traningModeIndex
            ]?.close?.toFixed(3)
            : symbolDataInfo?.[this.candleIndex]?.close?.toFixed(3),
        },
        {
          left: 'Volume',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[
              this.traningModeIndex
            ]?.volume?.toLocaleString()
            : symbolDataInfo?.[this.candleIndex]?.volume?.toLocaleString(),
        },
        {
          left: 'Value',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[
              this.traningModeIndex
            ]?.value?.toLocaleString()
            : symbolDataInfo?.[this.candleIndex]?.value?.toLocaleString(),
        },
        {
          left: 'VWAP',
          right: this.isTrainingMode
            ? this.trainingModeSelected?.[
              this.traningModeIndex
            ]?.vwap?.toLocaleString()
            : symbolDataInfo?.[this.candleIndex]?.vwap === 'NaN'
              ? 'N/A'
              : symbolDataInfo?.[this.candleIndex]?.vwap?.toFixed(3),
        },
      ]
    },
    metaDataStyle() {
      // let maxHeight = '35%'
      // if (this.chartHeight < 785) maxHeight = '20%'
      return `min-height: 100px; overflow-y: auto;margin-top:0px`
    },
    trainingModeStyles() {
      return this.isTrainingMode ? 'background: #029acf' : ''
    },
  },
  watch: {
    symbolName(newSymbol) { },
    // formattedSymbolData(newValue) {
    //   //TODO:CHANGE_EFFECTS
    //   if (newValue?.length > 0 && this.maxLength) {
    //     this.candleIndex = this.maxLength - 1
    //     const splitters = this.dc.get('onchart.Splitters')
    //     if (splitters) {
    //       splitters.forEach((splitter) => {
    //         if (splitter.name === 'CurrentCandle') {
    //           return this.dc.set(`${splitter.id}.data`, [
    //             [
    //               moment(
    //                 this.trainingModeSelected?.[this.candleIndex]?.date
    //               ).valueOf(),
    //             ],
    //           ])
    //         }
    //       })
    //     }
    //   }
    // },
    multiChartSymbol(newValue) {
      //TODO:CHANGE_EFFECTS
      for (let i = 0; i < newValue.length; i++) {
        const element = newValue[i];

        if (element?.data?.length > 0 && this.maxLength) {
          this.candleIndex = this.maxLength - 1
          const splitters = this.multiTv[i]?.data.get('onchart.Splitters')
          if (splitters) {
            splitters.forEach((splitter) => {
              if (splitter.name === 'CurrentCandle') {
                return this.multiTv[i]?.data.set(`${splitter.id}.data`, [
                  [
                    moment(
                      this.trainingModeSelected?.[this.candleIndex]?.date
                    ).valueOf(),
                  ],
                ])
              }
            })
          }
        }
      }

    },
    maxLength(newValue, oldValue) {
      this.candleIndex = newValue - 1
    },
    async candleIndexSelected(newValue, oldValue) {
      if (!oldValue) return

      if (newValue?.index < this.multiOhlcv[this.selectedTab].length) {
        const timeFrame = this.multiOhlcv[this.selectedTab][newValue?.index][0]
        this.setTimeStampToSplitter(timeFrame)
      }
    },
    async candleIndexJumpSelected(newValue, oldValue) {
      if (!oldValue || !this.isTrainingMode) return

      const symbolData = this.multiOhlcv[this.selectedTab]
      let trainingModeStartingIndex = this.trainingModeStartingIndex
      const trainingOffset = this.trainingOffset
      let selectedIndex = newValue?.index
      let selectedIndexOld = oldValue?.index
      const selectedTime = newValue?.time
      let trainingModeDataRaw = JSON.parse(
        JSON.stringify(this.trainingModeDataRaw)
      )
      if (selectedIndex <= trainingOffset) {
        if (selectedTime) {
          // When we are using chart to change data index
          this.setTimeStampToSplitter(selectedTime)
        } else {
          // when we are using arrow button to change data index
          if (selectedIndex >= 0) {
            const timeFrame = trainingModeDataRaw[selectedIndex][0]
            this.setTimeStampToSplitter(timeFrame)
          }
        }
        return
      }
      const selectedFromChart = newValue?.chartHit
      let endPoint = 0
      if (selectedFromChart) {
        let index = 0
        //   find index

        for (const dt of symbolData) {
          if (dt[0] > selectedTime) break
          index++
        }
        endPoint = index
      } else {
        endPoint = trainingModeStartingIndex + (selectedIndex - trainingOffset)
      }

      const maximumIndex = symbolData.length
      if (endPoint <= maximumIndex && this.isTrainingMode) {
        const trainingModeData = this.trainingModeData
        const oldIndexStart = selectedIndexOld + 1
        let startPoint =
          trainingModeStartingIndex + (oldIndexStart - trainingOffset)
        if (selectedIndex > selectedIndexOld) {
          if (selectedFromChart) {
            let sliceData = symbolData.slice(startPoint, endPoint)
            let slicedDataIndex = 0
            for (let i = oldIndexStart; i <= selectedIndex; i++) {
              trainingModeDataRaw[i] = sliceData[slicedDataIndex]
              slicedDataIndex++
            }
          } else {
            trainingModeDataRaw[selectedIndex] = symbolData[startPoint]
          }
          trainingModeDataRaw = trainingModeDataRaw.map((candle) => [
            candle[0],
            candle[1] ? candle[1] : NaN,
            candle[2] ? candle[2] : NaN,
            candle[3] ? candle[3] : NaN,
            candle[4] ? candle[4] : NaN,
            candle[5] ? candle[5] : NaN,
            candle[6] ? candle[6] : NaN,
            candle[7] ? candle[7] : NaN,
          ])
          // debugger
          // debugger
          // this.dc.merge('chart.data', sliceData)
          this.updateTrainingModeState({
            state: this.isTrainingMode,
            startingIndex: trainingModeStartingIndex,
            trainingDataIndex: trainingModeData.length - 1,
            trainingModeData,
            trainingModeDataRaw: trainingModeDataRaw,
          })
        } else if (selectedIndex < selectedIndexOld) {
          for (let i = trainingModeDataRaw.length - 1; i > selectedIndex; i--) {
            trainingModeDataRaw[i] = [
              trainingModeDataRaw[i][0],
              NaN,
              NaN,
              NaN,
              NaN,
              NaN,
              NaN,
              NaN,
            ]
          }
          this.updateTrainingModeState({
            state: this.isTrainingMode,
            startingIndex: trainingModeStartingIndex,
            trainingDataIndex: trainingModeData.length - 1,
            trainingModeData,
            trainingModeDataRaw: trainingModeDataRaw,
          })
          // this.dc.data.chart.data.pop()
        }
        if (selectedTime) this.setTimeStampToSplitter(selectedTime)
        else {
          const timeFrame = trainingModeDataRaw[selectedIndex][0]
          this.setTimeStampToSplitter(timeFrame)
        }
      }
    },
    isTrainingMode() {
      if (this.isTrainingMode) {
        this.traningModeIndex = this.trainingModeStartingIndexSubset
      } else {
        this.candleIndex = this.trainingModeSelected?.length - 1
      }
    },
  },
}
</script>

<style>
.scan {
  position: relative;
  display: inline-block;
  z-index: 101;
}

@media screen and (max-width: 1000px) {
  #toggleSidebar {
    /* display: none; */
  }
}

/* .isActive{

 } */

.small-font {
  /* font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; */
  font-family: 'Inter', sans-serif;
}



.company-deatil-scroll {
  width: 100%;
  height: 100px;
}

.right-container .p-component {
  font-size: 1em !important;
}

.candle-date,
.scan-result-first,
.scan-result-second,
.watch-result-first,
.watch-result-second {
  display: flex;
  gap: 0.2rem;
  margin: 0.5rem;
}

.scan-result-first .p-dropdown,
.watch-result-first .p-dropdown {
  margin-left: 0.5rem;
  width: 80%;
}

.scan-result-second .p-dropdown{
  margin-left: 0.5rem;
  width: 53%;
}
.watch-result-second .p-dropdown {

  margin-left: 0.5rem;
  width: 40%;
}

.candle-date input {
  padding: 0.5rem !important;
  margin: 0 0.5rem;
  width: 70%;
}

.right-container .info-cell {
  margin: 0.1rem 1rem;
}

.p-menu {
  width: auto !important;
}

#health-container {
  display: flex;
  height: 35px;
}

#progress-bar-container {
  width: 100%;
  overflow: hidden;
  margin: 0 0.5rem;
  border-radius: 5px;
  position: relative;
}

.progress-bar-child {
  width: 100%;
  height: 100%;
}

.progress {
  color: white;
  text-align: center;
  line-height: 75px;
  font-size: 35px;
  font-family: 'Segoe UI';
  animation-direction: reverse;
  background: rgb(207, 12, 12);

  /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, #f20e17 0, #ffde00 50%, #44ff00 100%);
}

.mask {
  position: absolute;
  background-color: #fff;
  width: 100%;
  top: 0;
}

.p-divider.company-detail-divider {
  margin: 0.5rem 0 !important;
}

span.right-tool-title-text {
  font-weight: 600;
  padding: 0.3rem;
  font-size: 1.1em;
}

.scan-drp-down {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
