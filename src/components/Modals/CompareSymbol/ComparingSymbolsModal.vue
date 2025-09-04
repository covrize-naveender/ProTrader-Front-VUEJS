<template>
  <p-dialog :visible.sync="visible" header="Comparing Symbols" @hide="onClose" :modal="true">
    <div>

      <p>
        Enter up to four additional stocks to compare against the current
        chart. The starting point for the comparison is controlled by the
        selected time frame (3M, 6M, etc), and is represented on the chart by
        a dashed vertical line.
      </p>
      <div class="p-grid p-mt-3">

        <div class="p-col-12 p-md-6 p-sm-6 p-4">
          <SymbolSearchBoxModal symbolNameProp="symbol1" v-model="symbol1" :selected-symbol-type="symbol1Market"
            @searchModalOpen="$emit('symbolModalOpen','symbol1')" />
        </div>
        <div class="p-col-12 p-md-6 p-sm-6 p-4">
          <SymbolSearchBoxModal symbolNameProp="symbol2" v-model="symbol2" :selected-symbol-type="symbol2Market"
            @searchModalOpen="$emit('symbolModalOpen','symbol2')" />
        </div>
        <div class="p-col-12 p-md-6 p-sm-6 p-4">
          <SymbolSearchBoxModal symbolNameProp="symbol3" v-model="symbol3" :selected-symbol-type="symbol3Market"
            @searchModalOpen="$emit('symbolModalOpen','symbol3')" />
        </div>
        <div class="p-col-12 p-md-6 p-sm-6 p-4">
          <SymbolSearchBoxModal symbolNameProp="symbol4" v-model="symbol4" :selected-symbol-type="symbol4Market"
            @searchModalOpen="$emit('symbolModalOpen','symbol4')" />
        </div>
      </div>
    </div>
    <template #footer>
      <p-button label="Ok" @click="onSubmit" />
      <p-button class="p-button-secondary" label="Cancel" @click="onClose" />
    </template>
  </p-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { TimeRangesConfig } from '../../../utils/TimeRangesConfig';
import { chartEvents } from '../../../chartEvents';
import SymbolSearchBoxModal from './SymbolSearchBoxModal.vue';

export default {
  name: 'ComparingSymbols',
  data() {
    return {
      isLoading: false,
      isDisabled: true,
    }
  },
  mounted() {
    this.toggleButtonState();
  },
  components: {
    SymbolSearchBoxModal,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    ...mapActions(['retrieveMultipleSymbolData', 'setNewChartType', 'setSymbolData']),
    ...mapMutations(['changeSymbol', 'deleteSymbol']),
    onClose() {
      this.$emit('closeModal')
    },

    toggleButtonState() {
      if (
        this.symbol1 === '' &&
        this.symbol2 === '' &&
        this.symbol3 === '' &&
        this.symbol4 === ''
      ) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
    async onSubmit() {

      const allSymbols = this.getSelectedMultipleSymbols
      const comparisonSymbolList = []
      for (let i = 1; i <= 4; i++) {
        const key = allSymbols[`symbol${i}`]
        if (comparisonSymbolList.includes(key)) {
          this.$store.commit("deleteSymbol", `symbol${i}`)
        } else {
          comparisonSymbolList.push(key)
        }
      }

      this.isLoading = true
      this.setNewChartType({
        type: 'CompareChartMain', location: "FromComparingSym",
        symbolMap: {
          symbol1: this.getSelectedMultipleSymbols?.symbol1 || "",
          symbol2: this.getSelectedMultipleSymbols?.symbol2 || "",
          symbol3: this.getSelectedMultipleSymbols?.symbol3 || "",
          symbol4: this.getSelectedMultipleSymbols?.symbol4 || "",
        }
      }).then(d => {
        localStorage.setItem("isComparisonChart", "true")
        this.setSymbolData({ symbolName: this.getSymbolName, timeFrame: this.getTimeFrame, reForce: true, isComparison: true }).then(d => {

          let config = TimeRangesConfig[this.getTimeFrame]
          let rangeMap = config.map(d => d.range)
          this.$store.dispatch("updateMultipleSymbolData2", { data: this.getMultipleSymbolDataNew, rangeMap })
            .then(async d => {
              await this.$nextTick()
              if (d) {

                this.multiTv[this.selectedTab]?.data.merge('chart.settings', d)
              }
            })
          chartEvents.$emit('setChartRange', undefined, 'ComparingModals')
          chartEvents.$emit('symbolChangeVerifyScanDetails')
          chartEvents.$emit('loadDrawingData')
        })
        // await this.retrieveMultipleSymbolData()
        this.isLoading = false
        this.$emit('closeModal')
      })

    },
    getSymbolPart(symbol) {
      let split = symbol?.split("~");
      return split?.[0] || ""
    },
    getSymbolMarket(symbol) {
      let split = symbol?.split("~");
      return split?.[1] || "ASX"
    }
  },
  watch: {
    symbol1: 'toggleButtonState',
    symbol2: 'toggleButtonState',
    symbol3: 'toggleButtonState',
    symbol4: 'toggleButtonState',
  },
  computed: {
    ...mapGetters(['getSelectedMultipleSymbols', 'symbolName', 'selectedTab', 'multiChartSymbol', 'getMultipleSymbolDataNew', 'multiTv']),
    /** @returns {String} */
    symbol1Market() {
      return this.getSymbolMarket(this.getSelectedMultipleSymbols.symbol1)
    },
    getSymbolName() {
      return this.multiChartSymbol?.[this.selectedTab]?.symbol
    },
    getTimeFrame() {
      return this.multiChartSymbol?.[this.selectedTab]?.timeFrame
    },
    symbol1: {
      get() {
        return this.getSymbolPart(this.getSelectedMultipleSymbols.symbol1)
      },
      set(value) {
        if (value === '' || undefined) {
          this.deleteSymbol('symbol1')
          // return "";
        }
        else {

          this.changeSymbol({ propName: 'symbol1', propValue: value })
        }
      },
    },
    /** @returns {String} */
    symbol2Market() {
      return this.getSymbolMarket(this.getSelectedMultipleSymbols.symbol2)
    },
    symbol3Market() {
      return this.getSymbolMarket(this.getSelectedMultipleSymbols.symbol3)
    },
    symbol4Market() {
      return this.getSymbolMarket(this.getSelectedMultipleSymbols.symbol4)
    },
    symbol2: {
      get() {
        return this.getSymbolPart(this.getSelectedMultipleSymbols.symbol2)
      },
      set(value) {
        if (value === '' || undefined) {
          this.deleteSymbol('symbol2')
        }
        this.changeSymbol({ propName: 'symbol2', propValue: value })
      },
    },
    /** @returns {String} */
    symbol3: {
      get() {
        return this.getSymbolPart(this.getSelectedMultipleSymbols.symbol3)
      },
      set(value) {
        if (value === '' || undefined) {
          this.deleteSymbol('symbol3')
        }
        this.changeSymbol({ propName: 'symbol3', propValue: value })
      },
    },
    /** @returns {String} */
    symbol4: {
      get() {
        return this.getSymbolPart(this.getSelectedMultipleSymbols.symbol4)
      },
      set(value) {
        if (value === '' || undefined) {
          this.deleteSymbol('symbol4')
        }
        this.changeSymbol({ propName: 'symbol4', propValue: value })
      },
    },
  },
}
</script>

<style></style>