<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">TSI</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="tsiLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="tsiPeriodColor[0]" :isSettingsPicker="true" />
        <color-picker v-model="tsiPeriodColor[1]" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"

export default {
  name: 'TSI_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    tsiLineWidth: {
      get: PlusChartSettingsComputed.tsiLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'tsiLineWidth', value)
      }
    },
    tsiPeriodColor: {
      get: PlusChartSettingsComputed.tsiPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'tsiPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>



</style>