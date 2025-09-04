<template>
    <p-dialog :visible.sync="visible" :closable="false" @hide="onCloseModal" :modal="true">
        <template #header>
            <div class="custom-header-container">
                <div class="custom-header-box-start">
                    <h2>Search for Historical Darvas Boxes</h2>
                </div>
                <div class="custom-header-box-end">
                    <p-button icon="pi pi-refresh" class="p-button-secondary p-button-outlined"
                        @click="ResetScanDefaultSettings" v-tooltip.bottom="`Reset`"/>
                    <p-button label="Ok" @click="handleButtonClick(runScan)" />
                    <p-button icon="pi pi-times" class="p-button-secondary p-button-outlined" @click="onCloseModal" v-tooltip.bottom="`Cancel`"/>
                </div>
            </div>

        </template>
        <LoaderPanel :loading="isLoading">
            <div>
                <p-message severity="error" v-if="noDarvasBoxFound"> No darvas box found</p-message>
                <div class="field-content">
                    <label>Scan Type:</label>
                    <p-dropdown v-model="settings.scanType" :options="scanTypes" optionLabel="text" optionValue="value"/>

                </div>
                <div class="field-content">

                    <label>Scan period</label>
                    <p-inputText type="number" v-model="settings.scanPeriod" :style="selectWidth" min="0" max="1000"
                        step="1" @keypress="preventDecimal" />

                </div>
                <div class="field-content">

                    <label>Top confirmation period</label>
                    <p-inputText type="number" v-model="settings.topConfirmationPeriod" :style="selectWidth" min="0"
                        max="1000" step="1" @keypress="preventDecimal" />

                </div>
                <div class="field-content">

                    <label>Bottom confirmation period</label>
                    <p-inputText type="number" v-model="settings.bottomConfirmationPeriod" :style="selectWidth" min="0"
                        max="1000" step="1" @keypress="preventDecimal" />

                </div>
                <div class="field-content">

                    <label>Percentage risk buffer</label>
                    <p-inputText type="number" v-model="settings.percentageRiskBuffer" :style="selectWidth" min="0"
                        step="1" />

                </div>
                <div class="field-content">

                    <p-checkbox v-model="settings.limitTotalRisk.isActive" :binary="true" />
                    <label>Limit total risk to</label>
                    <p-inputText type="number" v-model="settings.limitTotalRisk.valuePct" :style="selectWidth" min="1"
                        step="1" />

                </div>
                <div class="field-content">

                    <p-checkbox v-model="settings.volumeIncreasedOver.isActive" :binary="true" />
                    <label>Volume increased over</label>

                    <p-inputText type="number" v-model="settings.volumeIncreasedOver.percent" :style="selectWidth"
                        min="1" step="1" />
                    <label>% on previous</label>
                    <p-inputText type="number" v-model="settings.volumeIncreasedOver.previousBars" :style="selectWidth"
                        min="1" step="1" @keypress="preventDecimal" />
                    <label>bar(s)</label>

                </div>
            </div>
        </LoaderPanel>
    </p-dialog>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { handleButtonClick } from "../../../handleRestrictFeature.js";
import LoaderPanel from '../../Loader/LoaderPanel.vue';


const DEFAULT_SETTINGS = {
    scanType: 'long',
    scanPeriod: 55,
    topConfirmationPeriod: 3,
    bottomConfirmationPeriod: 3,
    percentageRiskBuffer: 2.0,
    limitTotalRisk: {
        isActive: false,
        valuePct: 20.0,
    },
    volumeIncreasedOver: {
        isActive: false,
        percent: 300,
        previousBars: 1,
    },
    inBox: {
        isActive: false,
        type: 'anyBox', // 'anyBox' | '1stBox'
    },

}
export default {
    name: "DarvasBoxDrawing",
    components: {
        LoaderPanel
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            settings: DEFAULT_SETTINGS,
            isLoading: false,
            scanTypes: [
                {
                    text: 'Long',
                    value: 'long',
                },
                {
                    text: 'Short',
                    value: 'short',
                },
            ],
            noDarvasBoxFound: false

        };
    },
    methods: {
        handleButtonClick,
        ...mapActions([
            'sendDarvasBoxDrawingRequest',
            'changeSymbolToScannedSymbolDarvasDrawing'
        ]),
        onClose() {
            this.$emit("darvasBoxClose");
        },
        preventDecimal(event) {
            if (event.key === '.' || event.key === ',' || event.key === '-') {
                event.preventDefault();
            }
        },
        ResetScanDefaultSettings() {
            this.settings = DEFAULT_SETTINGS
        },
        async runScan() {
            this.noDarvasBoxFound = false
            this.isLoading = true;
            this.$emit("darvasBoxDelete");
            const { data } = await this.sendDarvasBoxDrawingRequest(this.settings)
            if (data?.data) {

                const timeFrame = this.timeFrame
                const settings = this.settings
                const isDrawing = true
                const scanType = 'darvasScan'
                this.changeSymbolToScannedSymbolDarvasDrawing({
                    symbolData: data,
                    timeFrame,
                    isDrawing,
                    scanType,
                    settings,
                }).then((d) => { })
                this.onCloseModal()
                this.isLoading = false
            }
            else {
                // this.onCloseModal()
                this.noDarvasBoxFound = true
                this.isLoading = false
            }
        },
        onCloseModal() {
            this.noDarvasBoxFound = false
            this.$emit('toggleModal', false)
        }

    },

    computed: {
        ...mapGetters(["themeDarkMode", "themeFontColor", "themeSecondaryColor", "themePrimaryColor", "symbolName", "timeFrame", "getDarvasBoxSettings"]),
        selectWidth() {
            return 'width: 15%'
        },
        chartIndex() {
            return Number(this.$attrs.tv_id?.split('-')[0])
        },
    },

    watch: {
        getDarvasBoxSettings(newVal) {
            this.settings = { ...this.settings, ...newVal };
        }
    }
};
</script>

<style></style>