<template>
    <p-dialog :visible.sync="visible" :closable="false" @hide="onClose()" :modal="true" :class="['scan-modal',
        $tours[tour_ref]?.currentStep > 0 ? 'pointerNone' : ''
    ]" id="data-setting">
        <template #header>
            <div class="custom-header-container">
                <div class="custom-header-box-start">
                    <h2>ProTrader Scans</h2>
                </div>

                <div class="custom-header-box-end">
                    <p-button icon="pi pi-refresh" class="p-button-secondary p-button-outlined" @click="callReset"
                        :disabled="!selectedTool" v-tooltip.bottom="`Reset`" id="guru-tool1" />

                    <p-button label="Save" icon="pi pi-save" class="p-button-secondary p-button-outlined"
                        @click="handleButtonClick(ShowPopup)" :disabled="!selectedTool || selectedTool?.isSaved || isLoading" />
                    <p-button label="Scan" :disabled="!isButtonEnable" @click="handleButtonClick(callScan)"
                        v-if="!isLoading" id="scan-btn" />
                    <p-button label="Stop" :disabled="(!isButtonEnable || ($tours[tour_ref]?.currentStep > 0  && isLoading))" @click="callStop" v-else />
                    <p-button icon="pi pi-times" class="p-button-secondary p-button-outlined" @click="onClose()"
                        v-tooltip.bottom="`Cancel`" />
                </div>
            </div>

        </template>
        <LoaderPanel :loading="isLoading">
            <FavouriteScanModal :visible.sync="scanPopup" @saveScanSettings="callSaveFavScan" />

            <div class="p-d-flex">
                <div style="flex: 0.6;" class="scan_leftMenuStyle">
                    <p-accordion :activeIndex="activeTabIndex" class="scan-accordian" @tab-open="tabOpenCall">

                        <p-accordiontab v-for="(toolbox, index) in allList" :key="index" :id="toolbox?.id">
                            <template #header>
                                <div style="width: 100%;">

                                    <i class="pi pi-save" v-if="toolbox.isFav"></i>
                                    <span>{{ toolbox.label }}</span>
                                </div>
                            </template>
                            <p-listbox v-model="selectedTool" :options="toolbox.item" optionLabel="label"
                                @change="toolboxChange">
                                <template #option="slotProps" :id="slotProps.option.label">
                                    <div v-if="slotProps.option.isSaved" class="p-d-flex p-jc-between p-ai-center">
                                        {{ slotProps.option.favScanDeatils.scanName }}
                                        <i class="pi pi-times saved-closed"
                                            style="cursor: pointer; font-size: x-small;"></i>
                                    </div>
                                    <div :id="slotProps.option.label" v-else>
                                        {{ slotProps.option.label }}
                                    </div>
                                </template>
                            </p-listbox>
                        </p-accordiontab>
                    </p-accordion>
                </div>
                <div style="flex: 2.1;" class="scan_contentBodyStyle" ref="scan_content">
                    <div v-if="selectedTool" id="scan-contain">

                        <p-accordion v-if="selectedTool.isEvent && selectedTool.isFilter" :activeIndex="[0]"
                            :multiple="true" class="scan-content-accordian">

                            <p-accordiontab
                                :header="selectedTool?.favScanDeatils ? `Saved Scans /${selectedTool?.favScanDeatils.scanName}` : selectedTool.contentTitle">

                                <div>
                                    <DescriptionBox :title="selectedTool.contentTitle"
                                        v-if="selectedTool.descriptionBox" :imagePath="selectedTool.image"
                                        :description="selectedTool.description" />
                                    <component style="flex-grow: 1;" :is="getComponentForSelectedTool"
                                        v-if="selectedTool.value" @valid="handleValid" @loading="handleLoading"
                                        :id="selectedTool.value" :type="selectedTool.type" ref="toolRef"
                                        :isFavScan="selectedTool.isSaved"
                                        :favScanId="selectedTool?.favScanDeatils?.id" />
                                    <div style="clear: right;"></div>

                                </div>
                            </p-accordiontab>

                            <p-accordiontab header="Events">
                                <EventFilter :id="selectedTool.value" @valid="handleEventValid"
                                    :isFavScan="selectedTool.isSaved" :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                            <p-accordiontab header="Filters">
                                <FilterSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                            <p-accordiontab header="Scan type">
                                <DataSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                        </p-accordion>

                        <p-accordion v-else-if="!selectedTool.isEvent && !selectedTool.isFilter" :activeIndex="[0]"
                            :multiple="true" class="scan-content-accordian">

                            <p-accordiontab
                                :header="selectedTool?.favScanDeatils ? `Saved Scans /${selectedTool?.favScanDeatils.scanName}` : selectedTool.contentTitle">
                                <DescriptionBox :title="selectedTool.contentTitle" v-if="selectedTool.descriptionBox"
                                    :imagePath="selectedTool.image" :description="selectedTool.description" />
                                <component style="flex-grow: 1;" :is="getComponentForSelectedTool"
                                    v-if="selectedTool.value" @valid="handleValid" @loading="handleLoading"
                                    :id="selectedTool.value" :type="selectedTool.type" ref="toolRef"
                                    :isFavScan="selectedTool.isSaved" :favScanId="selectedTool?.favScanDeatils?.id" />
                                <div style="clear: right;"></div>


                            </p-accordiontab>

                            <p-accordiontab header="Scan type">
                                <DataSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                        </p-accordion>

                        <p-accordion v-else-if="!selectedTool.isContent" :activeIndex="[0]" :multiple="true"
                            class="scan-content-accordian">
                            <p-accordiontab header="Filters">
                                <component style="flex-grow: 1;" :is="getComponentForSelectedTool"
                                    v-if="selectedTool.value" @valid="handleValid" @loading="handleLoading"
                                    :id="selectedTool.value" :type="selectedTool.type" ref="toolRef"
                                    :isFavScan="selectedTool.isSaved" :favScanId="selectedTool?.favScanDeatils?.id" />
                                <DescriptionBox :title="selectedTool.contentTitle" v-if="selectedTool.descriptionBox"
                                    :imagePath="selectedTool.image" :description="selectedTool.description" />
                                <FilterSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                                <div style="clear: right;"></div>

                            </p-accordiontab>

                            <p-accordiontab header="Scan type">
                                <DataSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                        </p-accordion>
                        <p-accordion :activeIndex="($tours[tour_ref]?.currentStep > 0) ? accordianSetting : [0]"
                            :multiple="true" class="scan-content-accordian" id="scan-content-accordian" v-else
                            @tab-open="tabOpenCall">
                            <p-accordiontab
                                :header="selectedTool?.favScanDeatils ? `Saved Scans / ${selectedTool?.favScanDeatils.scanName}` : selectedTool.contentTitle"
                                :id="`${selectedTool.value}-scan`">

                                <DescriptionBox :title="selectedTool.contentTitle" v-if="selectedTool.descriptionBox"
                                    :imagePath="selectedTool.image" :description="selectedTool.description" />
                                <component style="flex-grow: 1;" :is="getComponentForSelectedTool"
                                    v-if="selectedTool.value" @valid="handleValid" @loading="handleLoading"
                                    :id="selectedTool.value" :type="selectedTool.type" ref="toolRef"
                                    :isFavScan="selectedTool.isSaved" :favScanId="selectedTool?.favScanDeatils?.id" />
                                <div style="clear: right;"></div>

                            </p-accordiontab>

                            <p-accordiontab header="Events" v-if="selectedTool.isEvent"
                                :id="`${selectedTool.value}-event-scan`">
                                <EventFilter :id="selectedTool.value" @valid="handleEventValid"
                                    :isFavScan="selectedTool.isSaved" :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                            <p-accordiontab header="Filters" v-else :id="`${selectedTool.value}-filter-scan`">
                                <FilterSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                            <p-accordiontab header="Scan type" :id="`${selectedTool.value}-type-scan`">
                                <DataSettings :id="selectedTool.value" :type="selectedTool.type"
                                    :favScanId="selectedTool?.favScanDeatils?.id" />
                            </p-accordiontab>

                        </p-accordion>
                    </div>
                </div>
            </div>
        </LoaderPanel>
        <DeleteSavedScan :deleteFavScanItem="deleteFavScanItem" :visible.sync="showDeleteDialog"
            @SureDeleteFavScanItem="SureDeleteFavScanItem" @HideDeletePopup="HideDeletePopup" />


    </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { allToolbox } from '../../../utils/allToolbox';
