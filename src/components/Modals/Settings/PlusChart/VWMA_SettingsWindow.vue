<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">VWMA</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="vwmaLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="vwmaPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'VWMA_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    vwmaLineWidth: {
      get: PlusChartSettingsComputed.vwmaLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'vwmaLineWidth', value)
      }
    },
    vwmaPeriodColor: {
      get: PlusChartSettingsComputed.vwmaPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'vwmaPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>



</style>