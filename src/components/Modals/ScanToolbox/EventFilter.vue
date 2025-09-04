<template>
    <div>
        <multiple-checker @selectAll="updateAllSelections(true)" @clearAll="updateAllSelections(false)" />

        <!-- 1st Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="breakComputed" :binary="true" />

            <p-inputText type="number" v-model="settings_break_period" @input="handleUserChoice" class="hidden" :style="selectWidth"/>

            <label>period</label>

            <p-dropdown v-model="settings_break_direction" :options="breakDirectionOptions" optionLabel="text"
                optionValue="value" />

            <p-dropdown v-model="settings_break_type" :options="breakingTypeOptions" optionLabel="text"
                optionValue="value"  />

        </div>

        <!-- 2nd Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="prebreakComputed" :binary="true" />

            <label>Within</label>

            <p-inputText type="number" v-model="settings_prebreak_pct" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>% of last</label>

            <p-inputText type="number" v-model="settings_prebreak_period" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>period(s)</label>

            <p-dropdown v-model="settings_prebreak_type" :options="peakTypeOptions" optionLabel="text"
                optionValue="value" />

        </div>

        <!-- 3rd Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="volumeIncreaseComputed" :binary="true" />

            <label>Increase volume for</label>

            <p-inputText type="number" v-model="settings_volumeIncrease_period" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>day(s) of data</label>

        </div>

        <!-- 4th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="tciBreakComputed" :binary="true" />

            <label>TCI Break</label>

            <p-radiobutton :id="'tciBreakDirection~up' + id" name="tciBreakDirection" value="up"
                v-model="settings_tciBreak_direction" />

            <label :for="'tciBreakDirection~up' + id">Up</label>

            <p-radiobutton :id="'tciBreakDirection~down' + id" name="tciBreakDirection" value="down"
                v-model="settings_tciBreak_direction" />

            <label :for="'tciBreakDirection~down' + id">Down</label>

            <p-radiobutton :id="'tciBreakDirection~all' + id" name="tciBreakDirection" value="all"
                v-model="settings_tciBreak_direction" />

            <label :for="'tciBreakDirection~all' + id">All</label>

        </div>

        <!-- 5th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="tciTrendComputed" :binary="true" />

            <label>TCI</label>

            <template v-for="(v, i) of tciBreakProps">
                <p-radiobutton :id="'tciTrendDirection~' + id + i" name="tciTrendDirection" :value="v.value"
                    v-model="settings_tciTrend_direction" />

                <label :for="'tciTrendDirection~up' + id">{{ v.label }}</label>
            </template>

            <p-inputText type="number" v-model="settings_tciTrend_period" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

        </div>

        <!-- 6th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="macdComputed" :binary="true" />

            <label>MACD</label>

            <p-inputText type="number" v-model="settings_macd_period" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>bars from a crossover</label>

        </div>

        <!-- 7th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="obvComputed" :binary="true" />

            <label>OBV</label>

            <p-inputText type="number" v-model="settings_obv_pctAbove" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>% above the level of</label>

            <p-inputText type="number" v-model="settings_obv_period" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>bars ago</label>

        </div>

        <!-- 8th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="volumeMoreComputed" :binary="true" />

            <label>Volume more than</label>

            <p-inputText type="number" v-model="settings_volumeMore_pct" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>% above highest vol. of the previous</label>

            <p-inputText type="number" v-model="settings_volumeMore_period" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>bars(s)</label>

        </div>

        <!-- 9th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="trendLineCrossingComputed" :binary="true" />

            <label>Trend line crossing in the last</label>

            <p-inputText type="number" v-model="settings_trendLineCrossing_period" @input="handleUserChoice"
                class="hidden" :style="selectWidth" />

            <label>bars(s)</label>

        </div>

        <!-- 10th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="gapUpComputed" :binary="true" />

            <label>Find any stock that left a gap up by at least</label>

            <p-inputText type="number" v-model="settings_gapUp_cents" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>cents</label>

        </div>

        <!-- 11th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="gapDownComputed" :binary="true" />

            <label>Find any stock that left a gap down by at least</label>

            <p-inputText type="number" v-model="settings_gapDown_cents" @input="handleUserChoice" class="hidden"
                :style="selectWidth" />

            <label>cents</label>

        </div>

        <!-- 12th Event Filter -->
        <div class="field-event">
            <p-checkbox v-model="settings_matchCombination" :binary="true" />

            <label>Match selected events in combination</label>

        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DEFAULT_EVENT_SETTINGS } from '../../../settings/USER_SETTINGS_DEFAULT'