import DataSettings from './DataSettings.vue';
import EventFilter from './EventFilter.vue';
import FilterSettings from './FilterSettings.vue';

import Activity from './Scanner/Activity.vue';
import Candle from './Scanner/Candle.vue';
import DarvasBoxes from './Scanner/DarvasBoxes.vue';
import Fundementals from './Scanner/Fundementals.vue';
import Indicator from './Scanner/Indicator.vue';
import Patterns from './Scanner/Patterns.vue';

import { handleButtonClick } from '../../../handleRestrictFeature';
import LoaderPanel from '../../Loader/LoaderPanel.vue';
import FavouriteScanModal from './FavouriteScanModal.vue';
import BigCandle from './Guru/BigCandle.vue';
import BollingerSqueeze from './Guru/BollingerSqueeze.vue';
import Capitulation from './Guru/Capitulation.vue';
import DivergenceScan from './Guru/DivergenceScan.vue';
import FranksPattern from './Guru/FranksPattern.vue';
import HeikenAshi from './Guru/HeikenAshi.vue';
import HigherHighHigherLow from './Guru/HigherHighHigherLow.vue';
import PocketPivot from './Guru/PocketPivot.vue';
import SamsPattern from './Guru/SamsPattern.vue';
import DeleteSavedScan from '../SavedScan/DeleteSavedScan.vue';
import DescriptionBox from '../DescriptionBox.vue';
import { activityAccordion, tourRef } from '../../../utils/tourGuide';



