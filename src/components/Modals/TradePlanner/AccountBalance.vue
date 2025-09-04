<template>
    <div class="p-mt-4 p-mb-4">
        <div class="p-grid p-m-4">
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label
                        :class="(formData.accountBalance !== null && !formData.accountBalance) ? 'form-field-invalid' : ''">Account
                        Balance</label>
                    <p-inputText type="number" placeholder="Account Balance" step="0.01" min="0"
                        v-model="formData.accountBalance"
                        :class="(formData.accountBalance !== null && !formData.accountBalance) ? 'p-invalid' : ''" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label>Stock Code</label>
                    <symbol-search-box :flexStart="true" :value="formData.stockCode" @input="onSymbolChanged"
                        :manualNavigation="false" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label
                        :class="(formData.currentPrice !== null && !formData.currentPrice) ? 'form-field-invalid' : ''">Current
                        Price</label>
                    <p-inputText type="number" placeholder="Current Price" step="0.01" min="0"
                        v-model="formData.currentPrice"
                        :class="(formData.currentPrice !== null && !formData.currentPrice) ? 'p-invalid' : ''" />
                </div>
            </div>
            <div class="p-col-12 p-md-6 p-4">
                <div class="form-field">
                    <label
                        :class="(formData.purchasePrice !== null && !formData.purchasePrice) ? 'form-field-invalid' : ''">Purchase
                        Price</label>
                    <p-inputText type="number" placeholder="Purchase Price" step="0.01" min="0"
                        v-model="formData.purchasePrice"
                        :class="(formData.purchasePrice !== null && !formData.purchasePrice) ? 'p-invalid' : ''" />
                </div>
            </div>
        </div>





    </div>
</template>

<script>
import symbolService from '../../../services/symbol'
import SymbolSearchBox from '../../SymbolSearchBox.vue'
export default {
    name: 'AccountBalance',
    model: {
        prop: 'isValidated',
        event: 'change',
    },
    components: {
        SymbolSearchBox
    },
    props: {
        isValidated: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        async onSymbolChanged(symbol) {
            this.formData.stockCode = symbol
            // fetch the close price
            this.formData.currentPrice = await symbolService.getSymbolClosePrice(
                symbol
            )
            this.formData.purchasePrice = this.formData.currentPrice
        },
    },
    computed: {
        formData: {
            get() {
                return this.$store.state.tadePlanner.accountBalanceData
            },
            set(value) {
                this.$store.commit('UPDATE_TRADE_PLANNER_STATE', {
                    key: 'accountBalanceData',
                    data: value,
                })
            },
        },
    },
    watch: {
        formData: {
            handler: async function (newValue) {
                for (const fieldValues of Object.values(newValue)) {
                    if (!fieldValues) return this.$emit('change', false)
                }
                this.$emit('change', true)
            },
            deep: true,
        },
    }
}
</script>

<style lang="scss" scoped></style>