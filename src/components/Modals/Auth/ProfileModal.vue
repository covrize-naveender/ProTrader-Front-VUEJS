<template>
    <p-dialog :visible.sync="visible" header="Update Profile Settings" :closable="true"
        @hide="$emit('toggleModal', false)" :modal="true">
        <!-- <p class="m-0">{{ getUserId ? getUserId: 'no user'}}</p> -->

        <p-inlinemessage v-if="showError" severity="error">
            <h3>Action Forbidden</h3>
            <p>{{ errorMsg }}</p>
        </p-inlinemessage>
        <p-inlinemessage v-if="showSuccess" severity="success">
            <h3>Success</h3>
            <p>{{ errorMsg }}</p>
        </p-inlinemessage>
        <div :style="themeFontColor" class="name-title">{{ firstName }} {{ lastName }}</div>

        <form class="profileForm">

            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-4">
                    <!-- First Name Field -->
                    <div class="p-field">
                        <label for="firstName">First Name</label><br />
                        <p-inputText id="firstName" v-model="firstName" name="firstName" placeholder="First Name"
                            class="" />
                    </div>
                </div>
                <div class="p-col-12 p-md-6 p-4">
                    <!-- Last Name Field -->
                    <div class="p-field">
                        <label for="lastName">Last Name</label><br />
                        <p-inputText id="lastName" v-model="lastName" name="lastName" placeholder="Last Name"
                            class="" />
                    </div>
                </div>
                <div class="p-col-12 p-md-6 p-4">
                    <!-- Email Field -->
                    <div class="p-field">
                        <label for="email">E-mail</label><br />
                        <p-inputText id="email" v-model="email" name="email" placeholder="joe@schmoe.com" class=""
                            readonly />
                        <p-button @click.prevent="() => showChangeEmailModel = true" class="p-mt-2 p-mb-2">Change
                            Email</p-button>
                        <ChangeEmailModal @toggleModal="showChangeEmailModel = false"
                            :visible.sync="showChangeEmailModel" />
                    </div>
                </div>
            </div>
            <div class="p-grid">

                <div class="p-col-12 p-md-6 p-4">
                    <!-- Old Password Field -->
                    <div class="p-field">
                        <label for="currentPassword">Old Password</label><br />
                        <p-password id="currentPassword" v-model="currentPassword" v-validate="'required'"
                            name="currentPassword" :feedback="false" />
                    </div>
                </div>
                <div class="p-col-12 p-md-6 p-4">
                    <!-- New Password Field -->
                    <div class="p-field">
                        <label for="newPassword">New Password</label><br />
                        <p-password id="newPassword" v-model="newPassword" v-validate="'required'" name="newPassword"
                            :feedback="false" />
                    </div>
                </div>
            </div>
            <div>
                <label :style="themeFontColor"> Subscription Detail</label>
                <div v-for="(item, index) in subs" :keY="index">

                    <div>
                        <div v-if="isPastDueSub">
                            <b>Your Trial Period is Expired. Please <span @click="onSubscribe"
                                    style="color: blue; cursor: pointer; "><u> Subscribe Now</u></span> .</b>
                        </div>
                        <div v-else-if="isTrialMode">
                            <div><b>Product Name: </b>{{ item.product?.desc?.title }}</div>
                            <b> {{ trialModeText }}</b> <span @click="onSubscribe"
                                style="color: blue; cursor: pointer; "><u> Subscribe Now</u></span>
                        </div>
                        <div v-else>
                            <div><b>Product Name: </b>{{ item.product?.desc?.title }}</div>
                            <b>Period Start: </b> {{ formatDate(item.startPeriod) }} <b>Period End:
                            </b>{{ formatDate(item.endPeriod) }}
                        </div>

                        <span v-if="subs[0].subscription_cancel_status === true" style="color: red;">Subscription
                            already cancelled.</span>
                        <a v-else-if="!isTrialMode" @click.prevent="onSubscriptionCancel" href="/">Cancel</a>
                    </div>
                </div>
                <div v-if="subs.length == 0">
                    No Active subscription. <router-link :to="{ path: `/products` }">Subscribe Now</router-link>
                </div>
            </div>

        </form>

        <template #footer>
            <p-button label="OK" @click="submit" />
            <p-button class="p-button-secondary" label="Cancel" @click="$emit('toggleModal', false)" />
        </template>
    </p-dialog>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import {
    deleteSubscription,
    getUserData,
    updateUserProfile
} from '../../../services/user'
import { IndicatorSettingsDefaults } from '../../settingsHelper/GeneralSettingsDefaults'
import ChangeEmailModal from './ChangeEmailModal.vue'

