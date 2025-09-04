<template>
  <div>
    <multiple-checker @selectAll="updateAllSelections(true)" @clearAll="updateAllSelections(false)" />
    <div class="p-d-flex">
      <div style="flex:1" v-for="col of candleItem">
        <CustomSvgCheckBox v-for="checkBox of col" :key="checkBox" :label="checkBox"
          :srcResolutionFunction="srcResolutionFunction" :updateState="updateCheckedPatterns"
          :fromProps="settings[toCamelCase(checkBox)]" />
      </div>
    </div>
    <CustomSvgCheckBox v-for="checkBox of col4" :key="checkBox" :label="checkBox"
      :srcResolutionFunction="srcResolutionFunction" :updateState="updateCheckedPatterns"
      :updateMultipleInsideInputState="updateMultipleInsideInput" :fromProps="settings[toCamelCase(checkBox)]"
      :fromPropsMultipleInput="settings['multipleInsideBarInput']"
      :fromPropsGtMultipleInput="settings['gtMultipleInsideBarInput']" />
  </div>
</template>

<script>
const DEFAULT_SETTINGS = {
  doji: false,
  bullishHarami: false,
  bearishHarami: false,
  bullishHaramiCross: false,
  bearishHaramiCross: false,
  hammer: false,
  invertedHammer: false,
  shootingStar: false,
  hangingMan: false,
  bullishEngulfing: false,
  bearishEngulfing: false,
  insideBar: false,
  multipleInsideBar: false,
  multipleInsideBarInput: 2,
  gtMultipleInsideBar: false,
  gtMultipleInsideBarInput: 5
}
import { mapActions, mapGetters } from 'vuex'
import { DEFAULT_DATA_SETTINGS, DEFAULT_EVENT_SETTINGS, DEFAULT_FILTER_SETTINGS } from "../../../../settings/USER_SETTINGS_DEFAULT"
import MultipleChecker from '../../../../baseComponents/MultipleChecker.vue'
import CustomSvgCheckBox from '../../../../svg_icon/CustomSvgCheckBox.vue'
export default {
  name: 'Candle',
  components: { MultipleChecker, CustomSvgCheckBox },
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'updateMarketAccordingTODataSettings',
      'setCandlestickScanSettings',
      'saveScannersScanRequest',
      'sendCandlestickScanRequest',
      'setSelectedMarket',
      'cancelScans',
      'saveCandlestickScanRequest',
      'deleteScanSettings',
      'getUserScanList',
      'runAndUpdateScanSettings',
      'resetSavedScan'
    ]),

    async onScanClick() {
      this.isLoading = true
      if (this.favScanId) {
        const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
        await this.runAndUpdateScanSettings(index)
        await this.getUserScanList()
      } else {
        await this.sendCandlestickScanRequest()
      }
      this.isLoading = false
      this.$emit('change', !open)
    },
    onScanStop() {
      this.cancelScans()
      this.isLoading = false
    },
    async saveScanSettings(name) {

      await this.saveScannersScanRequest({
        scanName: name,
        scanType: 'candlesticks'
      })
      this.$store.commit('SCAN_POPUP', false)
      await this.getUserScanList()
    },
    ResetScanDefaultSettings() {
      if (this.favScanId) {
        this.resetSavedScan(this.favScanId)
      } else {
        let val = {
          dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
          filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
          events: JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS))
        }
        this.updateMarketAccordingTODataSettings({ ...val, id: this.id })
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      }
    },
    updateAllSelections(newValue) {
      this.settings = {
        doji: newValue,
        bullishHarami: newValue,
        bearishHarami: newValue,
        bullishHaramiCross: newValue,
        bearishHaramiCross: newValue,
        hammer: newValue,
        invertedHammer: newValue,
        shootingStar: newValue,
        hangingMan: newValue,
        bullishEngulfing: newValue,
        bearishEngulfing: newValue,
        insideBar: newValue,
        multipleInsideBar: newValue,
        multipleInsideBarInput: 2,
        gtMultipleInsideBar: newValue,
        gtMultipleInsideBarInput: 5

      }
      this.$forceUpdate();
      this.handleUserChoice();
    },

    handleUserChoice() {
      if (this.userChoice == false) {
        this.$store.commit('SET_USER_CHOICE', true)
      }
    },
    srcResolutionFunction(label) {
      return label
        .replace('-', '_')
        .split(' ')
        .reverse()
        .map(w => w.toLowerCase())
        .reduce((curr, prev) => (prev && curr ? `${prev}_${curr}` : prev), '')
    },
    toCamelCase(name) {
      const pascal = name.replaceAll(' ', '')
      return pascal[0].toLowerCase() + pascal.substring(1)
    },
    updateCheckedPatterns(label, state) {
      this.settings[this.toCamelCase(label)] = state
    },
    updateMultipleInsideInput(label, state) {
      this.settings[label] = state
    },





  },
  data() {
    return {
      id: "candlesticks",
      isLoading: false,
      checkedPatterns: {},
      col4: ['Multiple Inside Bar', 'Gt Multiple Inside Bar'],

      candleItem: [
        [
          'Doji',
          'Bearish Harami',
          'Bearish Harami Cross',
          'Inverted Hammer',
          'Hanging Man',
          'Bearish Engulfing',
        ],
        [
          'Bullish Harami',
          'Bullish Harami Cross',
          'Hammer',
          'Shooting Star',
          'Bullish Engulfing',
          'Inside Bar',
        ],
      ],
      // settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    }
  },
  computed: {
    ...mapGetters(['userChoice', 'scannerScanSettings', 'userSavedScans']),
    isValid() {
      return Object.values(this.settings).filter(value => typeof value === 'boolean').some(state => state)
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.scannerScanSettings.candlesticks.settings || JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      },
      set(value) {
        this.setCandlestickScanSettings(value)
      }
    }
  },
  watch: {
    isValid: {
      handler(newVal) {
        this.$emit('valid', newVal);
      },
      immediate: true
    },
    isLoading: {
      handler(newVal) {
        this.$emit('loading', newVal);
      },
      immediate: true
    },
  }
}
</script>

<style>
/* .fontSize{
  font-size: 15px;
} */
.fss {
  font-size: 20px;
}
</style>
