<template>
    <div class="chart-bottom" style="height: 25px;">
        <div class="bottom-box p-d-flex p-jc-end p-mr-4 p-ai-center p-mt-1 p-mb-1" style="gap: 0.5rem;">
            <span>
                {{ utcTime }} (UTC) 
            </span>
            <span class="bottom-divider">
                |
            </span>
            <span>
                %
            </span>

            <p-button :class="`p-button-text toptool-bold-font ${logScale ? '' : 'p-button-secondary'}`" label="log"
                @click="setLogScale(true)" style="padding: 0;" />
            <p-button :class="`p-button-text toptool-bold-font ${logScale ? 'p-button-secondary' : ''}`" label="auto"
                @click="setLogScale(false)" style="padding: 0;" />

        </div>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'chartBottomBox',
    data() {
        return {
            utcTime: "",
        };
    },
    methods: {
        ...mapActions([
            'setLogScale'
        ]),
        updateUTCTime() {
            const now = new Date();
            this.utcTime = now.toISOString().slice(11, 19);
        },
        startPreciseClock() {

            const now = new Date();
            const delay = 1000 - now.getMilliseconds();


            setTimeout(() => {
                this.updateUTCTime();

                this.interval = setInterval(this.updateUTCTime, 1000);
            }, delay);
        },
    },
    computed: {
        ...mapGetters([
            'logScale'
        ])
    },
    mounted() {
        this.startPreciseClock();
    },
    beforeDestroy() {

        clearInterval(this.interval);
    },
}
</script>

<style lang="scss" scoped></style>