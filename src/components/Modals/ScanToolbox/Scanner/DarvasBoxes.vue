<template>
  <div>
    <div class="field-content">

      <label>Scan Type:</label>
      <p-dropdown v-model="settings.scanType" :options="scanTypes" optionLabel="text" optionValue="value"/>

    </div>
    <div class="field-content">

      <label>Scan period</label>
      <p-inputText type="number" v-model="settings.scanPeriod" :style="selectWidth" min="0" max="1000" step="1"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Top confirmation period</label>
      <p-inputText type="number" v-model="settings.topConfirmationPeriod" :style="selectWidth" min="0" max="1000"
        step="1" @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Bottom confirmation period</label>
      <p-inputText type="number" v-model="settings.bottomConfirmationPeriod" :style="selectWidth" min="0" max="1000"
        step="1" @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Percentage risk buffer</label>
      <p-inputText type="number" v-model="settings.percentageRiskBuffer" :style="selectWidth" min="0" step="1" />

    </div>
    <div class="field-content">

      <p-checkbox v-model="settings.limitTotalRisk.isActive" :binary="true" />
      <label>Limit total risk to</label>
      <p-inputText type="number" v-model="settings.limitTotalRisk.valuePct" :style="selectWidth" min="1" step="1" />

    </div>
    <div class="field-content">

      <p-checkbox v-model="settings.volumeIncreasedOver.isActive" :binary="true" />
      <label>Volume increased over</label>

      <p-inputText type="number" v-model="settings.volumeIncreasedOver.percent" :style="selectWidth" min="1" step="1" />
      <label>% on previous</label>
      <p-inputText type="number" v-model="settings.volumeIncreasedOver.previousBars" :style="selectWidth" min="1"
        step="1" @keypress="preventDecimal" />
      <label>bar(s)</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="settings.inBox.isActive" :binary="true" />
      <label>In a box</label>

      <p-radiobutton id="box_anyBox_sam" name="box" value="anyBox" v-model="settings.inBox.type" />
      <label for="box_anyBox_sam">Any Box</label>

      <p-radiobutton id="box_1stBox_sam" name="box" value="1stBox" v-model="settings.inBox.type" />
      <label for="box_1stBox_sam">1st Box</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="settings.within.isActive" :binary="true" />
      <label>With the</label>

      <p-radiobutton id="close-high-close-sam" name="close-high" value="close" v-model="settings.within.type" />
      <label for="close-high-close-sam">Close</label>

      <p-radiobutton id="close-high-high-sam" name="close-high" value="high" v-model="settings.within.type" />
      <label for="close-high-high-sam">High</label>

      <label>within</label>
      <p-inputText type="number" v-model="settings.within.pricePoints" :style="selectWidth" min="1" step="1" />
      <label>price points below the top</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="settings.restrictBoxToMaxBox.isActive" :binary="true" />
      <label>Restrict box sequences to a maximum of</label>

      <p-inputText type="number" v-model="settings.restrictBoxToMaxBox.maxBoxes" :style="selectWidth" min="1" step="1"
        @keypress="preventDecimal" />
      <label>boxes</label>

    </div>
    <div class="field-content">

      <p-checkbox v-model="settings.restrictCurrentBoxWidth.isActive" :binary="true" />
      <label>Restrict current box width to between</label>

      <p-inputText type="number" v-model="settings.restrictCurrentBoxWidth.start" :style="selectWidth" min="1" step="1"
        @keypress="preventDecimal" />
      <label>and</label>
      <p-inputText type="number" v-model="settings.restrictCurrentBoxWidth.end" :style="selectWidth" min="1" step="1"
        @keypress="preventDecimal" />
      <label>bars</label>

    </div>
  </div>
</template>

<script>
const DEFAULT_SETTINGS = {
  scanType: 'long',
  scanPeriod: 55,
  topConfirmationPeriod: 3,
  bottomConfirmationPeriod: 3,
  percentageRiskBuffer: 2.0,
  limitTotalRisk: {
    isActive: false,
    valuePct: 20.0,
  },
  volumeIncreasedOver: {
    isActive: false,
    percent: 300,
    previousBars: 1,
  },
  inBox: {
    isActive: false,
    type: 'anyBox', // 'anyBox' | '1stBox'
  },
  within: {
    isActive: false,
    type: 'close', // 'close' | 'high'
    pricePoints: 0,
  },
  restrictBoxToMaxBox: {
    isActive: false,
    maxBoxes: 0,
  },
  restrictCurrentBoxWidth: {
    isActive: false,
    start: 0,
    end: 10,
  },
}
import { mapActions, mapGetters } from 'vuex'
import { DEFAULT_DATA_SETTINGS, DEFAULT_EVENT_SETTINGS, DEFAULT_FILTER_SETTINGS } from "../../../../settings/USER_SETTINGS_DEFAULT"
export default {

  name: 'DarvasBoxes',
  components: {},
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'updateMarketAccordingTODataSettings',
      'sendDarvasScanRequest',
      'setDarvasScanSettings',
      'cancelScans',
      'saveScannersScanRequest',
      'deleteScanSettings',
      'getUserScanList',
      'setSelectedMarket',
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
        await this.sendDarvasScanRequest()
      }
      this.isLoading = false
      this.$emit('change', !open)
    },
    onScanStop() {
      this.cancelScans()
      this.isLoading = false
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
    async saveScanSettings(name) {
      await this.saveScannersScanRequest({
        scanName: name,
        scanType: 'darvasScan'
      })
      this.$store.commit('SCAN_POPUP', false)
      await this.getUserScanList()
    },

    handleUserChoice() {
      if (this.userChoice == false) {
        this.$store.commit('SET_USER_CHOICE', true)
      }
    },
    preventDecimal(event) {
      if (event.key === '.' || event.key === ',' || event.key === '-') {
        event.preventDefault();
      }
    },


  },

  data() {
    return {
      id: "darvasScan",
      isLoading: false,
      selectedScanType: 'long',
      scanTypes: [
        {
          text: 'Long',
          value: 'long',
        },
        {
          text: 'Short',
          value: 'short',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['themeFontColor', 'userChoice', 'themeDarkMode', 'scannerScanSettings', 'userSavedScans']),

    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.scannerScanSettings.darvasScan.settings || JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      },
      set(value) {
        this.setDarvasScanSettings(value)
      }
    },
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return true
    },
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
  },
}
</script>

<style scoped></style>
