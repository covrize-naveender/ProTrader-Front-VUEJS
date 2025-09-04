<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">Ribbon</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="ribbonLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="ribbonPeriodColor[0]" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
import { mapGetters } from "vuex";
export default {
  name: 'Ribbon_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    ribbonLineWidth: {
      get: PlusChartSettingsComputed.ribbonLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'ribbonLineWidth', value)
      }
    },
    ribbonPeriodColor: {
      get: PlusChartSettingsComputed.ribbonPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'ribbonPeriodColor', value)
      }
    }
  }
}
</script>
<style scoped>





</style>