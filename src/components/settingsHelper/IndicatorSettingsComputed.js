import { IndicatorSettingsDefaults } from "./GeneralSettingsDefaults";

export default {

    trendChannelPeriod: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.trendChannels.color
        },
        set(value) {

            this.updateProp('trendChannels')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                trendChannels: {
                    ...this.$store.state.userData.indicatorSettings.single.trendChannels,
                    color: value
                }
            })
        },
    },
    trendChannelValue: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.trendChannels.period
        },
        set(value) {
            this.updateProp('trendChannels')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                trendChannels: {
                    ...this.$store.state.userData.indicatorSettings.single.trendChannels,
                    period: Number(value)
                }
            })
        },
    },
    bollingerBandEnable: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.basicLineGroup?.basicLineEnable || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.basicLineGroup.basicLineEnable
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    basicLineGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.basicLineGroup,
                        basicLineEnable: value
                    }
                }
            })
        },
    },
    bollingerBandPeriodColor: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.basicLineGroup?.basicColor || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.basicLineGroup.basicColor
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    basicLineGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.basicLineGroup,
                        basicColor: value
                    }
                }
            })
        },
    },

    bollingerUpperEnable: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.upperLineGroup?.upperLineEnable || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.upperLineGroup.upperLineEnable
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    upperLineGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.upperLineGroup,
                        upperLineEnable: value
                    }
                }
            })
        },
    },
    bollingerUpperPeriodColor: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.upperLineGroup?.upperColor || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.upperLineGroup.upperColor
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    upperLineGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.upperLineGroup,
                        upperColor: value
                    }
                }
            })
        },
    },

    bollingerLowerEnable: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.lowerLineGroup?.lowerLineEnable || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.lowerLineGroup.lowerLineEnable
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    lowerLineGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.lowerLineGroup,
                        lowerLineEnable: value
                    }
                }
            })
        },
    },
    bollingerLowerPeriodColor: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.lowerLineGroup?.lowerColor || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.lowerLineGroup.lowerColor
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    lowerLineGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.lowerLineGroup,
                        lowerColor: value
                    }
                }
            })
        },
    },

    bollingerBackEnable: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.backgroundGroup?.backgroundEnable || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.backgroundGroup.backgroundEnable
        },
        set(value) {
            this.updateProp('bollingerBands')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    backgroundGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.backgroundGroup,
                        backgroundEnable: value
                    },
                }
            })
        },
    },
    bollingerBackColor: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.bollingerBands.backgroundGroup?.backgroundColor || IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands.backgroundGroup.backgroundColor
        },
        set(value) {
            this.updateProp('bollingerBands')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    backgroundGroup: {
                        ...this.$store.state.userData.indicatorSettings.single.bollingerBands.backgroundGroup,
                        backgroundColor: value
                    },
                }
            })
        },
    },

    bollingerBandPeriodValue: {
        get() {
            return this.$store.state.userData.indicatorSettings.single.bollingerBands.length
        },
        set(value) {
            this.updateProp('bollingerBands')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    length: value
                }
            })
        },
    },


    bollingerBandDeviationValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.bollingerBands.stddev
        },
        set(value) {
            this.updateProp('bollingerBands')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                bollingerBands: {
                    ...this.$store.state.userData.indicatorSettings.single.bollingerBands,
                    stddev: value
                }
            })
        },
    },
    atrPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.averageTrueRange.color
        },
        set(value) {
            this.updateProp('averageTrueRange')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                averageTrueRange: {
                    ...this.$store.state.userData.indicatorSettings.single.averageTrueRange,
                    color: value
                }
            })
        },
    },
    atrPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.averageTrueRange.length
        },
        set(value) {
            this.updateProp('averageTrueRange')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                averageTrueRange: {
                    ...this.$store.state.userData.indicatorSettings.single.averageTrueRange,
                    length: value
                }
            })
        },
    },
    atrLineWidthValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.averageTrueRange.lineWidth
        },
        set(value) {
            this.updateProp('averageTrueRange')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                averageTrueRange: {
                    ...this.$store.state.userData.indicatorSettings.single.averageTrueRange,
                    lineWidth: value
                }
            })
        },
    },
    atrMultiplierValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.averageTrueRange.multiplier
        },
        set(value) {
            this.updateProp('averageTrueRange')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                averageTrueRange: {
                    ...this.$store.state.userData.indicatorSettings.single.averageTrueRange,
                    multiplier: value
                }
            })
        },
    },

    rvmPeriodColor: {


        get() {
            let res = IndicatorSettingsDefaults.indicatorSettings.single.relativeVolatilityMeasure.color
            if (this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure?.color) {
                res = this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure.color
            }
            return res
        },
        set(value) {
            this.updateProp('relativeVolatilityMeasure')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeVolatilityMeasure: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure,
                    color: value
                }
            })
        },
    },
    rvmPeriodValue: {
        get() {
            let res = IndicatorSettingsDefaults.indicatorSettings.single.relativeVolatilityMeasure.length
            if (this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure?.length) {
                res = this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure.length
            }
            return res
        },
        set(value) {
            this.updateProp('relativeVolatilityMeasure')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeVolatilityMeasure: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure,
                    length: value
                }
            })
        },
    },
    rvmMultiplierValue: {
        get() {
            let res = IndicatorSettingsDefaults.indicatorSettings.single.relativeVolatilityMeasure.lineWidth
            if (this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure?.lineWidth) {
                res = this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure.lineWidth
            }
            return res
        },
        set(value) {
            this.updateProp('relativeVolatilityMeasure')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeVolatilityMeasure: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure,
                    lineWidth: value
                }
            })
        },
    },
    rvmBackColor: {
        get() {
            let res = IndicatorSettingsDefaults.indicatorSettings.single.relativeVolatilityMeasure.backColor
            if (this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure?.backColor) {
                res = this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure.backColor
            }
            return res
        },
        set(value) {
            this.updateProp('relativeVolatilityMeasure')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeVolatilityMeasure: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure,
                    backColor: value
                }
            })
        },
    },
    rvmBackColor1: {
        get() {
            let res = IndicatorSettingsDefaults.indicatorSettings.single.relativeVolatilityMeasure.backColor1
            if (this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure?.backColor1) {
                res = this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure.backColor1
            }
            return res
        },
        set(value) {
            this.updateProp('relativeVolatilityMeasure')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeVolatilityMeasure: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeVolatilityMeasure,
                    backColor1: value
                }
            })
        },
    },

    macdFastPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.macd.macdColor
        },
        set(value) {
            this.updateProp('macd')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                macd: {
                    ...this.$store.state.userData.indicatorSettings.single.macd,
                    macdColor: value
                }
            })
        },
    },
    macdFastPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.macd.fast
        },
        set(value) {
            this.updateProp('macd')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                macd: {
                    ...this.$store.state.userData.indicatorSettings.single.macd,
                    fast: Number(value)
                }
            })
        },
    },
    macdSlowPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.macd.signalColor
        },
        set(value) {
            this.updateProp('macd')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                macd: {
                    ...this.$store.state.userData.indicatorSettings.single.macd,
                    signalColor: value
                }
            })
        },
    },
    macdSlowPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.macd.slow
        },
        set(value) {
            this.updateProp('macd')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                macd: {
                    ...this.$store.state.userData.indicatorSettings.single.macd,
                    slow: Number(value)
                }
            })
        },
    },
    macdSignalPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.macd.histColor
        },
        set(value) {
            this.updateProp('macd')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                macd: {
                    ...this.$store.state.userData.indicatorSettings.single.macd,
                    histColor: value
                }
            })
        },
    },
    macdSignalPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.macd.smooth
        },
        set(value) {
            this.updateProp('macd')

            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                macd: {
                    ...this.$store.state.userData.indicatorSettings.single.macd,
                    smooth: Number(value)
                }
            })
        },
    },
    rocPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.rateOfChange.color
        },
        set(value) {
            this.updateProp('rateOfChange')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                rateOfChange: {
                    ...this.$store.state.userData.indicatorSettings.single.rateOfChange,
                    color: value
                }
            })
        },
    },
    rocPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.rateOfChange.length
        },
        set(value) {
            this.updateProp('rateOfChange')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                rateOfChange: {
                    ...this.$store.state.userData.indicatorSettings.single.rateOfChange,
                    length: value
                }
            })
        },
    },
    stocPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.stochasticOscillator.color
        },
        set(value) {
            this.updateProp('stochasticOscillator')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                stochasticOscillator: {
                    ...this.$store.state.userData.indicatorSettings.single.stochasticOscillator,
                    color: value
                }
            })
        },
    },
    stocPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.stochasticOscillator.smooth
        },
        set(value) {
            this.updateProp('stochasticOscillator')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                stochasticOscillator: {
                    ...this.$store.state.userData.indicatorSettings.single.stochasticOscillator,
                    smooth: value
                }
            })
        },
    },
    stocKPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.stochasticOscillator.kColor
        },
        set(value) {
            this.updateProp('stochasticOscillator')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                stochasticOscillator: {
                    ...this.$store.state.userData.indicatorSettings.single.stochasticOscillator,
                    kColor: value
                }
            })
        },
    },
    stocKPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.stochasticOscillator.param_k
        },
        set(value) {
            this.updateProp('stochasticOscillator')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                stochasticOscillator: {
                    ...this.$store.state.userData.indicatorSettings.single.stochasticOscillator,
                    param_k: value
                }
            })
        },
    },
    stocDPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.stochasticOscillator.dColor
        },
        set(value) {
            this.updateProp('stochasticOscillator')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                stochasticOscillator: {
                    ...this.$store.state.userData.indicatorSettings.single.stochasticOscillator,
                    dColor: value
                }
            })
        },
    },
    stocDPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.stochasticOscillator.param_d
        },
        set(value) {
            this.updateProp('stochasticOscillator')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                stochasticOscillator: {
                    ...this.$store.state.userData.indicatorSettings.single.stochasticOscillator,
                    param_d: value
                }
            })
        },
    },
    rsiPeriodValue: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.relativeStrengthIndex.length
        },
        set(value) {
            this.updateProp('relativeStrengthIndex')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeStrengthIndex: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeStrengthIndex,
                    length: value
                }
            })
        },
    },
    rsiPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.relativeStrengthIndex.color
        },
        set(value) {
            this.updateProp('relativeStrengthIndex')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                relativeStrengthIndex: {
                    ...this.$store.state.userData.indicatorSettings.single.relativeStrengthIndex,
                    color: value
                }
            })
        },
    },

    rsRatingColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.rsRating.color
        },
        set(value) {
            this.updateProp('rsRating')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                rsRating: {
                    ...this.$store.state.userData.indicatorSettings.single.rsRating,
                    color: value
                }
            })
        },
    },
    rsRatingPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.rsRating.length
        },
        set(value) {
            this.updateProp('rsRating')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                rsRating: {
                    ...this.$store.state.userData.indicatorSettings.single.rsRating,
                    length: value
                }
            })
        },
    },
    willRPeriodColor: {


        get() {

            return this.$store.state.userData.indicatorSettings.single.williamsR.color
        },
        set(value) {
            this.updateProp('williamsR')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                williamsR: {
                    ...this.$store.state.userData.indicatorSettings.single.williamsR,
                    color: value
                }
            })
        },
    },
    willRPeriodValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.williamsR.length
        },
        set(value) {
            this.updateProp('williamsR')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                williamsR: {
                    ...this.$store.state.userData.indicatorSettings.single.williamsR,
                    length: value
                }
            })
        },
    },
    sarStartValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.parabolicSar.start
        },
        set(value) {
            this.updateProp('parabolicSar')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                parabolicSar: {
                    ...this.$store.state.userData.indicatorSettings.single.parabolicSar,
                    start: value
                }
            })
        },
    },
    sarIncrementValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.parabolicSar.inc
        },
        set(value) {
            this.updateProp('parabolicSar')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                parabolicSar: {
                    ...this.$store.state.userData.indicatorSettings.single.parabolicSar,
                    inc: value
                }
            })
        },
    },
    sarMaxValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.parabolicSar.max
        },
        set(value) {
            this.updateProp('parabolicSar')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                parabolicSar: {
                    ...this.$store.state.userData.indicatorSettings.single.parabolicSar,
                    max: value
                }
            })
        },
    },
    sarSeriesValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.parabolicSar.color
        },
        set(value) {
            this.updateProp('parabolicSar')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                parabolicSar: {
                    ...this.$store.state.userData.indicatorSettings.single.parabolicSar,
                    color: value
                }
            })
        },
    },
    valueTradedSeriesValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.valueTraded.color
        },
        set(value) {
            this.updateProp('valueTraded')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                valueTraded: {
                    ...this.$store.state.userData.indicatorSettings.single.valueTraded,
                    color: value
                }
            })
        },
    },
    vwapSeriesValue: {
        get() {

            return this.$store.state.userData.indicatorSettings.single.vwap.color
        },
        set(value) {
            this.updateProp('vwap')
            this.$store.commit('SET_INDICATOR_SETTINGS_SINGLE', {
                vwap: {
                    ...this.$store.state.userData.indicatorSettings.single.vwap,
                    color: value
                }
            })
        },
    },
}