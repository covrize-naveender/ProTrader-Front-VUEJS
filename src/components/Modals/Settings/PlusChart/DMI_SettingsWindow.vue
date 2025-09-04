<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">DMI</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="dmiLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="dmiPeriodColor[0]" :isSettingsPicker="true" />
        <color-picker v-model="dmiPeriodColor[1]" :isSettingsPicker="true" />
        <color-picker v-model="dmiPeriodColor[2]" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'DMI_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    dmiLineWidth: {
      get: PlusChartSettingsComputed.dmiLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'dmiLineWidth', value)
      }
    },
    dmiPeriodColor: {
      get: PlusChartSettingsComputed.dmiPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'dmiPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>