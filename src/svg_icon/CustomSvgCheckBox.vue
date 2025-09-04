<template>

  <div class="image-check-box-container">
    <i class="custom-svg-icon">
      <component class="imgg" :is="componentRef" v-if="componentRef" :color="themeDarkMode ? '#9b9f9b' : '#000000'" />
    </i>
    <p-checkbox :id="label" v-if="haveCheck" v-model="checked" :binary="true" @click="handleUserChoice" />
    <label v-if="label === 'Multiple Inside Bar'"> Number of inside range bars</label>
    <label v-else-if="label === 'Gt Multiple Inside Bar'"> More than</label>
    <label v-else :for="label">{{ label }}</label>
    <p-inputText type="number" v-model="multipleVal" tabindex="1" :style="selectWidth"
      v-if="label === 'Multiple Inside Bar'" />

    <p-inputText type="number" v-model="gtMultipleVal" tabindex="1" :style="selectWidth"
      v-if="label === 'Gt Multiple Inside Bar'" />
    <label v-if="label === 'Gt Multiple Inside Bar'"> Inside Range bars</label>
  </div>
</template>

<script>
// style="max-height: 100%; max-width: 100%; "
import SvgIconList from "./index";
import { mapGetters } from 'vuex'

export default {
  components: {},
  name: 'CustomSvgCheckBox',
  methods: {
    handleUserChoice() {
      if (this.userChoice) {
        this.$store.commit('SET_USER_CHOICE', true)
      }
    },

    preventDecimal(event) {
      if (event.key === '.' || event.key === ',' || event.key === '-') {
        event.preventDefault();
      }
    },
  },
  props: {
    srcResolutionFunction: {
      type: Function,
    },
    label: {
      type: String,
      default: '',
    },
    updateState: {
      type: Function,
    },
    updateMultipleInsideInputState: {
      type: Function,
    },
    fromProps: {
      type: Boolean,
    },
    fromPropsMultipleInput: {
      type: Number,
    },
    fromPropsGtMultipleInput: {
      type: Number,
    },
    haveCheck: {
      type: Boolean,
      default: true
    },

  },
  data() {
    return {
      checked: false,
      multipleVal: 2,
      gtMultipleVal: 5,
      componentRef: undefined,
    }
  },
  watch: {
    checked(newValue) {
      this.updateState(this.label, newValue)
    },
    multipleVal: {
      handler(newVal) {
        this.updateMultipleInsideInputState('multipleInsideBarInput', newVal)
      },
      // immediate: true
    },
    gtMultipleVal: {
      handler(newVal) {
        this.updateMultipleInsideInputState('gtMultipleInsideBarInput', newVal)
      },
      // immediate: true
    },
    fromProps: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.checked = newVal
        }
      },
      immediate: true
    },

    fromPropsMultipleInput: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.multipleVal = newVal
        }
      },
      immediate: true
    },
    fromPropsGtMultipleInput: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.gtMultipleVal = newVal
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['userChoice', 'themeDarkMode']),
    selectWidth() {
      return 'width: 15%'
    },
    path() {
      // let definePath = `./${srcResolutionFunction}.vue`;
      return this.srcResolutionFunction(this.label)
    },
  },
  async mounted() {
    this.componentRef = SvgIconList.find(d => d.name === this.path)

  }
}
</script>

<style>
.image-check-box-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.imgg {
  width: 12px;
  height: 12px;
}

@media screen and (max-width: 360px) {
  .imgg {
    width: 8px;
    height: 10px;
  }
}
</style>
