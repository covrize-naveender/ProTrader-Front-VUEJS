<template>
    <div>
        <v-tour name="appTour" :steps="steps" :ref="lib_ref">
            <template slot-scope="tour">
                <transition name="fade">
                    <v-step v-if="tour.steps[tour.currentStep]" :key="tour.currentStep"
                        :step="tour.steps[tour.currentStep]" :previous-step="tour.previousStep"
                        :next-step="tour.nextStep" :stop="tour.stop" :skip="tour.skip" :is-first="tour.isFirst"
                        :is-last="tour.isLast" :labels="tour.labels" :style="scanLoading ? 'display: none;' : ''">

                        <template>
                            <div slot="actions" v-if="tour.isLast">
                                <p-button class="p-button-tour" @click="finishTour" label="Finish" />
                            </div>
                            <div slot="actions" class="p-d-flex p-jc-center" v-else>
                                <p-button class="p-button-tour-skip p-mr-2 p-ml-2" @click="skipTour" label="Skip" />
                                <p-button v-if="tour.steps[tour.currentStep].params.isNext"
                                    class="p-button-tour p-mr-2 p-ml-2" @click="nextStep" label="Next" />
                            </div>
                        </template>

                    </v-step>
                </transition>
            </template>
        </v-tour>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { activityAccordion, dynamicSteps, stepContent, tourConst, tourRef } from '../utils/tourGuide';

