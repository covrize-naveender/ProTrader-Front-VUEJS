<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">KC</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="kcLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="kcPeriodColor" :isSettingsPicker="true" />
        <color-picker v-model="kcBackColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'KC_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    kcPeriodColor: {
      get: PlusChartSettingsComputed.kcPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'kcPeriodColor', value)
      }
    },
    kcBackColor: {
      get: PlusChartSettingsComputed.kcBackColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'kcBackColor', value)
      }
    },
    kcLineWidth: {
      get: PlusChartSettingsComputed.kcLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'kcLineWidth', value)
      }
    },
  }
}
</script>
<style scoped>





</style>