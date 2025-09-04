<template>
    <div>
        <multiple-checker @selectAll="updateAllSelections(true)" @clearAll="updateAllSelections(false)" />
        <div class="p-d-flex">
            <div style="flex:1" v-for="col of patternItems">
                <CustomSvgCheckBox v-for="checkBox of col" :key="checkBox" :label="checkBox"
                    :srcResolutionFunction="srcResolutionFunction" :updateState="updateCheckedPatterns"
                    :fromProps="settings[toCamelCase(checkBox)]" />
            </div>
        </div>
    </div>
</template>

<script>
const DEFAULT_SETTINGS = {
    saucerBottom: false,
    doubleBottom: false,
    bearishKeyReversal: false,
    bullishPennant: false,
    bearishFlag: false,
    ascendingTriangle: false,
    doubleTop: false,
    triPointResistance: false,
    bearishPennant: false,
    descendingTriangle: false,
    bullishKeyReversal: false,
    triPointSupport: false,
    bullishFlag: false,
}
import CustomSvgCheckBox from '../../../../svg_icon/CustomSvgCheckBox.vue'
import { mapActions, mapGetters } from 'vuex'
import MultipleChecker from '../../../../baseComponents/MultipleChecker.vue'
import {
    DEFAULT_DATA_SETTINGS,
    DEFAULT_EVENT_SETTINGS,
    DEFAULT_FILTER_SETTINGS,
} from '../../../../settings/USER_SETTINGS_DEFAULT'
import svg_icon from '../../../../svg_icon'

export default {
    components: {
        CustomSvgCheckBox,
        MultipleChecker,
    },
    props: {
        favScanId: {
            type: String,
            default: ''
        }
    },
    name: 'Patterns',
    data() {
        return {
            id: 'patterns',
            isLoading: false,
            patternItems: [
                [
                    'Saucer Bottom',
                    'Descending Triangle',
                    'Double Top',
                    'Bearish Key Reversal',
                    'Tri-Point Support',
                    'Bearish Pennant',
                    'Bearish Flag',
                ], [
                    'Ascending Triangle',
                    'Double Bottom',
                    'Bullish Key Reversal',
                    'Tri-Point Resistance',
                    'Bullish Pennant',
                    'Bullish Flag',
                ]
            ],
            isEventsSelected: false,
            componentRef: undefined,
        }
    },
    methods: {
        ...mapActions([
            'updateMarketAccordingTODataSettings',
            'setPatternsScanSettings',
            'setSelectedMarket',
            'sendPatternsScanRequest',
            'cancelScans',
            'saveScannersScanRequest',
            'deleteScanSettings',
            'getUserScanList',
            'runAndUpdateScanSettings',
            'resetSavedScan'
        ]),
        async onScanClick() {

            this.isLoading = true
            if (this.favScanId) {
                const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
                await this.runAndUpdateScanSettings(index)
                await this.getUserScanList()
            }
            else {
                await this.sendPatternsScanRequest()
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
                scanType: 'patterns'
            })
            this.$store.commit('SCAN_POPUP', false)
            await this.getUserScanList()
        },
        updateAllSelections(state) {
            this.settings = {
                saucerBottom: state,
                doubleBottom: state,
                bearishKeyReversal: state,
                bullishPennant: state,
                bearishFlag: state,
                ascendingTriangle: state,
                doubleTop: state,
                triPointResistance: state,
                bearishPennant: state,
                descendingTriangle: state,
                bullishKeyReversal: state,
                triPointSupport: state,
                bullishFlag: state,
            }
            this.handleUserChoice()
        },
        srcResolutionFunction(label) {
            return label
                .replace('-', '_')
                .split(' ')
                .reverse()
                .map((w) => w.toLowerCase())
                .reduce((curr, prev) => (prev && curr ? `${prev}_${curr}` : prev), '')
        },
        toCamelCase(name) {
            const pascal = name.replace('-', '').replaceAll(' ', '')
            return pascal[0].toLowerCase() + pascal.substring(1)
        },
        updateCheckedPatterns(label, state) {
            // this.checkedPatterns = { ...this.checkedPatterns, [label]: state }
            this.settings[this.toCamelCase(label)] = state
        },


        handleUserChoice() {
            if (this.userChoice == false) {
                this.$store.commit('SET_USER_CHOICE', true)
            }
        },
    },
    async mounted() {
        this.componentRef = svg_icon.find(d => d.name === this.srcResolutionFunction('Saucer Bottom'))
    },
    computed: {
        ...mapGetters(['userChoice', 'themeDarkMode', 'scannerScanSettings', 'userSavedScans']),
        isValid() {
            return (
                this.isEventsSelected ||
                Object.values(this.settings).some((state) => state)
            )
        },
        settings: {
            get() {
                if (this.favScanId) {
                    return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
                }
                return this.scannerScanSettings.patterns.settings || DEFAULT_SETTINGS
            },
            set(value) {
                this.setPatternsScanSettings(value)
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