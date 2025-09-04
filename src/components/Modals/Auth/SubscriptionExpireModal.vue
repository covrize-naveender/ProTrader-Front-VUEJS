<template>
    <p-dialog class="small-dialog" :showHeader="false" :closable="false" :visible.sync="visible" @hide="onClose"
        :modal="true">
        <div class="ui center aligned">
            <br />
            <h4 class="ui">
                You Free Plan is about to expire soon, Please subscribe now...

            </h4>
            <br />
            <div class="ui red" v-if="showError" style="color: red">
                {{ msg }}
            </div>
        </div>
        <template #footer>
            <p-button label="Subscribe" @click="onSave" />
            <p-button label="Close" @click="onClose" class="p-button-secondary" />
        </template>
    </p-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import config from '../../../config';
export default {
    name: 'SubscriptionExpireModal',
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
            monthly_priceId: config.Monthly_priceId,
            msg: '',
            showError: false,
        }
    },

    methods: {
        ...mapMutations(['SET_SUB_EXP_POPUP']),
        ...mapActions(['setProductPageTrial']),
        async onSave() {
            this.setProductPageTrial(true);
            this.$router.push('/products');
        },
        onClose() {
            this.SET_SUB_EXP_POPUP(false)
        }
    },
}

</script>
<style></style>