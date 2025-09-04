<template>
  <p-dialog :visible.sync="isOpen" header="Trailing Stop" @hide="onClose" :modal="true">
    <div>
      <div class="p-d-flex form-field-drp">

        <div class="form-field" style="width: 50%;">
          <label>Date</label>
          <p-inputText type="date" placeholder="Date" v-model="periodStartDate" />
        </div>
        <div class="form-field" style="width: 50%;">
          <label>Entry price</label>
          <p-inputText type="number" placeholder="Entry Price" step="0.01" min="0" v-model="entryPrice" />
        </div>
      </div>

      <div class="form-field-drp p-d-flex p-ai-end">

        <div class="form-field" style="width: 50%;">
          <label>Trailing Type</label>
          <p-dropdown class="trailing-dropdown" v-model="selectedTrailingType" :options="trailingType"
            optionLabel="text" optionValue="value" appendTo='body' placeholder="Trailing Type" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'step-price'">
          <label>Step Price</label>
          <p-inputText type="number" placeholder="Step Price" step="0.01" min="0" v-model="stepPrice"
            name="stepPrice" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'value'">
          <label>Position Size</label>
          <p-inputText type="number" name="positionSize" placeholder="Position Size" value="1000"
            v-model="positionSize" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'value'">
          <h3>and</h3>
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'value'">
          <label>Risk Value</label>
          <p-inputText type="number" placeholder="Risk Value" name="riskValueInCash" value="500"
            v-model="riskValueInCash" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === '%value'">
          <label>Position Size</label>
          <p-inputText type="number" name="positionSize" placeholder="Position Size" value="1000"
            v-model="positionSize" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === '%value'">
          <h3>and</h3>
        </div>

        <div class="form-field" v-if="selectedTrailingType === '%value'">
          <label>Risk %</label>
          <p-inputText type="number" placeholder="Risk Value %" name="riskValueInPct" value="10"
            v-model="riskValueInPct" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'atr'">
          <label>Day Period</label>
          <p-inputText type="number" name="atrPeriod" placeholder="ATR Period" value="10" v-model="atrPeriod" />
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'atr'">
          <h3>and</h3>
        </div>

        <div class="form-field" v-if="selectedTrailingType === 'atr'">
          <label>Multiplier</label>
          <p-inputText type="number" placeholder="Multiplier" name="atrMultiplier" value="5" v-model="atrMultiplier" />
        </div>

      </div>

      <div class="form-field" v-if="
        selectedTrailingType === 'step-price'
      ">
        <label>Stop Price</label>
        <p-inputText type="number" placeholder="Stop Price" step="0.01" min="0" v-model="stopPrice" />

      </div>
    </div>
    <template #footer>
      <p-button label="OK" @click="updateData" />
      <p-button label="Cancel" class="p-button-secondary" @click="onClose" />
    </template>
  </p-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { chartEvents } from "../../../chartEvents";
import moment from 'moment/moment'
export default {
  name: "TrailingStop",
  components: {
  },
  props: {
    trialingStopData: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    onClose() {
      this.$emit("hideTrailingStop");
    },
    updateData() {
      let identity = "UpdateTrailingStopSettings" + this.trialingStopData?.$uuid;
      // let identity = "UpdateTrailingStopSettings";
      chartEvents.$emit(identity, {
        stepPrice: this.stepPrice,
        stopPrice: this.stopPrice,
        entryPrice: this.entryPrice,
        uuid: this.trialingStopData?.$uuid,
        trailingType: this.selectedTrailingType,
        atrPeriod: this.atrPeriod,
        atrMultiplier: this.atrMultiplier,
        riskValueInPct: this.riskValueInPct,
        riskValueInCash: this.riskValueInCash,
        positionSize: this.positionSize,
        periodStartDate: moment(this.periodStartDate).valueOf()

      });
      this.$emit("hideTrailingStop");

    },
  },
  data() {
    return {
      isOpen: false,
      entryPrice: 0,
      stopPrice: 0,
      stepPrice: 0,
      trailingType: [
        { text: "based on step price", value: "step-price" },
        { text: "$ value of a parcel", value: "value" },
        { text: "% value of a parcel", value: "%value" },
        { text: "ATR", value: "atr" },
      ],
      atrPeriod: 14,
      atrMultiplier: 2,
      positionSize: 1000,
      riskValueInPct: 10,
      riskValueInCash: 200,
      selectedTrailingType: "step-price",
      periodStartDate: moment(new Date()).format('YYYY-MM-DD').toString()
    };
  },
  computed: {
    ...mapGetters(["themeDarkMode", "themeFontColor", "themeSecondaryColor", "themePrimaryColor"]),
  },
  created() {
    if (this.$props?.trialingStopData) {

      let startDate = this.$props?.trialingStopData?.p1?.[2] ? new Date(this.$props.trialingStopData.p1[2]) : this.$props?.trialingStopData?.startClickTime ? new Date(this.$props.trialingStopData.startClickTime) : new Date()
      
      this.periodStartDate = moment(startDate).format('YYYY-MM-DD').toString()

      this.stepPrice = this.$props?.trialingStopData?.stepPrice
      this.entryPrice = this.$props?.trialingStopData?.entryPrice
      this.stopPrice = this.$props?.trialingStopData?.stopPrice
      this.atrPeriod = this.$props?.trialingStopData?.atrPeriod || 14
      this.atrMultiplier = this.$props?.trialingStopData?.atrMultiplier || 2
      this.riskValueInPct = this.$props?.trialingStopData?.riskValueInPct || 7
      this.riskValueInCash = this.$props?.trialingStopData?.riskValueInCash || 7
      this.positionSize = this.$props?.trialingStopData?.positionSize || 300
      this.selectedTrailingType = this.$props?.trialingStopData?.trailingType ? this.$props?.trialingStopData?.trailingType : 'step-price'
    }
  },
  watch: {
    periodStartDate(newVal, oldVal) {

    }
  },
  mounted() {
    if (this.$props?.trialingStopData) {
      this.isOpen = true;
    }
  }
};
</script>

<style></style>
