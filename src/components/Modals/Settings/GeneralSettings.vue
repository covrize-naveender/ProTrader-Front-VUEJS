<template>
    <div class="p-grid generalSettings">
        <div class="p-col-12 p-md-6 p-4">
            <div class="settings-container">
                <h4 :style="themeFontColor">Chart</h4>
                <div class="p-grid setting-item p-mr-2" key="lineColor">
                    <div class="p-col-10" :style="themeFontColor">Line Color
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartLineColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="sideColor">
                    <div class="p-col-10" :style="themeFontColor">Unchanged Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartSideColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="upColor">
                    <div class="p-col-10" :style="themeFontColor">Up Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartUpColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="downColor">
                    <div class="p-col-10" :style="themeFontColor">Down Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartDownColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="barChange">
                    <div class="p-col-10" :style="themeFontColor">Use Up/Down Colour on Bar Chart
                    </div>
                    <div class="p-col-2">
                        <p-checkbox id="barChange" name="barChange" v-model="chartBarChange" :binary="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="semiLogAxis">
                    <div class="p-col-10" :style="themeFontColor">Semi Log Price Axis
                    </div>
                    <div class="p-col-2">
                        <p-checkbox id="semiLogAxis" name="semiLogAxis" v-model="chartSemiLogAxis" :binary="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="volumeColor">
                    <div class="p-col-10" :style="themeFontColor">Volume Color
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartVolumeColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="upColorVolume">
                    <div class="p-col-10" :style="themeFontColor">Up Volume Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartUpColorVolume" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="downColorVolume">
                    <div class="p-col-10" :style="themeFontColor">Down Volume Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartDownColorVolume" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="barChangeVolume">
                    <div class="p-col-10" :style="themeFontColor">Use Up/Down Colours on Volume Chart
                    </div>
                    <div class="p-col-2">
                        <p-checkbox id="barChangeVolume" name="barChangeVolume" v-model="chartBarChangeVolume"
                            :binary="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="obvColor">
                    <div class="p-col-10" :style="themeFontColor">On-Balance Volume Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="chartObvColor" :isSettingsPicker="true" />
                    </div>
                </div>
            </div>
        </div>
        <div class="p-col-12 p-md-6 p-4">
            <div class="settings-container settings-container-space">
                <h4 :style="themeFontColor">CrossHair</h4>
                <div class="p-grid setting-item p-mr-2" key="enabled">
                    <div class="p-col-10" :style="themeFontColor">Enabled
                    </div>
                    <div class="p-col-2">
                        <p-checkbox id="enabled" name="enabled" v-model="crossHairEnabled" :binary="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="crossHairLineColor">
                    <div class="p-col-10" :style="themeFontColor">Line Color
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="crossHairLineColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="crossHairBoxColor">
                    <div class="p-col-10" :style="themeFontColor">Box Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="crossHairBoxColor" :isSettingsPicker="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="crossHairTextColor">
                    <div class="p-col-10" :style="themeFontColor">Text Colour
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="crossHairTextColor" :isSettingsPicker="true" />
                    </div>
                </div>
            </div>
            <div class="settings-container settings-container-space">
                <h4 :style="themeFontColor">Marker</h4>
                <div class="p-grid setting-item p-mr-2" key="markerEnabled">
                    <div class="p-col-10" :style="themeFontColor">Use Up/Down Colour on Bar Chart
                    </div>
                    <div class="p-col-2">
                        <p-checkbox id="marker-enabled" name="marker-enabled" v-model="markerEnabled" :binary="true" />
                    </div>
                </div>
                <div class="p-grid setting-item p-mr-2" key="markerLineColor">
                    <div class="p-col-10" :style="themeFontColor">Line Color
                    </div>
                    <div class="p-col-2">
                        <color-picker v-model="markerLineColor" :isSettingsPicker="true" />
                    </div>
                </div>

            </div>
            <div class="settings-container settings-container-space">
                <h4 :style="themeFontColor">Misc</h4>
                <div class="p-grid setting-item p-mr-2" key="markerHidePopup">
                    <div class="p-col-10" :style="themeFontColor">Use Up/Down Colour on Bar Chart
                    </div>
                    <div class="p-col-2">
                        <p-checkbox id="markerHidePopup" name="markerHidePopup" v-model="markerHidePopup"
                            :binary="true" />
                    </div>
                </div>


            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GeneralSettingsComputed from '../../settingsHelper/GeneralSettingsComputed'
import ColorPicker from '@/baseComponents/ColorPicker.vue'
export default {
    name: 'GenreralSettings',
    components: {
        ColorPicker
    },
    data(){
        return{
            changesNotSaved :false
        }
    },
    watch:{
        changesNotSaved(newVal, oldVal){
            if (newVal != oldVal) {
                this.$emit('propChange')
            }
        }
    },
    computed: {
        ...mapGetters(['themeFontColor']),
        ...GeneralSettingsComputed,
    }
}
</script>

<style lang="scss" scoped></style>