import MultipleChecker from '../../../baseComponents/MultipleChecker.vue'
export default {
    components: { MultipleChecker },
    props: {
        id: {
            type: String,
            default: null,
        },
        favScanId: {
            type: String,
            default: ''
        }
    },
    name: 'EventsFilter',
    data() {
        return {
            breakDirectionOptions: [
                {
                    text: 'breakup',
                    value: 'breakup',
                },
                {
                    text: 'breakdown',
                    value: 'breakdown',
                },
            ],
            breakingTypeOptions: [
                {
                    text: 'High',
                    value: 'high',
                },
                {
                    text: 'Low',
                    value: 'low',
                },
                {
                    text: 'Close',
                    value: 'close',
                },
            ],
            peakTypeOptions: [
                {
                    text: 'High',
                    value: 'high',
                },
                {
                    text: 'Low',
                    value: 'low',
                },
            ],
            settings: {
                break: {
                    isActive: false,
                    period: 30,
                    direction: 'breakup',
                    type: 'close',
                },
                volumeIncrease: {
                    isActive: false,
                    period: 4,
                },
                tciBreak: {
                    isActive: false,
                    direction: 'down',
                },
                tciTrend: {
                    isActive: false,
                    direction: 'up',
                    period: 21,
                },
                macd: {
                    isActive: false,
                    period: 2,
                },
                obv: {
                    isActive: false,
                    pctAbove: 2,
                    period: 2,
                },
                volumeMore: {
                    isActive: false,
                    pct: 1300,
                    period: 1,
                },
                trendLineCrossing: {
                    isActive: false,
                    period: 1,
                },
                gapUp: {
                    isActive: false,
                    cents: 10,
                },
                gapDown: {
                    isActive: false,
                    cents: 10,
                },
                matchCombination: false,
            },
            tciBreakProps: [
                { label: 'Up Trend', value: 'up' },
                { label: 'Down Trend', value: 'down' },
                { label: 'Horizontal', value: 'neutral' },
            ],
        }
    },
    computed: {
        ...mapGetters([
            'filterSettings',
            'themePrimaryColor',
            'themeSecondaryColor',
            'eventsSettings',
            'themeFontColor',
            'userChoice',
            'themeDarkMode',
            'userSavedScans'
        ]),
        selectWidth() {
            return 'width: 15%'
        },
        eventSettingsData() {
            return this.eventsSettings(this.id)
        },
        breakComputed: {
            get() {
                return this.getSettingCheck('break')
            },
            set(value) {
                this.setSettingCheck('break', value)
            },
        },
        prebreakComputed: {
            get() {
                return this.getSettingCheck('prebreak')
            },
            set(value) {
                this.setSettingCheck('prebreak', value)
            },
        },
        volumeIncreaseComputed: {
            get() {
                return this.getSettingCheck('volumeIncrease')
            },
            set(value) {
                this.setSettingCheck('volumeIncrease', value)
            },
        },
        tciBreakComputed: {
            get() {
                return this.getSettingCheck('tciBreak')
            },
            set(value) {
                this.setSettingCheck('tciBreak', value)
            },
        },
        tciTrendComputed: {
            get() {
                return this.getSettingCheck('tciTrend')
            },
            set(value) {
                this.setSettingCheck('tciTrend', value)
            },
        },
        macdComputed: {
            get() {
                return this.getSettingCheck('macd')
            },
            set(value) {
                this.setSettingCheck('macd', value)
            },
        },
        obvComputed: {
            get() {
                return this.getSettingCheck('obv')
            },
            set(value) {
                this.setSettingCheck('obv', value)
            },
        },
        volumeMoreComputed: {
            get() {
                return this.getSettingCheck('volumeMore')
            },
            set(value) {
                this.setSettingCheck('volumeMore', value)
            },
        },
        trendLineCrossingComputed: {
            get() {
                return this.getSettingCheck('trendLineCrossing')
            },
            set(value) {
                this.setSettingCheck('trendLineCrossing', value)
            },
        },
        gapUpComputed: {
            get() {
                return this.getSettingCheck('gapUp')
            },
            set(value) {
                this.setSettingCheck('gapUp', value)
            },
        },
        gapDownComputed: {
            get() {
                return this.getSettingCheck('gapDown')
            },
            set(value) {
                this.setSettingCheck('gapDown', value)
            },
        },
        settings_break_period: {
            get() {
                return this.getSetting('break', 'period')
            },
            set(value) {
                this.setSetting('break', 'period', value)
            },
        },
        settings_break_direction: {
            get() {
                return this.getSetting('break', 'direction')
            },
            set(value) {
                this.setSetting('break', 'direction', value)
            },
        },
        settings_break_type: {
            get() {
                return this.getSetting('break', 'type')
            },
            set(value) {
                this.setSetting('break', 'type', value)
            },
        },
        settings_prebreak_pct: {
            get() {
                return this.getSetting('prebreak', 'pct')
            },
            set(value) {
                this.setSetting('prebreak', 'pct', Math.max(0, Math.min(100, value)))
            },
        },
        settings_prebreak_period: {
            get() {
                return this.getSetting('prebreak', 'period')
            },
            set(value) {
                this.setSetting('prebreak', 'period', value)
            },
        },
        settings_prebreak_type: {
            get() {
                return this.getSetting('prebreak', 'type')
            },
            set(value) {
                this.setSetting('prebreak', 'type', value)
            },
        },
        settings_volumeIncrease_period: {
            get() {
                return this.getSetting('volumeIncrease', 'period')
            },
            set(value) {
                this.setSetting('volumeIncrease', 'period', value)
            },
        },
        settings_tciBreak_direction: {
            get() {
                return this.getSetting('tciBreak', 'direction')
            },
            set(value) {
                this.setSetting('tciBreak', 'direction', value)
            },
        },
        settings_tciTrend_direction: {
            get() {
                return this.getSetting('tciTrend', 'direction')
            },
            set(value) {
                this.setSetting('tciTrend', 'direction', value)
            },
        },
        settings_tciTrend_period: {
            get() {
                return this.getSetting('tciTrend', 'period')
            },
            set(value) {
                this.setSetting('tciTrend', 'period', value)
            },
        },
        settings_macd_period: {
            get() {
                return this.getSetting('macd', 'period')
            },
            set(value) {
                this.setSetting('macd', 'period', value)
            },
        },
        settings_obv_pctAbove: {
            get() {
                return this.getSetting('obv', 'pctAbove')
            },
            set(value) {
                this.setSetting('obv', 'pctAbove', value)
            },
        },
        settings_obv_period: {
            get() {
                return this.getSetting('obv', 'period')
            },
            set(value) {
                this.setSetting('obv', 'period', value)
            },
        },
        settings_volumeMore_pct: {
            get() {
                return this.getSetting('volumeMore', 'pct')
            },
            set(value) {
                this.setSetting('volumeMore', 'pct', value)
            },
        },
        settings_volumeMore_period: {
            get() {
                return this.getSetting('volumeMore', 'period')
            },
            set(value) {
                this.setSetting('volumeMore', 'period', value)
            },
        },
        settings_trendLineCrossing_period: {
            get() {
                return this.getSetting('trendLineCrossing', 'period')
            },
            set(value) {
                this.setSetting('trendLineCrossing', 'period', value)
            },
        },
        settings_gapUp_cents: {
            get() {
                return this.getSetting('gapUp', 'cents')
            },
            set(value) {
                this.setSetting('gapUp', 'cents', value)
            },
        },
        settings_gapDown_cents: {
            get() {
                return this.getSetting('gapDown', 'cents')
            },
            set(value) {
                this.setSetting('gapDown', 'cents', value)
            },
        },
        settings_matchCombination: {
            get() {
                let settings = this.eventSettingsData
                return settings && settings.matchCombination
                    ? settings.matchCombination
                    : this.settings.matchCombination
            },
            set(value) {
                let settings = this.eventSettingsData
                settings['matchCombination'] = value
                this.setEventsFilterSettings({
                    l: 'settings_single',
                    id: this.id,
                    settings,
                })
            },
        },
    },
    methods: {
        ...mapActions(['setEventsFilterSettings']),
        handleUserChoice() {
            if (!this.userChoice) {
                this.$store.commit('SET_USER_CHOICE', true)
            }
        },
        preventDecimal(event) {
            if (event.key === '.' || event.key === ',' || event.key === '-') {
                event.preventDefault();
            }
        },
        setSettingCheck(key, value) {
            let settings = this.eventSettingsData
            settings[key].isActive = value
            this.setEventsFilterSettings({
                l: 'settings_single',
                id: this.id,
                settings,
            })
        },
        getSettingCheck(key) {
            let settings = this.favScanId ? this.userSavedScans.find(x => x.id == this.favScanId).data.events : this.eventSettingsData
            if (settings && settings[key]) {
                return settings[key].isActive
            } else {
                return this.settings[key] ? this.settings[key].isActive : false
            }
        },
        setSetting(key1, key2, value) {
            let settings = this.eventSettingsData
            settings[key1][key2] = value
            this.setEventsFilterSettings({
                l: 'settings_single',
                id: this.id,
                settings,
            })
        },
        getSetting(key1, key2) {
            // if (this.favScanId) {
            //     return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
            // }
            let settings = this.favScanId ? this.userSavedScans.find(x => x.id == this.favScanId).data.events : this.eventSettingsData
            if (settings && settings[key1]) {
                return settings[key1][key2]
            } else {
                if (this.settings[key1] == null || this.settings[key1] == undefined) {
                    return DEFAULT_EVENT_SETTINGS[key1][key2]
                }
                return this.settings[key1][key2]
            }
            // this.setEventsFilterSettings({l:"settings_single",id:this.id,settings})
        },
        updateAllSelections(state) {
            this.handleUserChoice()
            this.breakComputed = state
            this.prebreakComputed = state
            this.volumeIncreaseComputed = state
            this.tciBreakComputed = state
            this.tciTrendComputed = state
            this.macdComputed = state
            this.obvComputed = state
            this.volumeMoreComputed = state
            this.trendLineCrossingComputed = state
            this.gapUpComputed = state
            this.gapDownComputed = state
            this.settings_matchCombination = state
        },
    },
    watch: {
        eventSettingsData: {
            handler: function () {
                const isSelected =
                    this.breakComputed ||
                    this.prebreakComputed ||
                    this.volumeIncreaseComputed ||
                    this.tciBreakComputed ||
                    this.tciTrendComputed ||
                    this.macdComputed ||
                    this.obvComputed ||
                    this.volumeMoreComputed ||
                    this.trendLineCrossingComputed ||
                    this.gapUpComputed ||
                    this.gapDownComputed ||
                    this.settings_matchCombination
                this.$emit('valid', isSelected)
            },
            deep: true,
            immediate: true
        }
    },
}
</script>

<style>
.field-event {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
}
</style>