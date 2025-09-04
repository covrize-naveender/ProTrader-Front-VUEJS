<template>
    <p-dialog :visible.sync="visible" header="Settings" @hide="onClose" :modal="true" class="settings-modal">
        <p-tabview class="settingsTab">
            <p-tabpanel header="General">
                <GeneralSettings @propChange="propChange"/>
            </p-tabpanel>
            <p-tabpanel header="Indicators">
                <IndicatorSettings @updateProp="updateProp" @propChange="propChange" :changesNotSaved="changesNotSaved" :propUpdates="propUpdates"/>
            </p-tabpanel>
            <p-tabpanel header="Themes">
                <div class="p-d-flex p-ai-center p-jc-between">
                    <div>

                        <div class="field-content">

                            <p-radiobutton id="theme" name="themes" value="Themes" v-model="selectedTheme"
                                v-on:change="disableCustomFonts" />
                            <label for="theme">Themes</label>
                        </div>
                        <p-dropdown v-model="primaryThemeId" :options="default_themes" optionLabel="text"
                            optionValue="value" placeholder="Select a theme" style="width: 15rem;" />
                    </div>
                    <div>
                        <p-button class="p-button-secondary " type="button"
                            :icon="themeSettings.id === 'dark' ? 'pi pi-sun' : 'pi pi-moon'" @click="checkDarkMode()" />
                    </div>
                </div>
                <p-divider />
                <div class="field-content">

                    <p-radiobutton id="custom" name="themes" value="Custom" v-model="selectedTheme"
                        v-on:change="disableTheme" />
                    <label for="custom">Custom</label>
                </div>
                <div class="p-grid p-mr-2">
                    <div class="p-col" :style="themeFontColor">Font</div>

                    <div class="p-col">
                        <color-picker v-model="themeSettingsSettingsFont" is-settings-picker fieldRef="font"
                            type="settings" v-on:input="changeCustomSettings" :isDisabled="isThemePrimary" />
                    </div>
                </div>
                <div class="p-grid p-mr-2">
                    <div class="p-col" :style="themeFontColor">Primary</div>

                    <div class="p-col">
                        <color-picker is-settings-picker v-model="themeSettingsSettingsPrimary" fieldRef="primary"
                            type="settings" v-on:input="changeCustomSettings" :isDisabled="isThemePrimary" />
                    </div>
                </div>
                <div class="p-grid p-mr-2">
                    <div class="p-col" :style="themeFontColor">Secondary</div>

                    <div class="p-col">
                        <color-picker is-settings-picker v-model="themeSettingsSettingsSecondary" fieldRef="secondary"
                            type="settings" v-on:input="changeCustomSettings" :isDisabled="isThemePrimary" />
                    </div>
                </div>
            </p-tabpanel>
            <p-tabpanel header="Plus charts">
                <div class="p-grid">
                    <div class="p-col-12 p-md-6 p-4">
                        <CMO_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>
                    <div class="p-col-12 p-md-6 p-4">
                        <ALMA_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>
                    <div class="p-col-12 p-md-6 p-4">
                        <BBW_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>
                    <div class="p-col-12 p-md-6 p-4">
                        <ATRP_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <COG_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <HMA_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <KCW_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <MOM_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <VWMA_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <Ribbon_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <KC_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <TSI_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <MFI_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <CCI_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>

                    <div class="p-col-12 p-md-6 p-4">
                        <DMI_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>
                    <div class="p-col-12 p-md-6 p-4">
                        <SWMA_SettingsWindow @runGeneralSetting="runGeneralSetting" />
                    </div>
                </div>
            </p-tabpanel>
        </p-tabview>

        <template #footer>
            <p-button class="p-button-secondary p-button-outlined p-pr-2 p-pl-2" icon="pi pi-refresh" @click="onReset" v-tooltip.bottom="`Reset`"/>
            <p-button label="Ok" @click="onSave" />
            <p-button class="p-button-secondary" label="Cancel" @click="onClose" />
        </template>


    </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import { DEFAULT_THEME_SETTINGS, THEME_DETAILS, } from '../../../settings/THEME_DETAILS'

