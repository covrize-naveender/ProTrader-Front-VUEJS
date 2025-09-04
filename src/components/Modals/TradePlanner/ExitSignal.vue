<template>
    <div>
        <h3>Select one or more of the exit signals</h3>
        <div class="checkbox-field">
            <p-checkbox id="gapFilling" v-model="formData.gapFilling" :binary="true" />
            <label for="gapFilling">Gap Filling</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="patternTarget" v-model="formData.patternTarget" :binary="true" />
            <label for="patternTarget">Pattern Target</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="movingAverageBreach" v-model="formData.movingAverageBreach" :binary="true" />
            <label for="movingAverageBreach">Moving Average Breach</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="movingAverageCrossover" v-model="formData.movingAverageCrossover" :binary="true" />
            <label for="movingAverageCrossover">Moving Average Crossover</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="breakOfSupport" v-model="formData.breakOfSupport" :binary="true" />
            <label for="breakOfSupport">Break of Support</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="breakOfResistance" v-model="formData.breakOfResistance" :binary="true" />
            <label for="breakOfResistance">Break of Resistance</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="fibonacciTarget" v-model="formData.fibonacciTarget" :binary="true" />
            <label for="fibonacciTarget">Fibonacci Target</label>
        </div>
        <div class="checkbox-field">
            <p-checkbox id="other" v-model="formData.other" :binary="true" />
            <label for="other">Other</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ExitSignal',
    computed: {
        formData: {
            get() {
                return this.$store.state.tadePlanner.exitSignalData;
            },
            set(value) {
                this.$store.commit("UPDATE_TRADE_PLANNER_STATE", {
                    key: "exitSignalData",
                    data: value,
                });
            },
        },
    }
}
</script>

<style lang="scss" scoped></style>