<template>
  <p-dialog :visible.sync="visible" header="Trade Planner" @hide="onClose" :modal="true" class="small-dialog">
    <LoaderPanel :loading="loading">
      <div class="p-mt-3 p-mb-3 p-d-flex p-flex-column p-ai-center">

        <h4>Create a new trade plan</h4>
        <div class="p-mt-3">
          <p-button @click.prevent="updateTradePlannerStepper(true)" label="Create a Plan" />
        </div>

      </div>
      <div class="p-mt-4" style="border: 1px solid lightgray; border-radius: 5px;" v-if="getSavedTradePlans.length">
        <div>
          <h4 class="p-m-2">Saved Plans:</h4>
        </div>
        <div class="p-d-flex p-jc-between p-m-3" v-for="plan of getSavedTradePlans" :key="plan.name">
          <h5>{{ plan.name }}</h5>
          <div class="p-d-flex" style="gap: 0.5rem;">
            <p-button icon="pi pi-download" color="green" class="p-button-success" @click="() => generatePDF(plan)" />
            <p-button icon="pi pi-times" negative @click="() => deletePlan(plan.name)" />
          </div>
        </div>
      </div>
    </LoaderPanel>
    <!-- pdf-content -->
    <div ref="document" style="display: none;" v-if="selectedTradePlan !== null">
      <div style="text-align: center">
        <div style="color: red; font-size: 50px;">Trading Plan</div>
        <div style="color: #aaa; font-size: 40px;">{{ selectedTradePlan.name }}</div>
        <div style="font-size: 30px;">{{ selectedTradePlan.date }}</div>
      </div>
      <!-- account row -->
      <div style="font-size: 30px;">
        <h3 style="color: red">Account</h3>
        <div style="padding-left: 16px">
          <div>
            Account Balance:
            <b>{{
              selectedTradePlan.plan.accountBalanceData.accountBalance
            }}</b>
          </div>
          <div>
            Stock Code:
            <b>{{ selectedTradePlan.plan.accountBalanceData.stockCode }}</b>
          </div>
          <div>
            Current Price:
            <b>{{ selectedTradePlan.plan.accountBalanceData.currentPrice }}</b>
          </div>
          <div>
            Purchase Price:
            <b>{{ selectedTradePlan.plan.accountBalanceData.purchasePrice }}</b>
          </div>
        </div>
      </div>
      <br />
      <!-- position size row -->
      <div style="font-size: 30px;">
        <h3 style="color: red">Poistion Size</h3>
        <div style="padding-left: 16px">
          <div>
            Entry Price:
            <b>{{ selectedTradePlan.plan.positionSize.entryPrice }}</b>
          </div>
          <div>
            Stop Loss: <b>{{ selectedTradePlan.plan.positionSize.stopLoss }}</b>
          </div>
          <div>
            Risk per share:
            <b>{{
              riskPerShare
            }}</b>
          </div>
          <div>
            Portfolio Risk(%):
            <b>{{ portfolioRisk }}</b>
          </div>
          <div>
            Portfolio Risk($):
            <b>{{
              portfolioRiskInCash
            }}</b>
          </div>
          <div>
            Trade Risk($):
            <b>{{
              tradeRiskInCash
            }}</b>
          </div>
          <div>
            Position Size:
            <b>{{ selectedTradePlan.plan.positionSize.positionSize }}</b>
          </div>
          <div>
            Cost of a position:
            <b>{{ selectedTradePlan.plan.positionSize.costOfPosition }}</b>
          </div>
        </div>
      </div>
      <br />

      <!-- entry signal row -->
      <div style="font-size: 30px;">
        <h3 style="color: red">Entry Signal</h3>
        <div style="padding-left: 16px">
          <div v-if="selectedTradePlan.plan.entrySignalData.darvas">Darvas</div>
          <div v-if="selectedTradePlan.plan.entrySignalData.ascendingTriangle">
            Ascending Triangle
          </div>
          <div v-if="selectedTradePlan.plan.entrySignalData.breakResistance">
            Break Resistance
          </div>
          <div v-if="selectedTradePlan.plan.entrySignalData.newsletter">
            Newsletter
          </div>
          <div v-if="selectedTradePlan.plan.entrySignalData.other">
            Other
          </div>
        </div>
      </div>
      <br />

      <!-- confirmation signal row -->
      <div style="font-size: 30px;">
        <h3 style="color: red">Confirmation Signal</h3>
        <div style="padding-left: 16px">
          <div v-if="selectedTradePlan.plan.confirmationSignalData.obv">
            OBV
          </div>
          <div v-if="selectedTradePlan.plan.confirmationSignalData.marketDepth">
            Market Depth
          </div>
          <div v-if="selectedTradePlan.plan.confirmationSignalData.other">
            Other
          </div>
        </div>
      </div>
      <br />

      <!-- Risk management signal row -->
      <div style="font-size: 30px;">
        <h3 style="color: red">Risk Management</h3>
        <div style="padding-left: 16px">
          <div v-if="selectedTradePlan.plan.riskManagementSignalData.atr">
            ATR
          </div>
          <div v-if="selectedTradePlan.plan.riskManagementSignalData.pctValue">
            % Value
          </div>
          <div v-if="selectedTradePlan.plan.riskManagementSignalData.dataPoint">
            Data Points
          </div>
          <div v-if="selectedTradePlan.plan.riskManagementSignalData.supportLevel">
            Support Level
          </div>
          <div v-if="selectedTradePlan.plan.riskManagementSignalData.other">
            Other
          </div>
        </div>
      </div>
      <br />

      <!-- Exit signal row -->
      <div style="font-size: 30px;">
        <h3 style="color: red">Exit Signal</h3>
        <div style="padding-left: 16px">
          <div v-if="selectedTradePlan.plan.exitSignalData.gapFilling">
            Gap filling
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.patternTarget">
            Pattern Target
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.movingAverageBreach">
            Moving Average Breach
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.movingAverageCrossover">
            Moving Average Crossover
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.breakOfSupport">
            Break of Support
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.breakOfResistance">
            Break of Resistance
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.fibonacciTarget">
            Fibonacci Target
          </div>
          <div v-if="selectedTradePlan.plan.exitSignalData.other">
            Other
          </div>
        </div>
      </div>
    </div>

  </p-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TradePlannerStepperDialog from './TradePlannerStepperDialog.vue'
