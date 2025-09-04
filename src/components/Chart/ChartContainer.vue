<template>
    <div :class="{
        'chart-container-tab': chartLayout === '4tab',
        'chart-container': true,
        'selected-tab': (selectedTab === chartIndex && chartLayout != '1tab' && !isFullScreen),
        'chart-tab': selectedTab !== chartIndex
    }" @click="!isTrainingMode && selectTab(chartIndex)">
        <Loader v-if="showLoader" :showLoader="showLoader" />
        <Chart v-if="showChart" :chartIndex="chartIndex" :chartHeightTemp="chartHeightTemp"
            :chartWidthTemp="chartWidthTemp" :chartSymbolTitle="chartSymbolTitle" :chartOHLCV="chartOHLCV"></chart>
    </div>
</template>

<script>

import Chart from './Chart.vue';
import Loader from 'BaseComponents/Loader'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'ChartContainer',
    components: {
        Chart,
        Loader
    },
    data() {
        return {
            chartHeight: 0,
            chartWidth: 0,
            chartSymbolTitle: '',
            chartOHLCV: []
        };
    },
    props: {
        chartHeightTemp: {
            type: Number,
            required: true
        },
        chartWidthTemp: {
            type: Number,
            required: true
        },
        chartIndex: {
            type: Number,
            required: true
        },
        chartLayout: {
            type: String,
            required: true
        },

    },
    computed: {
        ...mapGetters([
            'getSymbolsList',
            'selectedTab',
            'multiChartSymbol',
            'multiOhlcv',
            'isTrainingMode',
            'isFullScreen',
            'multiTv'
        ]),
        showChart() {
            return this.getSymbolsList.length > 0
        },
        showLoader() {
            let showLoad = !this.showChart || this.isChartLoading
            if (!showLoad) {
            }
            return showLoad
        },

    },
    methods: {
        selectTab(tabIndex) {
            if (this.selectedTab !== tabIndex) {
                this.$store.commit('SET_SELECTED_TAB', tabIndex)
            }
        },
    },
    watch: {
        multiChartSymbol(n, o) {
            this.chartSymbolTitle = n[this.chartIndex] ? n[this.chartIndex].symbol : ''
        },
        multiOhlcv(newVal, oldVal) {
            this.chartOHLCV = newVal[this.chartIndex]
        }
    },
}
</script>

<style>
</style>