<template>
  <div class="smallResendEmail"
    style="height:100%;width: 100%;display: flex;align-items: center;justify-content: center;padding-bottom: 5rem; margin-top: 2rem;">
    <div style="width:80%;" class="resend-container">
      <div style="display: flex;flex-direction: column;">
        <div style="justify-content: center; display: flex;">
          <span class="errorText" style="color:#300003;font-size:14px"> Didn't Receive?</span> <span
            @click="handleResend()" class="errorText"
            :style="isResendLoading ? 'pointer-events: none;color:gray' : 'pointer-events: auto;'"
            style="color:#F20E17;text-decoration:underline;cursor: pointer;">Resend Email</span>
        </div>
        <div class="formSevenDayTrial"
          style="border:1px solid #F20E17;font-size: 18px;color:#F20E17;width: fit-content;border-radius: 5px;padding: 5px 15px 5px 15px;font-weight: 500;display: none;margin: 20px 0px 20px 0px;">
          {{trial_days}}-DAYS FREE TRIAL
        </div>
        <div class="mediumText" v-if="isResponseMessage" style="font-size: 16px;margin-top: 2px;color: #300003;">{{
          isResponseMessage }}</div>
      </div>
      <div style="margin:1% 0 1% 0">
        <h1 class="mobileLargeText" style="color:#300003;font-size: 50px;font-weight: bold; text-align: center;">Welcome to ProTrader,
          Please <span style="color:#F20E17">verify</span> your email</h1>
          <h3 style="text-align: center;font-size:16px;">We’ve sent you an email with a verification link, please check your inbox.</h3>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config';

export default {
  name: 'ResendEmail',
  props: {
    isResendLoading: {
      type: {
        type: Boolean,
        default: false
      },
    },
    isResponseMessage: {
      type: {
        type: String,
        default: ""
      },
    }
  },
  data() {
    return {
      trial_days: config.TRIAL_DAYS
    };
  },
  methods: {
    handleResend() {
      this.$emit('resendEmail');
    }
  }
};
</script>

<style scoped></style>