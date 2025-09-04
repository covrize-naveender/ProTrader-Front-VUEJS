<template>
    <div>
        <!-- Trend Channels -->
        <div class="field-card" v-if="type == 'trendChannels'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="trendChannelValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="trendChannelPeriod" />
                </div>
            </div>
        </div>


        <!-- Bollinger Bands -->
        <div class="field-card" v-if="type == 'bollingerBands'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="bollingerBandPeriodValue" placeholder="20" />
                </div>
            </div>
            
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Deviations</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="bollingerBandDeviationValue" placeholder="20" />
                </div>
            </div>

            <div class="overlay-field p-grid">
                <div class="p-col p-d-flex p-ai-center" style="gap: 0.5rem;">
                    <p-checkbox :binary="true" v-model="bollingerBandEnable"/>
                    <label>Basic Line</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="bollingerBandPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col p-d-flex p-ai-center" style="gap: 0.5rem;">
                    <p-checkbox :binary="true" v-model="bollingerUpperEnable"/>
                    <label>Upper Line</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="bollingerUpperPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col p-d-flex p-ai-center" style="gap: 0.5rem;">
                    <p-checkbox :binary="true" v-model="bollingerLowerEnable"/>
                    <label>Lower Line</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="bollingerLowerPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col p-d-flex p-ai-center" style="gap: 0.5rem;">
                    <p-checkbox :binary="true" v-model="bollingerBackEnable"/>
                    <label>Background</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="bollingerBackColor" />
                </div>
            </div>
        </div>

        <!-- Average True Range -->
        <div class="field-card" v-if="type == 'averageTrueRange'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="atrPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="atrPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="atrLineWidthValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Multiplier</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="atrMultiplierValue" placeholder="2" />
                </div>
            </div>
        </div>

        <!-- Relative Volatility Measure -->
        <div class="field-card" v-if="type == 'relativeVolatilityMeasure'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="rvmPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="rvmPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Multiplier</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="rvmMultiplierValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Back Color 1</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false" v-model="rvmBackColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Back Color 2</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="rvmBackColor1" />
                </div>
            </div>

        </div>

        <!-- MACD -->
        <div class="field-card" v-if="type == 'macd'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Fast Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="macdFastPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Fast Period Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="macdFastPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Slow Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="macdSlowPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Slow Period Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="macdSlowPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Signal Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="macdSignalPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Signal Period Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="macdSignalPeriodColor" />
                </div>
            </div>
        </div>

        <!-- Rate Of Change -->
        <div class="field-card" v-if="type == 'rateOfChange'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="rocPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="rocPeriodColor" />
                </div>
            </div>
        </div>

        <!-- Relative Strength Index -->
        <div class="field-card" v-if="type == 'relativeStrengthIndex'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="rsiPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="rsiPeriodColor" />
                </div>
            </div>
        </div>

        <!-- Rs Rating -->
        <div class="field-card" v-if="type == 'rsRatingIndex'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="rsRatingColor" />
                </div>
            </div>
        </div>

        <!-- Stochastic Oscillator -->
        <div class="field-card" v-if="type == 'stochasticOscillator'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="stocPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>%K Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="stocKPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>K Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="stocKPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>%D Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="stocDPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>D Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="stocDPeriodColor" />
                </div>
            </div>
        </div>

        <!-- Williams %R -->
        <div class="field-card" v-if="type == 'williamsR'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="willRPeriodValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="willRPeriodColor" />
                </div>
            </div>
        </div>

        <!-- Parabolic SAR -->
        <div class="field-card" v-if="type == 'parabolicSar'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Start</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="sarStartValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Increment</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="sarIncrementValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Max</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="sarMaxValue" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="sarSeriesValue" />
                </div>
            </div>
        </div>

        <!-- Value -->
        <div class="field-card" v-if="type == 'valueTraded'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="valueTradedSeriesValue" />
                </div>
            </div>
        </div>

        <!-- VWAP -->
        <div class="field-card" v-if="type == 'vwap'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="vwapSeriesValue" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import IndicatorSettingsComputed from '../../settingsHelper/IndicatorSettingsComputed'
import ColorPicker from '@/baseComponents/ColorPicker.vue'
export default {
    name: 'SingleIndicator',
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    components: {
        ColorPicker
    },
    computed: {
        ...IndicatorSettingsComputed,
    },
    methods: {
        updateProp(type) {
            this.$emit('updateProp', type);
        },
    }
}
</script>

<style lang="scss" scoped></style>