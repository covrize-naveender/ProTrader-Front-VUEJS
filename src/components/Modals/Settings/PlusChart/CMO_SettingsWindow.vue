<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">CMO</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="cmoLineWidth" placeholder="20"/>
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="cmoPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
import { mapGetters } from "vuex";

export default {
  name: 'CMO_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    cmoLineWidth: {
      get: PlusChartSettingsComputed.cmoLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cmoLineWidth', value)
      }
    },
    cmoPeriodColor: {
      get: PlusChartSettingsComputed.cmoPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'cmoPeriodColor', value)
      }
    }
  }
}
</script>
<style scoped>


/*  */


</style>