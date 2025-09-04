import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './primevue.js'
import "./custom-theme.css"
import './app.css'
import './iconStyle.css'
import 'primeflex/primeflex.css';
import VueCoreVideoPlayer from 'vue-core-video-player'
import VueTour from "vue-tour";
import "vue-tour/dist/vue-tour.css";

Vue.use(VueTour);

// import PrimeVue from "primevue/config";

// // Import PrimeVue themes and styles
// import "primevue/resources/themes/saga-blue/theme.css"; // or your preferred theme
// import "primevue/resources/primevue.min.css";          // PrimeVue core CSS
// import "primeicons/primeicons.css";                    // Icons

// Use PrimeVue globally

// register component globally
Vue.config.productionTip = false


Vue.use(VueCoreVideoPlayer)
// Vue.use(PrimeVue);
Vue.directive('click-outside', {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})
// added code in base charting library
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
