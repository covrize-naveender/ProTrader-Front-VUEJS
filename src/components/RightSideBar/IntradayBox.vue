<template>
  <div :class="`side-bar-cardStyle intraday-cardStyle ${intradayModeSwitch ? 'intraday-on': 'intraday-off'}`">
    <div class="p-d-flex p-jc-between">
      <span class="right-tool-title-text"
        >Intraday {{ timeFrameText }} Data</span
      >
      <div class="p-d-flex p-ai-center">
        <span class="right-tool-title-text">{{
          intradayModeSwitch ? 'ON' : 'OFF'
        }}</span>
        <p-inputswitch
          v-model="intradayModeSwitch"
          :disabled="!isIntradayModeAllowed"
          style="margin: 0 0.5rem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { TimeFrameMap } from '../../constants'
import { getMarketTime } from '../../utils'

export default {
  name: 'IntradayBox',
  data: () => ({ intradayModeSwitch: false }),
  computed: {
    ...mapGetters(['timeFrame', 'getMarketId', 'isIntradayMode', 'themeFontColor']),
    timeFrameText() {
      return TimeFrameMap[this.timeFrame]
    },
    isIntradayModeAllowed() {
      return getMarketTime(this.getMarketId).isMarketOpened
    },
  },
  watch: {
    isIntradayModeAllowed: {
      immediate: true,
      handler(newValue) {
        this.intradayModeSwitch = newValue
      },
    },
    intradayModeSwitch(newValue) {
      if (this.isIntradayModeAllowed) {
        this.updateIntraDayModeState(newValue)
      } else {
        this.intradayModeSwitch = false
      }
    },
  },
  methods: {
    ...mapActions(['updateIntraDayModeState']),
  },
}
</script>

<style lang="scss" scoped></style>
