<template>
  <div class="field-content">
    <label>Find pocket pivot with period of</label>
    <p-inputText type="number" v-model="settings.period" :style="selectWidth" min="1" @keypress="preventDecimal" />

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { POCKET_PIVOT } from '../../../../utils/defaultScanValues';

export default {
  components: {},
  name: 'PocketPivot',

  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'setPocketPivotScanSettings',
      'sendPocketPivotScanRequest',
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

        await this.sendPocketPivotScanRequest()
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
        this.setPocketPivotScanSettings(JSON.parse(JSON.stringify(POCKET_PIVOT)))
      }
    },
    async saveScanSettings(name) {
      await this.saveguruScanRequest({
        scanName: name,
        scanType: 'pocketPivot'
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
      scanType: "pocketPivotScan",
      isLoading: false,
      settingsData: {
        period: 5
      }
    }
  },
  computed: {
    ...mapGetters(['gurusScanSettings', 'userSavedScans']),
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return this.settings.period > 0
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.gurusScanSettings.pocketPivot || this.settingsData
      },
      set(value) {
        this.setPocketPivotScanSettings(value)
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
