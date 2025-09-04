<template>
    <p-dialog :visible.sync="visible" :closable="false" @hide="onCancel" :modal="true" class="roundedModal"
        :showHeader="false">
        <!-- <p-button class="p-button-secondary" style="z-index: 1;position: absolute; right: 2rem; top: 1.5rem; border-radius: 24%;" @click="onCancel" icon="pi pi-times" /> -->

        <img class="modal-image" src="/images/ApplicationPopupImg.png" />
        <div style="margin: 1.5rem">

            <span class="ui" style="font-size: 28px;font-weight: 600;">
                Harness the power of Protrader.
            </span><br />
            <span style="font-size: 22px; font-weight: 400; ">
                Scan thousands of stocks in seconds.
            </span><br />
            <span style="font-size: 16px; font-weight: 400;line-height: 2rem;">Psst...Membership includes
                access to our exclusive trading room. Scan thousands of stocks in seconds or keep using our charts for
                free, forever.</span>
        </div>
        <div class="p-d-flex p-jc-center" style="gap: 0.5rem;">
            <p-button @click.native="onSave" class="p-button-lg"
                :label="getUserId ? `Upgrade your plan` : `14-day free trial`" />
            <p-button @click.native="onCancel" class="p-button-light p-button-lg" :label="`Close`" />
        </div>
        <div class="p-d-flex p-jc-center" style="gap: 0.5rem;">
            <h3>No Credit card required</h3>
        </div>
    </p-dialog>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import config from '../../../config.js'
export default {
    name: "RestrictFeatureModal",
    components: {
    },
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
    methods: {
        ...mapMutations(['SET_RESTRICT_POPUP', 'SET_AUTH_MODAL']),
        onCancel() {
            this.SET_RESTRICT_POPUP(false)
            // this.SET_AUTH_MODAL(true)
        },
        onSave() {
            if (this.getUserId != null) {
                this.$router.push("/products")
            }
            else {
                this.SET_RESTRICT_POPUP(false)
                this.SET_AUTH_MODAL(true)
            }
            this.SET_RESTRICT_POPUP(false)
        }
    },
    computed: {
        ...mapGetters([
            'getUserId'
        ])
    }
};
</script>

<style scoped></style>