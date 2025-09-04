<template>
    <p-dialog :visible.sync="visible" :closable="true" @hide="onCancel" :modal="true"
        :header="modelHeader">
        <div class="p-grid">
            <div class="p-col">
                <div class="field-content" v-if="isPnf">
                    <label>Box size</label>
                    <p-inputText type="number" min="0.1" step="0.01" v-model="boxSize" />

                </div>
                <div class="field-content" v-if="isPnf">
                    <label>Reversal</label>
                    <p-inputText type="number" min="1" step="1" v-model="reversal" />
                </div>
                <div class="field-content">
                    <p-inputText type="number" v-model="maxPrice" />
                    <label>Max price scale</label>

                </div>
                <div class="field-content">
                    <p-inputText type="number" v-model="minPrice" />
                    <label>Min price scale</label>
                </div>
                <p-button label="Set Default Scale" @click="handleResetScale" class="p-button-secondary" />
            </div>
            <div class="p-col">
                <h3>Chart type</h3>
                <div class="field-content">
                    <p-radiobutton id="logScale_settings" name="logScale" value="logScale" v-model="scale" />
                    <label for="logScale_settings">Log Chart</label>
                </div>
                <div class="field-content">
                    <p-radiobutton id="stdScale_settings" name="logScale" value="stdScale" v-model="scale" />
                    <label for="stdScale_settings">Standard Chart</label>
                </div>

            </div>
        </div>
        <template #footer>
            <p-button label="Save" @click="onSave" />
            <p-button label="Cancel" @click="onCancel" class="p-button-secondary" />
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { chartEvents } from '../../chartEvents'
export default {
    name: 'ChartPropModal',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isLoading: false,
            maxPrice: 0,
            minPrice: 0,
            boxSize: 0,
            reversal: 2,
            scale: 'stdScale'
        }
    },
    methods: {
        ...mapActions(['setLogScale']),
        ...mapMutations(['MAIN_CHART_PROPS']),
        onCancel() {
            this.MAIN_CHART_PROPS(!open)
        },
        handleResetScale() {
            this.multiTv.map((tv) => {
                tv?.data?.tv.toggleSideBarYAxis()
            })
            this.minPrice = 0;
            this.maxPrice = 0;
            this.MAIN_CHART_PROPS(!open)
        },
        onSave() {
            if (this.isPnf) {
                chartEvents.$emit('PnfValueUpdate', {
                    boxSize: this.boxSize,
                    reversal: this.reversal,
                })
            }
            if (this.scale == 'logScale') {
                this.setLogScale(true)
            }
            else {
                this.setLogScale(false)
            }
            if (this.maxPrice != 0 && this.minPrice != 0) {
                this.multiTv.map((tv) => {
                    
                    tv?.data?.tv.toggleSidebarCustomRange([Number(this.maxPrice),Number(this.minPrice)])
                })
            }
            this.MAIN_CHART_PROPS(!open)
        },
        PnfValueSetterToModal(val) {
            this.boxSize = val.boxSize
            this.reversal = val.reversal
        },
    },
    computed: {
        ...mapGetters(['getChartType', 'multiTv', 'logScale', 'themeFontColor']),
        getRadioProps() {
            return {
                ...this.themeFontColor,
                cursor: 'pointer',
                marginRight: '.8em',
                fontWeight: 'normal',
            }
        },
        modelHeader() {
            return `Chart Settings ${this.getChartType}`
        },
        isPnf() {
            return this.getChartType === 'PnF'
        },
        isCandles() {
            return this.getChartType === 'Candles'
        },
    },
    watch: {
        logScale(newVal, oldVal) {
            if (newVal) {
                this.scale = 'logScale'
            }
            else {
                this.scale = 'stdScale'
            }
        }
    },
    mounted() {
        chartEvents.$on('PnfValueSetterToModal', this.PnfValueSetterToModal)
    },
    beforeDestroy() {
        chartEvents.$off('PnfValueSetterToModal')
    },
}
</script>

<style lang="scss" scoped></style>