import html2canvasPro from "html2canvas-pro";
import jsPDF from "jspdf";
import LoaderPanel from '../../Loader/LoaderPanel.vue';

export default {
  name: 'TradePlanner',
  components: {
    TradePlannerStepperDialog,
    LoaderPanel
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions([
      'deletePlan',
      'updateTradePlannerStepper'
    ]),
    onClose() {
      this.$emit('toggleModal', false)
    },
    async generatePDF(plan) {
  this.loading = true;
  this.selectedTradePlan = plan;

  this.$nextTick(async () => {
    const clonedNode = this.$refs.document.cloneNode(true);
    clonedNode.style.display = "block";
    document.body.appendChild(clonedNode); // Temporarily add to DOM

    try {
      const scaleFactor = window.devicePixelRatio || 2; // Use screen scale for accurate font sizes
      const canvas = await html2canvasPro(clonedNode, {
        scale: scaleFactor, // Preserve original font size
        useCORS: true, // Handle images properly
        letterRendering: true,
        dpi: 300, // Ensure sharp text
      });

      document.body.removeChild(clonedNode); // Clean up

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // 10mm margin on each side
      const imgWidth = pageWidth - 2 * margin; // Adjusted width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      let yPos = margin;

      if (imgHeight <= pageHeight - 2 * margin) {
        // If content fits within one page
        const centerX = (pageWidth - imgWidth) / 2; // Center horizontally
        pdf.addImage(imgData, "PNG", centerX, yPos, imgWidth, imgHeight);
      } else {
        // Multi-page handling
        let heightLeft = imgHeight;

        while (heightLeft > 0) {
          const centerX = (pageWidth - imgWidth) / 2;
          pdf.addImage(imgData, "PNG", centerX, yPos, imgWidth, imgHeight);
          heightLeft -= pageHeight - 2 * margin; // Reduce remaining height
          yPos = -pageHeight + 30; // Move position for next page

          if (heightLeft > 0) pdf.addPage(); // Add new page if needed
        }
      }

      pdf.save(`${plan.name}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      this.loading = false;
    }
  });
}



  },
  data() {
    return {
      // isPlannerDialogOpened: false,
      selectedTradePlan: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'getSavedTradePlans',
      'themeFontColor',
      'themeSecondaryColor',
      'tradePlannerSteper'
    ]),
    portfolioRisk() {
      return this.selectedTradePlan.plan.positionSize.portFolioRisk
    },
    portfolioRiskInCash() {
      return (this.selectedTradePlan.plan.accountBalanceData.accountBalance *
        this.selectedTradePlan.plan.positionSize.portFolioRisk *
        0.01).toFixed(3)
    },
    riskPerShare() {
      return (this.selectedTradePlan.plan.positionSize.entryPrice -
        this.selectedTradePlan.plan.positionSize.stopLoss).toFixed(3)
    },
    tradeRiskInCash() {
      return (this.selectedTradePlan.plan.positionSize.positionSize *
        (this.selectedTradePlan.plan.positionSize.entryPrice -
          this.selectedTradePlan.plan.positionSize.stopLoss)).toFixed(3)
    }
  }
}
</script>

<style></style>