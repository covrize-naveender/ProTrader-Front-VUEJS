<template>
    <p-dialog :visible.sync="visible" header="Training Mode" :closable="true" @hide="onClose" :modal="true" >
        <p class="m-0">Training mode is designed to simulate your trading procedures. Once training mode is on, the data
            displayed reverts to a date of your choice (we suggest going back approximately 200 days). You may then
            arrow forward day by day, thereby testing your trading skills. Using the cursor controls (left and right
            arrows) in the data panel (located to the right of the stock date, above the open/high/low/close data), the
            cursor may be moved to the right revealing each new days' data. Using the training mode you may safely
            'practice trading', resulting in testing and improving your trading knowledge and trading plan without
            risking your capital. Select your desired starting date, and click OK to get started.</p>
        <br />
        <div class="ui form">
            <div class="p-field">
                <label :style="themeFontColor">Starting Date</label>
                <p-inputText type="date" v-model="startingDate"  />
            </div>
        </div>
        <br />
        <b> Note:</b> The application will remain in training mode until you click
        the training mode icon a second time.
        <template #footer>
            <p-button label="Ok" @click="onPressOk" />
            <p-button label="Cancel" class="p-button-secondary" @click="onClose" />
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment/moment'
export default {
    name: 'TrainingMode',
    components: {
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            startingDate: '2022-10-01',
            inputcolor: 'light',
        }
    },
    watch: {
        themeDarkMode(val) {
            if (val) {
                this.inputcolor = 'dark'
            } else {
                this.inputcolor = 'light'
            }
        },
    },
    methods: {
        ...mapActions(['updateTrainingModeState']),
        onClose() {
            this.$emit('toggleModal')
        },
        async onPressOk() {
            const startingTime = new Date(this.startingDate).getTime()
            const symbolData = this.multiOhlcv[this.selectedTab]
            const symbolDataLastIndex = symbolData.length - 1
            const symbolDatumElement = symbolData[symbolDataLastIndex][0]
            if (startingTime > symbolDatumElement) return

            let index = 0
            for (const dt of symbolData) {
                if (dt[0] > startingTime) break
                index++
            }

            const end = index + 1
            const trainingOffset = this.trainingOffset
            const trainingModeData = this.multiChartSymbol[this.selectedTab]?.data.slice(
                index - trainingOffset,
                end
            )
            const trainingModeDataRemaining = symbolData.slice(
                index + 1,
                symbolData.length
            )

            const trainingModeDataRaw = trainingModeData.map((candle) => [
                moment(candle.date).valueOf(),
                candle.open,
                candle.high,
                candle.low,
                candle.close,
                candle.volume,
                null,
                candle.value,
            ])
            const trainingModeDataRaw2 = trainingModeDataRemaining.map((candle) => [
                candle[0],
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ])
            const finalRawDataSet = [...trainingModeDataRaw, ...trainingModeDataRaw2]

            this.updateTrainingModeState({
                state: !this.isTrainingMode,
                startingIndex: index,
                trainingDataIndex: trainingModeData.length - 1,
                trainingModeData,
                trainingModeDataRaw: finalRawDataSet,
            })
            await this.$nextTick()
            this.onClose()
        },
    },
    computed: {
        ...mapGetters([
            'themeDarkMode',
            'isTrainingMode',
            'multiChartSymbol',
            'trainingOffset',
            'themeFontColor',
            'themePrimaryColor',
            'themeSecondaryColor',
            'multiOhlcv',
            'selectedTab'
        ]),
        today() {
            return Date.now()
        },
    },
}
</script>

<style>
input {
    color-scheme: v-bind(inputcolor);
}


</style>