export default {
    name: 'ScanModal',
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        DataSettings,
        FilterSettings,
        EventFilter,
        LoaderPanel,
        FavouriteScanModal,

        Patterns,
        Activity,
        Candle,
        Indicator,
        DarvasBoxes,
        Fundementals,

        BollingerSqueeze,
        BigCandle,
        Capitulation,
        DivergenceScan,
        FranksPattern,
        HeikenAshi,
        HigherHighHigherLow,
        PocketPivot,
        SamsPattern,

        DeleteSavedScan,
        DescriptionBox
    },
    data() {
        return {
            tour_ref: tourRef.TOUR_REF,
            combineToolBoxList: allToolbox,
            selectedTool: null,
            selectedToolRep: null,
            isValid: false,
            isEventValid: false,
            isLoading: false,


            deleteFavScan: false,
            showDeleteDialog: false,
            deleteFavScanItem: '',
            deleteFavScanId: null,


        }
    },
    computed: {
        
        ...mapGetters([
            'userData',
            'scanPopup',
            'userSavedScans',
            'getScanFavListTypes',
            'getGuruFavListTypes',
            'tourStep'
        ]),
        getComponentForSelectedTool() {
            const componentMap = {
                patterns: 'Patterns',
                activity: 'Activity',
                candlesticks: 'Candle',
                indicators: 'Indicator',
                darvasScan: 'DarvasBoxes',
                fundementals: 'Fundementals',
                bollingerSqueeze: 'BollingerSqueeze',
                bigCandle: 'BigCandle',
                capitulation: 'Capitulation',
                divergenceScan: 'DivergenceScan',
                franksPattern: 'FranksPattern',
                heikenAshi: 'HeikenAshi',
                hhhl: 'HigherHighHigherLow',
                pocketPivot: 'PocketPivot',
                samsPattern: 'SamsPattern',
            };
            return this.selectedTool ? componentMap[this.selectedTool.value] : null;
        },
        isButtonEnable() {
            if (this.selectedTool?.isEvent == true)
                return this.isValid || this.isEventValid
            else
                return this.isValid
        },
        favouriteScanList() {
            const favScans = this.userSavedScans.filter((scan) => (this.getScanFavListTypes.includes(scan.scanType) || this.getGuruFavListTypes.includes(scan.scanType)));
            return favScans;
        },
        allItemList() {
            return this.combineToolBoxList?.reduce((acc, toolbox) => {
                return acc.concat(toolbox.item);
            }, []);
        },
        allList() {
            let item = this.favouriteScanList.map((obj, index) => {
                return {
                    ...this.allItemList.find(x => x.value === obj.scanType),
                    favScanDeatils: obj,
                    isSaved: true,
                    label: `${obj.scanName}-${index}`
                }
            })
            let savedList = {
                label: "Saved Scans",
                id: "saved-tool",
                item: item,
                isFav: true
            }

            let finData = [...[savedList], ...this.combineToolBoxList]
            finData.forEach((x, index) => {
                if (x.item && Array.isArray(x.item)) {
                    x.item.forEach((item) => {
                        item.itemInx = index;
                    });
                }
            });

            return finData
        },
        activeTabIndex() {
            return this.selectedTool?.itemInx
        },
        tourStep() {
            return this.$tours[tourRef.TOUR_REF]?.currentStep
        },
        accordianSetting() {
            let asd = this.$tours[tourRef.TOUR_REF]?.steps[this.tourStep]?.params.accordianSetting
            return asd == activityAccordion.EMPTY_TAB ? [] : asd == activityAccordion.ONE_TAB ? [0] : asd == activityAccordion.TWO_TAB ? [0, 1] : asd == activityAccordion.THREE_TAB ? [0, 1, 2] : []
        },
        isNextStep() {
            return this.$tours[tourRef.TOUR_REF]?.steps[this.tourStep]?.params.outsideNext
        },

    },
    methods: {
        tabOpenCall() {
            if (this.isNextStep) {
                this.tourNextStep(500)
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
        ...mapActions([
            'updateMarketAccordingTODataSettings',
            'deleteScanSettings',
            'setTourStep',
            'setScanLoading',
        ]),
        handleButtonClick,
        toolboxChange(event) {
            if (event.value.value == 'activity') {
                this.tourNextStep(300)
            }

            if (event.originalEvent.target.classList.contains("saved-closed")) {
                this.selectedTool = this.selectedToolRep
                if (event.value == null)
                    this.onClickDeleteScan(this.selectedTool.favScanDeatils.id)
                else
                    this.onClickDeleteScan(event.value.favScanDeatils.id)
            } else {
                if (event.value == null) {
                    this.selectedTool = this.selectedToolRep
                }
                else {
                    this.selectedTool = event.value
                    this.selectedToolRep = event.value
                }
            }

        },
        handleUpdateLatestScan() {
            let scanner = this.userData?.ScanRequests ?? null;

            if (scanner) {
                let scan = JSON.parse(scanner);
                Object.keys(scan).map((key) => {
                    const payload = {
                        id: key,
                        settings: scan[key]
                    }
                    this.updateMarketAccordingTODataSettings({ ...scan[key], id: key })


                })
            }
        },
        handleUpdateLatestGuru() {

            let allitemArr = this.combineToolBoxList?.reduce((acc, toolbox) => {
                return acc.concat(toolbox.item);
            }, []);

            let guruScan = this.userData?.GuruRequests ?? null;
            if (guruScan) {
                let scan = JSON.parse(guruScan);
                Object.keys(scan).map((key) => {
                    const payload = {
                        id: allitemArr.find(x => x.scanType == key)['value'] || key,
                        settings: scan[key]
                    }
                    this.$store.commit("UPDATE_LATEST_GURU_SETTINGS", payload)
                })
            }
        },
        handleValid(data) {
            this.isValid = data;
        },
        handleEventValid(data) {
            this.isEventValid = data;
        },
        handleLoading(data) {
            this.isLoading = data;
        },
        ShowPopup() {
            this.$store.commit('SCAN_POPUP', true)
        },
        async callScan() {
            await this.$refs.toolRef.onScanClick();
            this.tourNextStep(100)
            this.onClose()
        },
        async callStop() {
            this.$refs.toolRef.onScanStop();
            this.isLoading = false;
            this.onClose()
        },
        onClose() {
            this.$emit('toggleModal', false)
        },
        async callReset() {
            this.$refs.toolRef.ResetScanDefaultSettings();
        },
        async callSaveFavScan(scanName) {
            await this.$refs.toolRef.saveScanSettings(scanName);
        },

        onClickDeleteScan(selectedFavScan) {

            if (selectedFavScan) {
                this.$store.commit(
                    'FAV_SELECTED_SCAN_ID',
                    selectedFavScan
                )

                this.deleteFavScanId = selectedFavScan
                this.deletedScan(this.userSavedScans.find(x => x.id === selectedFavScan).scanName)
                this.$store.commit('SCAN_DELETE_POPUP', true)
            }

        },
        SureDeleteFavScanItem(check) {

            this.deleteFavScan = check
            this.deletedScan()
        },
        HideDeletePopup() {
            this.showDeleteDialog = false
        },
        async deletedScan(selectedScanName) {
            this.deleteFavScanItem = selectedScanName

            this.showDeleteDialog = true
            if (this.deleteFavScan) {
                await this.deleteScanSettings(this.deleteFavScanId)
                this.$store.commit('SCAN_DELETE_POPUP', false)
            }
            this.deleteFavScan = false
        },

    },
    watch: {
        userData(n) {
            if (n) {
                this.handleUpdateLatestScan()
                this.handleUpdateLatestGuru()
            }
        },
        visible(n) {
            if (n) {
                if (this.isNextStep) {

                    this.selectedTool = null
                    this.selectedToolRep = null
                    this.isValid = false
                    this.isEventValid = false
                    this.tourNextStep(300)
                }
            }
        },
        isLoading(n) {
            console.log("loading watch");

            if (n == true) {
                this.setScanLoading(true)
            } else {
                this.setScanLoading(false)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.scan-modal-panel {
    width: 100%;
    height: 480px;
}
</style>