<template>
    <p-dialog :visible.sync="visible" :closable="false" :modal="true" class="roundedModal" :showHeader="false">

        <img class="modal-image" src="/images/ApplicationPopupImg.png" />
        <div style="margin: 1.5rem 2rem;">

            <span class="ui" style="font-size: 28px;font-weight: 600;">
                Ready to join the Protrader community?
            </span><br />
            <span style="font-size: 22px; font-weight: 400;">
                Sign-up for your free 14 day trial now.
            </span>
        </div>
        <div style="text-align: center;">
            <p-button @click.native="onSave" class="p-button-lg"
                :label="`Join For Free`" />
        </div>
    </p-dialog>
</template>

<script>
import { mapMutations } from 'vuex';
import config from '../../../config';

export default {
    name: "IntervalDisableModal",
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            monthly_priceId: config.Monthly_priceId
        }
    },
    model: {
        prop: 'open',
        event: 'change',
    },
    methods: {
        ...mapMutations(['SET_INTERVAL_POPUP', 'SET_AUTH_MODAL']),
        onSave() {
            this.SET_INTERVAL_POPUP(false)
            this.SET_AUTH_MODAL(true)
        }
    },
}
</script>

<style lang="scss" scoped></style>