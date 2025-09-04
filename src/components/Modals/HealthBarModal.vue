<template>
    <p-dialog header="ProTrader Health Report" :visible.sync="visible" @hide="$emit('toggleModal', false)" :modal="true"
        :dismissableMask="true" class="healthbar-dialog">

        <div>
            <p>Runs several test(detailed below) over the stock to determine its overall helth. As this stock does
                not
                pay a divident, the tests take a shorter time frame to look for more rapid price movements.</p>
            <p-divider />

            <div class="p-d-flex p-jc-between p-mt-2 p-mb-2">
                <div>
                    <h4>Test 1: Exponential moving averages</h4>
                    <p>Examines whether the stock has closed above the 34 and 55 day exponential moving averages. If
                        the
                        stock has closed above both, it receives full points, oterwise it receives no points.</p>
                </div>
                <div>
                    <h3>{{ this.allTest?.test1 }}/100</h3>
                </div>
            </div>
            <p-divider />

            <div class="p-d-flex p-jc-between p-mt-2 p-mb-2">
                <div>
                    <h4>Test 2: On-balance volume</h4>
                    <p>Examines the average on-balance volume of the stock over the last 13 days versus the 21 days
                        prior.
                        If the latest average is higher than the prior average, the stock receives full points,
                        otherwise it
                        receives no points.</p>
                </div>
                <div>
                    <h3>{{ this.allTest?.test2 }}/100</h3>
                </div>
            </div>
            <p-divider />

            <div class="p-d-flex p-jc-between p-mt-2 p-mb-2">
                <div>
                    <h4>Test 3: Price</h4>
                    <p>Examines the current price trend of the stock using the Trend channel Indicator over 21 days.
                        If the
                        trend is up, the stock receives full points, if it is sideways, it receives half points, and
                        if it is
                        down it receives no points.</p>
                </div>
                <div>
                    <h3>{{ this.allTest?.test3 }}/100</h3>
                </div>
            </div>
            <p-divider />

            <div class="p-d-flex p-jc-between p-mt-2 p-mb-2">
                <div>
                    <h4>Test 4: Volume</h4>
                    <p>Checks whether the stock has traded more than 2,500,000 shares over the past 5 days. If it
                        has, it
                        will receive a perfect score for this test. Anything lower than 2,500,000 will be reflacted
                        proportionately in the score.</p>
                </div>
                <h3>{{ this.allTest?.test4?.toFixed(2) }}/20</h3>
            </div>

            <p-divider />

            <div class="p-d-flex p-jc-between p-mt-2 p-mb-2">
                <div>
                    <h4>Test 5: Value</h4>
                    <p>Checks whether the stock has traded more than $ 1,500,000 worth of shares over the past 5
                        days. If it
                        has, It will receive a perfect score for this test. Anything lower than $ 1,500,000 will be
                        reflacted
                        proportionately in the score.</p>
                </div>
                <div>
                    <h3>{{ this.allTest?.test5?.toFixed(2) }}/20</h3>
                </div>
            </div>

        </div>
    </p-dialog>
</template>

<script>
export default {
    name: 'HealthBarModal',
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        allTest: {
            type: Object,
            default: {
                test1: 0,
                test2: 0,
                test3: 0,
                test4: 0,
                test5: 0
            }
        }
    },
}
</script>

<style lang="scss" scoped></style>