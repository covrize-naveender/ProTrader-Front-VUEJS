<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">ALMA</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="almaLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="almaPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'ALMA_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    almaLineWidth: {
      get: PlusChartSettingsComputed.almaLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'almaLineWidth', value)
      }
    },
    almaPeriodColor: {
      get: PlusChartSettingsComputed.almaPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'almaPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>