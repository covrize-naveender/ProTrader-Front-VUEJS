<template>
  <div>
    <div class="field-content">

      <p-radiobutton id="obv" name="indicator_settings" value="obv" v-model="settings.selectedScan" />
      <label for="obv">OBV</label>

    </div>
    <div class="field-content">

      <p-radiobutton id="stoc" name="indicator_settings" value="stoc" v-model="settings.selectedScan" />
      <label for="stoc">STOC</label>

      <label>Period</label>
      <p-inputText type="number" v-model="settings.stoc.period" :style="selectWidth" min="1"
        @keypress="preventDecimal" />

      <label>K%</label>
      <p-inputText type="number" v-model="settings.stoc.kPeriod" :style="selectWidth" min="1"
        @keypress="preventDecimal" />

      <label>D%</label>
      <p-inputText type="number" v-model="settings.stoc.dPeriod" :style="selectWidth" min="1"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <p-radiobutton id="macd" name="indicator_settings" value="macd" v-model="settings.selectedScan" />
      <label for="macd">MACD</label>

      <label>Fast</label>
      <p-inputText type="number" v-model="settings.macd.fast" :style="selectWidth" min="1" @keypress="preventDecimal" />

      <label>Slow</label>
      <p-inputText type="number" v-model="settings.macd.slow" :style="selectWidth" min="1" @keypress="preventDecimal" />

      <label>Signal</label>
      <p-inputText type="number" v-model="settings.macd.signal" :style="selectWidth" min="1"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <p-radiobutton id="rsi" name="indicator_settings" value="rsi" v-model="settings.selectedScan" />
      <label for="rsi">RSI</label>

      <label>Period</label>
      <p-inputText type="number" v-model="settings.rsi" :style="selectWidth" min="1" @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Maximum number of days in the past to be scanned</label>
      <p-inputText type="number" v-model="settings.maxRange" :style="selectWidth" min="1" @keypress="preventDecimal" />

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DIVERGENCE_SCAN } from '../../../../utils/defaultScanValues';

export default {
  components: {},
  name: 'DivergenceScan',
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'setDivergenceScanSettings',
      'sendDivergenceScanRequest',
      'cancelGuruScans',
      'saveguruScanRequest',
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
      }
      else {
        await this.sendDivergenceScanRequest()
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
      }
      else {
        this.setDivergenceScanSettings(JSON.parse(JSON.stringify(DIVERGENCE_SCAN)))
      }
    },
    async saveScanSettings(name) {
      await this.saveguruScanRequest({
        scanName: name,
        scanType: 'divergenceScan'
      })
      this.$store.commit('SCAN_POPUP', false)
      await this.getUserScanList()
    },

    preventDecimal(event) {
      if (event.key === '.' || event.key === ',' || event.key === '-') {
        event.preventDefault();
      }
    },
  },
  data() {
    return {
      isLoading: false,
      scanType: "divergenceScan",
      settingsData: {
        selectedScan: 'obv',
        maxRange: 20,
        stoc: {
          kPeriod: 12,
          dPeriod: 26,
          period: 9
        },
        rsi: 14,
        macd: {
          fast: 12,
          slow: 26,
          signal: 9
        }
      }
    }
  },
  computed: {
    ...mapGetters(['gurusScanSettings', 'userSavedScans']),
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return (
        (this.settings.selectedScan === 'obv' ||
          (this.settings.selectedScan === 'stoc' &&
            this.settings.stoc.kPeriod > 0 &&
            this.settings.stoc.dPeriod > 0 &&
            this.settings.stoc.period > 0) ||
          (this.settings.selectedScan === 'macd' &&
            this.settings.macd.fast > 0 &&
            this.settings.macd.slow > 0 &&
            this.settings.macd.signal > 0) ||
          (this.settings.selectedScan === 'rsi' && this.settings.rsi > 0)) &&
        this.settings.maxRange > 0
      )
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.gurusScanSettings.divergenceScan || this.settingsData
      },
      set(value) {
        this.setDivergenceScanSettings(value)
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
<style></style>