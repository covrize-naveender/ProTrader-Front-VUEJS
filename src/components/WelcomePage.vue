<template>
  <div style="width:100%;height:100%;overflow: hidden;padding: 40px 40px 40px 80px;"
    class="page-background mobileMainContainer">
    <div style="height:10%">
      <Header></Header>
    </div>
    <div class="welcomeParent"
      style="height:85%;;display: flex;align-items: center;justify-content: center;padding-bottom: 10rem;">
      <div style="width:50%;text-align: center;display: flex; flex-direction: column;align-items: center;"
        class="welcome-container">
        <div>
          <span class="extraLargeText" style="color:#300003;font-size: 50px;font-weight: bold;">Your account has being
            <span style="color:#F20E17">Created</span></span>
        </div>
        <div
          style="margin-bottom:2rem;width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;">
          <div class="welcome-Detail" style="width: 50%;line-height: 1.1;">
            <span class="mediumText" style="font-size: 13px;"><span style="color:#F20E17;font-weight: 800;">Enjoy you
                {{ trial_days }}-days free trial!</span> Our software is a Desktop Application and is best used on a
              laptop or computer
              device.</span>

          </div>
        </div>

        <div class="mainFormContainer"
          style="height:30%;width:30%;display: flex;align-items: center; justify-content: center;">
          <button class="btnRedHover" @click="handleRoute()"
            style="padding:14px; height:100%;background: #F20E17;color:white;cursor:pointer;width:100%;border-radius: 5px;font-size: 18px;display: flex;align-items: center;justify-content: center;">
            Start
            <div style="margin-left:8%">
              <img src="../assets/rightArrow.svg" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="smallFooter" style="display: none;width: 85%;">
      <SmallScreenFooter></SmallScreenFooter>
    </div>




    <div style="height:5%;" class="hideDetail">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import SmallScreenFooter from './SmallScreenFooter.vue'
import config from '../config';


export default {
  name: 'WelcomePage',
  props: ['status', 'token'],
  components: {
    Footer,
    Header,
    SmallScreenFooter
  },
  data() {
    return {
      trial_days: config.TRIAL_DAYS
    };
  },
  methods: {
    handleRoute() {
      localStorage.setItem('state', this.token)
      localStorage.setItem('stripeSession', this.status)
      this.$router.push('/')
    }
  },

};
</script>

<style scoped></style>