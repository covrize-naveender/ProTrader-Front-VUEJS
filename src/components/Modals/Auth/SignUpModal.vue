<template>
    <p-dialog header=" " :visible.sync="visible" :showHeader="false" :closable="false" @hide="onModalCancel()"
        :modal="true" class="roundedModal">
        <div class="p-d-flex p-jc-end" style="width:100%">

            <p-button class="p-button-secondary p-button-text" @click="onModalCancel" icon="pi pi-times" />
        </div>
        <div class="pageContainerParent" style="width:100%;height:100%;">
            <div class="p-d-flex p-jc-center">
                <Header></Header>
            </div>
            <div v-if="showResendEmail">
                <ResendEmail @resendEmail="handleResendEmail" :isResendLoading="isResendLoading"
                    :isResponseMessage="isResponseMessage"></ResendEmail>
            </div>
            <div v-else>
                <div v-if="priceId" style="height:100%;">
                    <div class="p-d-flex p-jc-center errorText" style="font-size: 15px">
                        <span style="color:#828282">Already have an account?</span>
                        <router-link :to="{ name: 'login' }">
                            <span class="p-d-flex p-jc-center">
                                <span style="color:#F20E17;margin: 0px 5px 0px 5px;cursor: pointer;"
                                    class="hoverUnderline">
                                    Log In
                                </span>
                                <img src="../../../assets/login.svg" />
                            </span>
                        </router-link>
                    </div>

                    <div class="formFreeTrial p-d-flex p-flex-column p-jc-center"
                        style="height:15%; font-size: 40px; color:#300003; font-weight: bold;">
                        <span v-if="showResponseError" class="errorText"
                            style="color:#F20E17;font-size: 15px;margin-top: -2%;font-weight: 300;">{{
                                showResponseError
                            }}</span>
                    </div>
                    <div class="p-d-flex p-flex-column p-jc-center p-ai-center">
                        <span style="font-size: 30px; font-weight: 600">Create an Account</span>
                        <div class="inputHeight signup-field">
                            <DynamicInput type="text" placeholder="Email" :isError="isEmailError"
                                :iconImg="require(`@/assets/${isEmailError ? 'redEmail.svg' : 'email.svg'}`)"
                                v-model="email" />
                        </div>
                        <div style="height:4%;margin-top: 1%;" class="signup-field-text">
                            <span v-if="emailErrorMsg == 'already exits'" style="color:#F20E17;font-size:13px">⚠
                                It
                                seems you already have an account with Pro Trader.
                                <router-link :to="{ name: 'login' }" style="color:#F20E17;">
                                    <span style="text-decoration: underline;cursor: pointer;">Login here</span>
                                </router-link>
                                or
                                <router-link :to="{ name: 'ResetPassword' }" style="color:#F20E17;">
                                    <span style="text-decoration: underline;cursor: pointer;">reset your
                                        password</span>
                                </router-link>
                            </span>
                            <span v-else class="errorText" style="color:#F20E17;font-size:13px">{{
                                emailErrorMsg}}</span>
                        </div>

                        <div class="inputHeight signup-field" style="margin: 2% 0px 1% 0px;"
                            :style="{ marginTop: emailErrorMsg == 'already exits' ? '4%' : '2%' }">
                            <DynamicInput :type="showPassword ? 'text' : 'password'" placeholder="Password"
                                :iconImg="require(`@/assets/${isPasswordError ? 'redEye.svg' : showPassword ? 'openEye.svg' : 'closeEye.svg'}`)"
                                v-model="password" :isError="isPasswordError"
                                @password-visibility-toggled="handlePasswordVisibilityToggle" />
                        </div>

                        <div class="strongPassword">
                            <div style="height:15px;display:flex;align-items: center;">
                                <div class="strongPasswordLine" :style="{
                                    height: '4px',
                                    background: weakPassword === 0 ? '#F20E17' : '#BDBDBD',
                                    width: '33%',
                                }"></div>
                                <div class="strongPasswordLine" :style="{
                                    height: '4px',
                                    background: mediumPassword === 1 ? '#e2e522' : '#BDBDBD',
                                    width: '33%',
                                    margin: '0 2% 0 2%',
                                }"></div>
                                <div class="strongPasswordLine" :style="{
                                    height: '4px',
                                    background: strongPassword === 2 ? '#4ece31' : '#BDBDBD',
                                    width: '33%',
                                }"></div>
                            </div>
                            <div style="margin-top: 1%;">
                                <span v-if="passwordErrorMsg" style="color:#F20E17;font-size:13px" class="errorText">
                                    {{ showWarningIcon ? '⚠' : '' }} {{ passwordErrorMsg }}
                                </span>
                            </div>
                            <div style=""><span v-if="strongPassword" style="color:#333333;font-size:13px"
                                    class="errorText">Your Password is strong. Good Job!</span></div>


                        </div>

                        <div class="iUnderstandContainer signup-field" style="margin:1% 0 1% 0;padding-top: 2%;">
                            <div style="display:flex;">
                                <div class="form-group">
                                    <input type="checkbox" v-model="isUnderstood" class="checkInput" />
                                </div>
                                <div class="iUnderstandText" style="margin-left:10px;font-size: 13px;"
                                    :style="{ color: isUnderstood ? '#F20E17' : '#828282' }">
                                    I understand Pro Trader does not provide personalised professional financial
                                    advice
                                </div>
                            </div>
                            <div class="errorText" style="color:#F20E17" v-if="requiredError">* Required fields
                            </div>
                        </div>
                        <div style="margin-top: 4%;" class="signup-field">
                            <button :class="isUnderstood ? 'btnRedHover' : 'btnGrayHover'" @click="handleCreateAccount"
                                :style="{
                                    background: isUnderstood ? '#F20E17' : '#E0E0E0',
                                    color: isUnderstood ? 'white' : '#828282',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    pointerEvents: isLoading ? 'none' : 'auto'
                                }" class="p-jc-center p-ai-center p-d-flex"
                                style="height:4rem; width: 100%;border-radius: 5px; font-size: 18px; cursor:pointer">
                                <span v-if="isLoading" style="margin-right: 10px;">
                                    <Loader></Loader>
                                </span>
                                <span>
                                    {{ isLoading ? 'Creating an Account' : 'Create an Account' }}
                                </span>
                                <div v-if="isUnderstood" style="margin-left:8%">
                                    <img src="../../../assets/rightArrow.svg" />
                                </div>
                            </button>
                        </div>
                        <div class="iUnderstandText signup-field" style="color:#828282;">
                            By creating an account, you agree to our <span style="text-decoration:underline">T&Cs</span>
                            and have read and acknowledge the <span style="text-decoration:underline">Global Privacy
                                Statement</span>.
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import config from '../../../config';
import { createAccount, resendEmail } from '../../../services/user';
import DynamicInput from '../../DynamicInput.vue';
import Header from '../../Header.vue';
import Loader from '../../Loader.vue';
import ResendEmail from '../../ResendEmail.vue';

