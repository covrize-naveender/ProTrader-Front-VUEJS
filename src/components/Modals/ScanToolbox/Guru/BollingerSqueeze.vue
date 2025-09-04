<template>
  <div>
    <div class="field-content">
      <label>Min scanning period</label>
      <p-inputText type="number" v-model="settings.minScanningPeriod" min="0" :style="selectWidth"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Max scanning period</label>
      <p-inputText type="number" v-model="settings.maxScanningPeriod" min="0" :style="selectWidth"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Days from today when squeeze started breaking out</label>
      <p-inputText type="number" v-model="settings.dayFromToday" min="0" :style="selectWidth"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Min squeeze length</label>
      <p-inputText type="number" v-model="settings.minSqueezeLength" min="0" :style="selectWidth"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Max squeeze length</label>
      <p-inputText type="number" v-model="settings.maxSqueezeLength" min="0" :style="selectWidth"
        @keypress="preventDecimal" />

    </div>
    <div class="field-content">

      <label>Ratio of spike height to a squeeze height</label>
      <p-inputText type="number" v-model="settings.ratioOfSpikeHeight" min="0" :style="selectWidth"
        @keypress="preventDecimal" />

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { BOLLINGER_SQUEEZE } from '../../../../utils/defaultScanValues';

export default {
  components: {},
  name: 'BollingerSqueeze',
  data() {
    return {
      scanType: "bollingerSqueeze",
      isLoading: false
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
      'sendBollingerSqueezePatternRequest',
      'setBollingerSqueezeSettings',
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

        await this.sendBollingerSqueezePatternRequest()
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
        this.setBollingerSqueezeSettings(JSON.parse(JSON.stringify(BOLLINGER_SQUEEZE)))
      }
    },
    async saveScanSettings(name) {
      await this.saveguruScanRequest({
        scanName: name,
        scanType: 'bollingerSqueeze'
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
    },
  },
  computed: {
    ...mapGetters(['gurusScanSettings', 'userSavedScans']),
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return (
        Number(this.settings.minScanningPeriod) > 0 &&
        Number(this.settings.maxScanningPeriod) > 0 &&
        Number(this.settings.minScanningPeriod) > 0 &&
        Number(this.settings.maxScanningPeriod) > 0 &&
        Number(this.settings.dayFromToday) > 0 &&
        Number(this.settings.ratioOfSpikeHeight) > 0 &&
        Number(this.settings.minScanningPeriod) < Number(this.settings.maxScanningPeriod) &&
        Number(this.settings.minSqueezeLength) < Number(this.settings.maxSqueezeLength)
      )
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.gurusScanSettings.bollingerSqueeze
      },
      set(value) {
        this.setBollingerSqueezeSettings(value)
      }
    }
  }
}
</script>
<style scoped></style>
