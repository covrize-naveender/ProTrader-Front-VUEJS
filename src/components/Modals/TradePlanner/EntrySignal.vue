<template>
    <div>
        <h3>Select one or more of the entry signals</h3>
        <div class="checkbox-field">
            <p-checkbox id="darvas" v-model="formData.darvas" :binary="true" />
            <label for="darvas">Darvas</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="ascendingTriangle" v-model="formData.ascendingTriangle" :binary="true" />
            <label for="ascendingTriangle">Ascending Triangle</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="breakResistance" v-model="formData.breakResistance" :binary="true" />
            <label for="breakResistance">Break Resistance</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="newsletter" v-model="formData.newsletter" :binary="true" />
            <label for="newsletter">Newsletter</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="other" v-model="formData.other" :binary="true" />
            <label for="other">Other</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EntrySignal',
    computed: {
        formData: {
            get() {
                return this.$store.state.tadePlanner.entrySignalData;
            },
            set(value) {
                this.$store.commit("UPDATE_TRADE_PLANNER_STATE", {
                    key: "entrySignalData",
                    data: value,
                });
            },
        },
    }
}
</script>

<style lang="scss" scoped></style>