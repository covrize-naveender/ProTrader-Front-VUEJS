<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">COG</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="cogLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="cogPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'COG_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    cogLineWidth: {
      get: PlusChartSettingsComputed.cogLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cogLineWidth', value)
      }
    },
    cogPeriodColor: {
      get: PlusChartSettingsComputed.cogPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cogPeriodColor', value)
      }
    }
  }
}
</script>
<style scoped>





</style>