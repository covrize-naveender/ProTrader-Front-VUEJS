<template>
  <div>
    <div class="field-content">

      <label>Scan Type:</label>
      <p-dropdown v-model="samSettings.scanType" :options="scanTypes" optionLabel="text" optionValue="value" />

    </div>
    <div class="field-content">

      <label>Scan period</label>
      <p-inputText type="number" v-model="samSettings.scanPeriod" :style="selectWidth" min="0" max="1000" step="1"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Top confirmation period</label>
      <p-inputText type="number" v-model="samSettings.topConfirmationPeriod" :style="selectWidth" min="0" max="1000"
        step="1" @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Bottom confirmation period</label>
      <p-inputText type="number" v-model="samSettings.bottomConfirmationPeriod" :style="selectWidth" min="0" max="1000"
        step="1" @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Percentage risk buffer</label>
      <p-inputText type="number" v-model="samSettings.percentageRiskBuffer" :style="selectWidth" min="0" step="1" />

    </div>
    <div class="field-content">


      <p-checkbox v-model="samSettings.limitTotalRisk.isActive" :binary="true" />
      <label>Limit total risk to</label>

      <p-inputText type="number" v-model="samSettings.limitTotalRisk.valuePct" :style="selectWidth" min="1" step="1" />

    </div>
    <div class="field-content">

      <p-checkbox v-model="samSettings.volumeIncreasedOver.isActive" :binary="true" />
      <label>Volume increased over</label>
      <p-inputText type="number" v-model="samSettings.volumeIncreasedOver.percent" :style="selectWidth" min="1"
        step="1" />
      <label>% on previous</label>
      <p-inputText type="number" v-model="samSettings.volumeIncreasedOver.previousBars" :style="selectWidth" min="1"
        step="1" @keypress="preventDecimal" />
      <label>bar(s)</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="samSettings.inBox.isActive" :binary="true" />
      <label>In a box</label>


      <p-radiobutton id="box_anyBox_sam" name="box" value="anyBox" v-model="samSettings.inBox.type" />
      <label for="box_anyBox_sam">Any Box</label>

      <p-radiobutton id="box_1stBox_sam" name="box" value="1stBox" v-model="samSettings.inBox.type" />
      <label for="box_1stBox_sam">1st Box</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="samSettings.within.isActive" :binary="true" />
      <label>With the</label>


      <p-radiobutton id="close-high-close-sam" name="close-high" value="close" v-model="samSettings.within.type" />
      <label for="close-high-close-sam">Close</label>

      <p-radiobutton id="close-high-high-sam" name="close-high" value="high" v-model="samSettings.within.type" />
      <label for="close-high-high-sam">High</label>

      <label>within</label>
      <p-inputText type="number" v-model="samSettings.within.pricePoints" :style="selectWidth" min="1" step="1" />
      <label>price points below the top</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="samSettings.restrictBoxToMaxBox.isActive" :binary="true" />
      <label>Restrict box sequences to a maximum of</label>


      <p-inputText type="number" v-model="samSettings.restrictBoxToMaxBox.maxBoxes" :style="selectWidth" min="1"
        step="1" @keypress="preventDecimal" />
      <label>boxes</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="samSettings.restrictCurrentBoxWidth.isActive" :binary="true" />
      <label>Restrict current box width to between</label>

      <p-inputText type="number" v-model="samSettings.restrictCurrentBoxWidth.start" :style="selectWidth" min="1"
        step="1" @keypress="preventDecimal" />
      <label>and</label>
      <p-inputText type="number" v-model="samSettings.restrictCurrentBoxWidth.end" :style="selectWidth" min="1" step="1"
        @keypress="preventDecimal" />
      <label>bars</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="samSettings.onlyShowBoxOfTopBottomOnFirstBar" :binary="true" />
      <label>Only show boxes where the top and bottom are formed by the first bar</label>


    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  DEFAULT_DATA_SETTINGS,
  DEFAULT_EVENT_SETTINGS,
  DEFAULT_FILTER_SETTINGS
} from "../../../../settings/USER_SETTINGS_DEFAULT";
const DEFAULT_SETTINGS = {
  scanType: 'long',
  scanPeriod: 55,
  topConfirmationPeriod: 3,
  bottomConfirmationPeriod: 3,
  percentageRiskBuffer: 2.0,
  limitTotalRisk: {
    isActive: false,
    valuePct: 20.0
  },
  volumeIncreasedOver: {
    isActive: false,
    percent: 300,
    previousBars: 1
  },
  inBox: {
    isActive: false,
    type: 'anyBox' // 'anyBox' | '1stBox'
  },
  within: {
    isActive: false,
    type: 'close', // 'close' | 'high'
    pricePoints: 0
  },
  restrictBoxToMaxBox: {
    isActive: false,
    maxBoxes: 0
  },
  restrictCurrentBoxWidth: {
    isActive: false,
    start: 0,
    end: 10
  },
  onlyShowBoxOfTopBottomOnFirstBar: false
}
export default {

  name: 'SamsPattern',
  components: {},
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: "samsPattern",
      isLoading: false,
      selectedScanType: 'long',
      scanTypes: [
        {
          text: 'Long',
          value: 'long'
        },
        {
          text: 'Short',
          value: 'short'
        }
      ],
      settingsData: JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
    }
  },
  methods: {
    ...mapActions([
      'sendSamsPatternRequest',
      'saveScannersScanRequest',
      'updateMarketAccordingTODataSettings',
      'getUserScanList',
      'setSamsPatternSettings',
      'deleteScanSettings',
      'cancelGuruScans',
      'runAndUpdateScanSettings',
      'resetSavedScan'
    ]),
    async onScanClick() {
      const { topConfirmationPeriod, bottomConfirmationPeriod, percentageRiskBuffer, scanPeriod } = this.samSettings
      if (
        !this.isValueWithinRange(topConfirmationPeriod, 0, 1000) ||
        !this.isValueWithinRange(bottomConfirmationPeriod, 0, 1000) ||
        // !this.isValueWithinRange(percentageRiskBuffer, 0, 1000) ||
        !this.isValueWithinRange(scanPeriod, 0, 1000)
      ) {
        return;
      }
      this.samSettings = {
        ...this.samSettings,
        scanPeriod: parseInt(scanPeriod),
        topConfirmationPeriod: parseInt(topConfirmationPeriod),
        bottomConfirmationPeriod: parseInt(bottomConfirmationPeriod),
        // percentageRiskBuffer: parseInt(percentageRiskBuffer)
      }
      this.isLoading = true
      if (this.favScanId) {
        const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
        await this.runAndUpdateScanSettings(index)
        await this.getUserScanList()
      } else {
        await this.sendSamsPatternRequest()
      }
      this.isLoading = false
    },
    onScanStop() {
      this.isLoading = false
      this.cancelGuruScans()
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
        this.samSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      }
    },
    async saveScanSettings(name) {
      await this.saveScannersScanRequest({
        scanName: name,
        scanType: 'samsPattern'
      })
      this.$store.commit('SCAN_POPUP', false)
      await this.getUserScanList()
    },

    isValueWithinRange(value, min, max) {
      return value >= min && value <= max;
    },
    preventDecimal(event) {
      if (event.key === '.' || event.key === ',' || event.key === '-') {
        event.preventDefault();
      }
    },
  },
  computed: {
    ...mapGetters(['samsPatternSettings', 'themeFontColor', 'scannerScanSettings', 'userSavedScans']),
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return true
    },
    samSettings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.samsPatternSettings || this.settingsData
      },
      set(value) {
        this.setSamsPatternSettings(value)
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
    }
  },
}
</script>

<style>
.space-between {
  max-width: 60%;
  justify-content: space-between;
}
</style>
