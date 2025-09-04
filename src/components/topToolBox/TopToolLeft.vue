<template>
  <div class="top-left-divs p-d-flex toptool-gap" style="margin: 0 1rem; ">
    <span id="step3" class="p-d-flex toptool-gap">
      <!-- Chart TimeFrame Dropdown -->
      <span class="p-buttonset fullscreen-inline-btn">
        <p-button v-for="(item, index) in chartTimeFrameRanges" :key="index" :label="item.btnLabel"
          :class="`${item.btnclass} toptool-bold-font`" @click="item.command()" />
      </span>

      <!-- Chart TimeFrame Dropdown -->
      <span class="p-buttonset fullscreen-inline-btn">
        <p-button v-for="(item, index) in filteredTimeRanges" :key="index" :label="item.label"
          :class="`${item.btnclass} toptool-bold-font`" @click="item.command()" />
      </span>

      <span class="p-buttonset toptool-left-drp">
        <!-- Chart TimeFrame Dropdown -->
        <p-button class="p-button-secondary p-button-outlined" type="button" :label="chartTimeframe"
          @click="toggleChartTimeFrame" />
        <p-menu class="custom-menu-topbar tour-active-menu" ref="chartTimeFrameMenu" :model="chartTimeFrameRanges"
          :popup="true" />

        <!-- Chart Range Dropdown -->
        <p-button class="p-button-secondary p-button-outlined" type="button"
          :label="chartVisibleRange ? chartVisibleRange : '1Y'" @click="toggleChartRange" :disabled="isTrainingMode" />
        <p-menu class="custom-menu-topbar tour-active-menu" ref="chartRangeMenu" :model="filteredTimeRanges"
          :popup="true" />

      </span>
    </span>

    <span class="p-buttonset p-d-flex">
      <!-- Chart Type Dropdown -->
      <p-button class="p-button-secondary " type="button" @click="toggleChartType" :disabled="isTrainingMode"
        id="chartType-btn">
        <div :class="`custom-btn-secondary not-outlined ${getChartType || 'Bars'}`"></div>
      </p-button>

      <p-menu class="custom-menu-topbar tour-active-menu" ref="chartTypeMenu" :model="chartTypeRanges" :popup="true" />

      <!-- Chart Layout Dropdown -->
      <p-button class="p-button-secondary p-button-outlined" type="button" icon="pi pi-chart-bar"
        @click="toggleChartLayout" :disabled="isTrainingMode || getChartType == 'CompareChartMain'" id="split-btn">
        <div :class="`custom-btn-secondary ${layoutImg || 'four-tab'}`"></div>
      </p-button>
      <p-menu class="custom-menu-topbar layout-menu tour-active-menu" ref="chartLayoutMenu" :model="layoutImageMapping"
        :popup="true" />

    </span>

    <!-- Indicator, scan , friday broadcast, AI -->
    <p-button v-for="(item, index) in otherButtonsMapping" :key="index" :class="`${item.btnClass} full-text-btn`"
      type="button" :icon="item.btnIcon" :label="item.btnLabel" @click="item.command()" :id="item.id">
      <div v-if="item.label === 'AI'" class="ai-icon"></div>
    </p-button>

    <p-button class="p-button-secondary p-button-outlined small-text-btn" type="button" icon="pi pi pi-bars"
      @click="toggleOtherSettings" id="stepNew" />
    <p-menu class="custom-menu-topbar" ref="otherSettingBtn" :model="otherButtonsMapping" :popup="true" />


    <!-- Dialogs  -->
    <FridayBroadcastModal :visible.sync="isBroadcastVisible" @toggleModal="changeBroadcastModal" />
    <ScanModal :visible.sync="isScanModalVisible" @toggleModal="changeScanModal" />
    <ComparingSymbolsModal :visible.sync="compareDialogOpen" @closeModal="changeChartToCompareStocksType(false)"
      @symbolModalOpen="selectSymbolModalOpen" />

    <SearchStockModal :visible.sync="symbolSearch" @closeModal="selectSymbolModalClose"
      v-on:selectSymbolModalData="selectSymbolModalData" />

    <IndicatorModal :visible.sync="indicatorModalVisible" @toggleModal="changeIndicatorModal" />
    <SaveLayoutModal :visible.sync="layoutPopup" />
    <DeleteLayoutModal :visible.sync="popupDeleteLayout" :deleteLayoutName="deleteLayoutName"
      :deleteLayoutId="deleteLayoutId" @toggleModal="closeDeleteLayoutPopup" />
  </div>

