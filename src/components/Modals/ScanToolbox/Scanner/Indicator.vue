<template>
    <div>
        <multiple-checker class="fontSize" @selectAll="updateAllSelections(true)"
            @clearAll="updateAllSelections(false)" />

        <div class="field-content">
            <p-checkbox v-model="settings.crossesAndAboveBelow.isActive" :binary="true" />

            <p-dropdown v-model="settings.crossesAndAboveBelow.left" :options="crossMenu" optionLabel="text"
                optionValue="value" />

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.crossesAndAboveBelow.leftPeriod"
                v-if="settings.crossesAndAboveBelow.left !== 'close'" @input="handleUserChoice" :style="selectWidth" />

            <p-dropdown v-model="settings.crossesAndAboveBelow.operatorType" :options="crossOperatorMenu"
                optionLabel="text" optionValue="value" />

            <p-dropdown v-model="settings.crossesAndAboveBelow.right" :options="crossMenu" optionLabel="text"
                optionValue="value" />

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.crossesAndAboveBelow.rightPeriod"
                v-if="settings.crossesAndAboveBelow.right !== 'close'" @input="handleUserChoice" tabindex="1"
                :style="selectWidth" />
        </div>

        <div class="field-content">
            <p-checkbox v-model="settings.ROC.isActive" :binary="true" />
            <label>ROC</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.ROC.period"
                @input="handleUserChoice" :style="selectWidth" />

            <p-radiobutton id="rocMode~overbought" name="rocMode" value="overbought" v-model="settings.ROC.mode" />
            <label for="rocMode~overbought">Overbought</label>

            <p-radiobutton id="rocMode~oversold" name="rocMode" value="oversold" v-model="settings.ROC.mode" />
            <label for="rocMode~oversold">Oversold</label>

        </div>
        <div class="field-content">
            <p-checkbox v-model="settings.RSI.isActive" :binary="true" />
            <label>RSI</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.RSI.period"
                @input="handleUserChoice" :style="selectWidth" />

            <p-radiobutton id="rsiMode~overbought" name="rsiMode" value="overbought" v-model="settings.RSI.mode" />
            <label for="rsiMode~overbought">Overbought</label>

            <p-radiobutton id="rsiMode~oversold" name="rsiMode" value="oversold" v-model="settings.RSI.mode" />
            <label for="rsiMode~oversold">Oversold</label>

        </div>
        <div class="field-content">
            <p-checkbox v-model="settings.RSR.isActive" :binary="true" />
            <label>RS Above</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.RSR.period"
                @input="handleUserChoice" :style="selectWidth" />

        </div>
        <div class="field-content">
            <p-checkbox v-model="settings.STOC.isActive" :binary="true" />
            <label>STOC</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.STOC.period"
                @input="handleUserChoice" :style="selectWidth" />
            <label>Period</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.STOC.kPercent"
                @input="handleUserChoice" :style="selectWidth" />
            <label>%K</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.STOC.dPercent"
                @input="handleUserChoice" :style="selectWidth" />
            <label>%D</label>

            <p-radiobutton id="stocMode~overbought" name="stocMode" value="overbought" v-model="settings.STOC.mode" />
            <label for="stocMode~overbought">Overbought</label>

            <p-radiobutton id="stocMode~oversold" name="stocMode" value="oversold" v-model="settings.STOC.mode" />
            <label for="stocMode~oversold">Oversold</label>

        </div>
        <div class="field-content">
            <p-checkbox v-model="settings.BANDS.isActive" :binary="true" />
            <label>Bollinger Band of period</label>

            <p-inputText @keypress="preventDecimal" type="number" v-model="settings.BANDS.period"
                @input="handleUserChoice" :style="selectWidth" />

            <p-radiobutton id="bbMode~top" name="bbMode" value="top" v-model="settings.BANDS.breakMode" />
            <label for="bbMode~top">Top Break</label>

            <p-radiobutton id="bbMode~bottom" name="bbMode" value="bottom" v-model="settings.BANDS.breakMode" />
            <label for="bbMode~bottom">Bottom Break</label>

        </div>
        <div class="field-content">
            <p-checkbox v-model="settings.guppyMMA.isActive" :binary="true" />
            <label>Guppy Multiple Moving Average</label>
        </div>
    </div>
</template>

