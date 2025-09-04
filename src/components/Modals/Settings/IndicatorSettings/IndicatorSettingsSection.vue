<template>
  <div>
    <h4 :style="themeFontColor">{{ title }}</h4>
    <div class="p-grid p-mr-2 p-mt-2" v-for="(multi, i) of settings" :key="i">
      <div class="p-col-9 p-d-flex toptool-gap">

        <p-inputText type="number" v-model.number="multi.period" placeholder="20" @input="updateSettings()"
          style="width: 100%;" />
        <div v-if="multi.group">

          <p-dropdown v-model="multi.group" :options="default_group" optionLabel="text" optionValue="value"
            placeholder="Select a Group"  @change="updateSettings"/>
        </div>
      </div>
      <div class="p-col p-d-flex">
        <color-picker v-model="multi.color" :isSettingsPicker="true" type="color" @input="updateSettings()" />
        <p-button class="p-button-sm p-button-secondary" icon="pi pi-times" :disabled="settings.length === 1"
          @click.prevent="removeElement(i)" />
      </div>
    </div>
    <div class="p-grid p-mt-2">
      <div class="p-col-9">
        <p-button class="p-button-sm" icon="pi pi-plus" :style="themeSecondaryColor" label="Add"
          @click.prevent="addElement" />
      </div>
    </div>
  </div>
</template>

<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { mapGetters } from 'vuex';
export default {
  name: 'IndicatorSettingsSection',
  components: { ColorPicker },
  data() {
    return {
      default_group: [
        {
          text: 'Short-term',
          value: 'short-term',
        },
        {
          text: 'Long-term',
          value: 'long-term',
        },
      ],

    }
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    settings: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'themeFontColor',
      'themeSecondaryColor'
    ]),
    defaultSetting() {
      return {
        period: 30,
        color: '#165ba8',
      };
    },
    defaultSettingGroup() {
      return {
        period: 3,
        color: '#3F91EB',
        group: 'short-term'
      };
    },
  },
  methods: {
    updateSettings() {
      this.$emit('updateProp', this.type);
    },
    addElement() {
      console.log(this.type);
      
      this.settings.push(this.type == 'gxma' ? {...this.defaultSettingGroup}: { ...this.defaultSetting });
      this.$store.commit('SET_INDICATOR_MULTI_SETTINGS', this.settings);
      this.updateSettings();
    },
    removeElement(index) {
      this.settings.splice(index, 1);
      this.$store.commit('SET_INDICATOR_MULTI_SETTINGS', this.settings);
      this.updateSettings();
    },
  },
};
</script>

<style scoped></style>