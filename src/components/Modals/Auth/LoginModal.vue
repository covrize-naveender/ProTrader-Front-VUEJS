<template>
    <p-dialog header=" " :visible.sync="visible" :showHeader="false" :closable="false" class="roundedModal login-dialog" @hide="onCancel()" :modal="true">
        <LoaderPanel :loading="loading">
            <div class="p-d-flex p-jc-end" style="width:100%">

                <p-button class="p-button-secondary p-button-text"
                @click="onCancel"
                icon="pi pi-times" />
            </div>
            <div class="login-modal-container p-mt-2"
                :style="themeDarkMode ? { background: '#151515 !important', borderColor: '#505050', color: '#A2A2A2' } : {}">
                <div class="p-d-flex p-jc-center">
                    <Header></Header>
                </div>
                <div class="p-d-flex p-jc-center">
                    <span style="font-size: 2rem;text-align: center;">Sign in</span>
                </div>
                <div class="p-d-flex p-jc-center">
                    <form @submit.prevent="handleSubmit" class="loginForm">

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
                            <p-password id="password" v-model="password" v-validate="'required'" name="password"
                                placeholder="password" :feedback="false" class="p-inputtext-lg" />
                            <span v-show="errors.has('password')" class="p-error">{{ errors.first('password') }}</span>
                        </div>
                        <p-inlinemessage class="p-field" v-if="error.length > 0" severity="error">
                            <h3>Action Forbidden</h3>
                            <p>{{ error }}</p>
                        </p-inlinemessage>

                        <!-- Links -->
                        <div class="links">
                            <router-link to="forget-password" style="color:red;">Forgotten your password ?</router-link>
                        </div>

                        <!-- Login Button -->
                        <div class="p-field p-d-flex p-jc-between">
                            <p-button label="Login" type="submit" class="p-button-light p-button-lg" />
                            <p-button label="Start a 14 day free trial" class="p-button-lg" @click="onclickRegister"/>
                        </div>
                    </form>
                </div>
            </div>
        </LoaderPanel>

    </p-dialog>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import config from '../../../config.js'
import { loginUser } from '../../../services/user.js';
import Header from '../../Header.vue';
import { Validator } from "vee-validate";
import LoaderPanel from '../../Loader/LoaderPanel.vue';

Validator.extend("email", {
    getMessage: () => "Please enter a valid email address",
    validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
});

Validator.extend("required", {
    getMessage: field => `The ${field} is required`,
    validate: value => !!value,
});

export default {
    name: "LoginModal",
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        Header,
        LoaderPanel
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
        ...mapMutations(['SET_AUTH_MODAL']),
        onCancel() {
            this.$emit('toggleModal', false)
        },
        gotoHome() {
            this.$router.push({ name: 'home' })
        },
        navigateToRegister() {
            this.$router.push({ name: 'register' })
        },
        onclickRegister() {
            this.SET_AUTH_MODAL(true)
            this.onCancel()
        },
        handleSubmit() {
            this.$validator.validateAll().then(isValid => {
                if (isValid) {
                    this.onLogin()
                } else {
                    console.log("Validation failed");
                }
            });
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
    computed: {
        ...mapGetters([
            'getUserId',
            'themeDarkMode',
            'themeSecondaryColor',
            'themeFontColor',
            'subscriptionStatus',
            'selectedPriceId'
        ]),
        error() {
            return this.loginError
        }
    }
};
</script>

<style scoped>
/* .form-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff9db;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
    text-align: center;
    margin-bottom: 1.5rem;
} */

.p-error {
    color: #f44336;
    font-size: 0.875em;
}

.required {
    color: #f44336;
}

.links {
    /* text-align: center; */
    margin-bottom: 1rem;
}

.links a {
    color: #007bff;
    text-decoration: none;
}

.links a:hover {
    text-decoration: underline;
}

.forgot-password {
    color: red;
    font-size: 0.875em;
    text-align: center;
    display: inline-block;
    margin-top: 0.5rem;
}

.login-button {
    display: block;
    margin: 0 auto;
}

.register-link {
    cursor: pointer;
}
</style>