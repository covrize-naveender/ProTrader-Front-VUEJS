<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">MFI</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="mfiLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="mfiPeriodColor" :isSettingsPicker="true" />
        <color-picker v-model="mfiBandColor" :isSettingsPicker="true" />
        <color-picker v-model="mfiBackColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'MFI_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    mfiLineWidth: {
      get: PlusChartSettingsComputed.mfiLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'mfiLineWidth', value)
      }
    },
    mfiPeriodColor: {
      get: PlusChartSettingsComputed.mfiPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'mfiPeriodColor', value)
      }
    },
    mfiBandColor: {
      get: PlusChartSettingsComputed.mfiBandColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'mfiBandColor', value)
      }
    },
    mfiBackColor: {
      get: PlusChartSettingsComputed.mfiBackColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'mfiBackColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>