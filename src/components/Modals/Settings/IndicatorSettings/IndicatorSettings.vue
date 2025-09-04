<template>
  <div class="p-grid">
    <div class="p-col-12 p-md-6 p-4">
      <IndicatorSettingsSection v-for="(title, type) in indicatorSettings" :key="type" :title="title" :type="type"
        :settings="userMultiSettings[type]" @updateProp="$emit('updateProp', type)" />
    </div>

    <div class="p-col-12 p-md-6 p-4">
      <!-- Trend Channels -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Trend Channels</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="trendChannelValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="trendChannelPeriod" />
          </div>
        </div>
      </div>

      <!-- Bollinger Bands -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Bollinger Bands</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="bollingerBandPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Deviations</div>
          <div class="p-col">
            <p-inputText type="number" v-model="bollingerBandDeviationValue" placeholder="20" />
          </div>
          <div class="p-col">
          </div>
        </div>

        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col p-d-flex p-ai-center" :style="themeFontColor">
            <p-checkbox :binary="true" v-model="bollingerBandEnable" class="p-mr-4"/>
            Basic Line
          </div>
          <div class="p-col">
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="bollingerBandPeriodColor" />
          </div>
        </div>
        
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col p-d-flex p-ai-center" :style="themeFontColor">
            <p-checkbox :binary="true" v-model="bollingerUpperEnable" class="p-mr-4"/>
            Upper Line
          </div>
          <div class="p-col">
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="bollingerUpperPeriodColor" />
          </div>
        </div>
        
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col p-d-flex p-ai-center" :style="themeFontColor">
            <p-checkbox :binary="true" v-model="bollingerLowerEnable" class="p-mr-4"/>
            Lower Line
          </div>
          <div class="p-col">
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="bollingerLowerPeriodColor" />
          </div>
        </div>
        
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col p-d-flex p-ai-center" :style="themeFontColor">
            <p-checkbox :binary="true" v-model="bollingerBackEnable" class="p-mr-4"/>
            Background
          </div>
          <div class="p-col">
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="bollingerBackColor" />
          </div>
        </div>
      </div>

      <!-- Average True Range -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Average True Range</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="atrPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="atrPeriodColor" />
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Line Width</div>
          <div class="p-col">
            <p-inputText type="number" v-model="atrLineWidthValue" placeholder="20" />
          </div>
          <div class="p-col"></div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Multiplier</div>
          <div class="p-col">
            <p-inputText type="number" v-model="atrMultiplierValue" placeholder="2" />
          </div>
          <div class="p-col"></div>
        </div>
      </div>

      <!-- Relative Volatility Measure -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Relative Volatility Measure</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="rvmPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="rvmPeriodColor" />
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Multiplier</div>
          <div class="p-col">
            <p-inputText type="number" v-model="rvmMultiplierValue" placeholder="20" />
          </div>
          <div class="p-col"></div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Back Color 1</div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="rvmBackColor" />
          </div>
          <div class="p-col" :style="themeFontColor">Back Color 2</div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="rvmBackColor1" />
          </div>
        </div>
      </div>

      <!-- MACD -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">MACD</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Fast Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="macdFastPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="macdFastPeriodColor" />
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Slow Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="macdSlowPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="macdSlowPeriodColor" />
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Signal Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="macdSignalPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="macdSignalPeriodColor" />
          </div>
        </div>
      </div>

      <!-- Rate Of Change -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Rate Of Change</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="rocPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="rocPeriodColor" />
          </div>
        </div>
      </div>

      <!-- Relative Strength Index -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Relative Strength Index</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="rsiPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="rsiPeriodColor" />
          </div>
        </div>
      </div>

      <!-- Rs Rating -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Rs Rating</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Colour</div>
          <div class="p-col"></div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="rsRatingColor" />
          </div>
        </div>
      </div>

      <!-- Stochastic Oscillator -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Stochastic Oscillator</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="stocPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <!-- <color-picker type="color" :isSettingsPicker="true" v-model="stocPeriodColor" /> -->
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">%K Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="stocKPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="stocKPeriodColor" />
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">%D Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="stocDPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="stocDPeriodColor" />
          </div>
        </div>
      </div>

      <!-- Williams %R -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Williams %R</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Period</div>
          <div class="p-col">
            <p-inputText type="number" v-model="willRPeriodValue" placeholder="20" />
          </div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="willRPeriodColor" />
          </div>
        </div>
      </div>

      <!-- Parabolic SAR -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Parabolic SAR</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Start</div>
          <div class="p-col">
            <p-inputText type="number" v-model="sarStartValue" placeholder="20" />
          </div>
          <div class="p-col">
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Increment</div>
          <div class="p-col">
            <p-inputText type="number" v-model="sarIncrementValue" placeholder="20" />
          </div>
          <div class="p-col">
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Max</div>
          <div class="p-col">
            <p-inputText type="number" v-model="sarMaxValue" placeholder="20" />
          </div>
          <div class="p-col">
          </div>
        </div>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Colour</div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="sarSeriesValue" />
          </div>
          <div class="p-col">
          </div>
        </div>
      </div>

      <!-- Value -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">Value</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Colour</div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="valueTradedSeriesValue" />
          </div>
          <div class="p-col">
          </div>
        </div>
      </div>

      <!-- VWAP -->
      <div class="settings-container p-mb-4">
        <h4 :style="themeFontColor">VWAP</h4>
        <div class="p-grid setting-item-plus-chart p-mr-2">
          <div class="p-col" :style="themeFontColor">Colour</div>
          <div class="p-col">
            <color-picker type="color" :isSettingsPicker="true" v-model="vwapSeriesValue" />
          </div>
          <div class="p-col">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import IndicatorSettingsSection from './IndicatorSettingsSection.vue';
import { mapGetters } from 'vuex';
import ColorPicker from '@/baseComponents/ColorPicker.vue'
import IndicatorSettingsComputed from '../../../settingsHelper/IndicatorSettingsComputed'


export default {
  name: 'IndicatorSettings',
  components: {
    IndicatorSettingsSection,
    ColorPicker
  },
  data() {
    return {
      changesNotSaved: false
    }
  },
  watch: {
    changesNotSaved(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$emit('propChange')
      }
    }
  },
  computed: {
    ...mapGetters([
      'userMultiSettings',
      'themeFontColor'
    ]),
    ...IndicatorSettingsComputed,
    indicatorSettings() {
      return {
        sma: 'Simple Moving Average',
        smaobv: 'Simple Moving Average of OBV',
        smavolume: 'Simple Moving Average of OBV of Volume',
        wma: 'Weighted Moving Average',
        xma: 'Exponential Moving Average',
        gxma: 'Guppy Exponential Moving Average',
      };
    },
  },
  methods: {
    updateProp(type) {
      this.$emit('updateProp', type);
    },
  }
};
</script>

<style scoped></style>