<template>
    <div>
        <h3>Select one or more of the confirmation signals</h3>
        <div class="checkbox-field">
            <p-checkbox id="atr" v-model="formData.atr" :binary="true" />
            <label for="atr">ATR</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="pctValue" v-model="formData.pctValue" :binary="true" />
            <label for="pctValue">% Value</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="dataPoint" v-model="formData.dataPoint" :binary="true" />
            <label for="dataPoint">Data Point</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="supportLevel" v-model="formData.supportLevel" :binary="true" />
            <label for="supportLevel">Support Level</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="other" v-model="formData.other" :binary="true" />
            <label for="other">Other</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RiskManagement',
    computed: {
        formData: {
            get() {
                return this.$store.state.tadePlanner.riskManagementSignalData;
            },
            set(value) {
                this.$store.commit("UPDATE_TRADE_PLANNER_STATE", {
                    key: "riskManagementSignalData",
                    data: value,
                });
            },
        },
    }
}
</script>

<style lang="scss" scoped></style>