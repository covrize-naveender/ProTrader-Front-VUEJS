export const ChartSettingsDefaults = {
    generalSettings: {
        chart: {
            lineColor: {
                value: "#2780E3"
            },
            sideColor: {
                value: "#2e2f2f"
            },
            upColor: {
                value: "#2780E3"
            },
            downColor: {
                value: "#ff0039"
            },
            barChange: {
                value: false
            },
            semiLogAxis: {
                value: false
            },
            volumeColor: {
                value: "#2780E3"
            },
            upColorVolume: {
                value: "#2780E3"
            },
            downColorVolume: {
                value: "#ff0039"
            },
            barChangeVolume: {
                value: true
            },
            obvColor: {
                value: "#2e2f2f"
            }
        },
        crossHair: {
            enabled: {
                value: true
            },
            lineColor: {
                value: "#b4b4b9"
            },
            boxColor: {
                value: "#48484a"
            },
            textColor: {
                value: "#ffffff"
            }
        },
        marker: {
            enabled: {
                value: true
            }, lineColor: {
                value: "#b4b4b9"
            },
        },
        misc: {
            hidePopup: {
                value: false
            }
        },
    }
}



export const IndicatorSettingsDefaults = {
    indicatorSettings: {
        single: {
            parabolicSar: {
                start: 0.02,
                inc: 0.02,
                max: 0.2,
                color: "#2780e3"
            },
            macd: {
                fast: 12,
                slow: 26,
                smooth: 9,
                macdColor: "#2780e3",
                signalColor: "#ff7518",
                histColor: "#9954bb",
            },
            relativeStrengthIndex: {
                length: 14,
                color: "#2780e3"
            },
            rsRating: {
                length: 14,
                color: "#0000ff"
            },
            stochasticOscillator: {
                param_k: 5,
                kColor: "#3782f2",
                param_d: 5,
                dColor: "#f48709",
                smooth: 15,
                // color:"#441b1b",
            },
            williamsR: {
                length: 5,
                color: "#ff7518"
            },
            trendChannels: {
                period: 21,
                color: "#2780E3",
            },
            bollingerBands: {
                length: 21,
                stddev: 2,
                basicLineGroup: {
                    basicLineEnable: true,
                    basicColor: "#D75800",
                },
                upperLineGroup: {
                    upperLineEnable: true,
                    upperColor: "#2A9044",
                },
                lowerLineGroup: {
                    lowerLineEnable: true,
                    lowerColor: "#FF0039",
                },
                backgroundGroup: {
                    backgroundEnable: true,
                    backgroundColor: "#d7580026",
                }
            },
            averageTrueRange: {
                length: 14,
                color: "#165ba8",
                lineWidth: 5,
                multiplier: 1
            },
            relativeVolatilityMeasure: {
                length: 15,
                color: "#165ba8",
                lineWidth: 2,
                backColor: '#15d822',
                backColor1: '#25d6ee',
            },
            rateOfChange: {
                length: 10,
                color: "#2780e3"
            },
            valueTraded: {
                color: "#2780e3"
            },
            vwap: {
                color: "#2780e3"
            },
        },
        additional: {
            CMO: {
                lineWidth: 0.75,
                color: '#559de0'
            },
            ALMA: {
                lineWidth: 0.75,
                color: '#559de0'
            },
            ATRp: {
                lineWidth: 0.75,
                color: '#f44336'
            },
            BBW: {
                lineWidth: 0.75,
                color: '#2cc6c9ab'
            },
            CCI: {
                lineWidth: 0.75,
                color: '#e28a3dee',
                backColor: '#e28a3d11',
                bandColor: '#aaaaaa',
                upper: 100,
                lower: -100
            },
            COG: {
                lineWidth: 0.75,
                color: '#559de0'
            },
            DMI: {
                lineWidth: 0.75,
                colors: ["#ef1360", "#3782f2", "#f48709"]
            },
            HMA: {
                lineWidth: 0.75,
                color: '#3af475'
            },
            KCW: {
                lineWidth: 0.75,
                color: '#4c8dffab'
            },
            KC: {
                lineWidth: 0.75,
                color: '#4c8dffab',
                showMid: true,
                backColor: '#4c8dff0a'
            },
            MOM: {
                lineWidth: 0.75,
                color: '#bcc427ee'
            },
            MFI: {
                lineWidth: 0.75,
                color: '#85c427ee',
                bandColor: '#aaaaaa',
                backColor: '#85c42711',
                upper: 80,
                lower: 20
            },
            Ribbon: {
                lineWidth: 0.75,
                colors: ["#3aaaf4ee"]
            },
            VWMA: {
                lineWidth: 0.75,
                color: '#db0670'
            },
            SWMA: {
                lineWidth: 0.75,
                color: '#db0670'
            },
            TSI: {
                lineWidth: 0.75,
                colors: ["#3bb3e4", "#f7046d"]
            },
            Ichi: {
                CP: 9,
                BP: 26,
                LSP: 52,
                DIZ: 26,
                baseColor: 'brown',
                conversionColor: 'lightblue',
                laggingColor: '#66CC66'
            }
        }
    }
}

export const MultipleIndicatorSettings = {
    multi: {
        sma: [
            { period: 30, color: "#165ba8", }
        ],
        smaobv: [
            { period: 30, color: "#165ba8", }
        ],
        smavolume: [
            { period: 30, color: "#165ba8", }
        ],
        obvvolume: [
            { period: 1, color: "#165ba8", }
        ],
        // volumeobv:[
        //     {period:30,color:"#165ba8",}
        // ],
        wma: [
            { period: 9, color: "#165ba8" },
            { period: 27, color: "#ff7518" },
        ],
        xma: [
            { period: 15, color: "#165ba8" },
            { period: 45, color: "#ff7518" },
            { period: 60, color: "#6f378b" },
        ],
        gxma: [
            { period: 3, color: "#3F91EB", group: "short-term" },
            { period: 5, color: "#3F91EB", group: "short-term" },
            { period: 8, color: "#3F91EB", group: "short-term" },
            { period: 10, color: "#3F91EB", group: "short-term" },
            { period: 12, color: "#3F91EB", group: "short-term" },
            { period: 15, color: "#3F91EB", group: "short-term" },

            { period: 30, color: "#F21425", group: "long-term" },
            { period: 35, color: "#F21425", group: "long-term" },
            { period: 40, color: "#F21425", group: "long-term" },
            { period: 45, color: "#F21425", group: "long-term" },
            { period: 50, color: "#F21425", group: "long-term" },
            { period: 60, color: "#F21425", group: "long-term" },
        ]
    }
}

export const DarvasBoxSettings = {
    darvasBoxSettings: {
        scanType: 'long',
        scanPeriod: 55,
        topConfirmationPeriod: 3,
        bottomConfirmationPeriod: 3,
        percentageRiskBuffer: 2.0,
        limitTotalRisk: {
            isActive: false,
            valuePct: 20.0,
        },
        volumeIncreasedOver: {
            isActive: false,
            percent: 300,
            previousBars: 1,
        },
        inBox: {
            isActive: false,
            type: 'anyBox', // 'anyBox' | '1stBox'
        }

    }
}
export default {
    ChartSettingsDefaults
}