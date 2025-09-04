<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">SWMA</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="swmaLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="swmaPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'SWMA_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    swmaLineWidth: {
      get: PlusChartSettingsComputed.swmaLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'swmaLineWidth', value)
      }
    },
    swmaPeriodColor: {
      get: PlusChartSettingsComputed.swmaPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'swmaPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>