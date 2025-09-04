<template>
  <div>
    <div class="field-content" id="activity-setting">

      <p-radiobutton id="activity_settings~top" name="activity_settings" value="top" v-model="settings.mode" />
      <label for="activity_settings~top">Top</label>
      <p-inputText type="number" v-model="settings.topCount" @input="handleUserChoice" :style="selectWidth"
        @keypress="preventDecimal" id="top-value"/>
      <label>stocks by</label>
      <p-dropdown v-model="settings.topMethod" :options="topModeOptions" optionLabel="text" optionValue="value" id="top-option"/>

    </div>

    <div class="field-content">

      <p-radiobutton id="activity_settings_closedOnHigh" name="activity_settings" value="closedOnHigh"
        v-model="settings.mode" />
      <label for="activity_settings_closedOnHigh">All stocks that closed on their high</label>

    </div>

    <div class="field-content">

      <p-radiobutton id="activity_settings_closedOnHighPct" name="activity_settings" value="closedOnHighPct"
        v-model="settings.mode" />
      <label for="activity_settings_closedOnHighPct">All stocks that closed within</label>
      <p-inputText type="number" v-model="highPct" @input="handleUserChoice" :style="selectWidth" />
      <label>% within their high</label>

    </div>

    <div class="field-content">

      <p-radiobutton id="activity_settings_closedOnLow" name="activity_settings" value="closedOnLow"
        v-model="settings.mode" />
      <label for="activity_settings_closedOnLow">All stocks that closed on their low</label>

    </div>

    <div class="field-content">

      <p-radiobutton id="activity_settings_closedOnLowPct" name="activity_settings" value="closedOnLowPct"
        v-model="settings.mode" />
      <label for="activity_settings_closedOnLowPct">All stocks that closed within</label>
      <p-inputText type="number" v-model="lowPct" @input="handleUserChoice" :style="selectWidth" />
      <label>% within their low</label>

    </div>

    <div class="field-content">

      <p-radiobutton id="activity_settings_range" name="activity_settings" value="range" v-model="settings.mode" />
      <label for="activity_settings_range">All stocks that closed within a price range from</label>
      <p-inputText type="number" v-model="settings.priceRangeStart" @input="handleUserChoice" :style="selectWidth" />
      <label>to</label>
      <p-inputText type="number" v-model="settings.priceRangeEnd" @input="handleUserChoice" :style="selectWidth" />


    </div>

  </div>
</template>

<script>
const DEFAULT_SETTINGS = {
  mode: 'top',
  topCount: 10,
  topMethod: 'volume',
  withinPct: 1.0,
  priceRangeStart: 1,
  priceRangeEnd: 5,
}
import { mapActions, mapGetters } from 'vuex'
import { DEFAULT_DATA_SETTINGS, DEFAULT_FILTER_SETTINGS, DEFAULT_EVENT_SETTINGS } from "../../../../settings/USER_SETTINGS_DEFAULT"
import { ACTIVITY } from '../../../../utils/defaultScanValues'
import { tourRef } from '../../../../utils/tourGuide'

export default {
  name: 'Activity',
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
      'setActivityScanSettings',
      'sendActivityScanRequest',
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
      }
      else {

        await this.sendActivityScanRequest()
      }
      this.isLoading = false
      this.$emit('change', !open)
    },
    onScanStop() {
      this.isLoading = false
      this.cancelScans()
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
        scanType: 'activity'
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
      id: "activity",
      isLoading: false,
      lowPct: 5,
      highPct: 5,

      topModeOptions: [
        {
          text: 'volume',
          value: 'volume',
        },
        {
          text: 'price increase',
          value: 'priceIncrease',
        },
        {
          text: '% price increase',
          value: 'priceIncreasePct',
        },
        {
          text: 'market cap',
          value: 'marketCap',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['themeFontColor', 'userChoice', 'themeDarkMode', 'scannerScanSettings', 'userSavedScans']),
    selectWidth() {
      return 'width: 15%'
    },
    getRadioProps() {
      return {
        ...this.themeFontColor,
        cursor: 'pointer',
        marginRight: '.8em',
        fontWeight: 'normal',
      }
    },
    isValid() {
      return Boolean(this.settings.mode)
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        if (this.$tours[tourRef.TOUR_REF]?.currentStep > 0) {
          this.setActivityScanSettings(ACTIVITY.settings)
          return JSON.parse(JSON.stringify(ACTIVITY.settings))
        }
        return this.scannerScanSettings.activity.settings || JSON.parse(JSON.stringify(this.settingsData))
      },
      set(value) {
        this.setActivityScanSettings(value)
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
    highPct(newVal) {
      if (this.mode === 'closedOnHighPct') {
        this.settings.withinPct = newVal
      }
    },
    lowPct(newVal) {
      if (this.mode === 'closedOnLowPct') {
        this.settings.withinPct = newVal
      }
    },
  },
}
</script>

<style scoped></style>