const notificationTimeout = 5000
export default {
    name: 'ProfileSettings',
    components: {
        ChangeEmailModal
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    async mounted() {
        const token = localStorage.getItem('state')
        if (token) {

            const data = await getUserData();
            if (data.status === 'active') {
            } else if (data.status === 'inactive') {
                //this.$router.push('/products')
            }
            else {
                this.$router.push('/login')
            }
            this.firstName = data.firstName
            this.userId = data.id
            this.lastName = data.lastName
            this.email = data.email
            this.subscription = data.subscription || 'yearly'
            this.currentPassword = ''
            if (data && data.userData) {
                let newDataSet = JSON.parse(JSON.stringify(data.userData))
                if (!("additional" in newDataSet?.indicatorSettings)) {
                    newDataSet.indicatorSettings['additional'] = IndicatorSettingsDefaults?.indicatorSettings?.additional
                }
                await this.updateProfileData(newDataSet)
                this.$store.commit('SET_USER_EMAIL', this.email)
            }
            else {
                this.$store.commit('SET_APP_TOUR', false)
            }
            if (data && data.id) {
                this.$store.commit('SET_USER_ID', data.id)
                this.getUserWatches()
                this.getUserScanList(true)
                this.getSavedLayouts()
                this.getSPXDataFunc()
            }

            if (data && data.userSettings && data.userSettings.chartSettings) {
                this.$store.commit('SET_CHART_SETTINGS', data.userSettings.chartSettings)

                this.$store.commit(
                    'SET_CHART_DEFAULT_SETTINGS',
                    data.userSettings.chartSettings
                )
                this.$store.commit('UPDATE_CHART_STATE', new Date().getTime())
            }
        }

    },
    methods: {
        ...mapActions(['getUserWatches', 'getUserScanList', 'updateProfileData', 'getSavedLayouts', 'getSPXDataFunc', 'setProductPageTrial']),
        onClose() {
            this.$emit('change', !open)
        },
        setError(msg) {
            this.errorMsg = msg
            this.showError = true
            this.showSuccess = false
            setTimeout(() => {
                this.showError = false
                this.showSuccess = false
                this.errorMsg = ""
            }, notificationTimeout)
        },
        setSuccess(msg) {
            this.currentPassword = ""
            this.newPassword = ""
            this.errorMsg = msg
            this.showError = false
            this.showSuccess = true
            setTimeout(() => {
                this.showError = false
                this.showSuccess = false
                this.errorMsg = ""
            }, notificationTimeout)
        },
        submit() {
            let updateProfile = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                userId: this.userId,
                currentPassword: this.currentPassword,
                newPassword: this.newPassword,
            }
            updateUserProfile(updateProfile).then(d => {
                if (d?.status) {
                    this.setSuccess(d.msg)
                } else {
                    this.setError(d.msg)
                }
            }).catch(e => {
                this.setError('Invalid Request')
            })
        },
        formatDate(val) {
            return moment(val).format("DD/MM/YYYY HH:mm")
        },
        async onClickTrialActivate() {
            this.$router.push("/products")
        },
        async onSubscriptionCancel() {
            if (confirm('Are you sure, you want to cancel the subscription?')) {
                const payload = this.subs[0].subscriptionId
                const cancel_response = await deleteSubscription(payload)
                // this.$router.push('/products')
                await this.$store.dispatch('user/retrieveUserSubscriptionStatus')
                this.$emit('change', !open);

                // localStorage.removeItem('state')
            }

            // location.reload()
            // const data = await fetchAllSubscriptions()
            // this.$store.commit('user/setSubscriptionList', data.subscription)
        },
        async onSubscribe() {
            if (this.isTrialMode) {
                this.setProductPageTrial(true);
            }
            this.$router.push('/products');
        },
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            userId: '',
            currentPassword: '',
            newPassword: '',
            subscription: '',
            isTrial: false,
            showError: false,
            showSuccess: false,
            showChangeEmailModel: false,
            errorMsg: "",
            subs: [],
        }
    },
    computed: {
        ...mapGetters(['themeFontColor', 'themeDarkMode', 'themeSecondaryColor', 'getUserId']),
        subscriptions() {
            return this.$store.state.user.subscriptionList
        },
        isTrialMode() {
            return this.$store.state.user.subscriptionStatus === 'trialing'
        },
        isPastDueSub() {
            return this.$store.state.user.subscriptionStatus === 'past_due'
        },
        trialModeText() {
            return this.isTrialMode
                ? ' Trial ends in ' + this.$store.state.user.trialEndsIn + ' day(s)'
                : ''
        }
    },
    watch: {
        subscriptions() {
            this.subs = this.subscriptions
        },
    },
    beforeUpdate() {
    }

}
</script>

<style>
.profile-font {
    font-size: 14px;
}

.name-title {
    font-size: medium;
    margin: 0.6rem 0;
}
</style>