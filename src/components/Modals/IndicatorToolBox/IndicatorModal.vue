<template>
    <p-dialog :visible.sync="visible" :closable="false" :modal="true" :class="['indicator-modal',
        $tours[tour_ref]?.currentStep > 0 ? 'pointerNone' : ''
    ]">
        <template #header>
            <div class="custom-header-container">
                <div class="custom-header-box-start">
                    <h2>ProTrader Indicators </h2>
                    <div class="custom-header-input-container">
                        <p-inputText placeholder="Search Indicators..." icon="" fluid v-model="filteredtext"
                            v-on:keyup="keyUpSearch" class="p-inputtext-lg" />
                    </div>
                </div>
                <div class="custom-header-box-end">
                    <p-button icon="pi pi-refresh" class="p-button-secondary p-button-outlined" @click="onReset"
                        v-tooltip.bottom="`Reset`" />
                    <p-button label="Confirm" @click="handleButtonClick(OnConfirm)" id="indicator-confirm" />
                    <p-button icon="pi pi-times" class="p-button-secondary p-button-outlined" @click="onClose(false)"
                        v-tooltip.bottom="`Cancel`" />
                </div>
            </div>

        </template>
        <div class="p-d-flex">
            <!-- Exchange List -->
            <div style="flex: 0.3;">
                <p-accordion :activeIndex="this.$tours[tour_ref]?.currentStep > 0 ? null : 0" id="indicator-steps"
                    :class="['indicator-accordian', isAllIndicatorActive ? 'active-step-indicator' : '']"
                    @tab-open="tabOpenCall">

                    <p-accordiontab :header="overlay?.title" v-for="(overlay, index) in filterOverlayList" :key="index"
                        id="trend-indicators">

                        <p-listbox v-model="selectedOverlay" :options="overlay.data" :multiple="true" optionLabel="desc"
                            @change="listChange">
                            <template #option="slotProps">
                                <div class="indicator-item">
                                    <p-checkbox :id="slotProps.option.chartId" name="overlay" :value="slotProps.option"
                                        v-model="selectedOverlay" @change="onChangeOverlay(slotProps.option)" />
                                    {{ slotProps.option.desc }}

                                </div>
                            </template>
                        </p-listbox>
                    </p-accordiontab>
                </p-accordion>
            </div>

            <div style="flex: 1;" class="content-indicator">
                <IndicatorDetailBox :selectedIndicator="latestSelectedOverlayObj" @updateProp="updateProp"
                    @propChange="propChange" />
            </div>
        </div>

    </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { handleButtonClick } from '../../../handleRestrictFeature';
import IndicatorDetailBox from './IndicatorDetailBox.vue';
import { tourRef } from '../../../utils/tourGuide';

