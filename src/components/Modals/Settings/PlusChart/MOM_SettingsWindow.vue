<template>
  <div class="settings-container">
    <h4 :style="themeFontColor">MOM</h4>
    <div class="p-grid setting-item-plus-chart p-mr-2">
      <div class="p-col" :style="themeFontColor">Line Width</div>
      <div class="p-col">
        <p-inputText type="number" v-model="momLineWidth" placeholder="20" />
      </div>
      <div class="p-col p-d-flex" style="gap: 0.5rem;">
        <color-picker v-model="momPeriodColor" :isSettingsPicker="true" />
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from "vuex";
import PlusChartSettingsComputed from "@/components/settingsHelper/PlusChartSettingsComputed"
export default {
  name: 'MOM_SettingsWindow',
  components: { ColorPicker },
  computed: {
    ...mapGetters(["themeFontColor"]),
    momLineWidth: {
      get: PlusChartSettingsComputed.momLineWidth.get,
      set(value) {
        this.$emit('runGeneralSetting', 'momLineWidth', value)
      }
    },
    momPeriodColor: {
      get: PlusChartSettingsComputed.momPeriodColor.get,
      set(value) {
        this.$emit('runGeneralSetting', 'momPeriodColor', value)
      }
    },
  }
}
</script>
<style scoped>





</style>