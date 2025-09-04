<template>
  <div class="updatepass-container">
    <div style="width: 60%; margin: auto; margin-top: 5rem">
      <img src="/images/logo-login.png" alt="Protrader login" class="p-mb-4"/>
      <form @submit.prevent="PasswordUpdated" id="myForm" class="loginForm">

        <div class="p-field">
          <label for="password">New Password <span class="required">*</span></label><br />
          <p-password id="newPassword" v-model="newPassword" v-validate="'required'" placeholder="new password"
            :feedback="false" class="p-inputtext-lg" />
          <span v-show="errors.has('newPassword')" class="p-error">{{ errors.first('newPassword') }}</span>
        </div>

        <div class="p-field">
          <label for="password">Confirm Password <span class="required">*</span></label><br />
          <p-password id="confirmPassword" v-model="confirmPassword" v-validate="'required'"
            placeholder="confirm password" :feedback="false" class="p-inputtext-lg" />
          <span v-show="errors.has('confirmPassword')" class="p-error">{{ errors.first('confirmPassword') }}</span>
        </div>
        <div class="p-field">
          <p-button label="Update" type="submit" class="p-button-danger login-button p-button-raised p-button-lg"
            style="width: 100%;" />
        </div>
      </form>
      <p-inlinemessage v-if="success_msg.length > 0" class="p-field" severity="info">
        {{ success_msg }}
      </p-inlinemessage>

      <p-inlinemessage v-if="error.length > 0" class="p-field" severity="error">
        <h3>Action Forbidden</h3>
        <p>
          {{ error }}
        </p>
      </p-inlinemessage>
      <router-link to="/login">
        <div class="p-field" v-if="success_msg.length > 0">
          <p-button label="> Back To Login" type="submit"
            class="p-button-danger login-button p-button-raised p-button-lg" style="width: 100%;" />
        </div>
        <button class="navigate-notice" style="color: red; cursor: pointer; background: none ; margin-top: 1rem" v-else>
          Cancel
        </button>
      </router-link>

    </div>
  </div>
</template>

<script>
import { UpdatePassword } from '../services/user'
import { Validator } from "vee-validate";

Validator.extend("required", {
  getMessage: field => `The ${field} is required`,
  validate: value => !!value,
});

export default {
  name: 'UpdatePassword',
  data() {
    return {
      SearchParam: { en: '', iv: '' },
      newPassword: '',
      confirmPassword: '',
      UpdatePassw: {},
      success_msg: '',
      error: '',
    }
  },

  methods: {
    async PasswordUpdated() {
      if (this.newPassword !== this.confirmPassword) {
        this.success_msg = ''
        this.error = "New Password and Confirm Password don't match"
        return
      }
      this.UpdatePassw = {
        password: this.newPassword,
        confirmPassword: this.confirmPassword,
        en: this.SearchParam.en,
        iv: this.SearchParam.iv,
      }
      try {
        this.newPassword = ''
        this.confirmPassword = ''
        this.error = ''
        const res = await UpdatePassword(this.UpdatePassw)
        if (res.data.error) {
          this.success_msg = ''
          this.error = 'Your link has expired.'
        } else {
          document.getElementById('myForm').remove()
          this.error = ''
          this.success_msg = 'Password Updated Successfully'
        }

        //  const token = res?.data?.accessToken
        // if(!token) throw Error('Invalid credentials')
        //  localStorage.setItem('state', token)

        //   await this.$nextTick()
        //  location.reload()
      } catch (e) {
        this.error = "Server Error"
        // this.loginError = 'Entered credentials are incorrect'
      }
      // this.loading = false
    },
  },

  created() {
    let uri = window.location.href.split('?')
    if (uri.length == 2) {
      let vars = uri[1].split('&')
      let getVars = {}
      let tmp = ''
      vars.forEach(function (v) {
        tmp = v.split('=')
        if (tmp.length == 2) getVars[tmp[0]] = tmp[1]
      })
      this.SearchParam.en = getVars.en
      this.SearchParam.iv = getVars.iv

      // do
    }
  },
}
</script>

<style>
.updatepass-container {
  margin-left: 30%;
  width: 40%;
  padding-top: 5%;
}

@media screen and (max-width: 1200px) {
  .updatepass-container {
    margin-left: 20%;
    width: 60%;
    padding-top: 5%;
  }
}

@media screen and (max-width: 700px) {
  .updatepass-container {
    margin-left: 10%;
    width: 80%;
    padding-top: 5%;
  }
}
</style>
