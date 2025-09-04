<template>
  <div class="field-content">
    <label>Find a candle</label>
    <p-inputText type="number" v-model="settings.candleSizeMultiplier" min="1" :style="selectWidth" />
    <label>times larger than previous</label>
    <p-inputText type="number" v-model="settings.previousCandlePeriod" min="1" :style="selectWidth" @keypress="preventDecimal"/>
    <label>candles</label>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DEFAULT_DATA_SETTINGS, DEFAULT_FILTER_SETTINGS } from '../../../../settings/USER_SETTINGS_DEFAULT';
import { BIG_CANDLE } from '../../../../utils/defaultScanValues';

export default {
  components: {},

  name: 'BigCandle',
  data() {
    return {
      isLoading: false,
      scanType: "bigCandleScan",
    }
  },
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'setBigCandleScanSettings',
      'sendBigCandleScanRequest',
      'cancelGuruScans',
      'updateIntraDayModeState',
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
      else{

        await this.updateIntraDayModeState(false)
        await this.sendBigCandleScanRequest()
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
      else{
        this.setBigCandleScanSettings(JSON.parse(JSON.stringify(BIG_CANDLE)))
      }
    },
    async saveScanSettings(name) {
      await this.saveguruScanRequest({
        scanName: name,
        scanType: 'bigCandle'
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
  computed: {
    ...mapGetters(['gurusScanSettings', 'userSavedScans']),
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return (
        Number(this.settings.candleSizeMultiplier) > 0 &&
        Number(this.settings.previousCandlePeriod) > 0
      )
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.gurusScanSettings.bigCandle
      },
      set(value) {
        this.setBigCandleScanSettings(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-container {
  font-size: 13.5px;
}

.fontSize {
  font-size: 13.5px;
  margin-bottom: 5px;
}

@media screen and (max-width:870px) {
  .fontSize {
    font-size: 11px;
    margin-bottom: 5px;
  }
}

@media screen and (max-width:510px) {
  .fontSize {
    font-size: 10px;
    margin-bottom: 7px;
  }
}
</style>
