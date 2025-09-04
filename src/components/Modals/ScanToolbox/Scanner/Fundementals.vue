<template>
  <div class="fundamental-content">
    <div class="fundamental-sub-content measures">

      <label class="header-text">Measures</label>
      <p-divider />

      <div class="field-content">

        <p-checkbox id="Earning_yield" v-model="settings.earningYield.isActive" :binary="true" />
        <label for="Earning_yield">Earning yield</label>

        <p-radiobutton id="EY_morethan" name="earning-yield-type" value="more" v-model="settings.earningYield.type" />
        <label for="EY_morethan">more than</label>

        <p-radiobutton id="EY_lessthan" name="earning-yield-type" value="less" v-model="settings.earningYield.type" />
        <label for="EY_lessthan">less than</label>

        <p-inputText type="number" v-model="settings.earningYield.value" @input="handleUserChoice"
          :style="selectWidth" />
        <label>%</label>

      </div>

      <div class="field-content">

        <p-checkbox id="P_E_ratio" v-model="settings.peRatio.isActive" :binary="true" />
        <label for="P_E_ratio">P/E ratio</label>

        <p-radiobutton id="P_E_morethan" name="pe-type" value="more" v-model="settings.peRatio.type" />
        <label for="P_E_morethan">more than</label>

        <p-radiobutton id="P_E_lessthan" name="pe-type" value="less" v-model="settings.peRatio.type" />
        <label for="P_E_lessthan">less than</label>

        <p-inputText type="number" v-model="settings.peRatio.value" @input="handleUserChoice" :style="selectWidth" />
        <label>%</label>

      </div>

      <div class="field-content">

        <p-checkbox id="DY" v-model="settings.dividendYield.isActive" :binary="true" />
        <label for="DY">Dividend yield</label>

        <p-radiobutton id="DY_morethan" name="dividend-yield-type" value="more" v-model="settings.dividendYield.type" />
        <label for="DY_morethan">more than</label>

        <p-radiobutton id="DYlessthan" name="dividend-yield-type" value="less" v-model="settings.dividendYield.type" />
        <label for="DYlessthan">less than</label>

        <p-inputText type="number" v-model="settings.dividendYield.value" @input="handleUserChoice"
          :style="selectWidth" />
        <label>%</label>

      </div>

      <div class="field-content">

        <p-checkbox id="WFC" v-model="settings.frankedPct.isActive" :binary="true" />
        <label for="WFC">With franking credits:</label>

        <p-radiobutton id="WFC_only100" name="franking-type" value="100" v-model="settings.frankedPct.type" />
        <label for="WFC_only100">100% only</label>

        <p-radiobutton id="WFC_anycredit" name="franking-type" value="any" v-model="settings.frankedPct.type" />
        <label for="WFC_anycredit">any credit</label>

      </div>

    </div>

    <div class="fundamental-sub-content capitalisation">
      <label class="header-text">Capitalisation</label>
      <p-divider />

      <div class="field-content">

        <p-checkbox v-model="settings.capitalisation.topSymbols.isActive" :binary="true" />
        <label class="capital-text">Must be in the top</label>

        <p-inputText type="number" v-model="settings.capitalisation.topSymbols.value" @input="handleUserChoice"
          :style="selectWidth" @keypress="preventDecimal" />
        <label>stocks by the market cap</label>

      </div>

      <div class="field-content">

        <p-checkbox v-model="settings.capitalisation.sharesIssued.isActive" :binary="true" />
        <label class="capital-text">Shares issued</label>

        <p-radiobutton id="SI_morethan" name="shares-issues-type" value="more"
          v-model="settings.capitalisation.sharesIssued.type" />
        <label class="capital-text" for="SI_morethan">more than</label>

        <p-radiobutton id="SI_lessthan" name="shares-issues-type" value="less"
          v-model="settings.capitalisation.sharesIssued.type" />
        <label class="capital-text" for="SI_lessthan">less than</label>

        <p-inputText type="number" v-model="settings.capitalisation.sharesIssued.value" @input="handleUserChoice"
          :style="selectWidth" />
        <label>million</label>

      </div>

      <div class="field-content">

        <p-checkbox v-model="settings.capitalisation.marketCap.isActive" :binary="true" />
        <label class="capital-text">Market Cap</label>

        <p-radiobutton id="MC_morethan" name="market-cap-type" value="more"
          v-model="settings.capitalisation.marketCap.type" />
        <label class="capital-text" for="MC_morethan">more than</label>

        <p-radiobutton id="MC_lessthan" name="market-cap-type" value="less"
          v-model="settings.capitalisation.marketCap.type" />
        <label class="capital-text" for="MC_lessthan">less than</label>

        <p-inputText type="number" v-model="settings.capitalisation.marketCap.value" @input="handleUserChoice"
          :style="selectWidth" />
        <label>million</label>

      </div>
    </div>

    <div class="fundamental-sub-content return">
      <label class="header-text">Returns</label>
      <p-divider />

      <div class="field-content">

        <p-checkbox v-model="settings.returns.isActive" :binary="true" />
        <label class="capital-text">Return</label>

        <p-radiobutton id="R_morethan" name="returns-type" value="more" v-model="settings.returns.type" />
        <label class="capital-text" for="R_morethan">more than</label>

        <p-radiobutton id="R_lessthan" name="returns-type" value="less" v-model="settings.returns.type" />
        <label class="capital-text" for="R_lessthan">less than</label>

        <p-inputText type="number" v-model="settings.returns.value" @input="handleUserChoice" :style="selectWidth" />
        <label>% for the last</label>

        <p-dropdown v-model="settings.returns.month" :options="monthList" optionLabel="text" optionValue="value" />

      </div>
    </div>





  </div>
