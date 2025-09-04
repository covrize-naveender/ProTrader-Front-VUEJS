<template>
    <div class="p-mt-4 p-mb-4">
        <div class="p-grid p-m-4">
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Entry Price</label>
                    <p-inputText type="number" placeholder="Entry Price" step="0.01" min="0"
                        v-model="formData.entryPrice" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Stop Loss</label>
                    <p-inputText type="number" placeholder="Stop Loss" step="0.01" min="0"
                        v-model="formData.stopLoss" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Risk Per Share($)</label>
                    <p-inputText type="number" placeholder="Risk Per Share($)" step="0.01" min="0" disabled
                        :value="riskPerShare" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Portfolio Risk(%)</label>
                    <p-inputText type="number" placeholder="Portfolio Risk(%)" step="0.01" min="0"
                        v-model="formData.portFolioRisk" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Portfolio Risk($)</label>
                    <p-inputText type="number" placeholder="Portfolio Risk($)" step="0.01" min="0" disabled
                        :value="portFolioRiskInCash" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Position Size</label>
                    <p-inputText type="number" placeholder="Position Size" step="0.01" min="0" v-model="positionSize" />
                    <small v-if="isLargePositionSizeError" class="form-field-invalid">Reduce the position size</small>
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Trade Risk($)</label>
                    <p-inputText type="number" placeholder="Trade Risk($)" step="0.01" min="0" disabled
                        :value="tradeRisk" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Cost of a position</label>
                    <p-inputText type="number" placeholder="Cost of a position" step="0.01" min="0"
                        v-model="costOfPosition" />
                </div>
            </div>
        </div>








    </div>
</template>

<script>
export default {
    name: 'PositionSize',
    model: {
        prop: 'isValidated',
        event: 'change'
    },
    props: {
        isValidated: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        formData: {
            get() {
                const frmData = this.$store.state.tadePlanner.positionSize
                if (!frmData.entryPrice) {
                    frmData.entryPrice = this.accountBalanceData.purchasePrice
                }
                return frmData
            },
            set(value) {
                this.$store.commit('UPDATE_TRADE_PLANNER_STATE', {
                    key: 'positionSize',
                    data: value
                })
            }
        },
        accountBalanceData() {
            return this.$store.state.tadePlanner.accountBalanceData
        },
        riskPerShare() {
            if (!this.formData.entryPrice || !this.formData.stopLoss) return ''
            return (this.formData.entryPrice - this.formData.stopLoss).toFixed(3)
        },
        portFolioRiskInCash() {
            if (
                !this.accountBalanceData.accountBalance ||
                !this.formData.portFolioRisk
            ) {
                return ''
            }
            return (
                this.accountBalanceData.accountBalance *
                this.formData.portFolioRisk *
                0.01
            ).toFixed(3)
        },
        positionSize: {
            get() {
                return Math.round(this.formData.positionSize)
            },
            set(value) {
                this.formData.positionSize = Math.round(value)
                this.formData.costOfPosition = Math.round(this.formData.positionSize * this.formData.entryPrice)
            }
        },
        tradeRisk() {
            if (!this.formData.positionSize || !this.riskPerShare) {
                return ''
            }
            return (this.formData.positionSize * this.riskPerShare).toFixed(3)
        },
        costOfPosition: {
            get() {
                return this.formData.costOfPosition
            },
            set(value) {
                if (!this.formData.entryPrice) return
                this.formData.positionSize = Math.floor(value / this.formData.entryPrice)
            }
        },
        isLargePositionSizeError() {
            return this.formData.costOfPosition > this.accountBalanceData.accountBalance
        }
    },
    watch: {
        formData: {
            handler: function (newValue) {
                for (const fieldValues of Object.values(newValue)) {
                    if (!fieldValues) return this.$emit('change', false)
                }
                this.$emit('change', true)
            },
            deep: true
        },
        portFolioRiskInCash(newValue) {
            if (!newValue || !this.riskPerShare) return ''
            this.positionSize = this.formData.portFolioRisk * 0.01 * this.accountBalanceData.accountBalance / this.riskPerShare
        }
    }

}
</script>

<style lang="scss" scoped></style>