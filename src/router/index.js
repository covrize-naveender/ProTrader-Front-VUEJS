import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('Components/HomeComponent'),
    // meta: { requiresAuth: true },
    // meta: { guestArea: true },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('Components/ProductsComponent'),
    meta: { requiresAuth: true },
  },
  {
    path: '/video-link',
    name: 'video-link',
    component: () => import('Components/BroadcastLinks'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('Components/Login.vue'),
    meta: { guestArea: true },
  },
  ///old registration route
  // {
  //   path: '/register',
  //   name: 'register',
  //   component: () => import('Components/Registration.vue'),
  //   meta: { guestArea: true },
  // },
  // {
  //   path: '/create-account',
  //   name: 'create-account',
  //   component: () => import('Components/CreateAccount.vue'),
  //   meta: { guestArea: true },
  // },
  {
    path: '/email-verify',
    name: 'email-verify',
    component: () => import('Components/EmailVerified.vue'),
    meta: { guestArea: true },
  },
  {
    path: '/verify-otp',
    name: 'verify-otp',
    component: () => import('Components/VerifyOtp.vue'),
    meta: { guestArea: true },
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('Components/WelcomePage.vue'),
    meta: { guestArea: true },
    props: true

  },
  {
    path: '/otp',
    name: 'otp',
    component: () => import('Components/MobileOtp.vue'),
    meta: { guestArea: true },
  },
  {
    path: '/forget-password',
    name: 'ResetPassword',
    component: () => import('Components/ResetPassword.vue'),
  },
  {
    path: '/update-password',
    name: 'UpdatePassword',
    component: () => import('Components/UpdatePassword.vue'),
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (isLoggedIn()) {
      next()
    } else {
      next({
        name: 'login',
      })
    }
  }
  else if (to.matched.some((record) => record.meta.guestArea)) {
    if (isLoggedIn()) {
      next({
        name: 'home',
      })
    } else {
      next()
    }
  }
  else {
    next() // make sure to always call next()!
  }
})

export default router
router.beforeEach((to, from, next) => {
  console.log(`Navigating to: ${to.name}, LoggedIn: ${isLoggedIn()}`);
  next();
});

function isLoggedIn() {
  if (localStorage.getItem('state')?.length) {
    if (localStorage.getItem('stripeSession') == 'active' || localStorage.getItem('stripeSession') == 'trialing') {
      return 1
    }
    else {
      return true
    }
  }

  else {
    return 0
  }




  // return localStorage.getItem('state')?.length

}
