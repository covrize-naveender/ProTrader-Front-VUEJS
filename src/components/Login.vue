<template>
  <div class="login-container"
    :style="themeDarkMode ? { background: '#151515 !important', borderColor: '#505050', color: '#A2A2A2' } : {}">
    <div style="" class="">
      <img src="/images/logo-login.png" alt="Protrader login" style="margin-bottom: 1rem; display: block;" />
      <div class="p-d-flex">
        <form @submit.prevent="onLogin" class="loginForm">

          <!-- Email Field -->
          <div class="p-field">
            <label for="email">E-mail <span class="required">*</span></label><br />
            <p-inputText id="email" v-model="email" v-validate="'required|email'" name="email"
              placeholder="joe@schmoe.com" class="p-inputtext-lg" />
            <span v-show="errors.has('email')" class="p-error">{{ errors.first('email') }}</span>
          </div>

          <!-- Password Field -->
          <div class="p-field">
            <label for="password">Password <span class="required">*</span></label><br />
            <p-password id="password" v-model="password" v-validate="'required'" name="password" placeholder="password"
              :feedback="false" class="p-inputtext-lg" />
            <span v-show="errors.has('password')" class="p-error">{{ errors.first('password') }}</span>
          </div>
          <p-inlinemessage class="p-field" v-if="error.length > 0" severity="error">
            <h3>Action Forbidden</h3>
            <p>{{ error }}</p>
          </p-inlinemessage>

          <!-- Links -->
          <!-- <div class="links">
            <p>
              Don’t have an account yet?
              <a @click="onclickRegister(monthly_priceId)" class="register-link">Register Monthly</a>
              or
              <a @click="onclickRegister(yearly_priceId)" class="register-link">Register Yearly</a>
            </p>
            <router-link to="forget-password" style="color:red;">Forgotten your password ?</router-link>
          </div> -->

          <!-- Login Button -->
          <div class="p-field p-d-flex p-jc-between">
            <p-button label="Login" type="submit" class="p-button-light p-button-lg" />
            <p-button label="Start a 14 day free trial" class="p-button-lg" @click="onclickRegister"/>
          </div>
        </form>
      </div>

      <router-link to="forget-password"><button class="navigate-notice"
          style="color : red; cursor: pointer; background: none ">Forgotten your password ?</button></router-link>

        </div>
        <SignUpModal :visible.sync="isAuthModal" />
  </div>
</template>

<script>
import { Validator } from "vee-validate";
import { mapGetters, mapMutations } from 'vuex';
import config from '../config';
import { loginUser } from '../services/user';
import SignUpModal from './Modals/Auth/SignUpModal.vue';


Validator.extend("email", {
    getMessage: () => "Please enter a valid email address",
    validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
});

Validator.extend("required", {
    getMessage: field => `The ${field} is required`,
    validate: value => !!value,
});

export default {
  name: 'Login',
  components: {
    SignUpModal
  },
  data() {
    return {
      count: 0,
      loading: false,
      email: '',
      password: '',
      loginError: '',
      monthly_priceId: config.Monthly_priceId,
      yearly_priceId: config.Yearly_priceId,
    }
  },
  methods: {
    ...mapMutations(['SET_AUTH_MODAL ']),
    onclickRegister(type) {
      this.$store.commit('SET_AUTH_MODAL', true)
    },
    gotoHome() {
      this.$router.push({ name: 'home' })
    },
    navigateToRegister() {
      this.$router.push({ name: 'register' })
    },
    async onLogin() {
      this.loading = true

      try {
        const res = await loginUser(this.email, this.password)
        const token = res?.data?.accessToken
        const status = res?.data?.status
        localStorage.setItem('state', token)
        localStorage.setItem('stripeSession', status)
        // if (status === 'active') {
        if (!token) throw Error('Invalid credentials')

        setTimeout(() => {
          location.reload()
        })
        // const data = await 

        // getUserData(token).then(d => {
        //  
        // })


        // await this.$nextTick()

        // } else {
        //   setTimeout(() => {
        //     this.$router.push("/products")
        //   },0)
        // }
      } catch (e) {
        this.loginError = 'Entered credentials are incorrect'
      }

      this.loading = false
    },
  },
  mounted() {
    this.$store.commit('RESET_STATE', true)
  },
  computed: {
    ...mapGetters(['themeDarkMode', 'themeSecondaryColor', 'themeFontColor', 'subscriptionStatus', 'isAuthModal']),
    error() {
      return this.loginError
    }
  }
}
</script>

<style>
.login-container {
  margin-left: 30%;
  width: 40%;
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
  margin-top: .5rem;
}
</style>