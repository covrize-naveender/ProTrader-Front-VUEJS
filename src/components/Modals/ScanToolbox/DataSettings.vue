<template>
    <div id="data-settings">
        <div class="timeframe-btn p-d-flex p-ai-center">
            <div class="label-div">TimeFrame</div>
            <p-selectbutton v-model="selectedTimeFrame" :options="scanTypes" optionLabel="label" optionValue="value" />
        </div>
        <div class="timeframe-btn p-d-flex p-ai-center" id="scan-filter">
            <div class="label-div">Filters</div>

            <div class="drp-container">
                <p-dropdown appendTo='body' v-model="selectedMarketCode" :options="marketTypes" optionLabel="text" optionValue="value" />

            </div>
            <div class="drp-container" id="scan-exchange">
                <p-dropdown appendTo='body' v-model="selectedMarketTye" :options="marketType" optionLabel="text" optionValue="value" v-if="selectedMarketCode === 'market'" />

            </div>
            <div class="drp-container"  id="scan-industry">
                <p-dropdown appendTo='body' v-model="selectedFilterBy" :options="filterTypes" optionLabel="text" optionValue="value" v-if="selectedMarketCode === 'market'" />

            </div>
            <div class="drp-container">
                <p-dropdown appendTo='body' v-model="selectedSector" :options="getMarketCategory" optionLabel="text" optionValue="value" v-if="selectedFilterBy === 'sector' && selectedMarketCode === 'market'" />

            </div>
            <div class="drp-container">
                <p-dropdown appendTo='body' v-model="selectedIndustry" :options="getIndustryGroupDD" optionLabel="text" optionValue="value" v-if="selectedFilterBy === 'industry' && selectedMarketCode === 'market'" />

            </div>
            <div class="drp-container">
                <p-dropdown appendTo='body' v-model="selectedSubIndustry" :options="getSubIndustryGroupDD" optionLabel="text" optionValue="value" v-if="selectedFilterBy === 'subIndustry' && selectedMarketCode === 'market'" />

            </div>
            <div class="drp-container">
                <p-dropdown appendTo='body' v-model="selectedWatchCode" :options="getWatchListFromStore" optionLabel="text" optionValue="value" v-if="selectedMarketCode === 'watch-list'" />

            </div>
            <div class="drp-container">
                <p-dropdown appendTo='body' v-model="selectedScanCode" :options="getScanListFromStore" optionLabel="text" optionValue="value" v-if="selectedMarketCode === 'scan-result'" />
            </div>

        </div>
    </div>
</template>

<script>
import { generateUUID } from 'Utils';
import { mapActions, mapGetters } from 'vuex';
import { marketsData } from '../../../data/markets';