export default {
    name: "IndicatorModal",
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    components: { IndicatorDetailBox },
    data() {
        return {
            tour_ref: tourRef.TOUR_REF,
            loading: false,
            selectedOverlay: null,
            latestSelectedOverlay: [],
            latestSelectedOverlayObj: null,
            activeTab: 0,
            overlayTitleList: {
                trendCharts: 'Trend',
                momentumCharts: 'Momentum',
                volumeCharts: 'Volume',
                volatilityCharts: 'Volatility',
                plusCharts: 'Other',
            },
            changesNotSaved: false,
            propUpdates: [],
            filteredtext: '',
            filterOverlayList: [],
            originMultiValue: null,
            originSingleIndicatorValue: null,
            originAdditionalIndicatorValue: null,
            isAllIndicatorActive: false
        }
    },
    computed: {
        ...mapGetters([
            'trendCharts',
            'momentumCharts',
            'volatilityCharts',
            'volumeCharts',
            'plusCharts',
            'allChartOverlays',
            'userChartlist',
            'userData',
            'chartToggleVolume',
            'userMultiSettings',
            'getSingleIndicator',
            'getAdditionalIndicator',
            'tourStep'
        ]),
        overlayList() {
            let allOverlayList = []
            Object.keys(this.overlayTitleList).map((key) => {
                allOverlayList.push({
                    title: this.overlayTitleList[key],
                    data: this[key].data
                })
            })

            return allOverlayList
        },
        isNextStep() {
            return this.$tours[tourRef.TOUR_REF]?.steps[this.tourStep]?.params.outsideNext
        },
        isAllIndicator() {
            return this.$tours[tourRef.TOUR_REF]?.steps[this.tourStep]?.params.isAllIndicator
        },


    },
    mounted() {

    },
    watch: {
        tourStep(newVal) {
            if (this.$tours[tourRef.TOUR_REF]?.steps[newVal]?.params?.isAllIndicator) {
                this.isAllIndicatorActive = true
                this.selectedOverlay = this.selectedOverlay.filter(x => (x.selected == true && x.name !== 'MACD'))
                this.latestSelectedOverlay = this.latestSelectedOverlay.filter(x => (x.selected == true && x.name !== 'MACD'))
                this.updateIndicatorSettings({
                    selectedOverlay: this.selectedOverlay,
                    indicatorSettingsChanged: this.changesNotSaved,
                    propUpdates: this.propUpdates,
                    originMultiValue: this.originMultiValue,
                    originSingleIndicatorValue: this.originSingleIndicatorValue,
                    originAdditionalIndicatorValue: this.originAdditionalIndicatorValue,
                })

                this.propUpdates = []
                this.changesNotSaved = false
            }
            else {
                this.isAllIndicatorActive = false
            }
        },
        allChartOverlays: {
            handler(newVal, o) {
                if (newVal) {
                    this.selectedOverlay = newVal.filter(x => x.selected == true)
                    this.latestSelectedOverlay = newVal.filter(x => x.selected == true)
                }
            },
            deep: true,
            immediate: true,
        },
        overlayList: {
            handler(newVal) {
                this.filterOverlayList = [...newVal];
            },
            immediate: true,
        },
        visible(newVal) {
            if (newVal) {
                this.originMultiValue = JSON.parse(JSON.stringify(this.userMultiSettings))
                this.originSingleIndicatorValue = JSON.parse(JSON.stringify(this.getSingleIndicator))
                this.originAdditionalIndicatorValue = JSON.parse(JSON.stringify(this.getAdditionalIndicator))

                if (this.isNextStep) {
                    this.tourNextStep(300)
                }
            }

        }

    },
    methods: {
        handleButtonClick,
        ...mapActions([
            'saveMultiChartSettings',
            'saveUserSettings',
            'updateIndicatorSettings',
            'setTourStep'
        ]),
        ...mapActions('action', [
            'setUndoAction'
        ]),
        onChangeOverlay(option) {
            const index = this.selectedOverlay.indexOf(option);
            if (index === -1) {
                this.selectedOverlay.push(option);
            } else {
                this.selectedOverlay.splice(index, 1);
            }
        },
        listChange(event) {
            if (this.$tours[tourRef.TOUR_REF]?.steps[this.tourStep]?.params?.macdSelection) {
                this.tourNextStep(300)
            }
            if (event.value?.length > this.latestSelectedOverlay?.length) {
                this.latestSelectedOverlayObj = event.value[event.value.length - 1]
            }
            else {
                this.latestSelectedOverlayObj = null
            }
            this.latestSelectedOverlay = event.value
        },
        async OnConfirm() {
            this.updateIndicatorSettings({
                selectedOverlay: this.selectedOverlay,
                indicatorSettingsChanged: this.changesNotSaved,
                propUpdates: this.propUpdates,
                originMultiValue: this.originMultiValue,
                originSingleIndicatorValue: this.originSingleIndicatorValue,
                originAdditionalIndicatorValue: this.originAdditionalIndicatorValue,
            })

            this.propUpdates = []
            this.changesNotSaved = false
            this.tourNextStep(100)
            this.onClose(true)
        },
        onReset() {
            this.filterOverlayList = this.overlayList
            this.filteredtext = ''
            this.selectedOverlay = this.allChartOverlays.filter(x => x.selected == true)
            this.latestSelectedOverlay = this.allChartOverlays.filter(x => x.selected == true)
            this.latestSelectedOverlayObj = null
        },
        updateProp(id) {

            if (!this.propUpdates.includes(id)) {
                this.changesNotSaved = true
                this.propUpdates.push(id)
            }
        },
        propChange() {
            this.changesNotSaved = true
        },
        onClose(isSave) {
            if (!isSave) {

                this.$store.commit('SET_INDICATOR_MULTI_SETTINGS', this.originMultiValue);
                this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', this.originSingleIndicatorValue);
                this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', this.originAdditionalIndicatorValue);
            }
            this.selectedOverlay = this.allChartOverlays.filter(x => x.selected == true)
            this.latestSelectedOverlayObj = null
            this.latestSelectedOverlay = this.allChartOverlays.filter(x => x.selected == true)
            this.propUpdates = []
            this.changesNotSaved = false
            this.$emit('toggleModal', false)
        },
        keyUpSearch(e) {
            const ignoredKeyCodes = [13, 35, 36, 37, 38, 39, 40, 16, 17]
            const { keyCode, target } = e
            const searchText = target.value.trim()
            if (ignoredKeyCodes.indexOf(keyCode) > -1) {
                return
            }
            if (searchText !== '') {

                let result = this.overlayList.map((item) => {
                    return {
                        ...item,
                        data: item.data.filter(x => x.desc.toLowerCase().includes(searchText.toLowerCase()))
                    }
                }).filter(x => x.data.length > 0)
                this.filterOverlayList = result
            }
            else {
                this.filterOverlayList = this.overlayList
            }

        },
        tourNextStep(time = 300) {
            if (this.$tours[tourRef.TOUR_REF].currentStep > 0) {

                setTimeout(() => {
                    this.setTourStep(this.$tours[tourRef.TOUR_REF].currentStep + 1)
                    this.$tours[tourRef.TOUR_REF].nextStep();
                }, time);
            }
        },
        tabOpenCall() {
            if (this.isNextStep) {
                this.tourNextStep(500)
            }
        },
    }

};
</script>

<style scoped>
/* Add custom styles if needed */
</style>