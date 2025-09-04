<template>
  <div class="resetpass-container">
    <div style="">
      <img src="/images/logo-login.png" alt="Protrader login" />
      <LoaderPanel :loading="loading">

        <form @submit.prevent="PasswordReset" class="loginForm" v-if="msg">

          <div class="p-d-flex p-flex-column">
            <p-message class="p-field" severity="info" :closable="false">
              Enter the email address associated with your account. Further instructions will be emailed to you to
              complete
              the password reset.

            </p-message>
            <!-- Email Field -->
            <div class="p-field">
              <label for="email">E-mail <span class="required">*</span></label><br />
              <p-inputText id="email" v-model="email" v-validate="'required|email'" name="email"
                placeholder="joe@schmoe.com" class="p-inputtext-lg" />
              <span v-show="errors.has('email')" class="p-error">{{ errors.first('email') }}</span>
            </div>

            <div class="p-field">
              <p-button label="Reset Password" type="submit"
                class="p-button-danger login-button p-button-raised p-button-lg" style="width: 100%;" />
            </div>

            <p-message class="p-field" severity="error" :closable="false" v-if="error.length > 0">
              {{ error }}
              <span style="color:#0000EE ;cursor: pointer;" @click="onclickRegister(monthly_priceId)">REGISTER
                MONTHLY</span> or <span style="color:#0000EE ;cursor: pointer;"
                @click="onclickRegister(yearly_priceId)">REGISTER YEARLY</span>
            </p-message>
            <SignUpModal :visible.sync="isAuthModal" />
          </div>
        </form>
      </LoaderPanel>

      <p-message v-if="error.length > 0 && msg == false" severity="info" :closable="false">
        {{ error }}
      </p-message>
      <router-link to="/login"><button class="navigate-notice"
          style="color : red; cursor: pointer; background: none ; margin-top: 1rem">Cancel</button></router-link>
    </div>
  </div>
</template>

<script>
import { Validator } from "vee-validate";
import { mapGetters } from 'vuex';
import config from '../config';
import { ResetPassword } from '../services/user';
import SignUpModal from "./Modals/Auth/SignUpModal.vue";
import LoaderPanel from './Loader/LoaderPanel.vue'

Validator.extend("email", {
  getMessage: () => "Please enter a valid email address",
  validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
});

Validator.extend("required", {
  getMessage: field => `The ${field} is required`,
  validate: value => !!value,
});
export default {
  name: "ResetPassword",
  components: { SignUpModal,LoaderPanel },
  data() {
    return {
      email: '',
      EmailError: '',
      loading: false,
      msg: true,
      monthly_priceId: config.Monthly_priceId,
      yearly_priceId: config.Yearly_priceId,
    }
  },

  methods: {

    async PasswordReset() {


      this.loading = true
      try {

        const res = await ResetPassword(this.email)

        const token = res?.data?.token
        if (!token) throw Error('Invalid Email')
        //  localStorage.setItem('state', token)  

        this.msg = false
        this.loading = false;
        this.EmailError = 'Password reset request successful. Please check your email for further instructions.'
        // await this.$nextTick()
        // this.$router.push({name : "login"})
        // location.reload()

      } catch (e) {
        console.log("error e", e);

        this.msg = true
        this.EmailError = "Oh no, it looks like you don't have a current account registered with us, please register a new account,"
        this.loading = false;
        this.email = ''

      }
      // this.loading = false 
    },
    onclickRegister(type) {
      if (type == this.yearly_priceId) {
        this.$store.commit('SET_PRICE_ID', this.yearly_priceId)

      }
      else {
        this.$store.commit('SET_PRICE_ID', this.monthly_priceId)
      }
      this.$store.commit('SET_AUTH_MODAL', true)
      // this.SET_AUTH_MODAL(true)
      // this.$emit('onCloseModal')
    },
  },

  computed: {
    ...mapGetters(['themeSecondaryColor', 'themeDarkMode', 'themeFontColor', 'isAuthModal']),
    error() {
      return this.EmailError
    }
  }

}
</script>

<style>
.resetpass-container {
  margin-left: 30%;
  width: 40%;
  padding-top: 5%;
}

@media screen and (max-width: 1200px) {
  .resetpass-container {
    margin-left: 20%;
    width: 60%;
    padding-top: 5%;
  }
}

@media screen and (max-width: 700px) {
  .resetpass-container {
    margin-left: 10%;
    width: 80%;
    padding-top: 5%;
  }
}
</style>