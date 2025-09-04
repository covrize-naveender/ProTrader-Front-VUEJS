<template>
    <div style="width:100%;height:100%;overflow: hidden;padding: 40px 40px 40px 80px;"
        class="page-background mobileMainContainer">
        <div v-if="isStripeLoader"
            style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
            <Loader></Loader>
        </div>
        <div v-else class="pageContainerParent"
            style="width:100%;height:100%;display:flex; justify-content: space-between">
            <div class="pageContainer"
                style="height:100%;width:25%;display: flex; flex-direction: column;justify-content: space-between;">
                <div style="height:10%">
                    <Header></Header>
                </div>
                <div style="height:80%;">
                    <!-- form -->
                    <div @click="handleBack()"
                        style="display: flex;align-items: center;font-size: 15px;width: fit-content;">
                        <img src="../assets/backArrow.svg" />
                        <span class="hoverUnderline iUnderstandText"
                            style="color:#828282;margin-left: 10px;cursor: pointer;">Phone Number </span>
                    </div>

                    <div class="formSevenDayTrial"
                        style="border:1px solid #F20E17;font-size: 18px;color:#F20E17;width: fit-content;border-radius: 10px;padding: 5px 15px 5px 15px;font-weight: 500;display: none;margin: 20px 0px 20px 0px;">
                        {{ trial_days }}-DAYS FREE TRIAL
                    </div>

                    <div class="headerDiv"
                        style="height:15%;display: flex;flex-direction: column;,align-items: center;justify-content: center;font-size: 40px;color:#300003;font-weight: bold;">
                        <div class="headerTitle">
                            Verify your number
                        </div>
                        <div class="errorText" v-if="responseError"
                            style="font-size: 16px;color:#828282;margin-top: -1%;font-weight: 300;">
                            {{ responseError }}
                        </div>
                    </div>

                    <div class="inputHeight" style="height: 8%;margin: 2% 0px 1% 0px;">
                        <DynamicInput type="number" placeholder="6-digit code"
                            :iconImg="require(`@/assets/${isCode ? 'redCode.svg' : 'codeSvg.svg'}`)" v-model="code"
                            :isError="isCode" />
                    </div>
                    <div style="height:4%;">
                        <div style="height:4%;margin-top: 1%;">
                            <span class="errorText" v-if="unMatchError" style="color:#F20E17;font-size:13px">⚠ This code
                                doesn’t match. <span @click="handleResendCode()"
                                    :style="{ pointerEvents: isResendLodaing ? 'none' : 'auto', color: isResendLodaing ? '#E0E0E0' : '#F20E17' }"
                                    style="text-decoration: underline;">Resend Code</span></span>
                            <span class="errorText" v-if="codeError" style="color:#F20E17;font-size:13px">{{ codeError
                                }}</span>
                        </div>
                    </div>


                    <div class="inputHeight" style="height:8%;">
                        <button :class="code ? 'btnRedHover' : 'btnGrayHover'" @click="handleVerifyCode"
                            :style="{ background: code ? '#F20E17' : '#E0E0E0', color: code ? 'white' : '#828282', pointerEvents: isLoading ? 'none' : 'auto' }"
                            style="height:100%;cursor:pointer;width:100%;border-radius: 5px;font-size: 18px;display: flex;align-items: center;justify-content: center;">
                            <span v-if="isLoading" style="margin-right: 10px;">
                                <Loader></Loader>
                            </span>
                            {{ isLoading ? 'Verifying' : 'Verify' }}
                            <div v-if="code" style="margin-left:8%">
                                <img src="../assets/rightArrow.svg" />
                            </div>
                        </button>
                    </div>
                    <div class="iUnderstandText" style="color:#828282;margin-top:2%">
                        <span style="color:#828282">Didn't Recieve it? </span>
                        <span @click="handleResendCode()"
                            :style="{ pointerEvents: isResendLodaing ? 'none' : 'auto', color: isResendLodaing ? '#E0E0E0' : '#F20E17' }"
                            style="color:#F20E17;margin: 0px 5px 0px 5px;cursor: pointer;text-decoration:underline">
                            Resend Code
                        </span>
                    </div>




                </div>
                <div style="height:5%;" class="hideDetail">
                    <!-- footer -->
                    <Footer></Footer>
                </div>
            </div>


            <div class="smallFooter" style="display: none">
                <SmallScreenFooter></SmallScreenFooter>
            </div>

            <div style="height:100%;width:68%" class="hideDetail">
                <TrialInfo></TrialInfo>
            </div>
        </div>
    </div>
</template>

<script>
// import {loginUser, registerUser} from '../services/user'

import DynamicInput from '../components/DynamicInput.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ResendEmail from '../components/ResendEmail.vue'
import TrialInfo from '../components/TrialInfo.vue'
import AccountReady from '../components/AccountReady.vue'
import Loader from '../components/Loader.vue'
import { verifyMobileOtp, sendOtp } from '../services/user'
import SmallScreenFooter from './SmallScreenFooter.vue'
import config from '../config'


export default {
    name: 'VerifyOtp',
    components: {
        DynamicInput,
        Header,
        Footer,
        ResendEmail,
        TrialInfo,
        AccountReady,
        Loader,
        SmallScreenFooter
    },
    data() {
        return {
            code: false,
            code: "",
            isCode: false,
            codeError: "",
            requiredError: false,
            isVerified: false,
            currentToken: "",
            currentPhone: "",
            isLoading: false,
            responseError: "",
            unMatchError: false,
            isResendLodaing: false,
            isStripeLoader: false,
            trial_days: config.TRIAL_DAYS
        }
    },
    methods: {
        async handleVerifyCode() {
            if (!this.code) {
                this.codeError = "*Required Field"
                this.isCode = true
                return
            }

            if (this?.code?.length != 6) {
                this.codeError = "Invalid Code"
                this.isCode = true
                return
            }

            const payload = {
                token: this.currentToken,
                phone: this.currentPhone,
                code: this.code
            }
            this.isLoading = true
            const res = await verifyMobileOtp(payload)
            if (res?.data?.success) {
                this.isStripeLoader = true
                window.location.href = res?.data?.payload;
            } else {
                if (res?.data?.message == "Invalid") {
                    this.unMatchError = true
                    this.isCode = true

                } else {
                    this.responseError = res?.data?.message
                    setTimeout(() => {
                        this.responseError = ""
                    }, 5000);
                }
            }
            this.isLoading = false
        },

        async handleResendCode() {
            this.isResendLodaing = true
            const payload = { phone: this.currentPhone }
            const res = await sendOtp(payload)
            if (res?.data?.success) {
                this.responseError = "Code sent successfully"
            } else {
                this.responseError = res?.data?.message
            }
            setTimeout(() => {
                this.responseError = ""
            }, 5000);
            this.isResendLodaing = false
        },

        handleBack() {
            this.$router.push(`/otp?Token=${this.currentToken}`)
        }

    },

    mounted() {
        let token = this.$route.query.Token;
        let phone = this.$route.query.phone;
        this.currentToken = token
        this.currentPhone = phone
    },

    watch: {
        code() {
            this.codeError = ""
            this.isCode = false
            this.unMatchError = false
        }
    },

}
</script>

<style>
.join-us-container {
    /* text-align: center; */
    display: flex;
    align-items: center;
    padding-left: 20px;
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
</style>