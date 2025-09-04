<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">BBW</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="bbwLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="bbwPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'BBW_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    bbwLineWidth: {
      get: PlusChartSettingsComputed.bbwLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'bbwLineWidth', value)
      }
    },
    bbwPeriodColor: {
      get: PlusChartSettingsComputed.bbwPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'bbwPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>