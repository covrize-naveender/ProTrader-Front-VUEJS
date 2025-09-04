<template>
  <p-dialog :visible.sync="visible" :closable="false" header="Fibonacci Settings" @hide="onClose" :modal="true">
    <div class="p-grid">
      <div v-for="(item, index) in fibSettings" :key="index" class="p-col-6 p-sm-6 p-md-6 p-lg-4 p-d-flex p-ai-center"
        style="gap: 0.5rem;">
        <p-checkbox v-model="item.enable" :binary="true" @input="updateSetting(index, 'enable', $event)" />
        <p-inputText v-model="item.val" type="number" :style="selectWidth" @input="updateSetting(index, 'val', $event)"
          step="0.001" />
        <color-picker v-model="item.color" :isSettingsPicker="true" @input="updateSetting(index, 'color', $event)" />
      </div>
    </div>
    <div class="field-content" style="padding: 0.5rem;">
      <p-checkbox id="logSetting" :disabled="!this.logScale" v-model="logSetting" :binary="true" @input="updateLogSetting($event)" />
      <label for="logSetting">Fib level based on log scale</label>
    </div>
    <template #footer>
      <p-button label="OK" negative @click="ok" />
      <p-button label="Cancel" class="p-button-secondary" @click="onClose" />
    </template>
  </p-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { fibonacciLines } from './fibonacciLines';

export default {
  name: 'TextSettings',
  components: {
    ColorPicker
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    getSettings: {
      type: Function,
      required: true
    },
    changeSettings: {
      type: Function,
      required: true
    },
  },
  mounted() {
  },
  data() {
    return {
      defaultFibSettings: null,
      defaultLogSettings: false,
    }
  },
  methods: {
    onClose() {
      if (!this.visible) return;
      this.changeSettings({
        fibSettings: this.defaultFibSettings,
        logSetting: this.defaultLogSettings,
      })
      this.$emit('onClose')
    },
    ok() {
      this.$emit('ok')
    },
    updateSetting(index, key, value) {
      const updatedSettings = [...this.fibSettings]; // Clone to trigger reactivity
      updatedSettings[index][key] = value;
      this.changeSettings({
        fibSettings: updatedSettings,
      })
    },
    updateLogSetting(value) {
      this.changeSettings({
        logSetting: value,
      })
    }
  },
  computed: {
    ...mapGetters(['logScale']),
    selectWidth() {
      return 'width: 60%'
    },
    fibSettings() {
      return this.getSettings('fibSettings') || fibonacciLines;
    },
    logSetting() {
      return this.getSettings('logSetting') || false;
    },
  },
  watch: {
    visible(n, o) {
      if (n === true) {
        this.defaultFibSettings = JSON.parse(JSON.stringify(this.getSettings('fibSettings') || fibonacciLines))
        this.defaultLogSettings = JSON.parse(JSON.stringify(this.getSettings('logSetting') || false))
      }
    }
  }
}
</script>

<style></style>