export default {
    name: 'SignUpModal',
    components: {
        Header,
        DynamicInput,
        Loader,
        ResendEmail
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
            yearly_priceId: config.Yearly_priceId,


            email: '',
            password: '',
            priceId: null,
            showResponseError: "",
            isEmailError: false,
            emailErrorMsg: "",
            showPassword: false,
            isPasswordError: false,
            weakPassword: null,
            mediumPassword: null,
            strongPassword: null,
            passwordErrorMsg: "",
            showWarningIcon: false,
            isUnderstood: false,
            requiredError: false,
            isLoading: false,
            emailRegix: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            passwordRegix: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/,
            showResendEmail: false,

            isResponseMessage: "",
            isResendLoading: false,
        }
    },
    mounted() {

        if (this.selectedPriceId === config.Yearly_priceId) {
            this.priceId = config.Yearly_priceId
        }
        else {
            this.priceId = config.Monthly_priceId
        }
    },
    methods: {
        ...mapActions(['changeAuthModal']),
        onModalCancel() {
            this.changeAuthModal(false)
            this.showResendEmail = false
        },
        handlePasswordVisibilityToggle() {
            this.showPassword = !this.showPassword
        },

        async handleCreateAccount() {

            if (!this.email && !this.password && !this.isUnderstood) {
                this.isEmailError = true
                this.emailErrorMsg = "*Required Field"
                this.isPasswordError = true
                this.passwordErrorMsg = "*Required Field"
                this.requiredError = true
                return
            }

            if (!this.email) {
                this.isEmailError = true
                this.emailErrorMsg = "*Required Field"
                return
            }
            if (!this.password) {
                this.isPasswordError = true
                this.passwordErrorMsg = "*Required Field"
                return
            }
            if (!this.isUnderstood) {
                this.requiredError = true
                return
            }

            if (this.email) {
                if (!this.emailRegix.test(this.email)) {
                    this.isEmailError = true
                    this.emailErrorMsg = "Invalid Email"
                    return
                }
            }
            if (this.password) {
                if (!this.passwordRegix.test(this.password)) {
                    this.isPasswordError = true
                    this.strongPassword = null
                    this.showWarningIcon = true
                    this.passwordErrorMsg = "The password must be more than 9 characters including uppercase, lowercase, numbers and special characters."
                    return
                }
            }

            this.isLoading = true
            const payload = {
                email: this.email,
                password: this.password,
                stripeId: this.priceId
            }

            const res = await createAccount(payload)
            if (res?.data?.success) {
                this.showResendEmail = true
            } else {
                if (res?.data?.message == "User Alredy Exists!") {
                    this.isEmailError = true
                    this.emailErrorMsg = "already exits"
                } else {
                    this.showResponseError = res?.data?.message
                    setTimeout(() => {
                        this.showResponseError = ""
                    }, 5000);
                }
            }
            this.isLoading = false
        },

        calculatePasswordStrength(pass) {
            if (pass?.length > 0) {
                if (pass?.length <= 3) {
                    this.weakPassword = 0
                    this.mediumPassword = null,
                        this.strongPassword = null
                } else if (pass?.length <= 8) {
                    this.weakPassword = 0
                    this.mediumPassword = 1,
                        this.strongPassword = null
                } else if (pass?.length > 9) {
                    if (this.passwordRegix.test(pass)) {
                        this.weakPassword = 0
                        this.mediumPassword = 1
                        this.strongPassword = 2
                    }
                }
            } else {
                this.weakPassword = null
                this.mediumPassword = null
                this.strongPassword = null
            }

        },
        async handleResendEmail() {
            this.isResendLoading = true
            const payload = {
                email: this.email,
                password: this.password,
                stripeId: this.priceId

            }
            const res = await resendEmail(payload)
            if (res?.data?.success) {
                this.isResponseMessage = res?.data?.message
            } else {
                this.isResponseMessage = res?.data?.message
            }
            setTimeout(() => {
                this.isResponseMessage = ""
            }, 5000);
            this.isResendLoading = false
        }
    },
    watch: {
        password(newPassword) {
            this.calculatePasswordStrength(newPassword);
            this.isPasswordError = false
            this.passwordErrorMsg = ""
            this.showWarningIcon = false
        },
        email() {
            this.isEmailError = false
            this.emailErrorMsg = ""
        },
        isUnderstood() {
            this.requiredError = false
        },
        selectedPriceId(newVal, o) {
            if (newVal === config.Yearly_priceId) {
                this.priceId = config.Yearly_priceId
            }
            else {
                this.priceId = config.Monthly_priceId
            }
        }
    },
    computed: {
        ...mapGetters([
            'selectedPriceId'
        ])
    }
}

</script>
<style>
/*
@media screen and (max-width: 800px) {
  .login-container{
  margin-left:2%;
  margin-right: 2%;
  width:100%;
  padding-top: 5%;
}
} */

.n-input {
    padding: 0.8rem !important;
}

.navigate-notice {
    margin-top: .5rem;
}

.loginModal .close {
    top: 1.2rem !important;
    right: 1.2rem !important;
    color: #000 !important;
}

.user-profile {
    width: 60px;
    height: 60px;
    border: 2px solid #fff;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    display: inline-block;
    margin-left: -30px;
    z-index: 1;
}

.user-profile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-profile:nth-child(2) {
    margin-left: -20px;
}

.user-profile:nth-child(3) {
    margin-left: -20px;
}

.join-us-text {
    font-size: 20px;
    color: #333333;
    margin-left: 20px;
    /* margin-top: 20px; */
}

.registerModal .close {
    top: 1.2rem !important;
    right: 1.2rem !important;
    color: #000 !important;
    font-size: larger !important;
}

.registerModal {
    font-family: -apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif;
    color: #131722;
}

.regModal-content {
    border-radius: 3% !important;
    padding: 0.9rem !important;
}

.registerModal>div.modal {
    border-radius: 3%;
}
</style>