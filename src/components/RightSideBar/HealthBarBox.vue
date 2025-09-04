<template>
  <div class="side-bar-cardStyle">
    <div class="p-d-flex p-jc-between">
      <span class="right-tool-title-text" :style="themeFontColor"
        >Health Report ({{
          !isNaN(getHealthPct.toFixed(2)) ? getHealthPct.toFixed(2) : 0
        }}/340)</span
      >
      <p-button
        icon="pi pi-info-circle"
        class="p-button-rounded p-button-secondary p-button-text"
        @click="changeHealthBarModal(true)"
      />
    </div>
    <div id="health-container">
      <div id="progress-bar-container">
        <div class="progress-bar-child progress"></div>
        <div class="progress-bar-child mask" :style="healthBarEmptyArea"></div>
      </div>
    </div>
    <HealthBarModal
      :visible="isHealthbarModalVisible"
      :allTest="getHealthAll"
      @toggleModal="changeHealthBarModal"
    />
  </div>
</template>

<script>
import HealthBarModal from '../Modals/HealthBarModal.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HealthBarBox',
  components: {
    HealthBarModal,
  },
  data() {
    return {
      isHealthbarModalVisible: false,
    }
  },
  computed: {
    ...mapGetters([
      'getSymbolHealth',
      'themeDarkMode',
      'multiChartSymbol',
      'selectedTab',
      'themeFontColor'
    ]),
    getHealthAll() {
      return (
        this.getSymbolHealth || {
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
        }
      )
    },
    getHealthPct() {
      const healthVal1 =
        this.multiChartSymbol?.[this.selectedTab]?.health.test1 +
        this.multiChartSymbol?.[this.selectedTab]?.health.test2 +
        this.multiChartSymbol?.[this.selectedTab]?.health.test3 +
        this.multiChartSymbol?.[this.selectedTab]?.health.test4 +
        this.multiChartSymbol?.[this.selectedTab]?.health.test5
      return healthVal1
    },
    healthBarEmptyArea() {
      return this.themeDarkMode
        ? {
            left: `${(this.getHealthPct * 100) / 340}%`,
            background: '#505050',
            borderColor: '#505050',
            color: '#A2A2A2',
          }
        : { left: `${(this.getHealthPct * 100) / 340}%` }
    },
  },
  methods: {
    changeHealthBarModal(val) {
      this.isHealthbarModalVisible = val
    },
  },
}
</script>

<style lang="scss" scoped></style>
