<template>
  <div style="
      width: 100%;
      height: 100%;
      overflow: hidden;
      padding: 40px 40px 40px 80px;
    " class="page-background mobileMainContainer">
    <div class="pageContainerParent" style="
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
      ">
      <div class="pageContainer" style="
          height: 100%;
          width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        ">
        <div style="height: 10%">
          <Header></Header>
        </div>

        <div v-if="isVerifiedToken" style="height: 80%">
          <h1>Email Verification is Completed!</h1>
          <h1 style="color: #f20e17">Redirecting...</h1>
        </div>

        <div v-else style="height: 80%">
          <div class="smallResendEmail" style="
              height: 40%;
              display: flex;
              flex-direction: column;
              justify-content: center;
            ">
            <div class="formSevenDayTrial" style="
                border: 1px solid #f20e17;
                font-size: 18px;
                color: #f20e17;
                width: fit-content;
                border-radius: 5px;
                padding: 5px 15px 5px 15px;
                font-weight: 500;
                display: none;
                margin: 20px 0px 20px 0px;
              ">
              {{ trial_days }}-DAYS FREE TRIAL
            </div>
            <div v-if="isInvalidToken">
              <span class="largeText" style="font-size: 44px">Oops, It seems your link is
                <span style="color: #f20e17">Expired</span></span>
            </div>

            <span v-else>
              <div>
                <span class="largeText" style="font-size: 44px">Your email is
                  <span style="color: #f20e17">verifing...</span></span>
              </div>
              <div style="margin-top: 2rem; display: flex; align-items: center">
                <!-- <div class="loader"></div> -->
                <Loader />
                <div style="margin-left: 20px">
                  <span class="mediumText" style="color: #828282; font-size: 16px">Loading...</span>
                </div>
              </div>
            </span>
          </div>
        </div>

        <div style="height: 5%" class="hideDetail">
          <Footer></Footer>
        </div>
      </div>

      <div class="smallFooter" style="display: none">
        <SmallScreenFooter></SmallScreenFooter>
      </div>

      <div style="height: 100%; width: 68%" class="hideDetail">
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
import Loader from '../components/Loader.vue'
import { verifyToken, sendOtp } from '../services/user'
import SmallScreenFooter from './SmallScreenFooter.vue'
import config from '../config'
import { mapActions } from 'vuex'

