<template>
    <div>
        <!-- ALMA -->
        <div class="field-card" v-if="type == 'ALMA'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="almaLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="almaPeriodColor" />
                </div>
            </div>
        </div>

        <!-- ATRp -->
        <div class="field-card" v-if="type == 'ATRp'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="atrpLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="atrpPeriodColor" />
                </div>
            </div>
        </div>

        <!-- BBW -->
        <div class="field-card" v-if="type == 'BBW'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="bbwLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="bbwPeriodColor" />
                </div>
            </div>
        </div>

        <!-- CCI -->
        <div class="field-card" v-if="type == 'CCI'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="cciLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="cciPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Back Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="cciBackColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Band Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="cciBandColor" />
                </div>
            </div>
        </div>

        <!-- CMO -->
        <div class="field-card" v-if="type == 'CMO'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="cmoLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="cmoPeriodColor" />
                </div>
            </div>
        </div>

         <!-- COG -->
         <div class="field-card" v-if="type == 'COG'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="cogLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="cogPeriodColor" />
                </div>
            </div>
        </div>

        <!-- DMI -->
        <div class="field-card" v-if="type == 'DMI'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="dmiLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false" v-model="dmiPeriodColor[0]" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false" v-model="dmiPeriodColor[1]" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false" v-model="dmiPeriodColor[2]" />
                </div>
            </div>
        </div>

        <!-- HMA -->
        <div class="field-card" v-if="type == 'HMA'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="hmaLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="hmaPeriodColor" />
                </div>
            </div>
        </div>

        <!-- KCW -->
        <div class="field-card" v-if="type == 'KCW'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="kcwLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="kcwPeriodColor" />
                </div>
            </div>
        </div>

        <!-- KC -->
        <div class="field-card" v-if="type == 'KC'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="kcLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="kcPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Back Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="kcBackColor" />
                </div>
            </div>
        </div>

        <!-- MOM -->
        <div class="field-card" v-if="type == 'MOM'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="momLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="momPeriodColor" />
                </div>
            </div>
        </div>

        <!-- MFI -->
        <div class="field-card" v-if="type == 'MFI'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="mfiLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="mfiPeriodColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Band Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="mfiBandColor" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Back Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="mfiBackColor" />
                </div>
            </div>
        </div>

        <!-- Ribbon -->
        <div class="field-card" v-if="type == 'Ribbon'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="ribbonLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="ribbonPeriodColor[0]" />
                </div>
            </div>
        </div>

         <!-- VWMA -->
         <div class="field-card" v-if="type == 'VWMA'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="vwmaLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="vwmaPeriodColor" />
                </div>
            </div>
        </div>

        <!-- TSI -->
        <div class="field-card" v-if="type == 'TSI'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="tsiLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="tsiPeriodColor[0]" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="tsiPeriodColor[1]" />
                </div>
            </div>
        </div>

         <!-- SWMA -->
         <div class="field-card" v-if="type == 'SWMA'">
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Line Width</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model="swmaLineWidth" placeholder="20" />
                </div>
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker type="color" :isSettingsPicker="true" :isIconVisible="false"
                        v-model="swmaPeriodColor" />
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>

import PlusChartSettingsComputed from '../../settingsHelper/PlusChartSettingsComputed'
import ColorPicker from '@/baseComponents/ColorPicker.vue'

export default {
    name: 'PlusIndicator',
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
        ...PlusChartSettingsComputed,
    },
    methods: {
        updateProp(type) {
            this.$emit('updateProp', type);
        },
    }
}
</script>

<style lang="scss" scoped></style>