import CMO_SettingsWindow from "./PlusChart/CMO_SettingsWindow";
import ALMA_SettingsWindow from "./PlusChart/ALMA_SettingsWindow.vue";
import BBW_SettingsWindow from "./PlusChart/BBW_SettingsWindow.vue";
import ATRP_SettingsWindow from "./PlusChart/ATRP_SettingsWindow.vue";
import COG_SettingsWindow from "./PlusChart/COG_SettingsWindow.vue";
import HMA_SettingsWindow from "./PlusChart/HMA_SettingsWindow.vue";
import KCW_SettingsWindow from "./PlusChart/KCW_SettingsWindow.vue";
import MOM_SettingsWindow from "./PlusChart/MOM_SettingsWindow.vue";
import VWMA_SettingsWindow from "./PlusChart/VWMA_SettingsWindow.vue";
import Ribbon_SettingsWindow from "./PlusChart/Ribbon_SettingsWindow.vue";
import KC_SettingsWindow from "./PlusChart/KC_SettingsWindow.vue";
import TSI_SettingsWindow from "./PlusChart/TSI_SettingsWindow.vue";
import MFI_SettingsWindow from "./PlusChart/MFI_SettingsWindow.vue";
import CCI_SettingsWindow from "./PlusChart/CCI_SettingsWindow.vue";
import DMI_SettingsWindow from "./PlusChart/DMI_SettingsWindow.vue";
import SWMA_SettingsWindow from "./PlusChart/SWMA_SettingsWindow.vue";
import GeneralSettings from './GeneralSettings.vue'
import IndicatorSettings from './IndicatorSettings/IndicatorSettings.vue'
import PlusChartSettingsComputed from '../../settingsHelper/PlusChartSettingsComputed'

