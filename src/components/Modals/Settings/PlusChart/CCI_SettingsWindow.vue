<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">CCI</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="cciLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="cciPeriodColor" :isSettingsPicker="true" />
        <color-picker v-model="cciBackColor" :isSettingsPicker="true" />
        <color-picker v-model="cciBandColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'CCI_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    cciLineWidth: {
      get: PlusChartSettingsComputed.cciLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cciLineWidth', value)
      }
    },
    cciPeriodColor: {
      get: PlusChartSettingsComputed.cciPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cciPeriodColor', value)
      }
    },
    cciBackColor: {
      get: PlusChartSettingsComputed.cciBackColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cciBackColor', value)
      }
    },
    cciBandColor: {
      get: PlusChartSettingsComputed.cciBandColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cciBandColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>