</template>

<script>
const DEFAULT_SETTINGS = {
  earningYield: {
    isActive: false,
    type: 'more',
    value: 5,
  },
  peRatio: {
    isActive: false,
    type: 'more',
    value: 20,
  },
  dividendYield: {
    isActive: false,
    type: 'more',
    value: 5,
  },
  frankedPct: {
    isActive: false,
    type: '100',
  },
  capitalisation: {
    topSymbols: {
      isActive: false,
      value: 20,
    },
    sharesIssued: {
      isActive: false,
      type: 'more',
      value: 5,
    },
    marketCap: {
      isActive: false,
      type: 'more',
      value: 5,
    },
  },
  returns: {
    isActive: false,
    type: 'more',
    value: 100,
    month: 'return12m',
  },
}
import { mapActions, mapGetters } from 'vuex'
import {
  DEFAULT_DATA_SETTINGS,
  DEFAULT_EVENT_SETTINGS,
  DEFAULT_FILTER_SETTINGS,
} from '../../../../settings/USER_SETTINGS_DEFAULT'
export default {

  name: 'Fundementals',
  components: {},
  props: {
    favScanId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'updateMarketAccordingTODataSettings',
      'setFundementalsScanSettings',
      'sendFundementalScanRequest',
      'saveScannersScanRequest',
      'cancelScans',
      'deleteScanSettings',
      'getUserScanList',
      'setSelectedMarket',
      'runAndUpdateScanSettings',
      'resetSavedScan'
    ]),
    async onScanClick() {
      this.isLoading = true
      if (this.favScanId) {
        const index = this.userSavedScans.findIndex((x) => { return x.id == this.favScanId })
        await this.runAndUpdateScanSettings(index)
        await this.getUserScanList()
      } else {
        await this.sendFundementalScanRequest()
      }
      this.isLoading = false
      this.$emit('change', !open)
    },
    onScanStop() {
      this.cancelScans()
      this.isLoading = false
    },
    ResetScanDefaultSettings() {
      if (this.favScanId) {
        this.resetSavedScan(this.favScanId)
      } else {
        let val = {
          dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
          filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
          events: JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS)),
        }
        this.updateMarketAccordingTODataSettings({ ...val, id: this.id })
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      }
    },
    async saveScanSettings(name) {
      await this.saveScannersScanRequest({
        scanName: name,
        scanType: 'fundementals'
      })
      this.$store.commit('SCAN_POPUP', false)
      await this.getUserScanList()
    },

    handleUserChoice() {
      if (this.userChoice == false) {
        this.$store.commit('SET_USER_CHOICE', true)
      }
    },
    preventDecimal(event) {
      if (event.key === '.' || event.key === ',' || event.key === '-') {
        event.preventDefault();
      }
    },
  },
  data() {
    return {
      id: 'fundementals',
      isLoading: false,
      selectedMonth: 'return12m',
      monthList: [
        {
          text: '1 month',
          value: 'return1m',
        },
        {
          text: '3 months',
          value: 'return3m',
        },
        {
          text: '6 months',
          value: 'return6m',
        },
        {
          text: '12 months',
          value: 'return12m',
        },
      ],

    }
  },
  computed: {
    ...mapGetters([
      'filterSettings',
      'themePrimaryColor',
      'themeSecondaryColor',
      'themeFontColor',
      'userChoice',
      'themeDarkMode',
      'scannerScanSettings',
      'userSavedScans'
    ]),
    selectWidth() {
      return 'width: 15%'
    },
    isValid() {
      return (
        Object.values(this.settings).some((state) => state.isActive) ||
        Object.values(this.settings.capitalisation).some(
          (state) => state.isActive
        )
      )
    },
    settings: {
      get() {
        if (this.favScanId) {
          return this.userSavedScans.find(x => x.id == this.favScanId).data.settings
        }
        return this.scannerScanSettings.fundementals.settings || JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      },
      set(value) {
        this.setFundementalsScanSettings(value)
      }
    }
  },
  watch: {
    isValid: {
      handler(newVal) {
        this.$emit('valid', newVal);
      },
      immediate: true
    },
    isLoading: {
      handler(newVal) {
        this.$emit('loading', newVal);
      },
      immediate: true
    },
  },
}
</script>

<style scoped>
.fundamental-content .p-divider {
  margin: 0 0;
}

.fundamental-sub-content {
  margin-bottom: 1rem;
}

.fundamental-sub-content .capital-text {
  font-weight: 700;
}

.fundamental-sub-content .header-text {
  font-weight: 500;
}
</style>
