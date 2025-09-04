<template>
  <div class="wrapper" style="width: 100%; height: 100%" v-click-outside="onClickOutside" v-if="isSettingsPicker">

    <p-button class="p-button-sm" @click="toggle" size="mini" :icon="isIconVisible ? `pi pi-pencil` : ''" :style="style"
      :disabled="isDisabled" />
    <p-overlaypanel ref="op" appendTo="body" class="color-panel-overlay">
      <sketch-picker :value="value" @input="onUpdateColor" :preset-colors="presetColors"></sketch-picker>
    </p-overlaypanel>
  </div>
  <div class="wrapper" style="width: 100%; height: 100%" v-click-outside="onClickOutside" v-else>
    <div @click.prevent="toggle" class="btn-color" :style="style"></div>
    <!-- <div style="position: absolute; z-index: 100001" v-if="open">
    </div> -->
    <p-overlaypanel ref="op" appendTo="body" class="color-panel-overlay">
      <sketch-picker :value="value" @input="onUpdateColor" :preset-colors="presetColors"></sketch-picker>
    </p-overlaypanel>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'
export default {
  name: 'ColorPicker',
  components: {
    'sketch-picker': Sketch,
  },
  props: {
    isSettingsPicker: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    fieldRef: {
      type: String,
    },
    type: {
      type: String,
    },
    invisibleBackground: {
      type: Boolean,
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isIconVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      color: {},
      borderColor: {},
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
      open: false,
    }
  },
  methods: {
    toggle(event) {
      this.$refs.op.toggle(event);
    },
    onUpdateColor(color) {

      const { r, g, b, a } = color.rgba
      this.$emit('input', color.hex8, this.fieldRef, this.type)
    },
    onUpdateborderColor(borderColor) {

      const { r, g, b, a } = borderColor.rgba
      this.$emit('input', borderColor.hex, this.fieldRef, this.type)
    },
    onClickOutside(event) {
      this.open = false
    },
  },
  computed: {
    style() {
      if (this.invisibleBackground) return 'width: 100%; height: 100%'
      return `background: ${this.value};  border-color: ${this.value}; color:rgba(0,0,0,.6);`
    },
    presetColors() {
      return [
        
        // 1st row
        '#ffffff',
        '#fdcbcd',
        '#fee2b6',
        '#fdfbc8',
        '#c6e7cb',
        '#aae5dc',
        '#b1eaf1',
        '#bcd7f9',
        '#d3c2e7',
        '#fabbcf',

        //2nd row
        '#b2b5bd',
        '#fca2a5',
        '#fecf88',
        '#fcf8a5',
        '#a1d7aa',
        '#6bccbd',
        '#7ddde8',
        '#93bcf5',
        '#b69ad8',
        '#f78fb0',

        //3rd row
        '#787a85',
        '#f97e82',
        '#ffbb5c',
        '#fcf484',
        '#7ac989',
        '#36bda9',
        '#48cedf',
        '#6396f1',
        '#9a70c9',
        '#f36291',

        //4th row
        '#5d5f6a',
        '#fa5562',
        '#ffab40',
        '#fcf26c',
        '#5cbd71',
        '#01ab95',
        '#1ac4d8',
        '#4470ef',
        '#844fbd',
        '#ef417a',

        //5th row
        '#2a2d38',
        '#b42c36',
        '#f68028',
        '#fac448',
        '#2a9044',
        '#006657',
        '#0096a5',
        '#313bc6',
        '#591da3',
        '#c51a5b',

        //6th row
        '#000000',
        '#821c24',
        '#e8561e',
        '#f68330',
        '#0d5f27',
        '#00332a',
        '#005f63',
        '#212795',
        '#3b018e',
        '#8a0c4e',
      ]
    },
  },
  created() {

  },
}
</script>

<style scoped>
.btn-color {
  width: 42px;
  height: 42px;
  border-radius: 0.5rem;
  cursor: pointer;
}

.wrapper {
  position: relative;
}
</style>
