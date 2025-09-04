<template>
  <span>
    <input
      v-if="type === 'text' || !type"
      :value="value"
      class="tvjs-std-input"
      :style="style"
      :placeholder="name"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
      required
    />
    <input
      v-else-if="type === 'number'"
      :value="value"
      class="tvjs-std-input"
      :style="style"
      :placeholder="name"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
      type="number"
      :step="step || 1"
      min="1"
      max="1000"
      required
    />
    <div
      v-else-if="type === 'color'"
      class="tvjs-std-input"
      :style="colorPickerStyle"
    >
      <color-picker
        :placeholder="name"
        v-model="selectedColor"
        invisibleBackground
        style="width: 100%; height: 100%"
      />
    </div>
    <select
      v-else-if="type === 'select'"
      class="tvjs-std-input"
      :style="style"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
      <option v-for="opt in list" :key="opt">{{ opt }}</option>
    </select>
    <div 
      v-else-if="type === 'bool'"
      :class="classGrp ?'tvjs-grp-check' : 'tvjs-std-check'">
      <p-checkbox class="stdCheckbox" v-model="enableVal" :binary="true" />
    </div>
  </span>
</template>

<script>
import ColorPicker from '@/baseComponents/ColorPicker.vue'
export default {
  name: 'StdInput',
  props: ['value', 'name', 'type', 'list', 'colors', 'step', 'classGrp'],
  methods: {},
  components: {
    ColorPicker
  },
  computed: {
    style() {
      return {
        //background: this.$props.colors.back,
        //color: this.$props.colors.text
      }
    },
    selectedColor: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    enableVal: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    colorPickerStyle() {
      return `background: ${this.selectedColor}; padding: 3px`
    }
  },
  data() {
    return {}
  }
}
</script>

<style>
.tvjs-std-input {
  margin: 5px;
  background-color: whitesmoke;
  border: 1px dotted #353940;
  height: 22px;
  border-radius: 3px;
  padding: 2px 0 3px 10px;
  color: black;
  font-size: 1.2em;
  outline: none;
  width: 100px;
}

.tvjs-std-check {
  margin: 5px;
  height: 22px;
  border-radius: 3px;
  padding: 2px 0 3px 10px;
  color: black;
  font-size: 1.2em;
  outline: none;
  width: 100px;
}
.tvjs-grp-check {
  margin: 5px;
  height: 22px;
  border-radius: 3px;
  padding: 2px 0 3px 10px;
  color: black;
  font-size: 1.2em;
  outline: none;
}

select.tvjs-std-input {
  height: 29px;
  -moz-appearance: none;
}

/* select.tvjs-std-input {
  //display: none; /*hide original SELECT element: */
.tvjs-std-input::placeholder {
  color: #8e909a;
  opacity: 0.25;
}
</style>
