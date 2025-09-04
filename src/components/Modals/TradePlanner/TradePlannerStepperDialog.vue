<template>
  <p-dialog :visible.sync="visible" header="Trade Planner" @hide="onClose" :modal="true" class="trade-planner-stepper">

    <div>
      <!-- Steps Component -->
      <div class="trade-steps">

        <p-steps :model="stepItems" :activeIndex="activeStep" :readonly="true" />
      </div>
      <div class="p-m-3">

        <AccountBalance v-if="activeStep === 0" v-model="validated[0]"/>
        <PositionSize v-if="activeStep === 1" v-model="validated[1]"/>
        <EntrySignal v-if="activeStep === 2" />
        <ConfirmationSignal v-if="activeStep === 3" />
        <RiskManagement v-if="activeStep === 4" />
        <ExitSignal v-if="activeStep === 5" />
      </div>

      <!-- Navigation Buttons -->

    </div>


    <template #footer>
      <div class="p-d-flex p-jc-between">
        <span class="p-buttonset">

          <p-button label="Back" class="p-button-secondary" :disabled="activeStep === 0" @click="prevStep" />
          <p-button label="Next" :disabled="activeStep === stepItems.length - 1 || !validated[activeStep]" @click="nextStep" />
        </span>
        <span class="p-buttonset" v-if="activeStep === stepItems.length - 1">

          <p-button label="Save"  :disabled="activeStep === 0"
            @click="onClickSaveButton" />
          <p-button label="Cancel" class="p-button-secondary" @click="onClose" />
        </span>
        <span v-else>
          <p-button label="Cancel" class="p-button-secondary" @click="onClose" />
        </span>
      </div>
    </template>
  </p-dialog>
</template>

<script>
//   import { Steps } from "primevue/steps";
//   import Button from "primevue/button";
import { mapActions } from 'vuex'
import AccountBalance from './AccountBalance.vue'
import ConfirmationSignal from './ConfirmationSignal.vue'
import EntrySignal from './EntrySignal.vue'
import ExitSignal from './ExitSignal.vue'
import PositionSize from './PositionSize.vue'
import RiskManagement from './RiskManagement.vue'

export default {
  name: 'TradePlannerStepperDialog',
  components: {
    AccountBalance,
    ConfirmationSignal,
    EntrySignal,
    ExitSignal,
    PositionSize,
    RiskManagement,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeStep: 0, // Tracks the active step
      items: [
        { label: "Account Balance" },
        { label: "Position Size" },
        { label: "Entry Signal" },
        { label: "Confirmation Signals" },
        { label: "Risk Management" },
        { label: "Exit" },
      ],
      validated: [false, false, true, true, true, true],

    };
  },
  methods: {
    ...mapActions(['saveTradePlan']),
    nextStep() {
      if (this.activeStep < this.stepItems.length - 1) {
        this.activeStep++;
      }
    },
    prevStep() {
      if (this.activeStep > 0) {
        this.activeStep--;
      }
    },
    onClose() {
      this.activeStep = 0
      this.$emit('onClose')
    },
    onClickSaveButton() {
      this.saveTradePlan().then(() => {
        this.activeStep = 0
      })
      this.$emit('onClose')
    },
  },
  computed: {
    stepItems() {
      return this.items.map((item, index) => {
        return {
          label: `${item.label}`, class: `${this.activeStep == index ? 'p-highlight p-steps-current' : 'none'}`
        }
      })
    }
  }
};
</script>

<style></style>