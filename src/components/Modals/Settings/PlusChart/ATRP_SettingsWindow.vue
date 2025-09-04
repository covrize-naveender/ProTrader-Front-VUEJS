<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">ATRP</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="atrpLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="atrpPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'ATRP_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    atrpLineWidth: {
      get: PlusChartSettingsComputed.atrpLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'atrpLineWidth', value)
      }
    },
    atrpPeriodColor: {
      get: PlusChartSettingsComputed.atrpPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'atrpPeriodColor', value)
      }
    }
  }
}
</script>
<style scoped>





</style>