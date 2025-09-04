<template>
    <div>
        <h3>Select one or more of the confirmation signals</h3>
        <div class="checkbox-field">
            <p-checkbox id="obv" v-model="formData.obv" :binary="true" />
            <label for="obv">OBV</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="marketDepth" v-model="formData.marketDepth" :binary="true" />
            <label for="marketDepth">Market Depth</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="other" v-model="formData.other" :binary="true" />
            <label for="other">Other</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfirmationSignal',
    computed: {
        formData: {
            get() {
                return this.$store.state.tadePlanner.confirmationSignalData;
            },
            set(value) {
                this.$store.commit("UPDATE_TRADE_PLANNER_STATE", {
                    key: "confirmationSignalData",
                    data: value,
                });
            },
        },
    }
}
</script>

<style lang="scss" scoped></style>