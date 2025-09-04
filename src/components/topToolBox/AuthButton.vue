<template>
    <div class="auth-button" style="padding-left: 0.2rem; padding-right: 0.2rem;">

        <p-button
        v-if="getUserId"
        label="Logout"
        class="p-button-secondary p-button-outlined large-auth-button"
        icon="pi pi-sign-out"
        @click="logoutAndNavigate"
        />
        <p-button
        v-else
        label="Login"
        class="p-button-secondary p-button-outlined large-auth-button"
        icon="pi pi-sign-in"
        @click="logInRoute"
        />

        <p-button
        v-if="getUserId"
        class="p-button-secondary p-button-outlined small-auth-button"
        icon="pi pi-sign-out"
        v-tooltip.left="'Logout'"
        type="button"
        @click="logoutAndNavigate"
        />
        <p-button
        v-else
        class="p-button-secondary p-button-outlined small-auth-button"
        icon="pi pi-sign-in"
        v-tooltip.left="'Login'"
        type="button"
        @click="logInRoute"
        />


        <LoginModal :visible.sync="loginModalOpen" @toggleModal="loginModalClose" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LoginModal from '../Modals/Auth/LoginModal.vue';

export default {
    name: "AuthButton",
    data() {
        return {
            loginModalOpen: false,
        }
    },
    components: {
        LoginModal
    },
    methods: {
        loginModalClose() {
            this.loginModalOpen = false
        },
        logInRoute() {
            this.loginModalOpen = true
        },
        logoutAndNavigate() {
            localStorage.removeItem('state')
            localStorage.removeItem('stripeSession')
            localStorage.removeItem('GuruRequests')
            localStorage.removeItem('ScanRequests')
            localStorage.removeItem('themeDarkModeSave')
            this.$store.commit('RESET_STATE', true)
            location.reload()
        },
    },
    computed: {
        ...mapGetters([
            'getUserId'
        ])
    }
}
</script>

<style lang="scss" scoped></style>