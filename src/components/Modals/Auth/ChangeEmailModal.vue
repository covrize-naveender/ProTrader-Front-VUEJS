<template>
    <p-dialog header="Update Profile Settings" :visible.sync="visible" :closable="true" @hide="$emit('toggleModal')"
        :modal="true" class="small-dialog">
        <p-inlinemessage v-if="isError" severity="error">
            <h3>Action Forbidden</h3>
            <p>{{ errorMessage }}</p>
        </p-inlinemessage>

        <form class="profileForm">
            <div class="p-field" v-if="!passwordVerified">
                <label for="password">Please verify your password</label><br />
                <p-password id="password" v-model="password" name="password" :feedback="false" placeholder="Password"/>
            </div>
            <div class="p-field" v-if="passwordVerified">
                <label for="email">Enter your new email address</label><br />
                <p-inputText id="email" v-model="email" name="email" placeholder="Email"  />
            </div>
            <div class="p-field" v-if="emailVerified">
                <label for="userOtp">Verify new email address</label><br />
                <p-inputText @keypress.enter="submit" id="userOtp" v-model="userOtp" name="userOtp" placeholder="Enter 6-digit OTP code"  />
            </div>
        </form>
        <template #footer>
            <p-button label="OK" @click="submit" />
            <p-button class="p-button-secondary" label="Close" @click="$emit('toggleModal')" />
        </template>
    </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
    SendOneTimePassword,
    verifyOTP,
    VerifyPassword,
} from '../../../services/user';
const notificationTimeout = 5000
export default {
    name: 'ChangeEmailModal',
    components: {
    },

    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        ...mapActions([]),
        setErorrMethod(errorCheck, errorMessage) {
            this.isError = errorCheck
            this.errorMessage = errorMessage
        },

        async handleVerifyPassword() {
            try {
                const response = await VerifyPassword({
                    userId: this.getUserId,
                    password: this.password,
                })
                if (response.data.success) {
                    this.passwordVerified = response.data.data
                    this.setErorrMethod(false, '')
                } else {
                    this.setErorrMethod(true, 'Password you entererd was incorrect')
                }
            } catch (err) {
                this.setErorrMethod(true, err.message)
            }
        },
        async handleSendOTP() {
            try {
                const response = await SendOneTimePassword({
                    userId: this.getUserId,
                    email: this.email,
                })
                if (response.data.success) {
                    this.emailVerified = true
                    this.setErorrMethod(false, '')
                } else {
                    this.setErorrMethod(true, response.data.msg || 'Your OTP could not be generated')
                }
            } catch (err) {
                this.setErorrMethod(true, err.message)
            }
        },
        async handleVerifyOtp() {
            try {
                const response = await verifyOTP({
                    userId: this.getUserId,
                    email: this.email,
                    otp: this.userOtp,
                })
                if (response.data.success) {
                    const token = response?.data?.data?.accessToken
                    localStorage.setItem('state', token)
                    location.reload()
                    this.password = ''
                    this.email = ''
                    this.userOtp = ''
                    this.passwordVerified = false
                    this.emailVerified = false
                    this.setErorrMethod(false, '')
                    this.$emit('change', !this.open)
                } else {
                    this.setErorrMethod(true, response.data.msg)
                }
            } catch (err) {
                this.setErorrMethod(true, err.message)
            }
        },

        async submit(event) {
            event.preventDefault()
            if (!this.passwordVerified) {
                if (this.password == '') return
                this.showLoader = true
                await this.handleVerifyPassword()
            } else if (this.passwordVerified && !this.emailVerified) {
                if (this.email == '') return
                this.showLoader = true
                await this.handleSendOTP()
            } else {
                if (this.userOtp == '') return
                this.showLoader = true
                await this.handleVerifyOtp()
            }
            this.showLoader = false
        },
        onClose(event) {
            event.preventDefault()
            this.passwordVerified = false
            this.emailVerified = false
            this.setErorrMethod(false, '')
            this.password = ''
            this.email = ''
            this.userOtp = ''
            this.$emit('change', !open)
        },
    },
    data() {
        return {
            password: '',
            email: '',
            passwordVerified: false,
            emailVerified: false,
            showLoader: false,
            userOtp: '',
            isError: false,
            errorMessage: '',
        }
    },
    computed: {
        ...mapGetters([
            'themeFontColor',
            'themeDarkMode',
            'themeSecondaryColor',
            'getUserId',
        ]),
    },
    watch: {},
}
</script>

<style>
.profile-font {
    font-size: 14px;
}
</style>