export default {
    name: 'DataSettings',
    props: {
        id: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            default: 'scanner',
        },
        favScanId: {
            type: String,
            default: null
        }
    },
    methods: {
        ...mapActions([
            'setScanDataSettings',
            'setScanDataSettingsOld',
            'setSelectedMarket',
            'setSelectedMarketNew',
        ]),
        handleUserChoice() {
            if (!this.userChoice) {
                this.$store.commit('SET_USER_CHOICE', true)
            }
        },
    },
    data() {
        return {
            dataId: '',
            watcherField: 0,
            scannerField: 0,
            selectedIndex: 'asx',
            indicesTypes: [
                {
                    text: 'Indices',
                    value: 'indices',
                },
                {
                    text: 'ASX',
                    value: 'asx',
                },
            ],
            filterTypes: [
                {
                    text: 'All',
                    value: 'all',
                },
                {
                    text: 'Sector',
                    value: 'sector',
                },
                {
                    text: 'Industry',
                    value: 'industry',
                },
                {
                    text: 'SubIndustry',
                    value: 'subIndustry',
                },
            ],
            scanTypes: [
                { value: 'D', label: 'Daily' },
                { value: 'W', label: 'Weekly' },
                { value: 'M', label: 'Monthly' },
            ],
        }
    },
    mounted() {
    },
    created() {
        const random = generateUUID()
        this.dataId = random
    },
    computed: {
        ...mapGetters([
            'dataSettings',
            'dataSettingsForScan',
            'selectedMarketForScan',
            'themePrimaryColor',
            'themeSecondaryColor',
            'showWatchRenameModal',
            'themeFontColor',
            'scanResults',
            'watchLists',
            'selectedMarket',
            'getIndustryGroup',
            'getSubIndustryGroup',
            'getSectorGroup',
            'userChoice',
            'themeDarkMode',
            'userSavedScans',
            'getGuruFavListTypes',
            'getScanFavListTypes'
        ]),
        getMarketCategory() {
            let data = []
            if (this.getSectorGroup[this.selectedMarketTye]) {
                return this.getSectorGroup[this.selectedMarketTye].map((d) => {
                    return { value: d, text: d }
                })
            }
            return data
        },
        getIndustryGroupDD() {
            let data = []
            if (this.getIndustryGroup[this.selectedMarketTye]) {
                return this.getIndustryGroup[this.selectedMarketTye].map((d) => {
                    return { value: d, text: d }
                })
            }
            return data
        },
        getSubIndustryGroupDD() {
            let data = []
            if (this.getSubIndustryGroup[this.selectedMarketTye]) {
                return this.getSubIndustryGroup[this.selectedMarketTye].map((d) => {
                    return { value: d, text: d }
                })
            }
            return data
        },
        modalID() {
            return this.$props.id
        },
        modalType() {
            return this.$props.type
        },
        FavScanId() {
            return this.$props.favScanId
        },
        marketTypes() {
            return this.scanResults.length > 0
                ? [
                    {
                        text: 'Market',
                        value: 'market',
                    },
                    {
                        text: 'Watch list',
                        value: 'watch-list',
                    },
                    {
                        text: 'Scan Result',
                        value: 'scan-result',
                    },
                ]
                : [
                    {
                        text: 'Market',
                        value: 'market',
                    },
                    {
                        text: 'Watch list',
                        value: 'watch-list',
                    },
                ]
        },

        /** @returns {String} */
        selectedTimeFrame: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.timeFrame
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    return this.dataSettingsForScan(this.modalID, this.modalType)
                        .timeFrame
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType)
                        .timeFrame
                } else return this.dataSettings.timeFrame
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, timeFrame: value },
                                    settings: {
                                        ...scan.data.settings,
                                        dataSettings: { ...scan.data.settings.dataSettings, timeFrame: value },
                                    }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        type: 'scanner',
                        id: this.modalID,
                        settings: { timeFrame: value },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: 'guru',
                        id: this.modalID,
                        settings: { timeFrame: value },
                    })
                }

                else {
                    this.setScanDataSettingsOld({ timeFrame: value })
                }
            },
        },
        selectedMarketTye: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.type
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType).type
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType).type
                } else if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.type
                } else return this.dataSettings.type
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, type: value },
                                    settings: {
                                        ...scan.data.settings, dataSettings: { ...scan.data.settings.dataSettings, type: value },
                                    }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        id: this.modalID,
                        type: this.modalType,
                        settings: { type: value },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: this.modalType,
                        id: this.modalID,
                        settings: { type: value },
                    })
                } else {
                    this.setScanDataSettingsOld({ type: value })
                }
            },
        },
        selectedFilterBy: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.filterBy
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType).filterBy
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType).filterBy
                } else return this.dataSettings.filterBy
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, filterBy: value, sector: '' },
                                    settings: {
                                        ...scan.data.settings,
                                        dataSettings: { ...scan.data.settings.dataSettings, filterBy: value, sector: '' },
                                    }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        id: this.modalID,
                        type: this.modalType,
                        settings: { filterBy: value, sector: '' },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: 'guru',
                        id: this.modalID,
                        settings: { filterBy: value, sector: '' },
                    })
                } else {
                    this.setScanDataSettingsOld({ filterBy: value })
                }
            },
        },
        selectedSector: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.sector
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType).sector
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType).sector
                } else return this.dataSettings.sector
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, sector: value },
                                    settings: { ...scan.data.settings, dataSettings: { ...scan.data.settings.dataSettings, sector: value } }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        id: this.modalID,
                        type: this.modalType,
                        settings: { sector: value },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: 'guru',
                        id: this.modalID,
                        settings: { sector: value },
                    })
                } else {
                    this.setScanDataSettingsOld({ sector: value })
                }
            },
        },
        selectedIndustry: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.industry
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType).industry
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType).industry
                } else return this.dataSettings.industry
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, industry: value },
                                    settings: { ...scan.data.settings, dataSettings: { ...scan.data.settings.dataSettings, industry: value } }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        id: this.modalID,
                        type: this.modalType,
                        settings: { industry: value },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: 'guru',
                        id: this.modalID,
                        settings: { industry: value },
                    })
                } else {
                    this.setScanDataSettingsOld({ industry: value })
                }
            },
        },
        selectedSubIndustry: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.subIndustry
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType)
                        .subIndustry
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType)
                        .subIndustry
                } else return this.dataSettings.subIndustry
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, subIndustry: value },
                                    settings: { ...scan.data.settings, dataSettings: { ...scan.data.settings.dataSettings, subIndustry: value } }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        id: this.modalID,
                        type: this.modalType,
                        settings: { subIndustry: value },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: 'guru',
                        id: this.modalID,
                        settings: { subIndustry: value },
                    })
                } else {
                    this.setScanDataSettingsOld({ subIndustry: value })
                }
            },
        },
        marketType: {
            get() {
                return marketsData.map((m) => {
                    return { value: m.code, text: m.desc }
                })
            },
        },
        selectedWatchCode: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.watchCode
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType)
                        .watchCode
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType)
                        .watchCode
                } else return this.dataSettings.watchCode
            },
            set(value) {
                if (this.getFavScanSettings) {
                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {
                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    dataSettings: { ...scan.data.dataSettings, watchCode: value, watchCodeId: value, scanCode: '' },
                                    settings: {
                                        ...scan.data.settings,
                                        dataSettings: { ...scan.data.settings.dataSettings, watchCode: value, watchCodeId: value, scanCode: '' }
                                    }
                                }
                            }
                        }
                        return scan
                    })

                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                }
                else if (this.modalID && this.modalType === 'scanner') {
                    this.setScanDataSettings({
                        id: this.modalID,
                        type: this.modalType,
                        settings: {
                            watchCode: value,
                            watchCodeId: value,
                            scanCode: '',
                        },
                    })
                } else if (this.modalID && this.modalType === 'guru') {
                    return this.setScanDataSettings({
                        type: 'guru',
                        id: this.modalID,
                        settings: {
                            watchCode: value,
                            watchCodeId: value,
                            scanCode: '',
                        },
                    })
                } else {
                    this.setScanDataSettingsOld({
                        watchCode: value,
                        watchCodeId: value,
                        scanCode: '',
                    })
                }
            },
        },
        selectedScanCode: {
            get() {
                if (this.getFavScanSettings) {
                    return this.getFavScanSettings.data.dataSettings.scanCode
                }
                else if (this.modalID && this.modalType === 'scanner')
                    return this.dataSettingsForScan(this.modalID, this.modalType).scanCode
                else if (this.modalID && this.modalType === 'guru') {
                    return this.dataSettingsForScan(this.modalID, this.modalType).scanCode
                } else return this.dataSettings.scanCode
            },
            set(value) {
                let filterList = this.scanResults.find((f) => f.scanId === value)
                if (filterList && filterList.results && filterList.results.length) {
                    let symbolList = filterList.results.map((s) => s.symbol)
                    if (this.getFavScanSettings) {
                        const updatedScans = this.userSavedScans.map((scan) => {
                            if (scan.id == this.FavScanId) {
                                return {
                                    ...scan,
                                    data: {
                                        ...scan.data,
                                        dataSettings: { ...scan.data.dataSettings, scanCode: value, scanList: symbolList },
                                        settings: {
                                            ...scan.data.settings,
                                            dataSettings: { ...scan.data.settings.dataSettings, scanCode: value, scanList: symbolList }
                                        }
                                    }
                                }
                            }
                            return scan
                        })

                        this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                    }
                    else if (this.modalID && this.modalType === 'scanner') {
                        this.setScanDataSettings({
                            id: this.modalID,
                            type: this.modalType,
                            settings: { scanCode: value, scanList: symbolList },
                        })
                    } else if (this.modalID && this.modalType === 'guru') {
                        this.setScanDataSettings({
                            id: this.modalID,
                            settings: { scanCode: value, scanList: symbolList },
                        })
                    } else {
                        this.setScanDataSettingsOld({
                            scanCode: value,
                            scanList: symbolList,
                        })
                    }
                } else {
                    if (this.getFavScanSettings) {
                        if (this.getTypeOfScan === 'scanner') {
                            this.setScanDataSettings({
                                type: 'scanner',
                                id: this.getFavScanSettings.scanType,
                                settings: { scanCode: value, scanList: [] },
                            })
                        } else if (this.getTypeOfScan === 'guru') {

                            this.setScanDataSettings({
                                type: 'guru',
                                id: this.getFavScanSettings.scanType,
                                settings: { scanCode: value, scanList: [] },
                            })
                        }

                        const updatedScans = this.userSavedScans.map((scan) => {
                            if (scan.id == this.FavScanId) {
                                return {
                                    ...scan,
                                    data: {
                                        ...scan.data,
                                        dataSettings: { ...scan.data.dataSettings, scanCode: value, scanList: [] },
                                        settings: { ...scan.data.settings, dataSettings: { ...scan.data.settings.dataSettings, scanCode: value, scanList: [] } }
                                    }
                                }
                            }
                            return scan
                        })

                        this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)
                    }
                    else if (this.modalID && this.modalType === 'scanner') {
                        this.setScanDataSettings({
                            id: this.modalID,
                            type: this.modalType,
                            settings: { scanCode: value, scanList: [] },
                        })
                    } else if (this.modalID && this.modalType === 'guru') {
                        this.setScanDataSettings({
                            id: this.modalID,
                            settings: { scanCode: value, scanList: [] },
                        })
                    } else {
                        this.setScanDataSettingsOld({ scanCode: value, scanList: [] })
                    }
                }
            },
        },
        selectedMarketCode: {
            get() {
                if (this.getFavScanSettings != null) {
                    return this.getFavScanSettings.data.settings.selectedMarket
                }
                else if (this.modalID) {
                    return this.selectedMarketForScan(this.modalID, this.modalType)
                }
                return this.selectedMarket
            },
            set(value) {
                if (this.getFavScanSettings != null) {
                    this.setSelectedMarketNew({ id: this.getFavScanSettings.scanType, value, type: this.getTypeOfScan })

                    const updatedScans = this.userSavedScans.map((scan) => {
                        if (scan.id == this.FavScanId) {

                            let isScanVal = value == "scan-result" ? true : false
                            let isWatchVal = value == "watch-list" ? true : false

                            return {
                                ...scan,
                                data: {
                                    ...scan.data,
                                    settings: { ...scan.data.settings, selectedMarket: value },
                                    dataSettings: { ...scan.data.dataSettings, isScan: isScanVal, isWatch: isWatchVal }
                                }

                            }

                        }

                        return scan
                    })
                    this.$store.commit('UPDATE_USER_SCAN_LIST', updatedScans)

                }
                else if (this.modalID) {

                    this.setSelectedMarketNew({ id: this.modalID, value, type: this.modalType })
                }
                else {
                    this.setSelectedMarket(value)
                }
            },
        },

        getWatchListFromStore() {
            return this.watchLists.map((v, k) => {
                return { value: v.id, text: v.name }
            })
        },
        getScanListFromStore() {
            return this.scanResults.map((v, k) => {
                return { value: v.scanId, text: v.scanName }
            })
        },
        getScannerId() {
            return 'scan-' + this.scannerField
        },
        getFavScanSettings() {
            if (this.favScanId != null) {
                const FavScans = this.userSavedScans.find((scan) => scan.id === this.favScanId);
                return FavScans;
            }
            return null;
        },
        getTypeOfScan() {
            if (this.getFavScanSettings != null) {
                if (this.getScanFavListTypes.includes(this.getFavScanSettings.scanType)) {
                    return 'scanner'
                }
                else if (this.getGuruFavListTypes.includes(this.getFavScanSettings.scanType)) {
                    return 'guru'
                }
                return null
            }
            return null
        }
    },
    watch: {
        showWatchRenameModal(n, o) {
            if (!n) {
                this.watcherField = this.watcherField + 1
            }
        },
    },
}
</script>
<style>
.ui.selection.dropdown .menu>.item {
    border-top: 1px solid #959494 !important;
}

.scan-type .ui.selection.dropdown {
    min-width: 12rem;
}
</style>
<style lang="scss" scoped>
.fontSize {
    font-size: 13.5px;
    margin-bottom: 5px;
}

@media screen and (max-width: 870px) {
    .fontSize {
        font-size: 11px;
        margin-bottom: 5px;
    }
}

@media screen and (max-width: 510px) {
    .fontSize {
        font-size: 10px;
        margin-bottom: 7px;
    }
}

.timeframe-btn {
    gap: 0.5rem;
    padding: 0.5rem 0;
}

.label-div {
    width: 75px;
}
.drp-container .p-dropdown{
    margin: 0.2rem;
}
</style>