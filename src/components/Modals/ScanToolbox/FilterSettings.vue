<template>
    <div id="filter-settings">
        <!-- 1st Filter -->
        <div class="field-content" :style="themeFontColor">
            <p-checkbox v-model="settings.crossesAndAboveBelow.isActive" :binary="true" />

            <p-dropdown v-model="settings.crossesAndAboveBelow.left" :options="crossMenu" optionLabel="text"
                optionValue="value" />

            <p-inputText type="number" v-model="settings.crossesAndAboveBelow.leftPeriod"
                v-if="settings.crossesAndAboveBelow.left !== 'close'" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <p-dropdown v-model="settings.crossesAndAboveBelow.operatorType" :options="crossOperatorMenu"
                optionLabel="text" optionValue="value" />

            <p-dropdown v-model="settings.crossesAndAboveBelow.right" :options="crossMenu" optionLabel="text"
                optionValue="value" />

            <p-inputText type="number" v-model="settings.crossesAndAboveBelow.rightPeriod"
                v-if="settings.crossesAndAboveBelow.right !== 'close'" @input="handleUserChoice" class="hidden"
                tabindex="1" :style="selectWidth" />
        </div>

        <!-- 2nd Filter -->
        <div class="field-content">
            <p-checkbox v-model="settings.rsRating.isActive" :binary="true" />

            <label>RS Above</label>

            <p-inputText type="number" v-model="settings.rsRating.period" @input="handleUserChoice" class="hidden"
                tabindex="1" :style="selectWidth" />
        </div>

        <!-- 3rd Filter -->
        <div class="field-content" id="price-range">
            <p-checkbox v-model="settings.priceRangeDollar.isActive" :binary="true" />

            <label>Price range in dollars from</label>

            <p-inputText type="number" v-model="settings.priceRangeDollar.start" @input="handleUserChoice"
                class="hidden" tabindex="1" :style="selectWidth" />

            <label>To</label>

            <p-inputText type="number" v-model="settings.priceRangeDollar.end" @input="handleUserChoice" class="hidden"
                tabindex="1" :style="selectWidth" />

        </div>

        <!-- 4th Filter -->
        <div class="field-content" id="ignore-results">
            <p-checkbox v-model="settings.ignoreResults.isActive" :binary="true" />

            <label>Ignore results that have less than</label>

            <p-inputText type="number" v-model="settings.ignoreResults.minDays" @input="handleUserChoice" class="hidden"
                tabindex="1" :style="selectWidth" />

            <label>day(s) of data</label>

        </div>

        <!-- 5th Filter -->
        <div class="field-content">
            <p-checkbox v-model="settings.isIgnoreResultsWithNoRangeForLastDay" :binary="true" />

            <label>Ignore results that have no trading range for the last day</label>

        </div>

        <!-- 6th Filter -->
        <div class="field-content" id="only-show-results">
            <p-checkbox v-model="settings.onlyShowResultsThatHaveTraded.isActive" :binary="true" />

            <label>Only show results that have traded in the past</label>

            <p-inputText type="number" v-model="settings.onlyShowResultsThatHaveTraded.pastDays"
                @input="handleUserChoice" class="hidden" tabindex="1" :style="selectWidth" />

            <label>day(s)</label>

        </div>

        <!-- 7th Filter -->
        <div class="field-content">
            <p-checkbox v-model="settings.ignoreResultsWithValueLess.isActive" :binary="true" />

            <label>Ignore results that have value less than</label>

            <p-inputText type="number" v-model="settings.ignoreResultsWithValueLess.value" @input="handleUserChoice"
                class="hidden" tabindex="1" :style="selectWidth" />

        </div>

        <!-- 8th Filter -->
        <div class="field-content">
            <p-checkbox v-model="settings.ignoreResultsWithVolumeLess.isActive" :binary="true" />

            <label>Ignore results that have volume less than</label>

            <p-inputText type="number" v-model="settings.ignoreResultsWithVolumeLess.volume" @input="handleUserChoice"
                class="hidden" tabindex="1" :style="selectWidth" />

        </div>

        <!-- 9th Filter -->
        <div class="field-content" v-if="id == 'patterns' || id == 'indicators'">
            <p-checkbox v-model="settings.matchFilterCombination" :binary="true" />

            <label>Match selected events and {{ id }} in combination</label>

        </div>

        <!-- 10th Filter -->
        <div class="field-content">
            <p-checkbox v-model="settings.includeIntraDayData" :binary="true" />

            <label>Include Only Intraday Data</label>

        </div>
        
        <!-- 11th Filter -->
        <div class="field-content">
            <p-checkbox v-model="settings.excludeWatchlists" :binary="true" />

            <label>Exclude All Watchlists</label>

        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'FilterSettings',
    props: {
        id: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: ""
        },
        favScanId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            settingsData: {
                crossesAndAboveBelow: {
                    isActive: false,
                    left: 'close',
                    leftPeriod: 14,
                    operatorType: 'above',
                    right: 'ma',
                    rightPeriod: 14,
                },
                rsRating: {
                    isActive: false,
                    period: 50,
                },
                priceRangeDollar: {
                    isActive: false,
                    start: 0,
                    end: 0,
                },
                ignoreResults: {
                    isActive: false,
                    minDays: 280,
                },
                isIgnoreResultsWithNoRangeForLastDay: false,
                onlyShowResultsThatHaveTraded: {
                    isActive: false,
                    pastDays: 10,
                },
                ignoreResultsWithValueLess: {
                    isActive: false,
                    value: 25000,
                },
                ignoreResultsWithVolumeLess: {
                    isActive: false,
                    volume: 25000,
                },
                includeIntraDayData: false,
                matchFilterCombination: false,
                excludeWatchlists: false,
            },
            crossMenu: [
                { text: "Close", value: 'close' },
                { text: "MA", value: 'ma' },
                { text: "WMA", value: 'wma' },
                { text: "XMA", value: 'xma' },
            ],
            crossOperatorMenu: [
                { text: "is Above", value: 'above' },
                { text: "is Below", value: 'below' },
                { text: "Crossed Above", value: 'crossAbove' },
                { text: "Crossed Below", value: 'crossBelow' },
            ],

        }
    },
    computed: {
        ...mapGetters([
            'filterSettingsForGuruScan',
            'filterSettingsForScan',
            'userChoice',
            'themeFontColor',
            'userSavedScans'
        ]),
        modalID() {
            return this.$props.id
        },
        modalType() {
            return this.$props.type
        },
        settings: {
            get() {
                if (this.modalID && this.favScanId) {
                    let savedFilterSettings = this.userSavedScans.find(x => x.id == this.favScanId).data.filterSettings
                    return { ...this.settingsData, ...savedFilterSettings }

                }

                else if (this.modalID && this.modalType == 'guru') {
                    let filterSettingsForGuruScan = this.filterSettingsForGuruScan(this.modalID)
                    if (!filterSettingsForGuruScan) {
                        let value = JSON.parse(JSON.stringify(this.settingsData))
                        this.setGuruFilterSettings({
                            id: this.modalID,
                            settings: value,
                        }).then((d) => {
                            return this.filterSettingsForGuruScan(this.modalID)
                        })
                    }
                    return filterSettingsForGuruScan || this.settingsData
                }
                else if (this.modalID && this.modalType == 'scanner') {
                    let filterSettingsForScan = this.filterSettingsForScan(this.modalID)
                    if (!filterSettingsForScan) {
                        let value = JSON.parse(JSON.stringify(this.settingsData))
                        this.setScanFilterSettings({
                            id: this.modalID,
                            settings: value,
                        }).then((d) => {
                            return this.filterSettingsForScan(this.modalID)
                        })
                    }
                    return filterSettingsForScan || this.settingsData
                }

                return this.filterSettings || this.settingsData
            },
            set(value) {
                if (this.modalID) {
                    if (this.modalType == 'guru')
                        this.setGuruFilterSettings({ id: this.modalID, settings: value })

                    else if (this.modalType == 'scanner')
                        this.setScanFilterSettings({ id: this.modalID, settings: value })

                    if (this.favScanId) {

                    }

                } else {
                    if (this.modalType == 'guru')
                        this.setGuruFilterSettingsOld(value)
                    else if (this.modalType == 'scanner')
                        this.setScanFilterSettingsOld(value)
                }
            },
        },
        selectWidth() {
            return 'width: 15%'
        }
    },
    methods: {
        ...mapActions([
            'setGuruFilterSettings',
            'setGuruFilterSettingsOld',
            'setScanFilterSettings',
            'setScanFilterSettingsOld'
        ]),
        handleUserChoice() {
            if (this.userChoice == false) {
                this.$store.commit('SET_USER_CHOICE', true)
            }
        },
    }
}
</script>

<style></style>