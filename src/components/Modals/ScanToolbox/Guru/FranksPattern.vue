<template>
  <div></div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FRANKS_PATTERN } from '../../../../utils/defaultScanValues';
export default {
  components: {},

  name: 'FranksPattern',
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scanType: "franksPattern",
      isLoading: false
    }
  },
  methods: {
    ...mapActions(['sendFranksPatternRequest', 'cancelGuruScans', 'setFranksSettings', 'saveguruScanRequest', 'runAndUpdateScanSettings',
      'getUserScanList',
      'resetSavedScan']),
    async onScanClick() {
      this.isLoading = true
      if (this.favScanId) {
        const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
        await this.runAndUpdateScanSettings(index)
        await this.getUserScanList()
      }
      else {

        await this.sendFranksPatternRequest()
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
        this.setFranksSettings(JSON.parse(JSON.stringify(FRANKS_PATTERN)))
      }
    },
    async saveScanSettings(name) {
      await this.saveguruScanRequest({
        scanName: name,
        scanType: 'franksPattern'
      })
      this.$store.commit('SCAN_POPUP', false)
      await this.getUserScanList()
    },
  },
  computed: {
    ...mapGetters(['gurusScanSettings', 'userSavedScans']),
    isValid() {
      return true
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.gurusScanSettings.franksPattern
      },
      set(value) {
        this.setFranksSettings(value)
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

<style lang="scss" scoped></style>