export default {
    name: 'Settings',
    components: {
        GeneralSettings,
        IndicatorSettings,

        DMI_SettingsWindow,
        SWMA_SettingsWindow,
        CCI_SettingsWindow,
        MFI_SettingsWindow,
        TSI_SettingsWindow,
        KC_SettingsWindow,
        Ribbon_SettingsWindow,
        VWMA_SettingsWindow,
        MOM_SettingsWindow,
        KCW_SettingsWindow,
        HMA_SettingsWindow,
        COG_SettingsWindow,
        ATRP_SettingsWindow,
        BBW_SettingsWindow,
        ALMA_SettingsWindow,
        CMO_SettingsWindow,

        ColorPicker,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        runGeneralSetting(key, value) {
            if (key && key in this) {
                // let PlusChartSettingsComputedElement = this[key];
                this[key] = value
            }
        },
        checkDarkMode() {
            this.toggleDarkMode(this.themeSettings.id).then((d) => {
            })
        },
        updateProp(id) {
            if (!this.propUpdates.includes(id)) {
                this.changesNotSaved = true
                this.propUpdates.push(id)
            }
        },
        ...mapActions([
            'setIndicatorDefaultSettings',
            'saveUserSettings',
            'toggleDarkMode',
        ]),
        async onSave() {
            if (this.changesNotSaved) {
                let res = await this.saveUserSettings()
                if (res) {
                    this.$store.commit('USER_SET_UPDATE_CHARTS', this.propUpdates)
                    this.propUpdates = []
                }
                this.changesNotSaved = false
            }
            this.$emit('toggleModal', false)
        },
        async onReset() {
            this.$store.commit('RESET_CHART_SETTINGS_DEFAULTS')
            let res = await this.saveUserSettings()
            if (res) {
                this.$store.commit('USER_SET_UPDATE_CHARTS', this.propUpdates)
                this.propUpdates = []
            }
            this.changesNotSaved = false
            this.propUpdates = []
            this.$emit('toggleModal', false)
        },
        onClose() {
            this.changesNotSaved = false
            this.propUpdates = []
            this.$emit('toggleModal', false)
        },
        disableCustomFonts: function (d) {
            if (d) {
                this.$store.commit('UPDATE_DEFAULT_THEME', 'classic')
            }
            this.isCustomTheme = !d
            this.propChange()
        },
        disableTheme: function (d) {
            if (d) {
                this.$store.commit(
                    'UPDATE_CUSTOM_THEME',
                    JSON.parse(JSON.stringify(DEFAULT_THEME_SETTINGS.settings))
                )
            }
            this.propChange()
        },
        propChange() {
            this.changesNotSaved = true
        },
        changeCustomSettings: function (data, prop, type) {
            let payload = this.themeSettings.settings
            payload[prop] = data
            this.propChange()
            this.$store.commit('UPDATE_CUSTOM_THEME', payload)
        },
    },

    data() {
        return {
            propUpdates: [],
            multiItems: 0,
            changesNotSaved: false,
            theme_type: 1,
            selected_theme: 1,
            default_themes: [
                {
                    text: 'Classic',
                    value: 'classic',
                },
                {
                    text: 'Dark',
                    value: 'dark',
                },
                {
                    text: 'Grey',
                    value: 'grey',
                },
            ],
            custom_theme: {
                themeFont: '',
                themePrim: '',
                themeSecond: '',
            },
            showVolumeBars: true,
            settings: {
                sma: 14,
                tci: 21,
            },
            selectedTheme: 'Themes'

        }
    },
    watch: {
        showVolumeBars: function (newValue) {
            this.$store.state.dc.set('chart.settings', {
                showVolume: newValue,
            })
        },
        settings: {
            handler: function (newSettings) {
                this.setIndicatorDefaultSettings(newSettings)
            },
            deep: true,
        },
        themeSettings(n, o) {
        },
    },
    computed: {
        ...PlusChartSettingsComputed,
        ...mapGetters([
            'onlyMatHasAccess',
            'getUserSettingData',
            'defaultIndicatorSettings',
            'defaultChartSettings',
            'chartSettings',
            'protraderGeneralSettings',
            'themeSettings',
            'userThemeSettings',
            'defaultThemeSettings',
            'themePrimaryColor',
            'themeSecondaryColor',
            'themeFontColor',
            'isThemePrimary',
            'userMultiSettings',
            'getUserEmail',
            'themeDarkMode',
        ]),
        primaryThemeId: {
            get() {
                return this.themeSettings.id
            },
            set(value) {
                this.propChange()
                this.$store.commit('UPDATE_DEFAULT_THEME', value)
            },
        },
        themeSettingsSettingsFont: {
            get() {
                let themeSettings = this.themeSettings
                let settings = themeSettings.settings
                let themeDetailDefault = THEME_DETAILS[themeSettings.id]
                return settings && settings.font
                    ? settings.font
                    : themeDetailDefault && themeDetailDefault.font
                        ? themeDetailDefault.font
                        : ''
            },
            set(val){
                console.log(val);
            }
        },
        themeSettingsSettingsPrimary: {
            get() {
                let themeSettings = this.themeSettings
                let settings = themeSettings.settings
                let themeDetailDefault = THEME_DETAILS[themeSettings.id]
                return settings && settings.primary
                    ? settings.primary
                    : themeDetailDefault && themeDetailDefault.primary
                        ? themeDetailDefault.primary
                        : ''
            },
            set(val){
                console.log(val);
            }
        },
        themeSettingsSettingsSecondary: {
            get() {
                let themeSettings = this.themeSettings
                let settings = themeSettings.settings
                let themeDetailDefault = THEME_DETAILS[themeSettings.id]
                return settings && settings.secondary
                    ? settings.secondary
                    : themeDetailDefault && themeDetailDefault.secondary
                        ? themeDetailDefault.secondary
                        : ''
            },
            set(val){
                console.log(val);
            }
        },
    },
    mounted() {
    },
    watch: {
        isThemePrimary(newVal) {
            newVal == true ? this.selectedTheme = 'Themes' : this.selectedTheme = 'Custom'
        }
    }
}
</script>

<style scoped></style>