export default {
  name: 'MobileOtp',
  components: {
    DynamicInput,
    Header,
    Footer,
    ResendEmail,
    TrialInfo,
    Loader,
    SmallScreenFooter,
  },
  data() {
    return {
      trial_days: config.TRIAL_DAYS,
      isUnderstood: false,
      mobile: '',
      responseError: '',
      isCountryError: false,
      isMobileError: false,
      countryErrorMessage: '',
      mobileErrorMessage: '',
      currentToken: '',
      requiredError: false,
      showResendEmail: false,
      isVerifiedToken: false,
      isLoading: false,
      isInvalidToken: false,
      selectedCountry: 'notValid',
      countries: [
        // { value: 'AUS', name: 'Australia +61' },
        // { value: 'USA', name: 'United States +1' },
        { value: 'AUS', name: 'Australia +61' },
        { value: 'USA', name: 'United States +1' },
        { value: 'IND', name: 'India +91' },
        { value: 'THA', name: 'Thailand +66' },
        { value: 'SGP', name: 'Singapore +65' },
        { value: 'MEX', name: 'Mexico +52' },
        { value: 'RUS', name: 'Russia +7' },
        { value: 'CAN', name: 'Canada +1' },
        { value: 'MYS', name: 'Malaysia +60' },
        { value: 'TUR', name: 'Turkey +90' },
        { value: 'CHN', name: 'China +86' },
        { value: 'SAU', name: 'Saudi Arabia +966' },
        { value: 'HKG', name: 'Hong Kong +852' },
        { value: 'DEU', name: 'Germany +49' },
        { value: 'JPN', name: 'Japan +81' },
        { value: 'FRA', name: 'France +33' },
        { value: 'GBR', name: 'United Kingdom +44' },
        { value: 'CHE', name: 'Switzerland +41' },
        { value: 'SWE', name: 'Sweden +46' },
        { value: 'TWN', name: 'Taiwan +886' },
        { value: 'NLD', name: 'Netherlands +31' },
        { value: 'AUT', name: 'Austria +43' },
        { value: 'ZAF', name: 'South Africa +27' },
        { value: 'BRA', name: 'Brazil +55' },
        { value: 'BEL', name: 'Belgium +32' },
        { value: 'ISR', name: 'Israel +972' },
        { value: 'PHL', name: 'Philippines +63' },
      ],
      countriesRegix: [
        // { name: 'AUS', regex: /^(?:\+?61|0)[2-4789]\d{8}$/, code: '+61' },
        // {
        //   name: 'USA',
        //   regex: /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
        //   code: '+1',
        // },
        {
          name: 'AUS',
          regex: /^\d{9}$/,
          code: '+61',
        },
        {
          name: 'USA',
          regex: /^\d{10}$/,
          code: '+1',
        },
        {
          name: 'IND',
          regex: /^[1-9]\d{9}$/,
          code: '+91',
        },
        {
          name: 'THA',
          regex: /^\d{8}$/,
          code: '+66',
        },
        {
          name: 'SGP',
          regex: /^\d{7}$/,
          code: '+65',
        },
        {
          name: 'MEX',
          regex: /^\d{10}$/,
          code: '+52',
        },
        {
          name: 'RUS',
          regex: /^\d{10}$/,
          code: '+7',
        },
        {
          name: 'CAN',
          regex: /^\d{10}$/,
          code: '+1',
        },
        {
          name: 'MYS',
          regex: /^\d{9}$/,
          code: '+60',
        },
        {
          name: 'TUR',
          regex: /^\d{10}$/,
          code: '+90',
        },
        {
          name: 'CHN',
          regex: /^\d{10}$/,
          code: '+86',
        },
        {
          name: 'SAU',
          regex: /^\d{9}$/,
          code: '+966',
        },
        {
          name: 'HKG',
          regex: /^\d{8}$/,
          code: '+852',
        },
        {
          name: 'DEU',
          regex: /^\d{10}$/,
          code: '+49',
        },
        {
          name: 'JPN',
          regex: /^\d{9}$/,
          code: '+81',
        },
        {
          name: 'FRA',
          regex: /^\d{9}$/,
          code: '+33',
        },
        {
          name: 'GBR',
          regex: /^\d{10}$/,
          code: '+44',
        },
        {
          name: 'CHE',
          regex: /^\d{9}$/,
          code: '+41',
        },
        {
          name: 'SWE',
          regex: /^\d{9}$/,
          code: '+46',
        },
        {
          name: 'TWN',
          regex: /^\d{8}$/,
          code: '+886',
        },
        {
          name: 'NLD',
          regex: /^\d{9}$/,
          code: '+31',
        },
        {
          name: 'AUT',
          regex: /^\d{9}$/,
          code: '+43',
        },
        {
          name: 'ZAF',
          regex: /^\d{9}$/,
          code: '+27',
        },
        {
          name: 'BRA',
          regex: /^\d{10}$/,
          code: '+55',
        },
        {
          name: 'BEL',
          regex: /^\d{9}$/,
          code: '+32',
        },
        {
          name: 'ISR',
          regex: /^\d{9}$/,
          code: '+972',
        },
        {
          name: 'PHL',
          regex: /^\d{10}$/,
          code: '+63',
        },
      ],
      selectedCountryRegix: null,
    }
  },
  methods: {
    ...mapActions(['changeAuthModal']),
    async handleSendOtp() {

      if (this.mobile.charAt(0) === '0') {
        this.mobileErrorMessage = 'Leave the 0 off the phone number'
        return
      }
      if (
        this.selectedCountry == 'notValid' &&
        !this.mobile &&
        !this.isUnderstood
      ) {
        this.isCountryError = true
        this.countryErrorMessage = '*Required Field'
        this.isMobileError = true
        this.mobileErrorMessage = '*Required Field'
        this.requiredError = true
        return
      }

      if (!this.mobile) {
        this.isMobileError = true
        this.mobileErrorMessage = '*Required Field'
        return
      }
      if (this.selectedCountry == 'notValid') {
        this.isCountryError = true
        this.countryErrorMessage = '*Required Field'
        return
      }
      if (!this.isUnderstood) {
        this.requiredError = true
        return
      }

      if (!this.selectedCountryRegix?.regex?.test(this.mobile)) {
        this.isMobileError = true
        this.mobileErrorMessage = 'Invalid Phone Number'
        return
      }

      this.isLoading = true

      const payload = { phone: this.selectedCountryRegix?.code + this.mobile }
      const res = await sendOtp(payload)
      if (res?.data?.success) {
        this.$router.push({
          path: '/verify-otp',
          query: {
            Token: this.currentToken,
            phone: this.selectedCountryRegix?.code + this.mobile,
          },
        })
      } else {
        this.responseError = res?.data?.message
        setTimeout(() => {
          this.responseError = ''
        }, 5000)
      }
      this.isLoading = false
    },

    async verfifyToken() {
      let token = this.$route.query.Token
      this.currentToken = token
      if (token) {
        const res = await verifyToken(token)
        if (res?.data?.success) {
          this.isVerifiedToken = true
          const token = res?.data?.payload?.accessToken
          const status = res?.data?.payload?.status
          this.$router.push({ name: 'welcome', params: { token, status } });
          this.changeAuthModal(false)
        } else {
          this.isInvalidToken = true
        }
      } else {
        this.isInvalidToken = true
      }
    },
  },
  computed: {},
  watch: {
    selectedCountry(val) {

      this.countryErrorMessage = ''
      this.isCountryError = false
      if (val !== 'notValid') {
        const findRegix = this.countriesRegix?.find((item) => item?.name == val)
        this.selectedCountryRegix = findRegix
      } else {
        this.selectedCountryRegix = null
      }
    },
    mobile() {
      this.mobileErrorMessage = ''
      this.isMobileError = false
    },
    isUnderstood() {
      this.requiredError = false
    },
  },

  mounted() {
    this.verfifyToken()
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

.graySelect {
  outline: none;
  padding-left: 16px !important;
  padding-right: 20px !important;
  font-size: 16px;
  border-radius: 6px;
  appearance: none;
  /* Remove default appearance */
  -webkit-appearance: none;
  /* For Safari */
  -moz-appearance: none;
  /* For Firefox */
  background: url('../assets/dropdownArrow.svg') no-repeat;
  /* Use custom icon as background */
  background-position: right 18px center;
  padding-right: 20px;
  /* Add some right padding to avoid overlapping with the arrow */
}

.redSelect {
  outline: none;
  padding-left: 16px !important;
  padding-right: 20px !important;
  font-size: 16px;
  border-radius: 6px;
  appearance: none;
  /* Remove default appearance */
  -webkit-appearance: none;
  /* For Safari */
  -moz-appearance: none;
  /* For Firefox */
  background: url('../assets/reddropdownArrow.svg') no-repeat;
  /* Use custom icon as background */
  background-position: right 18px center;
  padding-right: 20px;
  /* Add some right padding to avoid overlapping with the arrow */
}

.graySelect:hover {
  border: 1px solid #bdbdbd !important;
}

.redSelect:hover {
  border: 1px solid #bdbdbd !important;
}
</style>