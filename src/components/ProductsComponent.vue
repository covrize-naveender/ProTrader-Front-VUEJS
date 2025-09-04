<template>
  <div v-if="!isLoading" style="">
    <div style="
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        width: 100%;
        justify-content: end;
      ">
      <div class="p-d-flex">

        <router-link to="/"><p-button label="Back to HomePage" class="p-mr-1 p-ml-1" /></router-link>
        <p-button label="Logout" type="submit" class="p-mr-1 p-ml-1 p-button-secondary" @click="clickLogout" />
      </div>
    </div>
    <div style="" class="login-container">
      <div style="display: flex" class="">
        <img src="/images/logo-login.png" alt="Protrader login" style="margin-bottom: 1rem; display: block" />
      </div>


      <div style="margin-top: 10px; justify-content: center">

        <h1>Please select a subscription</h1>
      </div>
      <div style="margin-top: 10px; justify-content: center">

        <h4 v-if="!productPageTrial">Looks like your subscription has run out... <br />
          Please select one of the options below to continue</h4>
        <h4 v-else>Choose how you would like to subscribe. </h4>
      </div>

      <!-- Add Currency Dropdown -->
      <div style="margin-top: 20px; margin-bottom: 20px;">
        <p-dropdown
          v-model="selectedCurrency"
          :options="currencies"
          optionLabel="name"
          placeholder="Select Currency"
          @change="updatePrices"
          style="width: 200px"
        />
      </div>

      <div style="margin-top: 20px; display: flex">
        <div @click="cardClicked('M')" :style="selectedCardClass == 'monthly'
          ? 'border:2px solid #db2828;  margin-right: 30px; padding-right:15px; padding-left:15px'
          : 'background:white; margin-right: 30px; padding-right:15px; padding-left:15px'
          " class="card">
          <div class="container">
            <h3><b>Monthly</b></h3>
            <p>{{ selectedCurrency.symbol }}{{ monthlyPrice }} {{ selectedCurrency.name }} per month</p>
          </div>
        </div>
        <div @click="cardClicked('Y')" class="card" :style="selectedCardClass == 'yearly'
          ? 'border:2px solid #db2828; padding-right:15px; padding-left:15px'
          : 'background:white; padding-right:15px; padding-left:15px'
          ">
          <div class="container">
            <h3><b>Yearly</b></h3>
            <p>{{ selectedCurrency.symbol }}{{ yearlyPrice }} {{ selectedCurrency.name }} per month</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoaderVue v-else :showLoader="isLoading" />
</template>

<script>
import LoaderVue from '../../src/baseComponents/Loader.vue'
import { mapGetters, mapActions } from 'vuex'
import { isClientAccountActive, subscribeToPackage } from '../services/user'
export default {
  data() {
    return {
      isLoading: true,
      selectedCard: '',
      selectedCardClass: '',
      msg: '',
      showError: false,
      selectedCurrency: { name: 'AUD', symbol: '$', code: 'AUD' },
      currencies: [
        { name: 'USD', symbol: '$', code: 'USD' },
        { name: 'AUD', symbol: '$', code: 'AUD' },
      ],
      monthlyPrice: 49.00,
      yearlyPrice: 44.92,
      priceMap: {
        USD: { monthly: 49.00, yearly: 44.92 },
        AUD: { monthly: 69.00, yearly: 63.25 },
      }
    }
  },
  computed: {
    ...mapGetters(['productPageTrial']),
  },
  components: {
    LoaderVue,
  },
  methods: {
    async checkSubscriptionStatus() {
      try {
        this.isLoading = true
        const response = await isClientAccountActive()
        this.isLoading = false
        if (response?.status === 'active') { // || response?.status === 'trialing') {
          this.$router.push('/')
        }
      } catch (err) {
        this.isLoading = false
        alert(err.message)
      }
    },
    clickLogout() {
      localStorage.removeItem('state')
      localStorage.removeItem('stripeSession')
      localStorage.removeItem('GuruRequests')
      localStorage.removeItem('ScanRequests')
      localStorage.removeItem('themeDarkModeSave')
      this.$store.commit('RESET_STATE', true)
      this.$router.push('/')
    },
    updatePrices() {
      const prices = this.priceMap[this.selectedCurrency.code]
      this.monthlyPrice = prices.monthly
      this.yearlyPrice = prices.yearly
    },
    async cardClicked(value) {
      if (value == 'M') {
        this.selectedCard = 'price_1Lokw6KnyMslhmUAhkSegDAA'
        this.selectedCardClass = 'monthly'
      } else {
        this.selectedCard = 'price_1LokvpKnyMslhmUAV8kmJSyd'
        this.selectedCardClass = 'yearly'
      }
      await this.onSubmit()
    },
    async onSubmit() {
      if (this.selectedCard && this.selectedCardClass) {
        const url = await subscribeToPackage(this.selectedCardClass, this.selectedCurrency.code)
        if (url && url.error) {
          this.showError = true
          this.msg = url.message
          setTimeout(() => {
            this.showError = false
          }, 5000)
        } else {
          window.location = url.data
        }
      } else {
        this.showError = true
        this.msg = 'Please Select Product'
        setTimeout(() => {
          this.showError = false
        }, 3000)
      }
    },
  },
  mounted() {
    this.checkSubscriptionStatus()
    this.updatePrices()
  },
}
</script>

<style>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 150px;
  padding: 50px;
  cursor: pointer;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

/* Add some padding inside the card container */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
  /* padding: 2px 16px; */
  justify-content: center;
  cursor: pointer;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 5%;
}

@media screen and (max-width: 1200px) {
  .login-container {
    margin-left: 20%;
    width: 60%;
    padding-top: 5%;
  }
}

@media screen and (max-width: 700px) {
  .login-container {
    margin-left: 10%;
    width: 80%;
    padding-top: 5%;
  }
}

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
  margin-top: 0.5rem;
}

.product-error-msg {}
</style>
