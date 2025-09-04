<template>
    <p-toolbar class="top-toolbar">
        <template #start>
            <img :src="themeDarkMode ? '/images/Protrader Logo.svg' : '/images/Protrader Logo.svg'" alt="ProTrader"
                class="logo" width="150" id="step1"/>
            <TopToolLeft class="top-tool-left"/>
        </template>

        <template #end>
            <AuthButton />
            <TopSymbolFeatureTool class="symbol-feature-group" />
            <ChartFeaturesGroup class="chart-right-features" :style="screenWidth > 700 ? { width: (rightContainerwidth) + 'px' } : {}"/>
            <RestrictFeatureModal :visible.sync="isRestrictModal" />
            <IntervalDisableModal :visible.sync="isIntervalModal" />
            <SubscriptionExpireModal :visible.sync="isSubExpireModal" />
            <ChartPropModal :visible.sync="mainChartProps" />
        </template>


    </p-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
import IntervalDisableModal from '../Modals/Auth/IntervalDisableModal.vue'
import RestrictFeatureModal from '../Modals/Auth/RestrictFeatureModal.vue'
import SubscriptionExpireModal from '../Modals/Auth/SubscriptionExpireModal.vue'
import ChartPropModal from '../Modals/ChartPropModal.vue'
import ChartFeaturesGroup from './ChartFeaturesGroup.vue'
import TopSymbolFeatureTool from './TopSymbolFeatureTool.vue'
import TopToolLeft from './TopToolLeft.vue'
import AuthButton from './AuthButton.vue'

export default {
    name: 'TopToolBox',
    data() {
        return {
            screenWidth: window.innerWidth
        }
    },
    components: {
        TopToolLeft,
        TopSymbolFeatureTool,
        ChartFeaturesGroup,
        RestrictFeatureModal,
        IntervalDisableModal,
        SubscriptionExpireModal,
        ChartPropModal,
        AuthButton
    },
    computed: {
        ...mapGetters([
            'themeDarkMode',
            'isRestrictModal',
            'isIntervalModal',
            'isSubExpireModal',
            'mainChartProps',
            'rightContainerwidth'
        ])
    },
    mounted() {
        window.addEventListener('resize', this.updateScreenWidth);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateScreenWidth);
    },
    methods: {
        updateScreenWidth() {
            this.screenWidth = window.innerWidth;
        }
    }
}
</script>

<style lang="scss" scoped>
.p-toolbar.top-toolbar {
    border: none !important;
    background-color: transparent !important;
}
</style>