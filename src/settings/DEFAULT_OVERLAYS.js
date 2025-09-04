import { IndicatorSettingsDefaults } from "../components/settingsHelper/GeneralSettingsDefaults";
import store from "../store";
import { combineObject } from "./combineObject";

const singleIndicator = () => {
    return combineObject(store.getters.getSingleIndicator)
};
const indicatorSettings = () => {
    return store.getters.getSingleIndicator
};
const indicatorSettingsAdditional = () => {
    return store.getters.getAdditionalIndicator
};
const multiIndicator = () => {
    return store.getters.getMultiIndicator
};

const generalIndicator = () => {
    return store.getters.getGeneralUserSettings
}
export const OVERLAYS_CHARTS = {
    "MacdSetting": "MACD",
    "macd": "MACD",
    "Stoc": "Stoch",
    "stoc": "Stoch",
    "Roc": "ROC",
    "Bands": "BB",
    "MA": "SMA",
    "WMA": "WMA",
    "XMA": "XMA",
    "RSI": "RSI",
    "rsi": "RSI",
    "TCITrend": "TCI",
    "TCIBreak": "TCI",
    "Rsr": "RS",
    "GuppyMMA": "GuppyMMA"


}
export const DEFAULT_OVERLAYS = {
    trendCharts: {
        selected: false,
        data: [
            {
                id: 1,
                name: 'SMA',
                desc: 'SMA(Price)',
                fullDesc: 'Simple Moving Average(Price)',
                tool_type: 'trendCharts',
                selected: false,
                multi_value: true,
                props: [
                    {
                        length: 30,
                        color: '#0980e8',
                    },
                ],
                datatype: 'object',
                storeRef: 'sma',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'simpleMovingAverage',
                getData: function () {

                    const data = multiIndicator();
                    return data?.sma
                },
                getOverlayData: function (settings) {
                    let settingsBase = this.getData()
                    return {
                        ...settingsBase,
                        length: settings.crossesAndAboveBelow.rightPeriod,
                        color: '#0980e8',
                        chartId: 'simpleMovingAverage',
                    }
                }
            },

            {
                id: 4,
                name: 'WMA',
                desc: 'WMA',
                fullDesc: 'Weighted Moving Average',
                tool_type: 'trendCharts',
                selected: false,
                multi_value: true,
                props: [
                    {
                        period: 9,
                        color: '#0980e8',
                    },
                    {
                        period: 27,
                        color: '#FF7518',
                    },
                ],
                datatype: 'object',
                storeRef: 'wma',
                mapping: {
                    period: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'weightedMovingAverage',
                getData: function () {

                    const data = multiIndicator();
                    return data?.wma
                },
                getOverlayData: function (settings) {
                    let settingsBase = this.getData()
                    return {
                        ...settingsBase,
                        period: settings.crossesAndAboveBelow.rightPeriod,
                        color: '#0980e8',
                    }
                }
            },
            {
                id: 5,
                name: 'XMA',
                desc: 'XMA',
                fullDesc: 'Exponential Moving Average',
                tool_type: 'trendCharts',
                selected: false,
                multi_value: true,
                props: [
                    {
                        period: 15,
                        color: '#0980e8',
                    },
                    {
                        period: 45,
                        color: '#FF7518',
                    },
                    {
                        period: 60,
                        color: '#9954BB',
                    },
                ],
                datatype: 'object',
                storeRef: 'xma',
                mapping: {
                    period: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'exponentialMovingAverage',
                getData: function () {

                    const data = multiIndicator();
                    if (data?.xma) {
                        for (const datum of data?.xma) {
                            if (datum?.period) {
                                datum.period = Number(datum.period)
                            }
                        }
                    }
                    return data?.xma
                },
                getOverlayData: function (settings) {
                    let settingsBase = this.getData()
                    return {
                        ...settingsBase,
                        period: settings.crossesAndAboveBelow.rightPeriod,
                        color: '#0980e8',
                    }
                }
            },

            {
                id: 6,
                name: 'SAR',
                desc: 'SAR',
                fullDesc: 'Parabolic SAR',
                tool_type: 'trendCharts',
                selected: false,
                props: {
                    start: 0.2,
                    inc: 0.1,
                    max: 0.3,
                    color: '#35a9c6',
                },
                datatype: 'object',
                mapping: {
                    start: { prop: ['parameters', 'start', 'value'] },
                    inc: { prop: ['parameters', 'increment', 'value'] },
                    max: { prop: ['parameters', 'max', 'value'] },
                    color: { prop: 'series', color: true },
                },
                storeRef: 'parabolicSar',
                chartId: 'parabolicSar',
                getData: function () {

                    const data = singleIndicator();
                    return data?.parabolicSar
                }
            },
            {
                id: 7,
                name: 'MACD',
                desc: 'MACD',
                fullDesc: 'MACD',
                tool_type: 'trendCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb'
                },
                datatype: 'object',
                storeRef: 'macd',
                chartId: 'macd',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true }
                },
                getData: function () {

                    const data = singleIndicator();
                    return data?.macd
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 8,
                name: 'GuppyMMA',
                desc: 'GMMA',
                fullDesc: 'Guppy Multiple Moving Average',
                tool_type: 'trendCharts',
                selected: false,
                multi_value: false,
                props: {
                    periodList: [

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

                },
                datatype: 'object',
                storeRef: 'gxma',
                chartId: 'guppymultiplemovingaverage',
                getData: function () {

                    const data = multiIndicator();
                    if (data?.gxma) {
                        for (const datum of data?.gxma) {
                            if (datum?.period) {
                                datum.period = Number(datum.period)
                            }
                        }
                    }
                    return { periodList: data?.gxma }
                },
                getOverlayData: function (settings) {

                    let settingsBase = this.getData()
                    console.log("getoverlaydata", settings, settingsBase);
                    return {
                        ...settingsBase,
                    }
                }
            },
        ],
    },
    plusCharts: {
        selected: false,
        data: [
            {
                id: 1,
                name: 'ALMA',
                desc: 'ALMA',
                fullDesc: 'ALMA',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'ALMA',
                chartId: 'ALMA',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();
                    return data?.ALMA
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 2,
                name: 'ATRp',
                desc: 'ATRp',
                fullDesc: 'ATRp',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'ATRp',
                chartId: 'ATRp',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();
                    return data?.ATRp
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 3,
                name: 'BBW',
                desc: 'BBW',
                fullDesc: 'BBW',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'BBW',
                chartId: 'BBW',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();
                    return data?.BBW
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 4,
                name: 'CCI',
                desc: 'CCI',
                fullDesc: 'CCI',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'CCI',
                chartId: 'CCI',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();
                    return data?.CCI
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 5,
                name: 'CMO',
                desc: 'CMO',
                fullDesc: 'CMO',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    length: 10,
                    lineWidth: 0.75,
                    color: '#559de0'
                },
                datatype: 'object',
                storeRef: 'CMO',
                chartId: 'CMO',
                mapping: {

                },
                getData: function () {

                    const data = indicatorSettingsAdditional();
                    return data?.CMO
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },


            {
                id: 6,
                name: 'COG',
                desc: 'COG',
                fullDesc: 'COG',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'COG',
                chartId: 'COG',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();
                    return data?.COG
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 7,
                name: 'DMI',
                desc: 'DMI',
                fullDesc: 'DMI',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'DMI',
                chartId: 'DMI',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.DMI
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 8,
                name: 'HMA',
                desc: 'HMA',
                fullDesc: 'HMA',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'HMA',
                chartId: 'HMA',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.HMA
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 9,
                name: 'KCW',
                desc: 'KCW',
                fullDesc: 'KCW',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'KCW',
                chartId: 'KCW',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.KCW
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 10,
                name: 'KC',
                desc: 'KC',
                fullDesc: 'KC',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'KC',
                chartId: 'KC',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.KC
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },


            {
                id: 11,
                name: 'MOM',
                desc: 'MOM',
                fullDesc: 'MOM',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'MOM',
                chartId: 'MOM',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.MOM
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 12,
                name: 'MFI',
                desc: 'MFI',
                fullDesc: 'MFI',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'MFI',
                chartId: 'MFI',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.MFI
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 13,
                name: 'Ribbon',
                desc: 'Ribbon',
                fullDesc: 'Ribbon',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'Ribbon',
                chartId: 'Ribbon',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.Ribbon
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 14,
                name: 'VWMA',
                desc: 'VWMA',
                fullDesc: 'VWMA',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'VWMA',
                chartId: 'VWMA',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.VWMA
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 15,
                name: 'TSI',
                desc: 'TSI',
                fullDesc: 'TSI',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    fast: 30,
                    slow: 15,
                    smooth: 12,
                    macdColor: '#2772e3',
                    signalColor: '#441b1b',
                    histColor: '#54a0bb',
                },
                datatype: 'object',
                storeRef: 'TSI',
                chartId: 'TSI',
                mapping: {
                    fast: { prop: ['parameters', 'fastPeriod', 'value'] },
                    slow: { prop: ['parameters', 'slowPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'signalPeriod', 'value'] },
                    macdColor: { prop: 'fastPeriod', color: true },
                    signalColor: { prop: 'slowPeriod', color: true },
                    histColor: { prop: 'signalPeriod', color: true },
                },
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.TSI
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 16,
                name: 'SWMA',
                desc: 'SWMA',
                fullDesc: 'SWMA',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    lineWidth: 0.75,
                    color: '#e57440'
                },
                datatype: 'object',
                storeRef: 'SWMA',
                chartId: 'SWMA',
                mapping: {},
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.SWMA
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettings()


                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            fast: Number(settings["macd"].fast),
                            slow: Number(settings["macd"].slow),
                            smooth: Number(settings["macd"].signal),
                        }
                    } else {
                        if (settings.macd.isActive) {
                            return {
                                ...settingsBase,
                                fast: Number(indicatorSettingsData["macd"].fast),
                                slow: Number(indicatorSettingsData["macd"].slow),
                                smooth: Number(indicatorSettingsData["macd"].smooth),
                            }
                        }
                    }
                }
            },
            {
                id: 17,
                name: 'Ichi',
                desc: 'Ichi',
                fullDesc: 'Ichi',
                tool_type: 'plusCharts',
                selected: false,
                props: {
                    lineWidth: 0.75,
                    color: '#e57440'
                },
                datatype: 'object',
                storeRef: 'Ichi',
                chartId: 'Ichi',
                mapping: {},
                getData: function () {

                    const data = indicatorSettingsAdditional();

                    return data?.Ichi
                },
                getOverlayData: function (settings, scanType) {

                    let settingsBase = this.getData()
                    let indicatorSettingsData = indicatorSettingsAdditional()


                    return {
                        ...settingsBase,
                        CP: Number(indicatorSettingsData["Ichi"].CP),
                        BP: Number(indicatorSettingsData["Ichi"].BP),
                        LSP: Number(indicatorSettingsData["Ichi"].LSP),
                        DIZ: Number(indicatorSettingsData["Ichi"].DIZ),
                        baseColor: 'brown',
                        conversionColor: 'lightblue',
                        laggingColor: '#66CC66'
                    }
                }
            },
        ],
    },
    momentumCharts: {
        selected: false,
        data: [
            {
                id: 5,
                name: 'RS',
                desc: 'RS',
                fullDesc: 'RS Rating',
                tool_type: 'momentumCharts',
                selected: false,
                props: {
                    length: 1,
                    color: '#0000ff',
                },
                datatype: 'object',
                storeRef: 'rsRatingIndex',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'rsRating',
                getData: function () {

                    const data = singleIndicator();
                    return data?.rsRating
                },
                getOverlayData: function (settings, scanType) {
                    let settingsBase = this.getData()
                    return settingsBase
                }
            },
            {
                id: 1,
                name: 'RSI',
                desc: 'RSI',
                fullDesc: 'Relative Strength Index',
                tool_type: 'momentumCharts',
                selected: false,
                props: {
                    length: 15,
                    color: '#ecca20',
                },
                datatype: 'object',
                storeRef: 'relativeStrengthIndex',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'relativeStrengthIndex',
                getData: function () {

                    const data = singleIndicator();

                    return data?.relativeStrengthIndex
                },
                getOverlayData: function (settings, scanType) {
                    let settingsBase = this.getData()

                    if (scanType === 'divergenceScan') {
                        return { ...settingsBase, length: settings['rsi'] }
                    } else {
                        if ("RSI" in settings && settings["RSI"].period) {
                            return { ...settingsBase, length: settings["RSI"].period }
                        } else {
                            return settingsBase
                        }
                    }

                }
            },

            {
                id: 2,
                name: 'Stoch',
                desc: 'STOC',
                fullDesc: 'Stochastic Oscillator',
                tool_type: 'momentumCharts',
                selected: false,
                props: {
                    param_k: 14,
                    param_d: 3,
                    smooth: 3,
                    kColor: '#3782f2',
                    dColor: '#f48709',
                },
                datatype: 'object',
                storeRef: 'stochasticOscillator',
                mapping: {
                    param_k: { prop: ['parameters', 'period', 'value'] },
                    param_d: { prop: ['parameters', 'kPeriod', 'value'] },
                    smooth: { prop: ['parameters', 'dPeriod', 'value'] },
                    kColor: { prop: 'kPeriod', color: true },
                    dColor: { prop: 'dPeriod', color: true },
                },
                chartId: 'stochasticOscillator',
                getData: function () {

                    const data = singleIndicator();

                    return data?.stochasticOscillator
                },
                getOverlayData: function (settings, scanType) {
                    let settingsBase = this.getData()

                    if (scanType === 'divergenceScan') {
                        return {
                            ...settingsBase,
                            param_d: settings["stoc"].dPercent,
                            param_k: settings["stoc"].kPercent,
                            smooth: settings["stoc"].period,
                        }
                    } else {
                        if ("STOC" in settings && settings["STOC"].period && settings["STOC"].kPercent && settings["STOC"].dPercent) {
                            return {
                                ...settingsBase,
                                param_d: settings["STOC"].dPercent,
                                param_k: settings["STOC"].kPercent,
                                smooth: settings["STOC"].period,
                            }
                        } else {
                            return settingsBase
                        }
                    }

                }
            },
            {
                id: 3,
                name: 'WilliamsR',
                desc: 'W%R',
                fullDesc: 'Williams %R',
                tool_type: 'momentumCharts',
                selected: false,
                props: {
                    length: 14,
                    color: '#0980e8',
                },
                datatype: 'object',
                storeRef: 'williamsR',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'williamsR',
                getData: function () {

                    const data = singleIndicator();

                    return data?.williamsR
                }
            },
            {
                id: 4,
                name: 'TCI',
                desc: 'TCI',
                fullDesc: 'Trend Channels',
                tool_type: 'momentumCharts',
                selected: false,
                props: {
                    length: 14,
                    color: '#0980e8',
                },
                datatype: 'object',
                storeRef: 'trendChannels',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'trendChannels',
                getData: function () {

                    const data = singleIndicator();

                    return data?.trendChannels
                },
                getOverlayData: function (settings) {

                    let settingsBase = this.getData()
                    if (settings && settings.tciTrend && settings.tciTrend.isActive) {
                        return {
                            ...settingsBase,
                            period: settings.tciTrend.period,
                            color: '#0980e8',
                        }
                    }
                    if (settings && settings.tciBreak && settings.tciBreak.isActive) {
                        return {
                            ...settingsBase,
                            period: 14,
                            color: '#0980e8',
                        }
                    }
                }
            },
        ],
    },
    volatilityCharts: {
        selected: false,
        data: [
            {
                id: 1,
                name: 'BB',
                desc: 'BOL',
                fullDesc: 'Bollinger Bands',
                tool_type: 'volatilityCharts',
                selected: false,
                props: IndicatorSettingsDefaults.indicatorSettings.single.bollingerBands,
                datatype: 'object',
                storeRef: 'bollingerBands',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    stddev: { prop: ['parameters', 'deviation', 'value'] },
                    basicLineGroup: {
                        basicLineEnable: { prop: 'period', enable: true },
                        basicColor: { prop: 'period', color: true },
                    },
                    upperLineGroup: {
                        upperLineEnable: { prop: 'period', enable: true },
                        upperColor: { prop: 'period', color: true },
                    },
                    lowerLineGroup: {
                        lowerLineEnable: { prop: 'period', enable: true },
                        lowerColor: { prop: 'period', color: true },
                    },
                    backgroundGroup: {
                        backgroundEnable: { prop: 'period', enable: true },
                        backgroundColor: { prop: 'period', color: true },
                    },
                },
                chartId: 'bollingerBands',
                getData: function () {

                    const data = singleIndicator();
                    return data?.bollingerBands
                },
                getOverlayData: function (settings) {
                    let settingsBase = this.getData()
                    return settingsBase
                }
            },
            {
                id: 2,
                name: 'ATR',
                desc: 'ATR',
                fullDesc: 'Average True Range',
                tool_type: 'volatilityCharts',
                selected: false,
                props: {
                    length: 12,
                    lineWidth: 2,
                    multiplier: 1,
                    color: '#0980e8',
                },
                datatype: 'object',
                storeRef: 'averageTrueRange',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    lineWidth: { prop: ['parameters', 'lineWidth', 'value'] },
                    multiplier: { prop: ['parameters', 'multiplier', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'averageTrueRange',
                getData: function () {
                    const data = singleIndicator();

                    return data?.averageTrueRange
                }
            },
            {
                id: 6,
                name: 'RVM',
                desc: 'RVM',
                fullDesc: 'Relative Volatility Measure',
                tool_type: 'volatilityCharts',
                selected: false,
                props: {
                    length: 14,
                    lineWidth: 2,
                    color: '#0980e8',
                    backColor: '#15d822',
                    backColor1: '#25d6ee',
                },
                datatype: 'object',
                storeRef: 'relativeVolatilityMeasure',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    lineWidth: { prop: ['parameters', 'multiplier', 'value'] },
                    color: { prop: 'period', color: true },
                    backColor: { prop: 'deviation', color: true },
                    backColor1: { prop: 'deviation', color: true },
                },
                chartId: 'relativeVolatilityMeasure',
                getData: function () {
                    const data = singleIndicator();
                    return data?.relativeVolatilityMeasure ? data?.relativeVolatilityMeasure : IndicatorSettingsDefaults.indicatorSettings.single.relativeVolatilityMeasure
                },
            },
            {
                id: 3,
                name: 'ROC',
                desc: 'ROC',
                fullDesc: 'Rate Of Change',
                tool_type: 'volatilityCharts',
                selected: false,
                props: {
                    length: 14,
                    color: '#0980e8',
                },
                datatype: 'object',
                storeRef: 'rateOfChange',
                mapping: {
                    length: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'rateOfChange',
                getData: function () {

                    const data = singleIndicator();

                    return data?.rateOfChange
                },
                getOverlayData: function (settings) {
                    let settingsBase = this.getData()

                    if ("ROC" in settings && settings["ROC"].period) {
                        return { ...settingsBase, length: settings["ROC"].period }
                    } else {
                        return settingsBase
                    }
                }
            },
            {
                id: 4,
                name: 'Value',
                desc: 'Value',
                fullDesc: 'Value',
                tool_type: 'volatilityCharts',
                selected: false,
                props: {
                    color: '#0980e8',
                },
                datatype: 'object',
                storeRef: 'valueTraded',
                mapping: {
                    color: { prop: 'series', color: true },
                },
                chartId: 'valueTraded',
                getData: function () {

                    const data = singleIndicator();

                    return data?.valueTraded
                }
            },
            {
                id: 5,
                name: 'VWAP',
                desc: 'VWAP',
                fullDesc: 'VWAP',
                tool_type: 'volatilityCharts',
                selected: false,
                props: {
                    color: '#0980e8',
                },
                datatype: 'object',
                storeRef: 'vwap',
                mapping: {
                    color: { prop: 'series', color: true },
                },
                chartId: 'vwap',
                getData: function () {

                    const data = singleIndicator();

                    return data?.vwap
                }
            },
        ],
    },
    volumeCharts: {
        selected: false,
        data: [
            {
                id: 1,
                name: 'SMAOBV',
                desc: 'SMA(OBV)',
                fullDesc: 'Simple Moving Average of OBV',
                tool_type: 'volumeCharts',
                gridid: 1,
                selected: false,
                multi_value: true,
                props: [
                    {
                        period: 30,
                        color: '#0980e8',
                    },
                ],
                childRef: 'VolumeOVB',
                datatype: 'object',
                storeRef: 'smaobv',
                mapping: {
                    period: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'simpleMovingAverageObv',
                getData: function () {

                    const data = multiIndicator();

                    return data?.smaobv
                }
            },
            {
                id: 2,
                name: 'SMAVolume',
                desc: 'SMA(Volume)',
                fullDesc: 'Simple Moving Average of OBV of Volume',
                tool_type: 'volumeCharts',
                gridid: 1,
                selected: false,
                multi_value: true,
                props: [
                    {
                        period: 30,
                        color: '#0980e8',
                    },
                ],
                childRef: 'VolumeOVB',
                datatype: 'object',
                storeRef: 'smavolume',
                mapping: {
                    period: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'simpleMovingAverageVolume',
                getData: function () {

                    const data = multiIndicator();

                    return data?.smavolume
                }
            },
            {
                id: 3,
                name: 'OBVVolume',
                desc: 'OBV',
                fullDesc: 'OBV of Volume',
                tool_type: 'volumeCharts',
                gridid: 1,
                selected: false,
                multi_value: true,
                props: [
                    {
                        period: 30,
                        color: '#0980e8',
                    },
                ],
                childRef: 'VolumeOVB',
                datatype: 'object',
                storeRef: 'obvvolume',
                mapping: {
                    period: { prop: ['parameters', 'period', 'value'] },
                    color: { prop: 'period', color: true },
                },
                chartId: 'obvVolume',
                getData: function () {

                    const data = multiIndicator();

                    return data?.obvvolume
                }
            },
        ],
    },
}