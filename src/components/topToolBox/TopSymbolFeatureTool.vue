<template>
    <div class="top-middle-divs">
        <symbol-search-box :isDisabled="isTrainingMode" @refreshInput="refreshInput" @nextSymbol="nextSymbol"
            @prevSymbol="prevSymbol" @selectSymbolModal="selectSymbolModal" @TextMatchSymbolBox="TextMatchSymbolBox"
            :show-close-button="false" v-model="selectedSymbol" />
        <div v-if="symbolSearchTextLength === 0 && symbolSearchText" style="
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          top: 40px;
          height: 40px;
          width: 100px;
          background-color: white;
          box-shadow: 0px 0px 15px 1px grey;
        ">
            No results
        </div>
        <SearchStockModal :visible.sync="symbolSearch" @closeModal="closeSearchStockModal"
            v-on:selectSymbolModalData="selectSymbolModalData" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import config from '../../config';
import { chartEvents } from '../../chartEvents';
import SymbolSearchBox from '../SymbolSearchBox.vue';
import SearchStockModal from '../Modals/SearchStockModal.vue'

export default {
    name: 'TopSymbolFeatureTool',
    components: {
        SymbolSearchBox,
        SearchStockModal
    },
    data() {
        return {
            training_room_link: config.TRANING_ROOM_LINK,
            selectedSymbol: '',
            symbolSearch: false,
            symbolSearchText: '',
            symbolSearchTextLength: null,
        }
    },
    methods: {
        ...mapActions([
            'setSymbolData',
            'incrementSymbolIndex',
            'decrementSymbolIndex'
        ]),
        closeSearchStockModal() {
            this.symbolSearch = false
        },
        selectSymbolModalData(val) {
            this.setSymbolData({ symbolName: val, timeFrame: localStorage.getItem("SET_TIME_FRAME") || "D", chartIndex: this.selectedTab }).then((d) => {
                chartEvents.$emit('setChartRange', undefined, 'Symbol Modal')
                chartEvents.$emit('symbolChangeVerifyScanDetails')
                chartEvents.$emit('loadDrawingData', false, this.selectedTab)
            })
        },
        refreshInput() {
            this.selectedSymbol = this.selectedSymbol + ''
        },
        prevSymbol() {
            this.decrementSymbolIndex()
            this.refreshInput()
        },
        nextSymbol() {
            this.incrementSymbolIndex()
            this.refreshInput()
        },
        selectSymbolModal() {
            this.symbolSearch = !this.symbolSearch
        },
        TextMatchSymbolBox(length, text) {
            this.symbolSearchTextLength = length
            this.symbolSearchText = TextEncoder
        },
    },
    computed: {
        ...mapGetters([
            'isTrainingMode',
            'multiChartSymbol',
            'selectedTab'
        ]),
        getSymbolName() {
            return this.multiChartSymbol[this.selectedTab]?.symbol
        },
        getTimeFrame() {
            return this.multiChartSymbol[this.selectedTab]?.timeFrame
        },
    },
    watch: {
        multiChartSymbol(newVal, oldVal) {
            this.selectedSymbol = newVal[this.selectedTab]?.symbol
        },
        selectedTab(newVal, oldVal) {
            this.selectedSymbol = this.multiChartSymbol[newVal]?.symbol
        },
        selectedSymbol(newValue) {
            if (newValue && this.selectedSymbol !== this.getSymbolName) {
                this.setSymbolData({ symbolName: newValue, timeFrame: this.getTimeFrame || "D", chartIndex: this.selectedTab }).then((d) => {
                    chartEvents.$emit('setChartRange', undefined, 'SearchSelectSymbol')
                    chartEvents.$emit('symbolChangeVerifyScanDetails')
                    chartEvents.$emit('loadDrawingData', false, this.selectedTab)
                    this.$store.commit('SET_SEARCH_BOX_UPDATE', false)
                })
            }
        }
    }

}
</script>

<style>
</style>