</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { TimeRangesConfig } from '../../utils/TimeRangesConfig'
import { chartTypeConfig } from '../../utils/chartTypeConfig.js'
import { chartTimeFrameConfig } from '../../utils/charttimeFrameConfig.js'
import { layoutConfig } from '../../utils/layoutConfig.js'
import { chartEvents } from '../../chartEvents';
import ChartFeaturesGroup from './ChartFeaturesGroup.vue'
import { handleButtonClick } from '../../handleRestrictFeature.js'
import IndicatorModal from '../Modals/IndicatorToolBox/IndicatorModal.vue'
import SaveLayoutModal from '../Modals/Layout/SaveLayoutModal.vue'
import DeleteLayoutModal from '../Modals/Layout/DeleteLayoutModal.vue'
import ComparingSymbolsModal from '../Modals/CompareSymbol/ComparingSymbolsModal.vue'
import SearchStockModal from '../Modals/SearchStockModal.vue'
import ScanModal from '../Modals/ScanToolbox/ScanModal.vue'
import FridayBroadcastModal from '../Modals/FridayBroadcastModal.vue'
import { tourRef } from '../../utils/tourGuide.js'

export default {
  name: 'TopToolbox',
  components: {
    ChartFeaturesGroup,
    IndicatorModal,
    SaveLayoutModal,
    DeleteLayoutModal,
    ComparingSymbolsModal,
    SearchStockModal,
    ScanModal,
    FridayBroadcastModal
  },
  data() {
    return {
      timeRanges: TimeRangesConfig,
      chartImgAddress: '',
      layoutImg: '',
      popupDeleteLayout: false,
      deleteLayoutId: null,
      deleteLayoutName: '',
      compareDialogOpen: false,
      indicatorModalVisible: false,
      indicatorBtnLabel: '',
      symbolSearch: false,
      selectedSymbol: '',
      isScanModalVisible: false,
      isBroadcastVisible: false,
      originalHide: null
    }
  },
  methods: {
    handleButtonClick,
    ...mapActions([
      'setSymbolData',
      'selectLayout',
      'setTourStep',
      'setAIView'
    ]),
    ...mapMutations(['changeSymbol']),
    toggleChartType(event) {
      this.$refs.chartTypeMenu.toggle(event);
    },
    toggleChartTimeFrame(event) {
      this.$refs.chartTimeFrameMenu.toggle(event);
    },

    toggleChartRange(event) {
      this.$refs.chartRangeMenu.toggle(event);
    },

    toggleChartLayout(event) {
      this.$refs.chartLayoutMenu.toggle(event);
    },
    changeIndicatorModal(val) {
      this.indicatorModalVisible = val
    },

    toggleOtherSettings(event) {
      this.$refs.otherSettingBtn.toggle(event);
      this.tourNextStep(300)
    },


    toggleVloume() {
      this.$store.dispatch('toggleVolumeChart')
    },
    changeChartToCompareStocksType(val) {
      this.compareDialogOpen = val
    },
    selectSymbolModalData(val) {
      this.changeSymbol({ propName: this.selectedSymbol, propValue: val })
    },
    selectSymbolModalOpen(val) {
      this.selectedSymbol = val
      this.symbolSearch = true
    },
    selectSymbolModalClose() {
      this.symbolSearch = false
    },



    changeType(newType, mob_chartImg) {

      if (this.getChartType !== newType) {
        if (this.getChartType == 'PnF') {

          setTimeout(() => {
            this.chartImgAddress = mob_chartImg
            this.$store.dispatch('setNewChartType', { type: newType, location: "FromTopBar" })
            localStorage.removeItem("showLegendProps")
          }, 500);
        }
        else {
          this.chartImgAddress = mob_chartImg
          this.$store.dispatch('setNewChartType', { type: newType, location: "FromTopBar" })
        }
      }

    },
    changeTimeFrame(tf) {

      const scanResultData = this.getSymbolName === this.SelectedScanSymbol
      let config = TimeRangesConfig[tf]
      let rangeMap = config.map((d) => d.range)
      this.setSymbolData({
        symbolName: this.getSymbolName,
        timeFrame: tf,
        disableUndo: true,
        scanResultData: scanResultData,
        chartIndex: this.selectedTab
      }).then((d) => {
        const rangeExists = Object.keys(this.userData).includes(`${tf}_range`)
        let _index = 0;
        if (rangeExists) {
          const _range = this.userData[`${tf}_range`]
          _index = rangeMap.findIndex((x) => { return x == _range })
        }
        if (_index < 0) _index = 0;
        setTimeout(() => {
          chartEvents.$emit('setChartRange', rangeMap[_index], 'TimeFrameChange')
        })
        chartEvents.$emit('loadDrawingData', false, this.selectedTab)
      })
    },
    changeLayout(newType) {
      const layoutSelected = layoutConfig.find(x => x.name == newType)

      this.layoutImg = layoutSelected?.className
      this.$store.commit('SET_FULLSCREEN', null)
      this.$store.commit('SET_LAYOUT', newType)
      this.$store.commit('SET_TAB_COUNT', layoutSelected?.tabCount)
    },
    async saveLayoutFun() {
      this.$store.commit('LAYOUT_POPUP', true)
    },
    async handleItemClick(layout) {
      const res = await this.selectLayout(layout);
      if (res) {
        this.changeLayout(layout.layoutType)
        this.changeType(layout.chartType || 'Candles')
      }
    },
    openDeleteLayoutPopup(layout) {
      this.deleteLayoutId = layout.id
      this.deleteLayoutName = layout.layoutName
      this.popupDeleteLayout = true
    },
    closeDeleteLayoutPopup() {
      this.deleteLayoutId = null
      this.deleteLayoutName = ""
      this.popupDeleteLayout = false
    },
    chartRangeStyle() {
      return {
        ...this.themeSecondaryColor,
        ...this.themeFontColor,
        color: 'white',
      }
    },
    updateButtonLabel() {
      this.indicatorBtnLabel = window.innerWidth < 920 ? 'Ind' : 'Indicators';
    },
    changeScanModal(val) {
      this.isScanModalVisible = val
    },
    changeBroadcastModal(val) {
      this.isBroadcastVisible = val
    },
    tourNextStep(time = 300) {
      if (this.$tours[tourRef.TOUR_REF].currentStep > 0) {

        setTimeout(() => {
          this.setTourStep(this.$tours[tourRef.TOUR_REF].currentStep + 1)
          this.$tours[tourRef.TOUR_REF].nextStep();
          this.originalHide = this.$refs.otherSettingBtn.hide;
          this.$refs.otherSettingBtn.hide = () => { };
        }, time);
      }
    },

  },
  computed: {
    ...mapState({
      selectedChartType: (state) => state.type,
      chartToggleVolume: (state) => state.chartToggleVolume,
    }),
    ...mapGetters([
      'themeDarkMode',
      'themePrimaryColor',
      'themeSecondaryColor',
      'themeFontColor',
      'isChartLoading',
      'multiChartSymbol',
      'selectedTab',
      'SelectedScanSymbol',
      'userData',
      'getChartVisibleRange',
      'isTrainingMode',
      'layoutList',
      'layoutPopup',
      'getLayout',
      'getChartType',
      'tourStep',
      'gridHeight',
      'isAIOpen'
    ]),
    getSymbolName() {
      return this.multiChartSymbol[this.selectedTab]?.symbol
    },
    chartTimeframe() {
      return this.multiChartSymbol[this.selectedTab]?.timeFrame || 'D'
    },
    filteredTimeRanges() {
      // return this.timeRanges[this.chartTimeframe]
      return this.timeRanges[this.chartTimeframe] ? this.timeRanges[this.chartTimeframe].map((item, index) => ({
        label: item.range,
        btnclass: `${item.range == this.chartVisibleRange ? '' : 'p-button-secondary'} p-button-outlined`,
        class: `${item.range == this.chartVisibleRange ? 'selected-menu-item svg-icon' : 'svg-icon'}`,
        command: () => {
          this.chartVisibleRange = item.range

        }
      })) : [];


    },

    chartVisibleRange: {
      get() {
        return this.getChartVisibleRange
      },
      set(value) {
        if (value !== '' && value !== this.getChartVisibleRange) {

          this.$store.commit('CHART_PREDEFINE_RANGE_UPDATES')
          const key = `${this.chartTimeframe}_range`
          chartEvents.$emit('brush_range_change')
          chartEvents.$emit('setChartRange', value, 'VisibleRangeChange')
          this.$store.dispatch('setNewTimeFrameRange', { key, value })
        }
      },
    },

    chartTypeRanges() {
      let allchartMenu = chartTypeConfig.map((item, index) => {
        return {
          label: item.chartType,
          disabled: false,
          class: `${item.chartType} ${item.chartType == this.getChartType ? 'selected-menu-item svg-icon' : 'svg-icon'}`,
          command: () => {
            this.changeType(item.chartType, item.imagePath);
          }
        }
      });

      let comparechartObj = {
        label: 'Comparision Chart',
        disabled: this.getLayout !== '1tab',
        class: `CompareChartMain ${'CompareChartMain' == this.getChartType ? 'selected-menu-item svg-icon' : 'svg-icon'}`,
        command: () => {
          this.changeChartToCompareStocksType(true);
        }
      }
      allchartMenu.push(comparechartObj)
      return allchartMenu;
    },
    chartTimeFrameRanges() {
      return chartTimeFrameConfig.map((item, index) => {
        return {
          btnLabel: item.timeFrame,
          label: item.adverb,
          btnclass: `${item.timeFrame == this.chartTimeframe ? '' : 'p-button-secondary'} p-button-outlined`,
          class: `${item.timeFrame == this.chartTimeframe ? 'selected-menu-item svg-icon' : 'svg-icon'}`,
          command: () => {
            this.changeTimeFrame(item.timeFrame)
          }
        }
      });
    },
    layoutImageMapping() {
      const layoutMenu = layoutConfig.map((item, index) => {
        return {
          label: '',
          class: `${item.className} ${item.name == this.getLayout ? 'selected-menu-item svg-icon menu-item-icon-only' : 'svg-icon menu-item-icon-only'}`,
          command: () => {
            this.handleButtonClick(this.changeLayout, item.name)
          }
        }
      });

      const saveButton = [{
        label: '',
        // icon: 'pi pi-save',
        class: `save-layout svg-icon menu-item-icon-only`,
        command: () => {
          this.handleButtonClick(this.saveLayoutFun)

        }
      }]

      const savedLayout = this.layoutList.map((item, index) => {
        return {
          label: `${item.layoutName}`,
          icon: 'pi pi-times',
          class: `menu-close`,
          command: (event) => {
            if (event.originalEvent.target.classList.contains("p-menuitem-icon")) {
              this.handleButtonClick(this.openDeleteLayoutPopup, item)
            } else {
              this.handleButtonClick(this.handleItemClick, item)
            }


          }
        }
      });

      return [...layoutMenu, { separator: true }, ...saveButton, ...savedLayout]
    },
    otherButtonsMapping() {
      return [
        {
          id: "ind-btn",
          label: 'Indicators',
          icon: 'pi pi-chart-scatter',
          toolTip: '',
          btnLabel: 'Indicators',
          btnIcon: '',
          class: 'drp-indicator',
          btnClass: 'p-button-secondary p-button-outlined toptool-bold-font',
          command: () => {
            this.changeIndicatorModal(true)
          }
        },
        {
          id: "step4",
          label: 'Scans',
          icon: 'pi pi-qrcode',
          toolTip: '',
          btnLabel: 'Scans',
          btnIcon: 'pi pi-qrcode',
          btnClass: 'toptool-bold-font',
          class: 'drp-scan',
          command: () => {
            this.changeScanModal(true)
          }
        },
        {
          label: 'Friday Broadcast',
          icon: 'pi pi-play-circle',
          toolTip: 'Friday Broadcast',
          btnLlabel: '',
          btnIcon: 'pi pi-play-circle',
          btnClass: 'toptool-bold-font',
          command: () => {
            this.handleButtonClick(this.changeBroadcastModal, true)
          }
        },
        {
          label: 'AI',
          icon: 'pi pi-chart-scatter',
          toolTip: 'Protrader AI Tech',
          btnLabel: '',
          btnIcon: '',
          class: 'drp-indicator',
          btnClass: `p-button-secondary p-button-outlined toptool-bold-font`,
          command: () => {
            this.handleButtonClick(this.setAIView, !this.isAIOpen)
          }
        },
      ]
    },
  },
  watch: {
    tourStep(val) {
      let scanSelectComplete = this.$tours[tourRef.TOUR_REF]?.steps[val]?.params?.scanSelectComplete

      if ((scanSelectComplete == true || val == -1) && this.originalHide) {
        this.$refs.otherSettingBtn.hide = this.originalHide;
        this.originalHide = null;
        setTimeout(() => {
          this.$refs.otherSettingBtn.hide();
        }, 300);
      }
    }
  },
  created() {
    this.updateButtonLabel();
    window.addEventListener('resize', this.updateButtonLabel);
  },
  destroyed() {
    window.removeEventListener('resize', this.updateButtonLabel);
  },


}
</script>


<style scoped>
/* Style the Dropdown to fit custom trigger */
.custom-dropdown {
  position: relative;
}

.custom-dropdown .p-dropdown-panel {
  z-index: 1000;
  margin-top: 5px;
}

.custom-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>');
}


/* AI Button Styles */
.p-button-secondary.p-button-outlined.toptool-bold-font:has(.ai-icon),
.p-button-primary.toptool-bold-font:has(.ai-icon) {
  padding: 0rem;
  border: none;
  /* min-width: 2.5rem; */
}

.ai-icon {
  width: 30px;
  height: 30px;
  background-image: url('/src/assets/ai-icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>