export default {
    data() {
        return {
            lib_ref: tourRef.TOUR_REF,
            steps: [
                {
                    target: "#step1",
                    content: stepContent.WELCOME,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.BOTTOM,
                        highlight: false,
                    },
                },
                {
                    target: "#step2",
                    content: stepContent.DRAWING_TOOLS,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.RIGHT,
                        highlight: true,
                    },
                },
                {
                    target: "#step3",
                    content: stepContent.CHART_TIME,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.RIGHT,
                        highlight: true,
                    },
                },
                {
                    target: "#right-container",
                    content: stepContent.CHART_RIGHT_DATA,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true,
                        isAddDynamic: true,
                        dynamicId: dynamicSteps.SCAN_STEP,
                        nextId: 'step4',
                        nextMin: [{
                            target: "#stepNew",
                            content: stepContent.DROPDOWN_SELECT,
                            params: {
                                dynamicStep: dynamicSteps.SCAN_STEP,
                                outsideNext: true,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: false,
                                placement: tourConst.BOTTOM,
                                highlight: true,
                            },
                        },
                        {
                            target: ".drp-scan",
                            content: stepContent.SCAN_SELECTION,
                            params: {
                                dynamicStep: dynamicSteps.SCAN_STEP,
                                outsideNext: true,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: false,
                                placement: tourConst.BOTTOM,
                                highlight: true,
                            },
                        }],
                        nextFull: [{
                            target: "#step4",
                            content: stepContent.SCAN_SELECTION,
                            params: {
                                dynamicStep: dynamicSteps.SCAN_STEP,
                                outsideNext: true,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: false,
                                placement: tourConst.BOTTOM,
                                highlight: true,
                            },
                        }]
                    },
                },
                {
                    target: "#guru-tool",
                    content: stepContent.SCAN_GURU,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.EMPTY_TAB,
                        isNext: true,
                        placement: tourConst.RIGHT,
                        highlight: true,
                        scanSelectComplete: true
                    },
                },
                {
                    target: "#scan-tool",
                    content: stepContent.SCAN_STANDARD,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.EMPTY_TAB,
                        isNext: false,
                        placement: tourConst.RIGHT,
                        highlight: true
                    },
                },
                {
                    target: '[aria-label="Activity"]',
                    content: stepContent.SCAN_ACTIVITY,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.EMPTY_TAB,
                        isNext: false,
                        placement: tourConst.RIGHT,
                        highlight: true,
                    },
                },
                {
                    target: "#activity-scan",
                    content: stepContent.SCAN_ACTIVITY_MENU,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.EMPTY_TAB,
                        isNext: false,
                        placement: tourConst.LEFT,
                        highlight: true,
                    },
                },
                {
                    target: "#activity-setting",
                    content: stepContent.SCAN_ACTIVITY_SETTING,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#top-value",
                    content: stepContent.SCAN_ACTIVITY_TOP_VALUE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.BOTTOM,
                        highlight: true
                    },
                },
                {
                    target: "#top-option",
                    content: stepContent.SCAN_ACTIVITY_VOLUME,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.BOTTOM,
                        highlight: true
                    },
                },
                {
                    target: "#activity-filter-scan",
                    content: stepContent.SCAN_ACTIVITY_FILTER,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: false,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#price-range",
                    content: stepContent.SCAN_ACTIVITY_PRICE_RANGE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.TWO_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#ignore-results",
                    content: stepContent.SCAN_ACTIVITY_IGNORE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.TWO_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#only-show-results",
                    content: stepContent.SCAN_ACTIVITY_ONLY_RES,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.TWO_TAB,
                        isTimeOut: true,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#activity-type-scan",
                    content: stepContent.SCAN_ACTIVITY_SCANTYPE,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.TWO_TAB,
                        isNext: false,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: `[aria-label="Daily"]`,
                    content: stepContent.SCAN_ACTIVITY_SCANTYPE_TIME,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.THREE_TAB,
                        isNext: true,
                        placement: tourConst.TOP,
                        highlight: true
                    },
                },
                {
                    target: "#scan-exchange",
                    content: stepContent.SCAN_ACTIVITY_SCANTYPE_EXCHANGE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.THREE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#scan-industry",
                    content: stepContent.SCAN_ACTIVITY_SCANTYPE_INDUSTRY,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.THREE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#scan-btn",
                    content: stepContent.SCAN_ACTIVITY_SCANBTN,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.THREE_TAB,
                        isNext: false,
                        placement: tourConst.BOTTOM,
                        highlight: true
                    },
                },
                {
                    target: "#scan-result",
                    content: stepContent.SCAN_RES,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#auto-play-scan",
                    content: stepContent.SCAN_RES_AUTOPLAY,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.TOP,
                        highlight: true
                    },
                },
                {
                    target: "#watchlist-create",
                    content: stepContent.SCAN_RES_WATCHLIST_CREATE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.TOP,
                        highlight: true
                    },
                },
                {
                    target: "#watchlist",
                    content: stepContent.WATCHLIST,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#watchlist",
                    content: stepContent.WATCHLIST_1,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: false,
                        isAddDynamic: true,
                        dynamicId: dynamicSteps.TRADING_STEP,
                        nextId: 'trading-room',
                        nextMin: [{
                            target: "#trading-room-small",
                            content: stepContent.TRADING_ROOM,
                            params: {
                                dynamicStep: dynamicSteps.TRADING_STEP,
                                outsideNext: false,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: true,
                                placement: tourConst.BOTTOM,
                                highlight: true,
                            },
                        }],
                        nextFull: [{
                            target: "#trading-room",
                            content: stepContent.TRADING_ROOM,
                            params: {
                                dynamicStep: dynamicSteps.TRADING_STEP,
                                outsideNext: false,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: true,
                                placement: tourConst.BOTTOM,
                                highlight: true,
                            },
                        }]
                    },
                },

                {
                    target: "#chartType-btn",
                    content: stepContent.CHART_TYPE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true
                    },
                },
                {
                    target: "#split-btn",
                    content: stepContent.CHART_SPLIT,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true,
                        isAddDynamic: true,
                        dynamicId: dynamicSteps.INDICATOR_STEP,
                        nextId: 'ind-btn',
                        nextMin: [{
                            target: "#stepNew",
                            content: stepContent.DROPDOWN_SELECT,
                            params: {
                                dynamicStep: dynamicSteps.INDICATOR_STEP,
                                outsideNext: true,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: false,
                                placement: tourConst.BOTTOM,
                                highlight: true,
                            },
                        },
                        {
                            target: ".drp-indicator",
                            content: stepContent.INDICATOR_SELECTION,
                            params: {
                                outsideNext: true,
                                dynamicStep: dynamicSteps.INDICATOR_STEP,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: false,
                                placement: tourConst.BOTTOM,
                                highlight: true
                            },
                        }],
                        nextFull: [{
                            target: "#ind-btn",
                            content: stepContent.INDICATOR_SELECTION,
                            params: {
                                outsideNext: true,
                                dynamicStep: dynamicSteps.INDICATOR_STEP,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: false,
                                placement: tourConst.BOTTOM,
                                highlight: true
                            },
                        }]
                    },
                },

                {
                    target: "#indicator-steps",
                    content: stepContent.INDICATOR_INFO,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.RIGHT,
                        highlight: true,
                        isAllIndicator: true,
                        scanSelectComplete: true
                    },
                },
                {
                    target: "#trend-indicators",
                    content: stepContent.INDICATOR_TREND,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: false,
                        placement: tourConst.RIGHT,
                        highlight: true
                    },
                },
                {
                    target: `[aria-label="MACD"]`,
                    content: stepContent.INDICATOR_MACD,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: false,
                        placement: tourConst.RIGHT,
                        highlight: true,
                        macdSelection: true
                    },
                },
                {
                    target: '#indicator-settings',
                    content: stepContent.INDICATOR_MACD_SETTINGS,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.TOP,
                        highlight: true,
                    },
                },
                {
                    target: '#indicator-confirm',
                    content: stepContent.INDICATOR_CONFIRM,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: false,
                        placement: tourConst.BOTTOM,
                        highlight: true,
                    },
                },
                {
                    target: '#symbol-search',
                    content: stepContent.SYMBOL_SEARCH,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true,
                        isAddDynamic: true,
                        dynamicId: dynamicSteps.EXCHANGE_STEP,
                        nextId: 'exchange-btn-grp',
                        nextMin: [{
                            target: '#exchange-btn-small',
                            content: stepContent.SYMBOL_SEARCH_EXCHANGE,
                            params: {
                                dynamicStep: dynamicSteps.EXCHANGE_STEP,
                                outsideNext: false,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: true,
                                placement: tourConst.LEFT,
                                highlight: true,
                            },
                        }],
                        nextFull: [{
                            target: '#exchange-btn',
                            content: stepContent.SYMBOL_SEARCH_EXCHANGE,
                            params: {
                                dynamicStep: dynamicSteps.EXCHANGE_STEP,
                                outsideNext: false,
                                accordianSetting: activityAccordion.ONE_TAB,
                                isNext: true,
                                placement: tourConst.LEFT,
                                highlight: true,
                            },
                        }]
                    },
                },

                {
                    target: '#user-menu',
                    content: stepContent.USER_MENU,
                    params: {
                        outsideNext: true,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: false,
                        placement: tourConst.LEFT,
                        highlight: true,
                    },
                },
                {
                    target: '.user-menu-settings',
                    content: stepContent.USER_MENU_SETTINGS,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true,
                    },
                },
                {
                    target: '.user-menu-friday',
                    content: stepContent.USER_MENU_FRIDAY,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true,
                    },
                },
                {
                    target: '.user-menu-support',
                    content: stepContent.USER_MENU_SUPPORT,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.LEFT,
                        highlight: true,
                    },
                },
                {
                    target: "#trading-room",
                    content: stepContent.TOUR_COMPLETE,
                    params: {
                        outsideNext: false,
                        accordianSetting: activityAccordion.ONE_TAB,
                        isNext: true,
                        placement: tourConst.BOTTOM,
                        highlight: false,
                        userMenuComplete: true
                    },
                },

            ],

        };
    },
    watch: {
        appTour(newVal) {
            if (newVal == false) {
                this.tourFunction()
            }
        },
        subscriptionStatus(newVal) {
            if (newVal == 'active' || newVal == 'trialing') {
                this.tourFunction()
            }
        }
    },
    mounted() {
    },
    computed: {
        ...mapGetters(['appTour', 'isChartLoading', 'scanLoading']),
        ...mapGetters('user', ['subscriptionStatus'])
    },
    methods: {
        ...mapActions(['setAppTour', 'setTourStep']),
        tourFunction() {
            if (this.appTour == false && (this.subscriptionStatus == 'active' || this.subscriptionStatus == 'trialing')) {
                this.startStep()
            }
        },
        startStep() {
            if (this.$tours[tourRef.TOUR_REF]) {
                this.setTourStep(0)
                this.$tours[tourRef.TOUR_REF].start();
            }
        },
        nextStep() {
            let currentStep = this.$tours[tourRef.TOUR_REF].currentStep
            let params = this.$tours[tourRef.TOUR_REF].steps[currentStep]?.params
            if (params?.isAddDynamic && params?.nextId && params?.nextMin && params?.nextFull && params.dynamicId) {
                this.steps = this.steps.filter(step =>
                    step.params.dynamicStep !== params.dynamicId
                );
                getComputedStyle(document.getElementById(params.nextId)).display === "none" ? this.steps.splice(currentStep + 1, 0, ...params.nextMin) : this.steps.splice(currentStep + 1, 0, ...params.nextFull);
            }

            this.setTourStep(currentStep + 1)
            let isTimeoutStep = this.$tours[tourRef.TOUR_REF].steps[currentStep]?.params?.isTimeOut
            if (isTimeoutStep) {

                setTimeout(() => {
                    this.$tours[tourRef.TOUR_REF].nextStep();

                }, 300);
            }
            else {

                this.$tours[tourRef.TOUR_REF].nextStep();
            }
        },
        finishTour() {
            this.setAppTour(true)
            this.setTourStep(-1)
            this.$tours[tourRef.TOUR_REF].stop();
        },
        skipTour() {
            this.setAppTour(true)
            this.setTourStep(-1)
            this.$tours[tourRef.TOUR_REF].skip();
        }
    }
};
</script>
<style>
.v-tour--active .p-dropdown-panel,
.v-tour--active .tour-active-menu,
.v-tour--active .p-overlaypanel {
    pointer-events: auto !important;
}
</style>