<script>
const DEFAULT_SETTINGS = {
    crossesAndAboveBelow: {
        isActive: false,
        left: 'close',
        leftPeriod: 14,
        operatorType: 'above',
        right: 'ma',
        rightPeriod: 14,
    },
    ROC: {
        isActive: false,
        period: 10,
        mode: 'overbought',
    },
    RSI: {
        isActive: false,
        period: 18,
        mode: 'overbought',
    },
    RSR: {
        isActive: false,
        period: 80
    },
    STOC: {
        isActive: false,
        period: 15,
        kPercent: 3,
        dPercent: 3,
        mode: 'overbought',
    },
    BANDS: {
        isActive: false,
        period: 21,
        breakMode: 'top',
    },
    guppyMMA: {
        isActive: false,
        GuppyMMAItems: [
            { period: 3, isShort: true },
            { period: 5, isShort: true },
            { period: 8, isShort: true },
            { period: 10, isShort: true },
            { period: 12, isShort: true },
            { period: 15, isShort: true },

            { period: 30, isShort: false },
            { period: 35, isShort: false },
            { period: 40, isShort: false },
            { period: 45, isShort: false },
            { period: 50, isShort: false },
            { period: 60, isShort: false },
        ]
    }
}
import MultipleChecker from '../../../../baseComponents/MultipleChecker.vue'
import {
    DEFAULT_DATA_SETTINGS,
    DEFAULT_FILTER_SETTINGS,
    DEFAULT_EVENT_SETTINGS,
} from '../../../../settings/USER_SETTINGS_DEFAULT'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Indicators',
    components: {
        MultipleChecker,
    },
    props: {
        favScanId: {
            type: String,
            default: ''
        }
    },
    methods: {
        ...mapActions([
            'updateMarketAccordingTODataSettings',
            'setIndicatorsScanSettings',
            'sendIndicatorsScanRequest',
            'cancelScans',
            'saveScannersScanRequest',
            'deleteScanSettings',
            'getUserScanList',
            'setSelectedMarket',
            'runAndUpdateScanSettings',
            'resetSavedScan'
        ]),
        async onScanClick() {
            this.isLoading = true
            if (this.favScanId) {
                const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
                await this.runAndUpdateScanSettings(index)
                await this.getUserScanList()
            } else {
                await this.sendIndicatorsScanRequest()
            }
            this.isLoading = false
        },
        onScanStop() {
            this.cancelScans()
            this.isLoading = false
        },
        ResetScanDefaultSettings() {
            if (this.favScanId) {
                this.resetSavedScan(this.favScanId)
            } else {
                let val = {
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                    events: JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS)),
                }
                this.updateMarketAccordingTODataSettings({ ...val, id: this.id })
                this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
            }
        },
        async saveScanSettings(name) {
            await this.saveScannersScanRequest({
                scanName: name,
                scanType: 'indicators'
            })

            this.$store.commit('SCAN_POPUP', false)
            await this.getUserScanList()
        },
        updateAllSelections(state) {
            this.handleUserChoice()
            this.settings.crossesAndAboveBelow.isActive = state
            this.settings.ROC.isActive = state
            this.settings.RSI.isActive = state
            this.settings.RSR.isActive = state
            this.settings.STOC.isActive = state
            this.settings.BANDS.isActive = state
        },


        handleUserChoice() {
            if (this.userChoice == false) {
                this.$store.commit('SET_USER_CHOICE', true)
            }
        },
        preventDecimal(event) {
            if (event.key === '.' || event.key === ',' || event.key === '-') {
                event.preventDefault();
            }
        },
    },
    data() {
        return {
            id: 'indicators',
            dialogId: 'indicatorEvent',
            isLoading: false,
            isEventsSelected: false,
            // settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
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
        ...mapGetters(['themeFontColor', 'userChoice', 'themeDarkMode', 'scannerScanSettings', 'userSavedScans']),
        isValid() {
            if (this.isEventsSelected) return true
            if (
                this.settings.crossesAndAboveBelow.left !== 'close' &&
                this.settings.crossesAndAboveBelow.left ===
                this.settings.crossesAndAboveBelow.right &&
                this.settings.crossesAndAboveBelow.leftPeriod ===
                this.settings.crossesAndAboveBelow.rightPeriod
            )
                return false
            if (
                this.settings.crossesAndAboveBelow.left === 'close' &&
                this.settings.crossesAndAboveBelow.left ===
                this.settings.crossesAndAboveBelow.right
            )
                return false
            return Object.values(this.settings).some((state) => state.isActive)
        },
        selectWidth() {
            return 'width: 12%'
        },
        // settings() {
        //     return this.scannerScanSettings.indicators.settings || JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
        // },
        settings: {
            get() {
                if (this.favScanId) {
                    return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
                }
                return this.scannerScanSettings.indicators.settings || JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
            },
            set(value) {
                this.setIndicatorsScanSettings(value)
            }
        }
    },
    watch: {
        isValid: {
            handler(newVal) {
                this.$emit('valid', newVal);
            },
            immediate: true
        },
        isLoading: {
            handler(newVal) {
                this.$emit('loading', newVal);
            },
            immediate: true
        },
    },
}
</script>

<style></style>