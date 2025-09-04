<template>
    <!-- <div v-if="isFullScreen && getLayout !== '3tab_2' && getLayout !== '3tab_3'" class="left-container full"
        id="left-container" ref="chartContainerLayRef">
        <ChartContainer :chartIndex="fullScreenIndex" :chartHeightTemp="chartHeight - (decreaseHeight + bottomboxsize)"
            :chartWidthTemp="chartWidth" :chartLayout="'1tab'" />
        <ChartBottomBox />
    </div> -->
    <div v-if="getLayout == '1tab' && !isFullScreen" class="left-container" id="left-container"
        ref="chartContainerLayRef">
        <ChartContainer :chartIndex="0" :chartHeightTemp="chartHeight - (decreaseHeight + bottomboxsize)"
            :chartWidthTemp="chartWidth" :chartLayout="'1tab'" />
        <ChartBottomBox />
    </div>
    <div v-else-if="getLayout == '2tab_1' && !isFullScreen" class="left-container" id="left-container"
        ref="chartContainerLayRef">
        <ChartContainer :chartIndex="0" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
            :chartWidthTemp="chartWidth - 2" :chartLayout="'2tab_1'" />
        <ChartContainer :chartIndex="1" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
            :chartWidthTemp="chartWidth - 2" :chartLayout="'2tab_1'" />
        <ChartBottomBox />
    </div>
    <div v-else-if="getLayout == '2tab_2' && !isFullScreen" class="left-container" id="left-container"
        ref="chartContainerLayRef">
        <div class="chart-custom-row">
            <ChartContainer :chartIndex="0" :chartHeightTemp="(chartHeight - (decreaseHeight + bottomboxsize))"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'2tab_2'" />
            <ChartContainer :chartIndex="1" :chartHeightTemp="(chartHeight - (decreaseHeight + bottomboxsize))"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'2tab_2'" />
        </div>
        <ChartBottomBox />


    </div>
    <div v-else-if="getLayout == '3tab_1' && !isFullScreen" class="left-container" id="left-container"
        ref="chartContainerLayRef">
        <ChartContainer :chartIndex="0" :chartHeightTemp="((chartHeight - (decreaseHeight * 3 + bottomboxsize)) / 3)"
            :chartWidthTemp="chartWidth - 2" :chartLayout="'3tab_1'" />
        <ChartContainer :chartIndex="1" :chartHeightTemp="((chartHeight - (decreaseHeight * 3 + bottomboxsize)) / 3)"
            :chartWidthTemp="chartWidth - 2" :chartLayout="'3tab_1'" />
        <ChartContainer :chartIndex="2" :chartHeightTemp="((chartHeight - (decreaseHeight * 3 + bottomboxsize)) / 3)"
            :chartWidthTemp="chartWidth - 2" :chartLayout="'3tab_1'" />
        <ChartBottomBox />


    </div>
    <div v-else-if="getLayout == '3tab_2' && !isFullScreen" class="left-container" id="left-container"
        ref="chartContainerLayRef">

        <div class="chart-custom-tab">
            <ChartContainer :chartIndex="0" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'3tab_2'" />
            <ChartContainer :chartIndex="1" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'3tab_2'" />
        </div>
        <div class="chart-custom-tab">

            <ChartContainer :chartIndex="2" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
                :chartWidthTemp="chartWidth - 4" :chartLayout="'3tab_2'" />
        </div>
        <ChartBottomBox />



    </div>
    <div v-else-if="getLayout == '3tab_3' && !isFullScreen" class="left-container " id="left-container"
        ref="chartContainerLayRef">
        <div class="chart-custom-tab">
            <ChartContainer class="asasa" :chartIndex="0"
                :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
                :chartWidthTemp="chartWidth - 4" :chartLayout="'3tab_3'" />
        </div>
        <div class="chart-custom-tab">
            <ChartContainer :chartIndex="1" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'3tab_3'" />
            <ChartContainer :chartIndex="2" :chartHeightTemp="(chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'3tab_3'" />
        </div>
        <ChartBottomBox />


    </div>
    <div v-else-if="getLayout == '4tab' && !isFullScreen" class="left-container" id="left-container"
        ref="chartContainerLayRef">
        <div class="chart-custom-tab">

            <ChartContainer :chartIndex="0"
                :chartHeightTemp="((chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2)"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'4tab'" />
            <ChartContainer :chartIndex="1"
                :chartHeightTemp="((chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2)"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'4tab'" />
        </div>
        <div class="chart-custom-tab">

            <ChartContainer :chartIndex="2"
                :chartHeightTemp="((chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2)"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'4tab'" />
            <ChartContainer :chartIndex="3"
                :chartHeightTemp="((chartHeight - (decreaseHeight * 2 + bottomboxsize)) / 2)"
                :chartWidthTemp="(chartWidth / 2) - 2" :chartLayout="'4tab'" />
        </div>
        <ChartBottomBox />


    </div>
    <div v-else class="left-container" id="left-container" ref="chartContainerLayRef">
        <ChartContainer :chartIndex="fullScreenIndex" :chartHeightTemp="chartHeight- (decreaseHeight + bottomboxsize)" :chartWidthTemp="chartWidth" />
        <ChartBottomBox />
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import ChartBottomBox from './ChartBottomBox.vue';
import ChartContainer from './ChartContainer.vue';
export default {
    name: 'LayoutChart',
    components: {
        ChartContainer,
        ChartBottomBox
    },
    data() {
        return {
            chartHeight: 0,
            chartWidth: 0,
            decreaseHeight: 35,
            bottomboxsize: 25
        };
    },
    computed: {
        ...mapGetters([
            'themePrimaryColor',
            'getLayout',
            'getTabCount',
            'fullScreenIndex',
            'isFullScreen'
        ]),
        chartContainerRef() {
            return this.$refs.chartContainerLayRef
        },
    },
    methods: {
        updateChartDimensions() {
            if (this.chartContainerRef) {
                this.chartHeight = this.chartContainerRef.clientHeight;
                this.chartWidth = this.chartContainerRef.clientWidth;
            }
        },
    },
    watch: {
        getLayout() {
            this.$store.commit('SET_CHART_LOADING_STATUS', true)
            setTimeout(() => {
                this.$store.commit('SET_CHART_LOADING_STATUS', false)
            }, 5000);
        },
        getTabCount(newVal, oldVal) {
            if (oldVal > newVal) {
                this.$store.commit('SET_SELECTED_TAB', newVal - 1)
            }
        }

    },
    mounted() {
        this.updateChartDimensions();
        window.addEventListener('resize', this.updateChartDimensions);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateChartDimensions);
    },

}
</script>

<style>
</style>