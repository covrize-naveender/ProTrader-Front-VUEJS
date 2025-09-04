<template>
  <p-dialog :visible.sync="visible" :closable="false" header="Enter Text" @hide="onClose" :modal="true"
    class="small-dialog">
    <div>
      <div class="p-d-flex p-jc-start" style="gap: 0.5rem;">
        <p-dropdown appendTo='body' v-model="selectedFontSize" :options="fontSizeMenu" optionLabel="text"
          optionValue="value" />
        <color-picker v-model="selectedColor" :isSettingsPicker="true" />
      </div>
      <div class="p-d-flex p-jc-center p-pt-2">
        <p-textarea v-model="text" rows="5" cols="40" style="font-size:x-large; overflow-x:auto" />
      </div>
    </div>
    <template #footer>
      <p-button label="OK" :disabled="!valid" negative @click="ok" />
      <p-button label="Cancel" class="p-button-secondary" @click="onClose" />
    </template>
  </p-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { fontSizeMenuOption } from './toolMenu';
import ColorPicker from '@/baseComponents/ColorPicker.vue'

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
    header: {
      type: String,
      default: 'Enter Text'
    },
    initialText: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    },
    getSettings: {
      type: Function,
      required: true
    },
    changeSettings: {
      type: Function,
      required: true
    }
  },
  mounted() {
    this.text = this.initialText
  },
  data() {
    return {
      text: '',
      dark_Theme_Col: '',
      fontSizeMenu: fontSizeMenuOption.map((item) => {
        return {
          text: item.label,
          value: item.fontSize,
        }
      }),
    }
  },
  methods: {
    toggleFontSize(event) {
      this.$refs.fontSizeMenu.toggle(event);
    },
    onClose() {
      this.$emit('onClose')
    },
    ok() {
      this.$emit('ok', this.text)
    }
  },
  computed: {
    ...mapGetters(['themeDarkMode', 'themePrimaryColor', 'themeSecondaryColor']),
    valid() {
      return this.text.length > 0
    },
    selectedFontSize: {
      get() {
        return this.getSettings('fontSize');
      },
      set(value) {
        this.changeSettings({
          fontSize: value,
        })
      },
    },
    selectedColor: {
      get() {
        return this.getSettings('color')
      },
      set(value) {
        this.changeSettings({
          color: value,
        })
      },
    },
  },
  watch: {
    // themeDarkMode(val){
    //   if(val){
    //     this.dark_Theme_Col = '#151515'
    //   }
    //   else{
    //     this.dark_Theme_Col = this.themePrimaryColor.backgroundColor
    //   }

    // }
  }
}
</script>

<style></style>
