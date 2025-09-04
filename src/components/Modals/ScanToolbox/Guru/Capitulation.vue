<template>
    <div>
        <div class="field-content">

            <label>Any volume of the last two days is at least</label>

            <p-inputText type="number" v-model="settings.volumeMultiplier" min="0.1" step="0.01" class="hidden"
                :style="selectWidth" />

        </div>
        <div class="field-content">
            <label>times greater than the average volume of the</label>

            <p-inputText type="number" v-model="settings.lastVolumeAvgPeriod" min="1" step="1" class="hidden"
                :style="selectWidth" @keypress="preventDecimal" />

            <label> days before them </label>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { CAPITALISATION } from '../../../../utils/defaultScanValues';
export default {
    components: {},

    name: 'Capitulation',
    props: {
        favScanId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            scanType: "capitulation",
            isLoading: false
        }
    },
    methods: {
        ...mapActions(['sendCapitulationRequest', 'setCapitulationSettings', 'cancelGuruScans', 'saveguruScanRequest',
            'getUserScanList', 'runAndUpdateScanSettings',
            'resetSavedScan']),
        async onScanClick() {
            this.isLoading = true
            if (this.favScanId) {
                const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
                await this.runAndUpdateScanSettings(index)
                await this.getUserScanList()
            }
            else {
                await this.sendCapitulationRequest()
            }
            this.isLoading = false
        },
        onScanStop() {
            this.isLoading = false
            this.cancelGuruScans()
        },
        ResetScanDefaultSettings() {
            if (this.favScanId) {
                this.resetSavedScan(this.favScanId)
            }
            else {
                this.setCapitulationSettings(JSON.parse(JSON.stringify(CAPITALISATION)))
            }
        },
        async saveScanSettings(name) {
            await this.saveguruScanRequest({
                scanName: name,
                scanType: 'capitulation'
            })
            this.$store.commit('SCAN_POPUP', false)
            await this.getUserScanList()
        },
        preventDecimal(event) {
            if (event.key === '.' || event.key === ',' || event.key === '-') {
                event.preventDefault();
            }
        },
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
        }
    },
    computed: {
        ...mapGetters(['capitulationSettings', 'gurusScanSettings', 'userSavedScans']),
        selectWidth() {
            return 'width: 15%'
        },

        isValid() {
            return this.settings.volumeMultiplier > 0 && this.settings.lastVolumeAvgPeriod > 0
        },
        settings: {
            get() {
                if (this.favScanId) {
                    return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
                }
                return this.gurusScanSettings.capitulation
            },
            set(value) {
                this.setCapitulationSettings(value)
            }
        }
    }
}
</script>

<style></style>