<template>
   <div class="settings-container">
    <h4 :style="themeFontColor">HMA</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="hmaLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="hmaPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
  
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import {mapGetters} from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'HMA_SettingsWindow',
  components: {ColorPicker},
  computed: {
    ...mapGetters(["themeFontColor"]),
    hmaLineWidth:{
      get: PlusChartSettingsComputed.hmaLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'hmaLineWidth', value)
      }
    },
    hmaPeriodColor:{
      get: PlusChartSettingsComputed.hmaPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'hmaPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>