import { IndicatorSettingsDefaults } from "./GeneralSettingsDefaults";

export default {
    cmoPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.CMO?.color
        },
        set(value) {
            this.updateProp('CMO')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                CMO: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.CMO,
                    color: value
                }
            })
        },
    },
    cmoLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.CMO?.lineWidth
        },
        set(value) {
            this.updateProp('CMO')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                CMO: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.CMO,
                    lineWidth: Number(value)
                }
            })
        },
    },
    almaPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.ALMA.color
        },
        set(value) {
            this.updateProp('ALMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                ALMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.ALMA,
                    color: value
                }
            })
        },
    },
    almaLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.ALMA.lineWidth
        },
        set(value) {
            this.updateProp('ALMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                ALMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.ALMA,
                    lineWidth: Number(value)
                }
            })
        },
    },
    atrpPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.ATRp.color
        },
        set(value) {
            this.updateProp('ATRp')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                ATRp: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.ATRp,
                    color: value
                }
            })
        },
    },
    atrpLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.ATRp.lineWidth
        },
        set(value) {
            this.updateProp('ATRp')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                ATRp: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.ATRp,
                    lineWidth: Number(value)
                }
            })
        },
    },
    bbwPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.BBW.color
        },
        set(value) {
            this.updateProp('BBW')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                BBW: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.BBW,
                    color: value
                }
            })
        },
    },
    bbwLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.BBW.lineWidth
        },
        set(value) {
            this.updateProp('BBW')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                BBW: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.BBW,
                    lineWidth: Number(value)
                }
            })
        },
    },
    cciPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.CCI.color
        },
        set(value) {
            this.updateProp('CCI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                CCI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.CCI,
                    color: value
                }
            })
        },
    },
    cciBackColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.CCI.backColor
        },
        set(value) {
            this.updateProp('CCI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                CCI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.CCI,
                    backColor: value
                }
            })
        },
    },
    cciBandColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.CCI.bandColor
        },
        set(value) {
            this.updateProp('CCI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                CCI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.CCI,
                    bandColor: value
                }
            })
        },
    },
    cciLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.CCI.lineWidth
        },
        set(value) {
            this.updateProp('CCI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                CCI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.CCI,
                    lineWidth: Number(value)
                }
            })
        },
    },
    cogPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.COG.color
        },
        set(value) {
            this.updateProp('COG')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                COG: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.COG,
                    color: value
                }
            })
        },
    },
    cogLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.COG.lineWidth
        },
        set(value) {
            this.updateProp('COG')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                COG: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.COG,
                    lineWidth: Number(value)
                }
            })
        },
    },
    dmiPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.DMI.colors
        },
        set(value) {
            this.updateProp('DMI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                DMI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.DMI,
                    colors: [...value]
                }
            })
        },
    },
    dmiLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.DMI.lineWidth
        },
        set(value) {
            this.updateProp('DMI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                DMI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.DMI,
                    lineWidth: Number(value)
                }
            })
        },
    },
    hmaPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.HMA.color
        },
        set(value) {
            this.updateProp('HMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                HMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.HMA,
                    color: value
                }
            })
        },
    },
    hmaLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.HMA.lineWidth
        },
        set(value) {
            this.updateProp('HMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                HMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.HMA,
                    lineWidth: Number(value)
                }
            })
        },
    },
    kcwPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.KCW.color
        },
        set(value) {
            this.updateProp('KCW')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                KCW: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.KCW,
                    color: value
                }
            })
        },
    },
    kcwLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.KCW.lineWidth
        },
        set(value) {
            this.updateProp('KCW')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                KCW: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.KCW,
                    lineWidth: Number(value)
                }
            })
        },
    },
    kcPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.KC.color
        },
        set(value) {
            this.updateProp('KC')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                KC: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.KC,
                    color: value
                }
            })
        },
    },
    kcBackColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.KC.backColor
        },
        set(value) {
            this.updateProp('KC')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                KC: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.KC,
                    backColor: value
                }
            })
        },
    },
    kcLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.KC.lineWidth
        },
        set(value) {
            this.updateProp('KC')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                KC: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.KC,
                    lineWidth: Number(value)
                }
            })
        },
    },
    momPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.MOM.color
        },
        set(value) {
            this.updateProp('MOM')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                MOM: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.MOM,
                    color: value
                }
            })
        },
    },
    momLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.MOM.lineWidth
        },
        set(value) {
            this.updateProp('MOM')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                MOM: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.MOM,
                    lineWidth: Number(value)
                }
            })
        },
    },
    mfiPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.MFI.color
        },
        set(value) {
            this.updateProp('MFI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                MFI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.MFI,
                    color: value
                }
            })
        },
    },
    mfiBandColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.MFI.bandColor
        },
        set(value) {
            this.updateProp('MFI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                MFI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.MFI,
                    bandColor: value
                }
            })
        },
    },
    mfiBackColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.MFI.backColor
        },
        set(value) {
            this.updateProp('MFI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                MFI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.MFI,
                    backColor: value
                }
            })
        },
    },
    mfiLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.MFI.lineWidth
        },
        set(value) {
            this.updateProp('MFI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                MFI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.MFI,
                    lineWidth: Number(value)
                }
            })
        },
    },
    ribbonPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.Ribbon.colors
        },
        set(value) {
            this.updateProp('Ribbon')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                Ribbon: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.Ribbon,
                    colors: [...value]
                }
            })
        },
    },
    ribbonLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.Ribbon.lineWidth
        },
        set(value) {
            this.updateProp('Ribbon')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                Ribbon: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.Ribbon,
                    lineWidth: Number(value)
                }
            })
        },
    },
    vwmaPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.VWMA.color
        },
        set(value) {
            this.updateProp('VWMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                VWMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.VWMA,
                    color: value
                }
            })
        },
    },
    vwmaLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.VWMA.lineWidth
        },
        set(value) {
            this.updateProp('VWMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                VWMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.VWMA,
                    lineWidth: Number(value)
                }
            })
        },
    },
    swmaPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.SWMA.color
        },
        set(value) {
            this.updateProp('VWMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                SWMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.SWMA,
                    color: value
                }
            })
        },
    },
    swmaLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.SWMA.lineWidth
        },
        set(value) {
            this.updateProp('SWMA')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                SWMA: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.SWMA,
                    lineWidth: Number(value)
                }
            })
        },
    },
    tsiPeriodColor: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.TSI.colors
        },
        set(value) {
            this.updateProp('TSI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                TSI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.TSI,
                    colors: [...value]
                }
            })
        },
    },
    tsiLineWidth: {
        get() {
            return this.$store?.state?.userData?.indicatorSettings?.additional?.TSI.lineWidth
        },
        set(value) {
            this.updateProp('TSI')
            this.$store.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', {
                TSI: {
                    ...this.$store?.state?.userData?.indicatorSettings?.additional?.TSI,
                    lineWidth: Number(value)
                }
            })
        },
    },
}