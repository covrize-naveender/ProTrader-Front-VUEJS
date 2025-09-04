<template>
    <div v-if="selectedIndicator !== null">
        <div class="indicator-title">
            <h3 style="font-weight: 600;">{{ selectedIndicator?.fullDesc }}</h3>
        </div>
        <div class="p-grid">
            <div class="p-col-12 p-sm-12 p-md-7 p-lg-7 p-4">
                <div class="p-d-flex p-jc-between" id="indicator-settings">
                    <div v-if="isMultiIndicator">
                        <MultiValueIndicator :type="indicatortype" @updateProp="$emit('updateProp', indicatortype)" />
                    </div>
                    <div v-else-if="isPlusChartIndicator">
                        <PlusIndicator :type="indicatortype" @updateProp="$emit('updateProp', indicatortype)" />
                    </div>
                    <div v-else>
                        <SingleIndicator :type="indicatortype" @updateProp="$emit('updateProp', indicatortype)" />

                    </div>
                </div>
            </div>
            <div class="p-col-12 p-sm-12 p-md-5 p-lg-5 p-4">
                <!-- <div class="desc-block">
                    <span style="font-weight: 600;">{{ selectedIndicator?.desc }}</span>
                    <img src="../../../assets/indicator-desc.png"/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra arcu id enim finibus, vel auctor nisl aliquam. Mauris imperdiet ligula nibh, vel dignissim mauris suscipit non.</p>
                </div> -->
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MultiValueIndicator from './MultiValueIndicator.vue';
import SingleIndicator from './SingleIndicator.vue'
import PlusIndicator from './PlusIndicator.vue';
export default {
    name: 'IndicatorDeatilBox',
    props: {
        selectedIndicator: {
            type: Object,
            default: null
        }
    },
    components: {
        MultiValueIndicator,
        SingleIndicator,
        PlusIndicator
    },
    computed: {

        ...mapGetters([
            'getSingleIndicator',
            'getAdditionalIndicator'
        ]),
        indicatorSettings() {
            return {
                sma: 'Simple Moving Average',
                smaobv: 'Simple Moving Average of OBV',
                smavolume: 'Simple Moving Average of OBV of Volume',
                wma: 'Weighted Moving Average',
                xma: 'Exponential Moving Average',
                gxma: 'Guppy Multiple Moving Average'
            };
        },
        isMultiIndicator() {
            return Object.keys(this.indicatorSettings).includes(this.selectedIndicator?.storeRef)
        },
        isPlusChartIndicator() {
            return this.selectedIndicator?.tool_type == 'plusCharts'
        },
        indicatortype() {
            return this.selectedIndicator?.storeRef
        }
    }
}
</script>

<style lang="scss" scoped>
.indicator-title {
    padding: 1rem;
    width: 100%;
    border-bottom: 1px solid lightgray;
}
</style>