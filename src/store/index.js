import {
    deleteAllDrawingDataV1,
    updateDrawingDataV1,
    updateDrawingDataV2
} from '@/services/drawing'
import {
    deleteLayout,
    getLayoutListData,
    saveLayout
} from '@/services/layout'
import { updateChartSettings, updateUserSettings } from '@/services/user'
import {
    deleteWatchList,
    getWatchListData,
    saveWatches,
} from '@/services/watches'
import { marketsData } from 'Data/markets'
import moment from 'moment'
import Vue from 'vue'
import Vuex from 'vuex'
import {
    ChartSettingsDefaults,
    DarvasBoxSettings,
    IndicatorSettingsDefaults,
    MultipleIndicatorSettings,
} from '../components/settingsHelper/GeneralSettingsDefaults'
import gurus from '../services/gurus'
import scanner, { getDarvasBoxDrawing } from '../services/scans'
import symbol, { getLastSymbol, getSPXData, setLastSymbol } from '../services/symbol'
import {
    DEFAULT_DATA_SETTINGS,
    DEFAULT_EVENT_SETTINGS,
    DEFAULT_FILTER_SETTINGS,
    defaultChartSettings,
    protraderCharts,
} from '../settings/USER_SETTINGS_DEFAULT'
import { getMarketTime, parseToChartCandleData } from '../utils'

import multipleSymbolStore from './multipleSymbol'
import userModule from './user'
import actionModule from './action'
import autoplayModule from './autoplay'

import { Utils } from 'trading-vue-js'
import { chartEvents } from '../chartEvents'
import config from '../config'
import Overlays from '../overlays'
import {
    exponentialMovingAverageTest,
    onBalanceVolumeTest,
    priceTest,
    valueTest,
    volumeTest
} from '../services/healthbar'
import { updateMultiChartSettings } from '../services/user'
import { currentSymbolDefaults } from '../settings'
import { DEFAULT_OVERLAYS, OVERLAYS_CHARTS } from '../settings/DEFAULT_OVERLAYS'
import {
    DEFAULT_THEME_SETTINGS,
    isThemePrimary,
    THEME_DETAILS,
} from '../settings/THEME_DETAILS'
import { GetIterationData } from '../settings/TimeRangeConfig'
import { copy as copyObject } from "../utils"
import { ACTIVITY, BIG_CANDLE, BOLLINGER_SQUEEZE, CANDLESTICKS, CAPITALISATION, DARVAS, DIVERGENCE_SCAN, FRANKS_PATTERN, FUNDAMENTALS, HEIKEN_ASHI, HHHL, INDICATORS, PATTERNS, POCKET_PIVOT, SAMS_PATTERN } from '../utils/defaultScanValues'
import { TimeRangesConfig } from '../utils/TimeRangesConfig'
import { actionsubType, actionType, indicatorParam } from '../utils/action'
Vue.use(Vuex)

const themeModeSave = localStorage.getItem('themeModeSave')
const defaultThemeSettings = JSON.parse(JSON.stringify(DEFAULT_THEME_SETTINGS))
let themeDarkMode = false
if (themeModeSave) {
    themeDarkMode = themeModeSave === 'true'
    if (themeDarkMode) {
        defaultThemeSettings.id = 'dark'
        defaultThemeSettings.settings = THEME_DETAILS['dark']
        defaultThemeSettings.themeDarkMode = themeDarkMode
    }
}
let hasStoreRange = localStorage.getItem('TimeRange')
let ShowVolume = localStorage.getItem('ShowVolume')
let GetType = localStorage.getItem('SET_CHART_TYPE')
if (!GetType) {
    GetType = 'Candles'
}
// GetType = 'Candles'
localStorage.removeItem('showLegendProps')
let debugActiveStore = localStorage.getItem('debugActive')
let rangeObj = { range: '1Y' }
if (hasStoreRange) {
    rangeObj = JSON.parse(hasStoreRange)
}
localStorage.setItem('HideVolumeBar', JSON.stringify(['VolumeOVB_0']))

let showVolume = true
// if(ShowVolume && ShowVolume === "false"){
//   showVolume = false
// }
let debugActive = false
if (debugActiveStore && debugActiveStore === 'true') {
    debugActive = true
}
const getDefaultState = () => {
    return {
        scanFavListTypes: ['candlesticks', 'patterns', 'activity', 'fundementals', 'indicators', 'darvasScan'],
        guruFavListTypes: ["samsPattern", "capitulation", 'franksPattern', 'hhhl', 'bollingerSqueeze', 'divergenceScan', 'bigCandle', 'pocketPivot', 'heikenAshi'],
        minusIndex: 0,
        deleteFavScanLoader: false,
        candleIndexSelected: null,
        candleIndexJumpSelected: null,
        trainingOffset: 10,
        compareChartSymbols: [],
        trainingModeDataRaw: [],
        trainingModeData: [],
        debugActive: debugActive,
        chartRangeObj: {
            startRange: '2022/10/22',
            endRange: '2022/11/22',
            startIndex: 0,
            endIndex: 0,
            count: 0,
            daysCount: 0,
        },
        scanOverlay: null,
        showOverlay: false,
        mainChartProps: false,
        chartControlPressed: false,
        searchBoxUpdates: false,
        userChoice: false,
        selectedDrawingID: '',
        userSavedScans: [],
        userSavedScansDefault: [],
        proTrader: {
            themeSettings: defaultThemeSettings,
        },
        themeDarkMode: themeDarkMode,
        favSelectedScanId: undefined,
        scanDeletePopup: false,
        scanPopup: false,
        watchlistPopup: false,
        topListSymbolName: '',
        topListSymbol: '',
        scrollRight: true,
        SelectedScanId: '',
        SelectedScanSymbol: '',
        DEFAULT_THEME_SETTINGS: JSON.stringify(DEFAULT_THEME_SETTINGS),
        scanCopyBtn: false,
        type: GetType,
        protraderCharts: protraderCharts,
        trainingMode: false,
        userChartlist: [],
        chartIDList: [],
        drawingDataList: [],
        symbolIsMissing: false,
        showWatchesModal: false,
        showWatchRenameModal: false,
        showWatchesDeleteModal: false,
        showWatchesImportModal: false,
        watchLists: [],
        watchListsData: [],
        selectedWatch: '',
        selectedWatchCode: -1,
        selectedWatchSymbolCode: -1,
        selectedMarket: 'market',
        intradayMode: true,
        trainingModeStartingIndex: 0,
        trainingModeStartingIndexSubset: 0,
        tradingChartReference: null,
        tradingMultiChartReference: [],
        brushChartReference: null,
        dc: null,
        multiDc: [],
        drawingData: {},
        multiDrawingData: [],
        drawingDataSaveSettings: {},
        data: [],
        ohlcv: [],
        spx: [],
        ohlcvTimeMap: [],
        comparisionHigherHigh: [],
        comparisionLowestLow: [],
        chartUpperRange: 0,
        chartLowerRange: 0,
        comparisionIndex: 0,
        currentSymbol: currentSymbolDefaults,
        symbolName: 'ZNO.au',
        marketId: '',
        marketDesc: '',
        symbolIndex: 0,
        symbolsList: [],
        industryGroup: {},
        subIndustryGroup: {},
        sectorGroup: {},
        timeFrame: localStorage.getItem("CHART_TIME_FRAME") || 'D',
        chartVisibleRange: rangeObj.range,
        chartPredineRangeUpdates: false,
        chartToggleVolume: showVolume,
        chartSettingUpdatedDate: null,
        userData: {
            ...ChartSettingsDefaults,
            ...IndicatorSettingsDefaults,
            ...MultipleIndicatorSettings,
            ...DarvasBoxSettings
        },
        ChartSettingsDefaults: JSON.stringify(ChartSettingsDefaults),
        IndicatorSettingsDefaults: JSON.stringify(IndicatorSettingsDefaults),
        MultipleIndicatorSettings: JSON.stringify(MultipleIndicatorSettings),
        DarvasBoxSettings: JSON.stringify(DarvasBoxSettings),
        userId: null,
        emailId: null,
        settingUpdatesForCharts: [],
        chartOverlays: DEFAULT_OVERLAYS,
        chartSettings: defaultChartSettings,
        defaultChartSettings: defaultChartSettings,
        savedTradePlans: [],
        tadePlanner: {
            accountBalanceData: {
                accountBalance: null,
                stockCode: null,
                currentPrice: null,
                purchasePrice: null,
            },
            positionSize: {
                entryPrice: null,
                stopLoss: null,
                portFolioRisk: null,
                positionSize: null,
                costOfPosition: null,
            },
            entrySignalData: {
                darvas: false,
                ascendingTriangle: false,
                breakResistance: false,
                newsletter: false,
            },
            confirmationSignalData: {
                obv: false,
                marketDepth: false,
            },
            riskManagementSignalData: {
                atr: false,
                pctValue: false,
                dataPoint: false,
                supportLevel: false,
            },
            exitSignalData: {
                gapFilling: false,
                patternTarget: false,
            },
        },
        trailingStop: {
            isOnChart: false,
            isDialogBoxOpened: false,
            entryPrice: 0,
            stopPrice: 0,
            trailingType: '',
            stepPrice: 0.01,
            positionSize: 1000,
            riskValueInCash: 500,
            riskValueInPct: 10,
            atrPeriod: 14,
            atrMultiplier: 5,
        },

        isChartLoading: false,
        scans: {
            results: [],
            gurus: {
                capitulation: JSON.parse(JSON.stringify(CAPITALISATION)),
                bollingerSqueeze: JSON.parse(JSON.stringify(BOLLINGER_SQUEEZE)),
                divergenceScan: JSON.parse(JSON.stringify(DIVERGENCE_SCAN)),
                bigCandle: JSON.parse(JSON.stringify(BIG_CANDLE)),
                pocketPivot: JSON.parse(JSON.stringify(POCKET_PIVOT)),
                heikenAshi: JSON.parse(JSON.stringify(HEIKEN_ASHI)),
                franksPattern: JSON.parse(JSON.stringify(FRANKS_PATTERN)),
                hhhl: JSON.parse(JSON.stringify(HHHL)),
            },
            scanner: {
                samsPattern: JSON.parse(JSON.stringify(SAMS_PATTERN)),
                darvasScan: JSON.parse(JSON.stringify(DARVAS)),
                fundementals: JSON.parse(JSON.stringify(FUNDAMENTALS)),
                activity: JSON.parse(JSON.stringify(ACTIVITY)),
                candlesticks: JSON.parse(JSON.stringify(CANDLESTICKS)),
                patterns: JSON.parse(JSON.stringify(PATTERNS)),
                indicators: JSON.parse(JSON.stringify(INDICATORS)),
            },
            dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
            filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
            eventsSettings: JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS)),
            eventUpdates: {
                status: false,
                dialogId: '',
            },
        },
        indicatorDefaults: {
            sma: 14,
            tci: 21,
        },
        selectedEmoji: '',
        layoutTabMaxCount: 4,
        layout: '1tab',
        tabCount: 1,
        selectedTab: 0,
        multiChartSymbol: [],
        multiOhlcv: [],
        multiSymbolIndex: [],
        isFullScreen: false,
        fullScreenIndex: null,
        savedDrawingData: [],
        layoutPopup: false,
        layoutList: [],
        rsLineData: [],
        scanResultRS: false,
        logScale: false,
        isRestrictModal: false,
        isIntervalModal: false,
        isSubExpireModal: false,
        isAuthModal: false,
        selectedPriceId: config.Monthly_priceId,
        svgColor: '#000000',
        tradePlannerSteper: false,
        rightContainerwidth: 0,
        productPageTrial: false,
        appTour: null,
        tourStep: -1,
        scanLoading: false,
        gridHeight: [],
        isAIOpen: false
    };
};
export default new Vuex.Store({
    modules: {
        user: userModule,
        action: actionModule,
        multipleSymbol: multipleSymbolStore,
        autoplay: autoplayModule
    },
    state: getDefaultState(),
    mutations: {
        SET_CANDLE_DATA_TIME_MAP(state, payload) {
            state.ohlcvTimeMap.splice(payload.index, 1, payload.ohlcvTimeMap)
        },
        SET_MINUS_INDEX(state, payload) {
            state.minusIndex = payload
        },
        COMPARE_CHART_SYMBOLS(state, payload) {
            state.compareChartSymbols = payload
        },
        MAIN_CHART_PROPS(state, payload) {
            state.mainChartProps = payload
        },
        UPDATE_TRAINING_MODE_DATA(state, payload) {
            state.trainingModeData = payload.data
            state.trainingModeDataRaw = payload.raw
        },
        SET_CANDLE_INDEX_UPD(state, payload) {

            state.candleIndexSelected = payload
        },
        SET_CANDLE_INDEX_UPD_TRAINING(state, payload) {

            state.candleIndexJumpSelected = payload
        },
        SET_ChartRangeObj(state, payload) {
            state.chartRangeObj = payload
        },
        SET_CHART_YRANGE_UPPER(state, payload) {
            state.chartUpperRange = payload
        },
        SET_CHART_YRANGE_LOWER(state, payload) {
            state.chartLowerRange = payload
        },
        SET_COMPARISION_HIGHEST_HIGH(state, payload) {
            state.comparisionHigherHigh = payload
        },
        SET_COMPARISION_LOWEST_LOW(state, payload) {
            state.comparisionLowestLow = payload
        },
        SET_COMPARISION_INDEX(state, payload) {
            state.comparisionIndex = payload
        },
        SET_OHLCV(state, payload) {
            state.ohlcv = payload
        },
        SET_MULTI_CHART_OHLCV(state, payload) {
            if (state.multiOhlcv.length > 0) {
                if (state.multiOhlcv[payload.index]) {
                    state.multiOhlcv.splice(payload.index, 1, payload.ohlcv);
                }
                else {
                    state.multiOhlcv[payload.index] = payload.ohlcv
                }
            }
            else {
                state.multiOhlcv[payload.index] = payload.ohlcv
            }
        },
        SET_SPX(state, payload) {
            state.spx = payload
        },
        SHOW_OVERLAYS(state, payload) {
            state.showOverlay = payload
        },
        SCAN_OVERLAYS(state, payload) {
            state.scanOverlay = payload
        },
        SET_SEARCH_BOX_UPDATE(state, payload) {
            state.searchBoxUpdates = payload
        },
        SET_DEL_FAV_SCAN_LOADER(state, payload) {
            state.deleteFavScanLoader = payload
        },
        THEME_MODE(state, payload) {
            state.proTrader.themeSettings = {
                ...state.proTrader.themeSettings,
                themeDarkMode: payload,
            }
        },
        SET_USER_CHOICE(state, payload) {
            state.userChoice = payload
        },
        SET_DRAWING_ID(state, payload) {
            state.selectedDrawingID = payload
        },
        FAV_SELECTED_SCAN_ID(state, payload) {
            state.favSelectedScanId = payload
        },
        RESET_SCAN_SETTINGS_DEFAULT(state) {

            state.dataSettings = JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS))
            state.filterSettings = JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS))
            state.eventsSettings = JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS))
        },
        UPDATE_USER_SCAN_LIST(state, payload) {
            state.userSavedScans = payload
        },
        SET_DEFAULT_SAVED_SCAN(state, payload) {
            state.userSavedScansDefault = JSON.parse(JSON.stringify(payload))
        },

        SCAN_DELETE_POPUP(state, payload) {
            state.scanDeletePopup = payload
        },
        SCAN_POPUP(state, payload) {
            state.scanPopup = payload
        },
        WATCHLIST_POPUP(state, payload) {

            state.watchlistPopup = payload
        },
        TOP_LIST_SYMBOL_NAME(state, payload) {
            state.topListSymbolName = payload
        },
        TOP_LIST_SYMBOL(state, payload) {
            state.topListSymbol = payload
        },
        SCROLL_RIGHT(state, payload) {
            state.scrollRight = payload
        },
        SCAN_COPY_BUTTON(state, payload) {
            state.scanCopyBtn = payload
        },
        SELECTED_SCAN_ID(state, payload) {
            state.SelectedScanId = payload

        },
        RESET_DEFAULT_THEME(state, payload) {

            state.proTrader.themeSettings = payload
        },
        UPDATE_CUSTOM_THEME(state, payload) {

            // delete state.proTrader.themeSettings.id
            state.proTrader.themeSettings = { settings: payload }
        },
        UPDATE_DEFAULT_THEME(state, payload) {

            // delete state.proTrader.themeSettings.settings
            state.proTrader.themeSettings = { id: payload }
            payload == "dark" ? state.themeDarkMode = true : state.themeDarkMode = false
        },
        UPDATE_THEME_SETTINGS(state, payload) {
            state.proTrader.themeSettings = payload
        },
        TOGGLE_VOLUME_CHART(state) {
            const chartToggleVolume = !state.chartToggleVolume
            localStorage.setItem('ShowVolume', chartToggleVolume)
            state.chartToggleVolume = chartToggleVolume
        },
        SET_CHART_TYPE(state, payload) {
            chartEvents.$emit('setChartType', payload)
            localStorage.setItem('SET_CHART_TYPE', payload)
            state.type = payload
        },
        SET_TIME_FRAME(state, payload) {
            localStorage.setItem('SET_TIME_FRAME', payload)
            state.currentSymbol.timeFrame = payload
            state.timeFrame = payload
        },
        SET_TRADING_CHART_REFERENCE(state, payload) {

            state.tradingChartReference = payload.tradingChartReference
        },
        SET_TRADING_MULTI_CHART_REFERENCE(state, payload) {
            state.tradingMultiChartReference[payload.index] = payload.tradingChartReference
        },
        SET_TRADING_BRUSH_REFERENCE(state, payload) {
            state.brushChartReference = payload.brushChartReference
        },
        SET_DATA_CUBE(state, payload) {
            state.dc = payload.dc
        },
        SET_MULTI_DATA_CUBE(state, payload) {
            state.multiDc[payload.index] = payload.dc
        },
        SET_CURRENT_SYMBOL(state, symbol) {
            //////////////////////////////////////////////
            state.currentSymbol = symbol
        },
        SET_MULTI_CHART_SYMBOL(state, payload) {
            //////////////////////////////////////////////
            if (state.multiChartSymbol.length > 0) {
                if (state.multiChartSymbol[payload.index]) {
                    state.multiChartSymbol.splice(payload.index, 1, payload.symbolData);
                }
                else {
                    state.multiChartSymbol[payload.index] = payload.symbolData
                }
            }
            else {
                state.multiChartSymbol[payload.index] = payload.symbolData
            }
        },
        SET_MARKET_ID(state, marketId) {
            ////////////////////////////////////////////////////////////

            let data = marketsData.find((m) => m.code === marketId)
            if (data) {
                state.marketDesc = data.desc
            }
            state.marketId = marketId

        },
        SET_HEALTH(state, payload) {
            // const symData = state.currentSymbol.data
            const symData = state.multiChartSymbol[payload]?.data

            const expTestVal = exponentialMovingAverageTest(symData.map(x => x.close))

            const data_onBalance = symData.slice(-34).map(x => x.volume)

            const onBalanceVal = onBalanceVolumeTest(data_onBalance)

            const priceVal = priceTest(symData)

            const last_five_day_data = symData.slice(-5)
            const volumeVal = volumeTest(last_five_day_data)
            const valueVal = valueTest(last_five_day_data)

            const healtBarVal = expTestVal + onBalanceVal + priceVal + volumeVal + valueVal
            state.multiChartSymbol[payload].health = {
                test1: expTestVal || 0,
                test2: onBalanceVal || 0,
                test3: priceVal || 0,
                test4: volumeVal || 0,
                test5: valueVal || 0
            }
        },
        // SET_BAR_DATA(state, payload) {
        //     state.dc.data.chart.data = payload.barData
        // },
        // ADD_INDICATOR(state, payload) {
        //     state.dc.data.onchart.push(payload.indicator)
        // },
        SET_SYMBOL_TIME_FRAME(state, timeFrame) {
            state.timeFrame = timeFrame
        },
        SET_CHART_SETTINGS(state, payload) {
            state.chartSettings = {
                ...state.chartSettings,
                ...payload,
            }
        },
        SET_DARVASBOX_SETTINGS(state, payload) {
            state.userData.darvasBoxSettings = {
                ...state.userData.darvasBoxSettings,
                ...payload
            }
        },
        SET_CHART_GENERAL_SETTINGS(state, payload) {
            state.userData.generalSettings.chart = {
                ...state.userData.generalSettings.chart,
                ...payload,
            }
        },
        SET_INDICATOR_SETTINGS_SINGLE(state, payload) {
            state.userData.indicatorSettings.single = {
                ...state.userData.indicatorSettings.single,
                ...payload,
            }
        },
        SET_INDICATOR_SETTINGS_ADDITIONAL(state, payload) {
            state.userData.indicatorSettings.additional = {
                ...state.userData.indicatorSettings.additional,
                ...payload,
            }
        },
        SET_MARKER_GENERAL_SETTINGS(state, payload) {
            state.userData.generalSettings.marker = {
                ...state.userData.generalSettings.marker,
                ...payload,
            }
        },
        SET_CROSSHAIR_GENERAL_SETTINGS(state, payload) {
            state.userData.generalSettings.crossHair = {
                ...state.userData.generalSettings.crossHair,
                ...payload,
            }
        },
        SET_MISC_GENERAL_SETTINGS(state, payload) {
            state.userData.generalSettings.misc = {
                ...state.userData.generalSettings.misc,
                ...payload,
            }
        },
        SET_INDICATOR_MULTI_SETTINGS(state, payload) {
            state.userData.multi = {
                ...state.userData.multi,
                ...payload,
            }
        },

        RESET_CHART_SETTINGS_DEFAULTS(state) {

            let ChartSettingsDefaults = JSON.parse(state.ChartSettingsDefaults)
            let IndicatorSettingsDefaults = JSON.parse(
                state.IndicatorSettingsDefaults
            )
            let MultipleIndicatorSettings = JSON.parse(
                state.MultipleIndicatorSettings
            )
            let DarvasBoxSettings = JSON.parse(
                state.DarvasBoxSettings
            )
            state.userData = {
                ...ChartSettingsDefaults,
                ...IndicatorSettingsDefaults,
                ...MultipleIndicatorSettings,
                ...DarvasBoxSettings
            }
            state.proTrader.themeSettings = JSON.parse(state.DEFAULT_THEME_SETTINGS)
        },
        SET_USER_ID(state, payload) {
            state.userId = payload
        },
        SET_USER_EMAIL(state, payload) {
            state.emailId = payload
        },
        SET_USER_CHART_LIST(state, payload) {
            const defaultCharts = [
                'trendCharts',
                'momentumCharts',
                'volatilityCharts',
                'volumeCharts',
                'plusCharts'
            ]
            let userChartData = false
            let userChartlist = []
            let chartIDList = []
            for (let defaultChart of defaultCharts) {
                // 
                let findElement = false
                if (
                    state.chartOverlays[defaultChart] &&
                    state.chartOverlays[defaultChart].data
                ) {
                    for (const datum of state.chartOverlays[defaultChart].data) {

                        if (payload.data.includes(datum.chartId)) {
                            userChartlist.push(datum.chartId)
                            chartIDList.push(datum.name)
                            datum.selected = true
                            findElement = true
                        } else {
                            datum.selected = false
                        }
                    }
                }
                if (!userChartData) {
                    userChartData = findElement
                }
                state.chartOverlays[defaultChart].selected = findElement
            }
            state.userChartlist = userChartlist
            state.chartIDList = chartIDList
            state.userData["proTrader.chart.0.indicators"] = userChartlist
        },
        SET_USER_DATA(state, payload) {
            if (state.userData?.indicatorSettings?.additional) {
                Object.keys(state.userData.indicatorSettings.additional).map((key) => {
                    if (!payload.indicatorSettings.additional[key]) {
                        payload.indicatorSettings.additional[key] = state.userData.indicatorSettings.additional[key]
                    }
                })
            }
            if (payload?.indicatorSettings?.single?.averageTrueRange) {
                payload.indicatorSettings.single.averageTrueRange.multiplier = payload.indicatorSettings.single.averageTrueRange.multiplier || 1
            }
            payload.multi = { ...state.userData.multi, ...payload.multi }

            state.userData = {
                ...state.userData,
                ...payload,
            }
        },
        USER_SET_UPDATE_CHARTS(state, payload) {
            state.settingUpdatesForCharts = payload
        },
        SET_CHART_DEFAULT_SETTINGS(state, payload) {
            state.defaultChartSettings = {
                ...state.defaultChartSettings,
                ...payload,
            }
            state.chartSettingUpdatedDate = new Date().getTime()
        },
        RESET_CHART_SETTINGS(state, payload) {
            if (payload && payload.chartSettings) {
                state.chartSettings = payload.chartSettings
            } else {
                state.chartSettings = defaultChartSettings
            }

            state.chartSettingUpdatedDate = new Date().getTime()
            // reset the indicator defaults as well
            state.indicatorDefaults = {
                sma: 14,
                tci: 21,
            }
        },
        RESET_THEME_SETTINGS(state, payload) {
            if (payload && payload.chartSettings) {
                state.chartSettings = payload.chartSettings
            } else {
                state.chartSettings = defaultChartSettings
            }

            state.chartSettingUpdatedDate = new Date().getTime()
            // reset the indicator defaults as well
            state.indicatorDefaults = {
                sma: 14,
                tci: 21,
            }
        },
        UPDATE_CHART_STATE(state, payload) {
            state.chartSettingUpdatedDate = payload
        },
        SET_INDICATOR_DEFAULTS(state, payload) {
            state.indicatorDefaults = {
                ...state.indicatorDefaults,
                ...payload,
            }
        },
        UPDATE_CHART_SELECTION(state, payload) {
            state.chartSettings[payload.chartName] = payload.chartType
            // state.chartSettings =
        },
        RESET_TRADE_PLANNER_STATE(state) {
            state.tadePlanner = {
                accountBalanceData: {
                    accountBalance: null,
                    stockCode: null,
                    currentPrice: null,
                    purchasePrice: null,
                },
                positionSize: {
                    entryPrice: null,
                    stopLoss: null,
                    portFolioRisk: null,
                    positionSize: null,
                    costOfPosition: null,
                },
                entrySignalData: {
                    darvas: false,
                    ascendingTriangle: false,
                    breakResistance: false,
                    newsletter: false,
                },
                confirmationSignalData: {
                    obv: false,
                    marketDepth: false,
                },
                riskManagementSignalData: {
                    atr: false,
                    pctValue: false,
                    dataPoint: false,
                    supportLevel: false,
                },
                exitSignalData: {
                    gapFilling: false,
                    patternTarget: false,
                },
            }
        },
        RESET_GURUS(state) {
            state.scans.gurus = {
                capitulation: {
                    selectedMarket: 'market',
                    volumeMultiplier: 2,
                    lastVolumeAvgPeriod: 5,
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS))
                },
                bollingerSqueeze: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                    minScanningPeriod: 200,
                    maxScanningPeriod: 250,
                    dayFromToday: 5,
                    minSqueezeLength: 200,
                    maxSqueezeLength: 250,
                    ratioOfSpikeHeight: 10,
                },
                divergenceScan: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                    selectedScan: 'obv',
                    maxRange: 20,
                    stoc: {
                        kPeriod: 12,
                        dPeriod: 26,
                        period: 9,
                    },
                    rsi: 14,
                    macd: {
                        fast: 12,
                        slow: 26,
                        signal: 9,
                    },
                },
                bigCandle: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                    candleSizeMultiplier: 2,
                    previousCandlePeriod: 5,
                },
                pocketPivot: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                    period: 5,
                },
                heikenAshi: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                    period: 10,
                },
                franksPattern: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
                },
                hhhl: {
                    selectedMarket: 'market',
                    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
                    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS))
                },
            }
            state.scans.filterSettings = {
                crossesAndAboveBelow: {
                    isActive: false,
                    left: 'close',
                    leftPeriod: 14,
                    operatorType: 'above',
                    right: 'ma',
                    rightPeriod: 14,
                },
                rsRating: {
                    isActive: false,
                    period: 50,
                },
                priceRangeDollar: {
                    isActive: false,
                    period: 0,
                    end: 0,
                },
                ignoreResults: {
                    isActive: false,
                    minDays: 280,
                },
                isIgnoreResultsWithNoRangeForLastDay: false,
                onlyShowResultsThatHaveTraded: {
                    isActive: false,
                    pastDays: 10,
                },
                ignoreResultsWithValueLess: {
                    isActive: false,
                    value: 2500,
                },
                ignoreResultsWithVolumeLess: {
                    isActive: false,
                    volume: 2500,
                },
                includeIntraDayData: false,
                matchFilterCombination: false,
                excludeWatchlists: false,
            }
        },
        UPDATE_LATEST_GURU_SETTINGS(state, payload) {

            let data = {
                dataSettings: payload.settings.dataSettings,
                ...payload.settings?.settings,
            }
            data.filterSettings = {
                ...DEFAULT_FILTER_SETTINGS,
                ...Object.fromEntries(
                    Object.entries(payload.settings.filterSettings || {}).map(([key, value]) =>
                        [key, value !== null ? value : DEFAULT_FILTER_SETTINGS[key]]
                    )
                )
            };
            state.scans.gurus[payload.id] = data
        },
        UPDATE_TRADE_PLANNER_STATE(state, payload) {
            state.tadePlanner = {
                ...state.tadePlanner,
                [payload.key]: payload.data,
            }
        },
        SAVE_TRADE_PLAN(state) {
            state.savedTradePlans.push({
                name: `${state.tadePlanner.accountBalanceData.stockCode}@${state.tadePlanner.positionSize.entryPrice}-${state.tadePlanner.positionSize.stopLoss}`,
                date: moment().format('HH:MM Do MMM YYYY'),
                plan: state.tadePlanner,
            })
        },
        DELETE_PLAN(state, payload) {
            state.savedTradePlans.splice(
                state.savedTradePlans.findIndex((plan) => plan.name === payload),
                1
            )
        },
        CHART_VISIBLE_RANGE(state, range) {
            state.chartVisibleRange = range
        },
        CHART_PREDEFINE_RANGE_UPDATES(state) {
            state.chartPredineRangeUpdates = !state.chartPredineRangeUpdates
        },
        UPDATE_INDUSTRY_MAP(state, industryGroup) {
            ///////////////////////////////////////
            state.industryGroup = industryGroup
        },
        UPDATE_SUB_INDUSTRY_MAP(state, subIndustryGroup) {
            ///////////////////////////////////////
            state.subIndustryGroup = subIndustryGroup
        },
        UPDATE_SECTOR_MAP(state, sectorGroup) {
            ///////////////////////////////////////
            state.sectorGroup = sectorGroup
        },
        UPDATE_SYMBOLS_LIST(state, symbolsList) {
            ///////////////////////////////////////
            state.symbolsList = symbolsList
        },
        UPDATE_SYMBOL_INDEX(state, newSymbolIndex) {
            /////////////////////////////////////
            state.symbolIndex = newSymbolIndex
        },
        UPDATE_MULTI_SYMBOL_INDEX(state, payload) {
            /////////////////////////////////////
            state.multiSymbolIndex[payload.index] = payload.newSymbolIndex
        },
        SET_CHART_LOADING_STATUS(state, status) {
            state.isChartLoading = status
        },
        ADD_NEW_SCAN_RESULT(state, newScanResult) {
            let date = moment().format('HH:mm:ss')
            if (!newScanResult.events) {
                newScanResult.events = {}
            }
            newScanResult.settings = JSON.parse(
                JSON.stringify({ ...newScanResult.settings, ...newScanResult.events })
            )
            let scanId =
                newScanResult.scanType + ' - ' + newScanResult.timeFrame + ' - ' + date
            let scanName =
                newScanResult.scanType.substr(0, 3).toUpperCase() +
                ' - ' +
                newScanResult.timeFrame +
                ' - ' +
                date

            state.scans.results.push({
                ...newScanResult,

                date: date,
                scanId,
                scanName,
                createdDate: moment(),
                count: 0,
            })

        },

        // var a = moment([2007, 0, 29]);
        // var b = moment([2007, 0, 28]);
        // a.diff(b, 'days')

        UPDATE_SCAN_RESULTS(state, payload) {

            state.scans.results.map((m) => {
                let currentDate = moment()
                let seconds = currentDate.diff(m.createdDate, 'seconds')
                let minutes = currentDate.diff(m.createdDate, 'minutes')
                let hours = currentDate.diff(m.createdDate, 'hours')
                if (seconds < 60) {
                    m.count = seconds + ' seconds ago'
                }
                if (seconds >= 60) {
                    m.count = minutes + ' minutes ago'
                }
                if (minutes >= 60) {
                    m.count = hours + ' hours ago'
                }
            })
        },
        SET_SCAN_DATA_SETTINGS(state, settings) {
            state.scans.dataSettings = { ...state.scans.dataSettings, ...settings }
        },
        SET_SCAN_DATA_SETTINGS2(state, payload) {

            if (payload.type === 'scanner') {
                let spreadElements = {
                    ...state.scans.scanner[payload.id].dataSettings,
                    ...payload.settings,
                }
                state.scans.scanner[payload.id].dataSettings = spreadElements
            } else if (payload.type === 'guru') {
                let spreadElements = state.scans.gurus[payload.id].dataSettings
                spreadElements = { ...spreadElements, ...payload.settings }
                state.scans.gurus[payload.id].dataSettings = spreadElements
            }
        },
        SET_SCAN_FILTER_SETTINGS(state, settings) {
            state.scans.filterSettings = {
                ...state.scans.filterSettings,
                ...settings,
            }
        },
        SET_SCAN_FILTER_SETTINGS2(state, payload) {
            let spreadElements = {
                ...state.scans.scanner[payload.id].filterSettings,
                ...payload.settings,
            }
            let spreadElements1 = {
                ...DEFAULT_FILTER_SETTINGS,
                ...Object.fromEntries(
                    Object.entries(spreadElements || {}).map(([key, value]) =>
                        [key, value !== null ? value : DEFAULT_FILTER_SETTINGS[key]]
                    )
                )
            };
            state.scans.scanner[payload.id].filterSettings = spreadElements1
        },
        SET_GURU_FILTER_SETTINGS2(state, payload) {
            let spreadElements = {
                ...state.scans.gurus[payload.id].filterSettings,
                ...payload.settings,
            }
            state.scans.gurus[payload.id].filterSettings = spreadElements
        },
        SET_SCAN_FILTER_SETTINGS_NEW(state, payload) {

            let spreadElements = {
                ...state.scans.scanner[payload.id].filterSettings,
                ...payload.settings.filterSettings,
            }
            state.scans.scanner[payload.id].filterSettings = spreadElements
        },
        SET_GURU_FILTER_SETTINGS_NEW(state, payload) {
            let spreadElements = {
                ...state.scans.gurus[payload.id].filterSettings,
                ...payload.settings.filterSettings,
            }
            state.scans.gurus[payload.id].filterSettings = spreadElements
        },
        SET_EVENTS_SETTINGS(state, payload) {
            let spreadElements = {
                ...state.scans.scanner[payload.id].eventsSettings,
                ...payload.settings,
            }
            state.scans.scanner[payload.id].eventsSettings = spreadElements
        },
        SET_SCAN_SETTINGS(state, payload) {

            let spreadElements = {
                ...state.scans.scanner[payload.id].settings,
                ...payload.settings,
            }
            state.scans.scanner[payload.id].settings = spreadElements
        },
        SET_GURUS_CAPITULATION_SETTINGS(state, settings) {
            state.scans.gurus.capitulation = {
                ...state.scans.gurus.capitulation,
                ...settings,
            }
        },
        SET_GURUS_FRANKS_SETTINGS(state, settings) {
            state.scans.gurus.franksPattern = settings
        },
        SET_GURUS_HHHL_SETTINGS(state, settings) {
            state.scans.gurus.hhhl = settings
        },
        SET_GURUS_SAMS_PATTERN_SETTINGS(state, settings) {
            state.scans.scanner.samsPattern.settings = {
                ...state.scans.scanner.samsPattern.settings,
                ...settings,
            }
        },
        SET_GURUS_BOLLINGER_SQUEEZE_PATTERN_SETTINGS(state, settings) {

            state.scans.gurus.bollingerSqueeze = {
                ...state.scans.gurus.bollingerSqueeze,
                ...settings,
            }
        },
        SET_GURUS_DIVERGENCE_SCAN_SETTINGS(state, settings) {
            state.scans.gurus.divergenceScan = {
                ...state.scans.gurus.divergenceScan,
                ...settings,
            }
        },
        SET_GURUS_BIG_CANDLE_SCAN_SETTINGS(state, settings) {
            state.scans.gurus.bigCandle = {
                ...state.scans.gurus.bigCandle,
                ...settings,
            }
        },
        SET_GURUS_POCKET_PIVOT_SCAN_SETTINGS(state, pocketPivotPeriod) {
            state.scans.gurus.pocketPivot = pocketPivotPeriod
        },
        SET_GURUS_HEIKEN_ASHI_SCAN_SETTINGS(state, heikenAshiPeriod) {
            state.scans.gurus.heikenAshi = heikenAshiPeriod
        },
        SET_DARVAS_SCAN_SETTINGS(state, settings) {
            state.scans.scanner.darvasScan.settings = {
                ...state.scans.scanner.darvasScan.settings,
                ...settings,
            }
        },
        SET_FUNDEMENTAL_SCAN_SETTINGS(state, settings) {
            state.scans.scanner.fundementals.settings = {
                ...state.scans.scanner.fundementals.settings,
                ...settings,
            }
        },
        SET_ACTIVITY_SCAN_SETTINGS(state, settings) {
            state.scans.scanner.activity.settings = {
                ...state.scans.scanner.activity.settings,
                ...settings,
            }
        },
        SET_CANDLESTICK_SCAN_SETTINGS(state, settings) {
            state.scans.scanner.candlesticks.settings = {
                ...state.scans.scanner.candlesticks.settings,
                ...settings,
            }
        },
        SET_PATTERNS_SCAN_SETTINGS(state, settings) {
            state.scans.scanner.patterns.settings = {
                ...state.scans.scanner.patterns.settings,
                ...settings,
            }
        },
        SET_INDICATORS_SCAN_SETTINGS(state, settings) {
            state.scans.scanner.indicators.settings = {
                ...state.scans.scanner.indicators.settings,
                ...settings,
            }
        },
        SET_TRAINING_MODE(state, payload) {
            state.trainingMode = payload.state
            state.trainingModeStartingIndex =
                payload.startingIndex ?? state.trainingModeStartingIndex
            state.trainingModeStartingIndexSubset =
                payload.trainingDataIndex ?? state.trainingModeStartingIndex
        },
        SET_INTRADAY_MODE(state, payload) {
            state.intradayMode = payload
        },
        UPDATE_DATA_SET(state, payload) {
            state.currentSymbol.data = payload
        },
        UPDATE_USER_DRAWING_TOOLS(state, payload) {
            state.drawingData = payload
        },
        UPDATE_USER_DRAWING_TOOLS_MULTI(state, payload) {
            state.multiDrawingData = payload
        },
        UPDATE_USER_DRAWING_Settings(state, payload) {
            state.drawingDataSaveSettings[payload.id] = payload.value
        },
        UPDATE_USER_DRAWING_LIST(state, payload) {
            state.drawingDataList[payload.index] = payload.drawingDataList
        },
        UPDATE_FILTER_EVENT_SETTINGS(state, payload) {
            state.scans.eventUpdates = payload
        },
        SET_EMOJI(state, payload) {
            state.selectedEmoji = payload
        },
        SET_LAYOUT(state, payload) {
            state.layout = payload
        },
        SET_TAB_COUNT(state, payload) {
            state.tabCount = payload
        },
        SET_SELECTED_TAB(state, payload) {
            state.selectedTab = payload
        },
        SET_FULLSCREEN(state, payload) {
            if (payload !== null) {
                state.selectedTab = payload
                state.fullScreenIndex = payload
                state.isFullScreen = true
            } else {
                state.isFullScreen = false
                state.fullScreenIndex = null
            }

        },
        SET_SAVED_DRAWING(state, payload) {
            state.savedDrawingData = payload
        },
        LAYOUT_POPUP(state, payload) {
            state.layoutPopup = payload
        },
        SET_RS_LINE_DATA(state, payload) {
            state.rsLineData[payload.index] = payload.rsData
        },
        SET_LOGSCALE(state, payload) {
            state.logScale = payload
        },
        SET_RESTRICT_POPUP(state, payload) {
            state.isRestrictModal = payload
        },
        SET_INTERVAL_POPUP(state, payload) {
            state.isIntervalModal = payload
        },
        SET_SUB_EXP_POPUP(state, payload) {
            state.isSubExpireModal = payload
        },
        RESET_STATE(state) {
            // Reset the state to its default values
            Object.assign(state, getDefaultState());
        },
        SET_AUTH_MODAL(state, payload) {
            state.isAuthModal = payload
        },
        SET_PRICE_ID(state, payload) {
            state.selectedPriceId = payload
        },
        UPDATE_SVG_COLOR(state, payload) {
            state.svgColor = payload
        },
        SET_STEPPER(state, payload) {
            state.tradePlannerSteper = payload
        },
        SET_RIGHT_BOX_WIDTH(state, payload) {
            state.rightContainerwidth = Number(payload).toFixed(3)
        },
        SCAN_RESULT_RS(state, payload) {
            state.scanResultRS = payload
        },
        PRODUCT_PAGE_TRIAL(state, payload) {
            state.productPageTrial = payload
        },
        SET_APP_TOUR(state, payload) {
            state.appTour = payload
        },
        SET_TOUR_STEP(state, payload) {
            state.tourStep = payload
        },
        SET_SCAN_LOADING(state, payload) {
            state.scanLoading = payload
        },
        SET_GRID_HEIGHT(state, payload) {
            state.gridHeight[payload.index] = payload.value
        },
        SET_AI_VIEW(state, payload) {
            state.isAIOpen = payload
        }
    },
    actions: {
        async deleteScanSettings(context, id) {
            let deletescan = await scanner.deleteScanId(context.state.userId, id)
            context.commit('SET_DEL_FAV_SCAN_LOADER', false)
            if (deletescan && deletescan.data && deletescan.data.deletedCount) {
                context.dispatch('getUserScanList')
                context.commit('SCAN_DELETE_POPUP', false)
            }
        },
        async runAndUpdateScanSettings(context, id) {

            const scanTypeMap = {
                darvasScan: 'darvasScan',
                fundementalScan: 'fundementals',
                activityScan: 'activity',
                candlestickScan: 'candlesticks',
                patternsScan: 'patterns',
                indicatorsScan: 'indicators',
                samsPattern: "samsPattern",
            }
            const guruScanTypeMap = {
                capitulation: "capitulation",
                franksPattern: "franksPattern",
                hhhl: "hhhl",
                bollingerSqueeze: "bollingerSqueeze",
                divergenceScan: "divergenceScan",
                bigCandle: "bigCandle",
                pocketPivot: "pocketPivot",
                heikenAshi: "heikenAshi",
            }
            var isGuruScan = false
            let currentScan = context.state.userSavedScans[id]
            let scanType = currentScan.scanType
            if (scanTypeMap[scanType]) {
                scanType = scanTypeMap[scanType]
            }
            else if (guruScanTypeMap[scanType]) {
                scanType = guruScanTypeMap[scanType]
                isGuruScan = true
            }
            // if (isGuruScan) {
            //     context.commit('SET_SCAN_DATA_SETTINGS2', {
            //         id: scanType,
            //         settings: currentScan.data.dataSettings,
            //     })
            // }
            // else {
            //     context.commit('SET_SCAN_DATA_SETTINGS2', {
            //         id: scanType,
            //         settings: currentScan.data.dataSettings,
            //     })
            //     context.commit('SET_SCAN_FILTER_SETTINGS2', {
            //         id: scanType,
            //         settings: currentScan.data.filterSettings,
            //     })
            // }


            if (scanType === 'fundementals') {
                context.commit(
                    'SET_FUNDEMENTAL_SCAN_SETTINGS',
                    currentScan.data.settings
                )
                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendFundementalScanRequest')

            } else if (scanType === 'activity') {
                context.commit('SET_ACTIVITY_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendActivityScanRequest')
            } else if (scanType === 'candlesticks') {
                context.commit(
                    'SET_CANDLESTICK_SCAN_SETTINGS',
                    currentScan.data.settings
                )
                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendCandlestickScanRequest')
            } else if (scanType === 'darvasScan') {
                context.commit('SET_DARVAS_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendDarvasScanRequest')
            } else if (scanType === 'indicators') {
                context.commit(
                    'SET_INDICATORS_SCAN_SETTINGS',
                    currentScan.data.settings
                )

                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.commit('SET_EVENTS_SETTINGS', {
                    id: scanType,
                    settings: currentScan.data.events,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendIndicatorsScanRequest')
            } else if (scanType === 'patterns') {
                context.commit('SET_PATTERNS_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.commit('SET_EVENTS_SETTINGS', {
                    id: scanType,
                    settings: currentScan.data.events,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendPatternsScanRequest')
            }
            else if (scanType === 'samsPattern') {
                context.commit('SET_GURUS_SAMS_PATTERN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setScanFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                await context.dispatch('setScanDataSettings', {
                    type: 'scanner',
                    id: currentScan.scanType,
                    settings: currentScan.data.dataSettings,
                })
                context.dispatch('saveScannersScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendSamsPatternRequest')
            }
            else if (scanType === 'capitulation') {
                context.commit('SET_GURUS_CAPITULATION_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendCapitulationRequest')

            }
            else if (scanType === 'franksPattern') {
                context.commit('SET_GURUS_FRANKS_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendFranksPatternRequest')

            }
            else if (scanType === 'hhhl') {
                context.commit('SET_GURUS_HHHL_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendHigherHighHigherLowPatternRequest')
            }
            else if (scanType === 'bollingerSqueeze') {
                context.commit('SET_GURUS_BOLLINGER_SQUEEZE_PATTERN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })

                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendBollingerSqueezePatternRequest')
            }
            else if (scanType === 'divergenceScan') {
                context.commit('SET_GURUS_DIVERGENCE_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendDivergenceScanRequest')
            }
            else if (scanType === 'bigCandle') {
                context.commit('SET_GURUS_BIG_CANDLE_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendBigCandleScanRequest')
            }
            else if (scanType === 'pocketPivot') {
                context.commit('SET_GURUS_POCKET_PIVOT_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendPocketPivotScanRequest')
            }
            else if (scanType === 'heikenAshi') {
                context.commit('SET_GURUS_HEIKEN_ASHI_SCAN_SETTINGS', currentScan.data.settings)
                await context.dispatch('setGuruFilterSettingsNew', {
                    settings: currentScan.data,
                    id: currentScan.scanType
                })
                context.dispatch('saveguruScanRequest', {
                    scanName: currentScan.scanName,
                    scanType: scanType,
                    scanId: currentScan.id
                })
                return await context.dispatch('sendHeikenAshiScanRequest')
            }
            else {
                return null
            }

        },
        enterThemehoverColor(context, obj) {
            obj.style.backgroundColor =
                context.getters.themeSecondaryColor.backgroundColor
            obj.style.color = 'white'
        },
        exitElementColor(context, obj) {
            obj.style.backgroundColor =
                context.getters.themePrimaryColor.backgroundColor
            obj.style.color = context.getters.themeFontColor.color
        },
        updateTrainingModeState(context, payload) {
            // const { state: trainingModeActivated } = payload
            const trainingModeActivated = payload.state

            // when the training mode is deactivated, reset the chart
            if (!trainingModeActivated) {
                context.state.multiDc[context.state.selectedTab].set('chart.data', context.getters.multiOhlcv[context.state.selectedTab])
                // context.state.dc.set('chart.data', context.getters.getSymbolData)
                chartEvents.$emit(
                    'setChartRange',
                    context.state.chartVisibleRange,
                    'TrainingModeRangeReset'
                )
                //code remain
            } else {
                const trainingModeDataRaw = payload.trainingModeDataRaw
                const trainingModeData = payload.trainingModeData
                context.commit('UPDATE_TRAINING_MODE_DATA', {
                    data: trainingModeData,
                    raw: trainingModeDataRaw,
                })
            }
            context.commit('SET_TRAINING_MODE', payload)
        },
        async updateIntraDayModeState(context, isIntradayMode) {
            context.commit('SET_INTRADAY_MODE', isIntradayMode)

            window.dc = this.getters.dc
            const {
                currentZoneTime,
                marketStartTime,
                marketEndTime,
                isMarketOpened,
            } = getMarketTime(context.state.marketId)


            for (let i = 0; i < context.state.multiChartSymbol.length; i++) {
                const element = context.state.multiChartSymbol[i];
                if (element) {
                    let dataForCurrentSymbol = element.data
                    let timeFrame = element.timeFrame
                    let lastCandleApi = element?.lastCandle
                    let latestCandle = element?.latestCandle
                    const lastDataIndex = dataForCurrentSymbol.length - 1
                    const lastCandle = lastCandleApi
                        ? lastCandleApi
                        : dataForCurrentSymbol[lastDataIndex]
                    const lastCandleTime = moment(lastCandle.date).valueOf()
                    if (isMarketOpened) {
                        context
                            .dispatch('setSymbolData', {
                                symbolName: element.symbol,
                                timeFrame: timeFrame,
                                reForce: true,
                                chartIndex: i
                            })
                            .then((d) => {
                                chartEvents.$emit('setChartRange', undefined, 'MarketIntraDayChange')
                                chartEvents.$emit('symbolChangeVerifyScanDetails')
                                chartEvents.$emit('loadDrawingData', false, i)
                            })

                    }
                }


            }
        },
        async retrieveSymbolsList(context) {

            const symbolsList = await symbol.getListOfSymbols()

            context.commit('UPDATE_SECTOR_MAP', symbolsList.sectorGroup)
            context.commit('UPDATE_INDUSTRY_MAP', symbolsList.industryGroup)
            context.commit('UPDATE_SUB_INDUSTRY_MAP', symbolsList.subIndustryGroup)
            context.commit('UPDATE_SYMBOLS_LIST', symbolsList.symbolList)
        },
        async setTimeFrame(context, newTimeFrame) {
            context.state.dc.set('chart.tf', '1' + newTimeFrame)
        },
        async setSymbolData(context, payload) {
            let ismultiChart = context.state.layout !== "1tab"
            let selectTemplate = payload.selectTemplate
            //--- check if we are already on the same symbol
            let isComparision = payload?.isComparison || context.state.type === "CompareChartMain"
            if (!payload.reForce) {
                if (
                    payload.symbolName.length > 0 &&
                    payload.symbolName === context.state.multiChartSymbol[payload.chartIndex]?.symbol &&
                    payload.timeFrame === context.state.multiChartSymbol[payload.chartIndex]?.timeFrame
                ) {
                    return
                }
            }

            if (!ismultiChart && !payload.selectTemplate && context.state.userId) {

                context.dispatch('setNewChartTimeFrame', {
                    timeFrame: payload?.timeFrame,
                    symbol: payload?.symbolName?.length ? payload.symbolName : ""
                })
            }
            if (!payload.scanResultData) {
                chartEvents.$emit('remove_scan_overlay_new', null, true)
                context.commit('SCAN_RESULT_RS', false)
            }
            chartEvents.$emit('deleteAllTools')
            await context.dispatch('setChartLoadingStatus', true)

            //--- delete the existing objects
            const searchElement = 'TSLA~NASDAQ'
            let containBHP = context.state.symbolsList?.includes(searchElement)
            let symbolName = payload.symbolName || getLastSymbol()
            if (!symbolName) {
                if (containBHP) {
                    symbolName = searchElement
                } else {
                    symbolName = context.state.symbolsList?.[0]
                }
            }

            let marketId = 'ASX'
            let symbolArray = symbolName.split('~')
            if (symbolArray && symbolArray.length) {
                symbolName = symbolArray[0]
                marketId = symbolArray[1]
            }

            // let comparisionChart =
            //   context.getters.dc.data.chart.type === 'CompareChartMain'
            let symbolData = {}
            let multipleSymbol = {}
            let rangeMap
            if (isComparision) {

                const timeFrame =
                    payload.timeFrame || context.state.multiChartSymbol[context.state.selectedTab].timeFrame
                const symbolList = Object.values(
                    context.getters.getSelectedMultipleSymbols
                ).filter((str) => str)
                // const symbolName = context.rootGetters.
                let config = TimeRangesConfig[timeFrame]
                rangeMap = config.map((d) => d.range)
                multipleSymbol = await symbol.getMultipleSymbolData(
                    symbolList,
                    timeFrame,
                    symbolName,
                    rangeMap
                )
                symbolData = multipleSymbol.main
            } else {
                let marketOpened = getMarketTime().isMarketOpened
                let intradayMode = context.state.intradayMode
                const isIntraday = intradayMode && marketOpened

                symbolData = await symbol.getData(
                    symbolName,
                    payload.timeFrame,
                    isIntraday,
                    marketId,
                    context.state.minusIndex,
                )
            }

            if ('Error' === symbolData.symbol) {
                //--- set loading status
                context.dispatch('setChartLoadingStatus', false)
                context.dispatch('toggleSymbolMissing')
                const ohlcvData = parseToChartCandleData([currentSymbolDefaults])[0]
                context.state.dc.set('chart.data', ohlcvData)

                context.commit('SET_CURRENT_SYMBOL', {
                    ...currentSymbolDefaults,
                    symbol: symbolName,
                })
                return false
            } else {
                let symIdentifier =
                    symbolData.symbol + '~' + symbolData.metaData.exchange
                context.commit('SET_MULTI_CHART_SYMBOL', {
                    index: payload.chartIndex,
                    symbolData: symbolData
                })
                if (!ismultiChart && !payload.selectTemplate) {

                    // context.commit('SET_CURRENT_SYMBOL', symbolData)
                    context.commit('SET_MARKET_ID', symbolData.metaData.exchange)
                    setLastSymbol(symIdentifier)
                }
                let marketOpened = getMarketTime().isMarketOpened
                let intradayMode = context.state.intradayMode
                const isIntraday = intradayMode && marketOpened
                const len = symbolData.data.length - 1
                if (isIntraday && symbolData?.latestCandle && symbolData?.lastCandle) {
                    // symbolData.data.pop()

                    let latestDateApi = symbolData?.latestCandle?.date
                    let lastCandleDate = symbolData?.lastCandle.date
                    if (latestDateApi && lastCandleDate) {
                        if (!moment(latestDateApi).isSame(moment(lastCandleDate))) {
                            //symbolData.data.push(symbolData.latestCandle)
                        }
                    }
                }
                context.commit('SET_MULTI_CHART_SYMBOL', {
                    index: payload.chartIndex,
                    symbolData: symbolData
                })
                let [parsedData, ohlcvMap] = parseToChartCandleData(symbolData.data)

                context.commit('SET_MULTI_CHART_OHLCV', {
                    index: payload.chartIndex,
                    ohlcv: parsedData
                })
                context.commit('SET_CANDLE_DATA_TIME_MAP', {
                    index: payload.chartIndex,
                    ohlcvTimeMap: ohlcvMap
                })
                if (!ismultiChart) {

                    context.commit('SET_OHLCV', parsedData)
                    context.commit('SET_CURRENT_SYMBOL', symbolData)
                }

                // symbolData.health = Math.random() * 100
                const selectedSymbolIndex = context.state.symbolsList.findIndex(
                    (sym) => sym === symIdentifier
                )

                if (selectedSymbolIndex !== -1) {
                    // context.commit('UPDATE_SYMBOL_INDEX', selectedSymbolIndex)
                    context.commit('UPDATE_MULTI_SYMBOL_INDEX', {
                        index: payload.chartIndex,
                        newSymbolIndex: selectedSymbolIndex
                    })
                }

                if (payload.timeFrame !== context.state.timeFrame) {
                    context.commit('SET_SYMBOL_TIME_FRAME', payload.timeFrame || 'D')
                }
                context.commit('SET_HEALTH', payload.chartIndex)
                if (!payload.disableUndo) {

                    context.dispatch('action/resetActions')
                }
                //--- reset the chart
                // context.state.tradingChartReference.resetChart(true)

                //--- if the chart is in compare symbol mode

                if (isComparision) {
                    // await context.dispatch('retrieveMultipleSymbolData')
                    //--- set loading status
                    context.commit('setMultiSymbolData', multipleSymbol)
                    context.dispatch('updateMultipleSymbolData2', {
                        data: multipleSymbol,
                        rangeMap,
                    })

                    context.dispatch('setChartLoadingStatus', false)

                    //--- setting the chart range
                    //TODO:CHANGE_EFFECTS
                    // context.dispatch('setChartRange', context.state.chartVisibleRange)
                } else {
                    //--- set loading status
                    context.dispatch('setChartLoadingStatus', false)
                }
                // if(!context.getters?.tv?.$refs?.chart?.auto_y_axis){
                //   context?.getters?.tv?.toggleSideBarYAxis();
                // }
                // await getDrawingData(symbolData.symbol)
                return true

            }
        },

        async setNewChartTimeFrame(context, payload) {
            try {
                let userData = {
                    ...context.state.userData,
                }
                userData['timeFrame'] = payload.timeFrame
                if (payload?.symbol)
                    userData['symbol'] = payload?.symbol
                context.commit('SET_TIME_FRAME', payload.timeFrame)
                const result = await updateUserSettings({
                    userData: userData,
                }, "setNewChartTimeFrame")
                return result.updated
            } catch (error) {
                return null
            }
        },

        async setNewTimeFrameRange(context, payload) {
            try {
                let userData = {
                    ...context.state.userData,
                }
                userData[payload.key] = payload.value
                const result = await updateUserSettings({
                    userData: userData,
                }, "setNewTimeFrameRange")
                context.state.userData[payload.key] = payload.value
                return result.updated
            } catch (error) {
                return null
            }
        },

        async setNewChartType(context, payload) {
            try {
                let userData = {
                    ...context.state.userData,
                }
                userData['chartType'] = payload?.type
                userData['symbolMap'] = payload?.symbolMap
                const result = await updateUserSettings({
                    userData: userData,
                }, "setNewChartType")
                context.state.userData = userData
                context.commit('SET_CHART_TYPE', payload?.type)
                return result.updated
            } catch (error) {
                return null
            }

            if (payload?.type === 'PnF' || payload?.type === 'Kagi') return

            /*
      TODO:CHANGE_EFFECTS
      setTimeout(() => {
        context.getters.tv.goto(
          context.getters.tv.data.data.chart.data.length + 20
        )
      }, 0)*/
        },
        async saveTradePlan(context) {
            context.commit('SAVE_TRADE_PLAN')
            context.commit('RESET_TRADE_PLANNER_STATE')
        },
        async toggleVolumeChart(context) {
            context.commit('TOGGLE_VOLUME_CHART')
        },
        async deletePlan(context, payload) {
            context.commit('DELETE_PLAN', payload)
        },
        /**
         * Change chart range
         * @param {Object} context store context
         * @param {String} range current selected range
         */
        async setChartRange(context, range) {
            let rangeObj = { range: range, start: null, end: null }
            let isRangeChange = rangeObj.range !== context.state.chartVisibleRange

            if (isRangeChange) {

                let eventStr = JSON.stringify(rangeObj)
                localStorage.setItem('TimeRange', eventStr)
            }

            let hasStoreRange = localStorage.getItem('TimeRange')

            if (hasStoreRange) {
                rangeObj = JSON.parse(hasStoreRange)
            }
            const candleData = context.getters.tv.data.data.chart.data //context.state.currentSymbol.data
            // const candleData = context.getters.dc.get('chart.data') //context.state.currentSymbol.data
            if (candleData.length) {
                let calculatedStartingTimeForYears
                context.commit('CHART_VISIBLE_RANGE', rangeObj.range)
                if (
                    (isRangeChange && context.state.chartPredineRangeUpdates) ||
                    (rangeObj && rangeObj.range && rangeObj.range.length)
                ) {
                    if (context.state.chartPredineRangeUpdates)
                        context.commit('CHART_PREDEFINE_RANGE_UPDATES')

                    const endingTime = candleData[candleData.length - 1][0]
                    let startingTime = candleData[0][0]

                    if (rangeObj.range === '3M') {
                        // let calculateThreeM = moment(endingTime).subtract(10, 'days');
                        let calculateThreeM = moment(endingTime).subtract(3, 'months')
                        startingTime = calculateThreeM.valueOf()
                    } else if (rangeObj.range === '6M') {
                        let calculateSixM = moment(endingTime).subtract(6, 'months')
                        startingTime = calculateSixM.valueOf()
                    } else if (rangeObj.range === 'YTD') {
                        startingTime = moment().startOf('year').valueOf()
                    } else if (rangeObj.range.includes('Y')) {
                        const numOfYears = parseInt(
                            rangeObj.range.substring(0, rangeObj.range.length - 1)
                        )
                        calculatedStartingTimeForYears = moment(endingTime)
                            .subtract(numOfYears, 'year')
                            .valueOf()

                        let checkValidDate = moment(calculatedStartingTimeForYears)
                        if (checkValidDate.isValid()) {
                            startingTime = calculatedStartingTimeForYears
                        }
                    }
                    const { iterations, type } = GetIterationData(context.state.timeFrame)
                    let startingTimeObj = moment(startingTime)
                    let firstCandleTimeObj = moment(candleData[0][0])
                    let lastCandleTimeObj = moment(candleData[0][candleData.length - 1])
                    let diffInDaysFromFirstCandle = startingTimeObj.diff(
                        firstCandleTimeObj,
                        type
                    )
                    let startIndex = context.state.tradingChartReference.getTimeIndex(
                        candleData[0][0]
                    )

                    if (startIndex < 0) {
                        startIndex = startingTime
                    } else {
                        startIndex = Math.floor(startIndex)
                    }
                    let endIndex = context.state.tradingChartReference.getTimeIndex(
                        candleData[0][candleData.length - 1]
                    )
                    context.dispatch('updateChartStartingTime', startingTime)
                    context.dispatch('updateChartEndingTime', endingTime)

                    context.state.tradingChartReference.setRange(
                        diffInDaysFromFirstCandle < 0 ? 0 : startingTime,
                        candleData.length + iterations
                    )
                } else {

                    context.state.chartVisibleRange = rangeObj.range

                    if (rangeObj.range) {
                    } else {

                        let startingTime = rangeObj.start
                        let firstCandleTimeObj = moment(candleData[0][0])
                        let startingTimeObj = moment(rangeObj.start)
                        let lastCandleTimeObj = moment(candleData[candleData.length - 1][0])
                        let timestamp2Obj = moment(rangeObj.end)
                        let diffInDaysFromFirstCandle = startingTimeObj.diff(
                            firstCandleTimeObj,
                            'day'
                        )
                        let endingTimeDiff = timestamp2Obj.diff(lastCandleTimeObj, 'day')
                        let startingDaysInControls = diffInDaysFromFirstCandle < 0
                        const { iterations } = GetIterationData(context.state.timeFrame)
                        let index =
                            context.state.tradingChartReference.getTimeIndex(startingTime)
                        context.state.tradingChartReference.setRange(
                            startingDaysInControls ? 0 : startingTime,
                            endingTimeDiff > 0 ? candleData.length + iterations : rangeObj.end
                        )
                    }

                    // context.state.tradingChartReference.setRange(
                    //     rangeObj[0],
                    //     candleData.length + 20
                    // )
                }

                // context.state.chartVisibleRange
                /* let rangeFinal = context.state.tradingChartReference.getRange()
              if (isRangeChange) {
                rangeObj.start = rangeFinal[0]
                rangeObj.end = rangeFinal[1]
                rangeObj.range = range
                let rangeFinalStr = JSON.stringify(rangeObj)

                localStorage.setItem('TimeRange', rangeFinalStr)
              } */
            } else {
                alert('Symbol Data Not Available')
                await context.dispatch('incrementSymbolIndex', context)
            }
        },
        async incrementSymbolIndex(context) {
            const conSymbolIdx = context.state.multiSymbolIndex[context.state.selectedTab]
            const timeFrame = context.state.multiChartSymbol[context.state.selectedTab]?.timeFrame
            const max = context.state.symbolsList.length - 1
            let submitObj = {
                symbolName: context.state.symbolsList[conSymbolIdx + 1],
                timeFrame: timeFrame || 'D',
                chartIndex: context.state.selectedTab
            }
            if (conSymbolIdx < max) {

                context.dispatch('setSymbolData', submitObj).then((d) => {
                    chartEvents.$emit('setChartRange', undefined, 'RightSymbolSelect')
                    chartEvents.$emit('symbolChangeVerifyScanDetails')
                    chartEvents.$emit('loadDrawingData', false, context.state.selectedTab)
                })
            }
        },
        async decrementSymbolIndex(context) {
            const conSymbolIdx = context.state.multiSymbolIndex[context.state.selectedTab]
            const timeFrame = context.state.multiChartSymbol[context.state.selectedTab]?.timeFrame
            if (conSymbolIdx > 0) {

                context
                    .dispatch('setSymbolData', {
                        symbolName:
                            context.state.symbolsList[conSymbolIdx - 1],
                        timeFrame: timeFrame || 'D',
                        chartIndex: context.state.selectedTab
                    })
                    .then((d) => {
                        chartEvents.$emit('setChartRange', undefined, 'LeftSymbolSelect')
                        chartEvents.$emit('symbolChangeVerifyScanDetails')
                        chartEvents.$emit('loadDrawingData', false, context.state.selectedTab)
                    })
            }
        },
        async toggleSymbolMissing(context) {
            context.state.symbolIsMissing = !context.state.symbolIsMissing
        },
        async setChartLoadingStatus(context, status) {
            context.commit('SET_CHART_LOADING_STATUS', status)
        },
        async addNewScanResult(context, newResult) {
            context.commit('ADD_NEW_SCAN_RESULT', newResult)
        },
        async setScanDataSettings(context, payload) {

            context.commit('SET_SCAN_DATA_SETTINGS2', payload)
        },
        async setScanDataSettingsOld(context, payload) {
            context.commit('SET_SCAN_DATA_SETTINGS', payload)
        },
        async setScanFilterSettingsOld(context, settings) {
            context.commit('SET_SCAN_FILTER_SETTINGS', settings)
        },
        async setGuruFilterSettingsOld(context, settings) {
            context.commit('SET_GURU_FILTER_SETTINGS', settings)
        },
        async setScanFilterSettings(context, settings) {

            context.commit('SET_SCAN_FILTER_SETTINGS2', settings)
            return true
        },
        async setGuruFilterSettings(context, settings) {

            context.commit('SET_GURU_FILTER_SETTINGS2', settings)
            // return true
        },
        async setGuruFilterSettingsNew(context, settings) {

            context.commit('SET_GURU_FILTER_SETTINGS_NEW', settings)
            // return true
        },
        async setScanFilterSettingsNew(context, settings) {

            context.commit('SET_SCAN_FILTER_SETTINGS_NEW', settings)
        },
        async setEventsFilterSettings(context, settings) {
            context.commit('SET_EVENTS_SETTINGS', settings)
        },
        async setCapitulationSettings(context, settings) {
            context.commit('SET_GURUS_CAPITULATION_SETTINGS', settings)
        },
        async setFranksSettings(context, settings) {
            context.commit('SET_GURUS_FRANKS_SETTINGS', settings)
        },
        async setHhhlSettings(context, settings) {
            context.commit('SET_GURUS_HHHL_SETTINGS', settings)
        },
        async setSamsPatternSettings(context, settings) {
            context.commit('SET_GURUS_SAMS_PATTERN_SETTINGS', settings)
        },
        async setBollingerSqueezeSettings(context, settings) {

            context.commit('SET_GURUS_BOLLINGER_SQUEEZE_PATTERN_SETTINGS', settings)
        },
        async setDivergenceScanSettings(context, settings) {
            context.commit('SET_GURUS_DIVERGENCE_SCAN_SETTINGS', settings)
        },
        async setBigCandleScanSettings(context, settings) {
            context.commit('SET_GURUS_BIG_CANDLE_SCAN_SETTINGS', settings)
        },
        async setPocketPivotScanSettings(context, period) {
            context.commit('SET_GURUS_POCKET_PIVOT_SCAN_SETTINGS', period)
        },
        async setHeikenAshiScanSettings(context, period) {
            context.commit('SET_GURUS_HEIKEN_ASHI_SCAN_SETTINGS', period)
        },
        async setDarvasScanSettings(context, settings) {
            context.commit('SET_DARVAS_SCAN_SETTINGS', settings)
        },
        async setFundementalsScanSettings(context, settings) {
            context.commit('SET_FUNDEMENTAL_SCAN_SETTINGS', settings)
        },
        async setActivityScanSettings(context, settings) {
            context.commit('SET_ACTIVITY_SCAN_SETTINGS', settings)
        },
        async setCandlestickScanSettings(context, settings) {
            context.commit('SET_CANDLESTICK_SCAN_SETTINGS', settings)
        },
        async setPatternsScanSettings(context, settings) {
            context.commit('SET_PATTERNS_SCAN_SETTINGS', settings)
        },
        async setIndicatorsScanSettings(context, settings) {
            context.commit('SET_INDICATORS_SCAN_SETTINGS', settings)
        },

        // gurus requests
        resetGurusSettings(context) {
            context.commit('RESET_GURUS')
        },
        async saveguruScanRequest(context, scanInfo) {

            const settings = scanInfo.scanType == "capitulation"
                ? {
                    ...context.state.scans.gurus.capitulation,
                    tci: context.state.indicatorDefaults.tci,
                }
                : scanInfo.scanType == "samsPattern"
                    ? context.state.scans.scanner.samsPattern.settings
                    : context.state.scans.gurus[scanInfo.scanType]

            try {
                const result = await gurus.saveGuruScan(
                    settings,
                    context.state.scans.gurus[scanInfo.scanType].filterSettings,
                    context.state.scans.gurus[scanInfo.scanType].dataSettings,
                    context.state.userId,
                    scanInfo.scanName,
                    scanInfo.scanType,
                    scanInfo.scanId ? scanInfo.scanId : null
                )

                return result.data
            } catch (error) {
                return null
            }
        },


        async sendCapitulationRequest(context) {
            try {
                const settings = {
                    ...context.state.scans.gurus.capitulation,
                    tci: context.state.indicatorDefaults.tci,
                }
                const filterSettings = context.state.scans.gurus.capitulation.filterSettings
                const result = await gurus.capitulation(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.capitulation.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendFranksPatternRequest(context) {
            try {
                chartEvents.$emit('removeDarvas')
                const settings = context.state.scans.gurus.franksPattern
                const filterSettings = context.state.scans.gurus.franksPattern.filterSettings
                const result = await gurus.franksPattern(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.franksPattern.dataSettings,
                    // context.state.scans.gurus.franksPattern.selectedMarket,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', {
                    ...result.data.data,
                    settings: {},
                })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendSamsPatternRequest(context) {
            try {
                chartEvents.$emit('removeDarvas')
                const settings = context.state.scans.scanner.samsPattern.settings
                const filterSettings =
                    context.state.scans.scanner.samsPattern.filterSettings
                const result = await gurus.samsPattern(
                    settings,
                    filterSettings,
                    context.state.scans.scanner.samsPattern.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendHigherHighHigherLowPatternRequest(context) {
            try {
                const settings = context.state.scans.gurus.hhhl
                const filterSettings = context.state.scans.gurus.hhhl.filterSettings
                const result = await gurus.higherHighHigherLow(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.hhhl.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendBollingerSqueezePatternRequest(context) {
            try {
                const settings = context.state.scans.gurus.bollingerSqueeze
                const filterSettings = context.state.scans.gurus.bollingerSqueeze.filterSettings
                const result = await gurus.bollingerSqueeze(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.bollingerSqueeze.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendDivergenceScanRequest(context) {
            try {
                const settings = context.state.scans.gurus.divergenceScan
                const filterSettings = context.state.scans.gurus.divergenceScan.filterSettings
                const result = await gurus.divergenceScan(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.divergenceScan.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendBigCandleScanRequest(context) {
            try {
                const settings = context.state.scans.gurus.bigCandle
                const filterSettings = context.state.scans.gurus.bigCandle.filterSettings
                const result = await gurus.bigCandleScan(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.bigCandle.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendPocketPivotScanRequest(context) {
            try {
                const settings = context.state.scans.gurus.pocketPivot
                const filterSettings = context.state.scans.gurus.pocketPivot.filterSettings
                const result = await gurus.pocketPivotScan(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.pocketPivot.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendHeikenAshiScanRequest(context) {
            try {
                const settings = context.state.scans.gurus.heikenAshi
                const filterSettings = context.state.scans.gurus.heikenAshi.filterSettings
                const result = await gurus.heikenAshiScan(
                    settings,
                    filterSettings,
                    context.state.scans.gurus.heikenAshi.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async updateGuruSettingForLatestScans(context, payload) {
            try {
                let userData = { ...context.state.userData }
                const savedGuruLatest = localStorage.getItem('GuruRequests')
                userData['GuruRequests'] = savedGuruLatest
                const result = await updateUserSettings({ userData: userData }, "saveLatestScansForGuru")
                context.state.userData['GuruRequests'] = savedGuruLatest
                return result.updated
            } catch (error) {
                return null
            }
        },
        cancelGuruScans() {
            gurus.cancelGuruScan()
        },

        // scanners
        async sendDarvasScanRequest(context) {
            try {
                chartEvents.$emit('removeDarvas')
                const settings = context.state.scans.scanner.darvasScan.settings
                const filterSettings =
                    context.state.scans.scanner.darvasScan.filterSettings
                const result = await scanner.darvasScan(
                    settings,
                    filterSettings,
                    context.state.scans.scanner.darvasScan.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },
        async sendFundementalScanRequest(context) {
            try {
                const settings = context.state.scans.scanner.fundementals.settings
                const filterSettings =
                    context.state.scans.scanner.fundementals.filterSettings
                const result = await scanner.fundementalScan(
                    settings,
                    filterSettings,
                    context.state.scans.scanner.fundementals.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },


        async sendActivityScanRequest(context) {
            try {
                const settings = context.state.scans.scanner.activity.settings
                const filterSettings =
                    context.state.scans.scanner.activity.filterSettings
                const result = await scanner.activityScan(
                    settings,
                    filterSettings,
                    context.state.scans.scanner.activity.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },

        async sendCandlestickScanRequest(context) {
            try {
                const settings = context.state.scans.scanner.candlesticks.settings
                const result = await scanner.candlestickScan(
                    settings,
                    context.state.scans.scanner.candlesticks.filterSettings,
                    context.state.scans.scanner.candlesticks.dataSettings,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', { ...result.data.data, settings })
                return result.data
            } catch (error) {
                return null
            }
        },

        async sendPatternsScanRequest(context) {
            try {
                const settings = context.state.scans.scanner.patterns.settings
                let events = context.state.scans.scanner.patterns.eventsSettings
                if ("macd" in events) {
                    let macd = context.getters.getSingleIndicator.macd;
                    events = {
                        ...events,
                        macd: {
                            ...events.macd,
                            fastPeriod: macd.fast,
                            slowPeriod: macd.slow,
                            signalPeriod: macd.smooth
                        }
                    }
                }
                const result = await scanner.patternsScan(
                    settings,
                    context.state.scans.scanner.patterns.filterSettings,
                    context.state.scans.scanner.patterns.dataSettings,
                    events,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', {
                    ...result.data.data,
                    settings,
                    events,
                })
                return result.data
            } catch (error) {
                return null
            }
        },

        async sendIndicatorsScanRequest(context) {
            try {
                const settings = context.state.scans.scanner.indicators.settings
                let events = context.state.scans.scanner.indicators.eventsSettings
                if (settings.guppyMMA.isActive) {
                    let gxmaSettings = context.getters.getMultiIndicator.gxma
                    let gxmaItem = gxmaSettings.map((item) => {
                        return {
                            period: item.period,
                            isShort: item.group == 'short-term' ? true : false
                        }
                    })
                    settings.guppyMMA.GuppyMMAItems = gxmaItem
                }
                if ("macd" in events) {
                    let macd = context.getters.getSingleIndicator.macd;
                    events = {
                        ...events,
                        macd: {
                            ...events.macd,
                            fastPeriod: macd.fast,
                            slowPeriod: macd.slow,
                            signalPeriod: macd.smooth
                        }
                    }
                }
                const result = await scanner.indicatorsScan(
                    settings,
                    context.state.scans.scanner.indicators.filterSettings,
                    context.state.scans.scanner.indicators.dataSettings,
                    events,
                    context.state.userId
                )
                context.dispatch('addNewScanResult', {
                    ...result.data.data,
                    settings,
                    events,
                })
                return result.data
            } catch (error) {
                return null
            }
        },

        async saveScannersScanRequest(context, scanInfo) {
            const settings = context.state.scans.scanner[scanInfo.scanType].settings
            settings.selectedMarket = context.state.scans.scanner[scanInfo.scanType].selectedMarket

            const eventsSettings = scanInfo.scanType == 'patterns' || scanInfo.scanType == 'indicators' ? context.state.scans.scanner[scanInfo.scanType].eventsSettings : null
            try {
                const result = await scanner.saveScannersScan(
                    settings,
                    context.state.scans.scanner[scanInfo.scanType].filterSettings,
                    context.state.scans.scanner[scanInfo.scanType].dataSettings,
                    eventsSettings,
                    context.state.userId,
                    scanInfo.scanName,
                    scanInfo.scanType,
                    scanInfo.scanId ? scanInfo.scanId : null
                )
                // context.dispatch('addNewScanResult', result.data.data)
                return result.data
            } catch (error) {
                return null
            }
        },

        async updateScansSettingForLatestScans(context, payload) {
            try {
                let userData = { ...context.state.userData }
                const savedScansLatest = localStorage.getItem('ScanRequests')
                userData['ScanRequests'] = savedScansLatest
                const result = await updateUserSettings({ userData: userData }, "saveLatestScansForScans")
                context.state.userData['ScanRequests'] = savedScansLatest
                return result.updated
            } catch (error) {
                return null
            }
        },
        cancelScans() {
            scanner.cancelScan()
        },

        // settings
        async setIndicatorDefaultSettings(context, newSettings) {
            context.commit('SET_INDICATOR_DEFAULTS', newSettings)
        },
        async saveUserSettings(context, userSettings) {
            // context.commit('SET_INDICATOR_DEFAULTS', newSettings)
            try {
                let userData = {
                    ...context.state.userData,
                }
                userData['proTrader.themeSettings'] =
                    context.state.proTrader.themeSettings

                const result = await updateUserSettings({
                    userData: userData,
                }, "saveUserSettings")
                //
                // context.dispatch('addNewScanResult', result.data.data)
                return result.updated
            } catch (error) {
                return null
            }
        },
        async saveChartSettings(context, chartSettings) {
            // context.commit('SET_INDICATOR_DEFAULTS', newSettings)

            try {
                let toolType = chartSettings.tool_type
                let chartId = chartSettings.chartId
                let changeState = chartSettings.selected
                let chartSettingObj = context.state.chartOverlays
                let chartType = chartSettingObj[toolType]

                let settings = {
                    isAdd: !changeState,
                    isRemove: changeState,
                    chartName: chartId,
                }
                if (settings.isRemove == true && settings.chartName == "rsRating") {
                    context
                        .dispatch('setSymbolData', {
                            symbolName: context.state.currentSymbol.symbol,
                            timeFrame: context.state.timeFrame,
                            reForce: true,
                            disableUndo: true,
                            chartIndex: context.state.selectedTab
                        })
                        .then((d) => {
                            chartEvents.$emit('setChartRange', undefined, 'MarketIntraDayChange')
                            chartEvents.$emit('symbolChangeVerifyScanDetails')
                            chartEvents.$emit('loadDrawingData', false, context.state.selectedTab)
                        })
                }

                if (chartType && chartType.data) {
                    let hasChartSelected = false
                    for (const key in chartType.data) {
                        if (chartType.data[key].name === chartSettings.tool_name) {
                            chartType.data[key].selected = !chartType.data[key].selected

                            if (!changeState) {

                                hasChartSelected = true

                                // settings.isAdd = false
                                // settings.isRemove = true
                            }
                        } else {
                            if (chartType.data[key].selected) {
                                hasChartSelected = true
                            }
                        }
                    }

                    chartType.selected = hasChartSelected
                    // let filtered = chartType.data.filter(a => a.name === name)
                    // let chartSettingsData = {}
                    chartSettingObj[toolType] = chartType

                    let config = context.getters.allChartOverlays.find(x => x.chartId == chartId)
                    context.dispatch('action/setUndoAction', {
                        type: actionsubType.INDICATOR_UPDATE,
                        actionType: actionType.INDICATOR_ACTION,
                        payload: {
                            overlayData: [
                                {
                                    name: config.name,
                                    chartName: chartId,
                                    isAdd: settings.isAdd,
                                    isRemove: settings.isRemove
                                }
                            ]
                        }
                    })

                    const result = await updateChartSettings(settings)
                    // context.commit('UPDATE_CHART_SELECTION', {
                    //   chartType,
                    //   chartName: chartSettings.tool_name,
                    // })
                    return result.updated
                }

                return false
            } catch (error) {
                return null
            }
        },
        async saveMultiChartSettings(context, chartList) {
            // context.commit('SET_INDICATOR_DEFAULTS', newSettings)
            try {
                const result = await updateMultiChartSettings({ chartList })

                // chartList.map((chartSettings, index) => {

                //     let chartId = chartSettings.chartId
                //     //let changeState = chartSettings.selected

                //     let settings = {
                //         isAdd: chartSettings.isAdd,
                //         isRemove: chartSettings.isRemove,
                //         chartName: chartId,
                //     }
                //     if (settings.isRemove == true && settings.chartName == "rsRating") {
                //         context
                //             .dispatch('setSymbolData', {
                //                 symbolName: context.state.currentSymbol.symbol,
                //                 timeFrame: context.state.timeFrame,
                //                 reForce: true,
                //                 chartIndex: context.state.selectedTab
                //             })
                //             .then((d) => {
                //                 chartEvents.$emit('setChartRange', undefined, 'MarketIntraDayChange')
                //                 chartEvents.$emit('symbolChangeVerifyScanDetails')
                //                 chartEvents.$emit('loadDrawingData', false, context.state.selectedTab)
                //             })
                //     }
                // })


                return result.updated
            } catch (error) {
                return null
            }
        },
        async sendDarvasBoxDrawingRequest(context, settings) {
            try {
                context.commit('SET_DARVASBOX_SETTINGS', settings)

                let userData = {
                    ...context.state.userData,
                }
                const reqSetting = settings
                reqSetting['symbol'] = context.state.multiChartSymbol[context.state.selectedTab].symbol
                reqSetting['timeFrame'] = context.state.multiChartSymbol[context.state.selectedTab].timeFrame
                const result = await getDarvasBoxDrawing(reqSetting)
                userData.darvasBoxSettings = settings
                const result1 = await updateUserSettings({
                    userData: userData,
                })
                return result.data
            } catch (error) {
                return null
            }
        },
        // scan results
        async removeAllObjects(context) {
            context.state.dc.del('Tool')
            context.state.dc.del('Fibonacci')
            context.state.dc.del('Darvas')
            context.state.dc.del('ChartPatterns')
        },
        async addDrawingForScannedSymbol(
            context,
            { symbolData, scanType, settings }
        ) {
            let scanOverlay;
            let patternName = symbolData.patternName;
            let symbolName = symbolData.symbol;
            let overlayName = OVERLAYS_CHARTS[patternName];
            let allChartOverlays = context.getters.allChartOverlays;

            let isHeikenAshi = scanType === 'heikenAshi';
            let isBollingerSqueeze = scanType === 'bollingerSqueeze';
            let isDivergenceScan = scanType === 'divergenceScan';
            let isFranksPattern = scanType === 'franksPattern';
            let isChartPattern = scanType === 'chartPatterns';
            let isHHL = scanType === 'hhhl';
            let isDarvasScans = scanType === 'samsPattern' || scanType === 'darvasScan';

            let overlay_tv = Object.values(Overlays);
            let ChartPatternsOverlay = overlay_tv.find(
                (n) => n.name.toUpperCase() === 'ChartPatterns'.toUpperCase()
            );

            chartEvents.$emit('removeBB');

            if (isHeikenAshi) {
                await context.dispatch('setNewChartType', { type: 'HeikenAshi', location: "From HeikenAshi" });
            } else if (isDivergenceScan) {
                if ('data' in symbolData) {
                    const presetSettings = ChartPatternsOverlay.methods.meta_info().preset.settings;
                    const chartPattern = {
                        name: `ChartPatterns-${symbolName}`,
                        type: 'ChartPatterns',
                        data: [{
                            patternName: symbolData.patternName,
                            drawData: symbolData?.data?.elements,
                        }],
                        scanResults: true,
                        settings: { ...presetSettings },
                    };
                    chartEvents.$emit('add_overlay_object', [chartPattern], 'ChartPatterns');
                }
            } else if (isBollingerSqueeze) {
                overlayName = 'BB';
            }

            if (isChartPattern || isHHL) {
                if (symbolData?.drawingData?.elements || symbolData?.data?.elements) {
                    const drawData = symbolData.drawingData?.elements || symbolData.data.elements;
                    const presetSettings = ChartPatternsOverlay.methods.meta_info().preset.settings;
                    const chartPattern = {
                        name: `ChartPatterns-${symbolName}`,
                        type: 'ChartPatterns',
                        data: [{
                            patternName: symbolData.patternName,
                            drawData: drawData,
                        }],
                        scanResults: true,
                        settings: { ...presetSettings },
                    };
                    chartEvents.$emit('add_overlay_object', [chartPattern], 'ChartPatterns');
                }
            } else if (isDarvasScans || isFranksPattern) {
                function getDarvasDirection(mainPoints, riskPoints) {
                    if (!riskPoints || !mainPoints) return true;
                    return (
                        Math.min(mainPoints[0].value, mainPoints[1].value) >
                        Math.min(riskPoints[0].value, riskPoints[1].value)
                    );
                }

                const darvasDrawingList = [];
                for (const element of symbolData?.data?.elements) {
                    const points = element.points;
                    let mainPoints = null,
                        riskPoints = null;

                    if (element.metatype === 'Main') {
                        mainPoints = points;
                        riskPoints = symbolData.data.elements.find(
                            (el) => el.metatype === 'Risk' &&
                                el.points[0].timeStamp === mainPoints[0].timeStamp &&
                                el.points[1].timeStamp === mainPoints[1].timeStamp
                        )?.points;
                    } else {
                        riskPoints = points;
                        mainPoints = symbolData.data.elements.find(
                            (el) => el.metatype === 'Main' &&
                                el.points[0].timeStamp === riskPoints[0].timeStamp &&
                                el.points[1].timeStamp === riskPoints[1].timeStamp
                        )?.points;
                    }

                    const isBullish = getDarvasDirection(mainPoints, riskPoints);

                    const darvasDrawing = {
                        name: `Darvas-${symbolName}-${element.metatype}-${points[0].value}`,
                        type: 'DarvasBox',
                        data: [[
                            element.metatype,
                            points[0].timeStamp,
                            points[1].timeStamp,
                            points[0].value,
                            points[1].value,
                            element.metatype === 'Main' ? 'rgba(39, 128, 227, 0.3)' : 'rgba(245, 188, 195, 0.3)',
                            isBullish,
                        ]],
                        scanResults: true,
                        settings: {
                            legend: false,
                            labelColor: context.state.themeDarkMode ? "#FFF" : "#000",
                        },
                    };
                    darvasDrawingList.push(darvasDrawing);
                }
                chartEvents.$emit('add_overlay_object', darvasDrawingList, 'DarvasBox');
            }

            if (isDivergenceScan) {
                overlayName = OVERLAYS_CHARTS[settings.selectedScan];
            }
            if (patternName?.startsWith('Combo')) {
                const comboPatterns = patternName.split('-').slice(1);
                comboPatterns.forEach(pattern => {
                    let comboName = OVERLAYS_CHARTS[pattern];
                    chartEvents.$emit('remove_scan_overlay_new', comboName);
                });
            }
            else {
                chartEvents.$emit('remove_scan_overlay_new', overlayName);
            }

            let patternDataSet = ["CLOSE", "MA", "XMA", "WMA"];
            let isCrossAboveSet = scanType === "indicatorsPatterns" && (settings?.crossesAndAboveBelow?.isActive)
                && patternDataSet.includes(patternName);

            if (isCrossAboveSet) {
                let _overlay1, _overlay2;
                let _leftName = OVERLAYS_CHARTS[settings?.crossesAndAboveBelow?.left?.toUpperCase()];
                let _rightName = OVERLAYS_CHARTS[settings?.crossesAndAboveBelow?.right?.toUpperCase()];

                if (_leftName === _rightName) {
                    chartEvents.$emit('remove_scan_overlay_new', _leftName.toUpperCase(), true);
                    setTimeout(() => {
                        let config = allChartOverlays.find((n) => n.name === _leftName);
                        const userSettings = config.getOverlayData(settings, scanType);
                        _overlay1 = overlay_tv.find(
                            (n) => n.name.toUpperCase() === _leftName.toUpperCase()
                        );
                        chartEvents.$emit(
                            'add_overlay_new',
                            _overlay1,
                            _leftName,
                            [{ ...userSettings, period: parseInt(settings?.crossesAndAboveBelow?.leftPeriod) }, {
                                ...userSettings,
                                period: parseInt(settings?.crossesAndAboveBelow?.rightPeriod)
                            }],
                            true
                        );
                    });
                } else {
                    chartEvents.$emit('remove_scan_overlay_new', "", true);
                    setTimeout(() => {
                        if (_leftName) {
                            let config = allChartOverlays.find((n) => n.name === _leftName);
                            const userSettings = config.getOverlayData(settings, scanType);
                            _overlay1 = overlay_tv.find(
                                (n) => n.name.toUpperCase() === _leftName.toUpperCase()
                            );
                            chartEvents.$emit(
                                'add_overlay_new',
                                _overlay1,
                                _leftName,
                                { ...userSettings, period: parseInt(settings?.crossesAndAboveBelow?.leftPeriod) },
                                true
                            );
                        }

                        if (_rightName) {
                            let config = allChartOverlays.find((n) => n.name === _rightName);
                            const userSettings = config.getOverlayData(settings, scanType);
                            _overlay2 = overlay_tv.find(
                                (n) => n.name.toUpperCase() === _rightName.toUpperCase()
                            );
                            chartEvents.$emit(
                                'add_overlay_new',
                                _overlay2,
                                _rightName,
                                { ...userSettings, period: parseInt(settings?.crossesAndAboveBelow?.rightPeriod) },
                                true
                            );
                        }
                    });
                }
            } else {
                if (patternName?.startsWith('Combo')) {
                    const comboPatterns = patternName.split('-').slice(1);
                    setTimeout(() => {
                        comboPatterns.forEach(pattern => {
                            let comboName = OVERLAYS_CHARTS[pattern];
                            if (comboName) {
                                let config = allChartOverlays.find((n) => n.name === comboName);
                                let overlay = overlay_tv.find(
                                    (n) => n.name.toUpperCase() === comboName.toUpperCase()
                                );

                                if (config && config.getOverlayData) {
                                    const userSettings = config.getOverlayData(settings, scanType);
                                    if (comboName == 'RS') {
                                        context.commit('SCAN_RESULT_RS', true);
                                    }
                                    chartEvents.$emit(
                                        'add_overlay_new',
                                        overlay,
                                        comboName,
                                        { ...userSettings },
                                        true,
                                        false,
                                        {},
                                        true,
                                        context.state.selectedTab
                                    );
                                }
                            }

                        });
                    });

                } else if (overlayName) {
                    let config = allChartOverlays.find((n) => n.name === overlayName);
                    let overlay = overlay_tv.find(
                        (n) => n.name.toUpperCase() === overlayName.toUpperCase()
                    );

                    if (config && config.getOverlayData) {
                        const userSettings = config.getOverlayData(settings, scanType);
                        
                        if (overlayName == 'RS') {
                            context.commit('SCAN_RESULT_RS', true);
                        }
                        chartEvents.$emit(
                            'add_overlay_new',
                            overlay,
                            overlayName,
                            { ...userSettings },
                            true,
                            false,
                            {},
                            true,
                            context.state.selectedTab
                        );
                    }
                }
            }

            if (scanOverlay) {
                return scanOverlay;
            } else {
                return null;
            }
        },
        async changeSymbolToScannedSymbol(
            context,
            { symbolData, timeFrame, scanType, settings }
        ) {
            context.state.SelectedScanSymbol = symbolData.symbol
            // Check ScanType

            const symbolName = symbolData.symbol ? symbolData.symbol : symbolData

            await context.dispatch('setSymbolData', {
                symbolName,
                timeFrame,
                scanResultData: true,
                reForce: true,
                chartIndex: context.state.selectedTab
            })
            chartEvents.$emit('setChartRange', undefined, 'ScannedSymbolSelect')
            let val = await context.dispatch('addDrawingForScannedSymbol', {
                symbolData,
                scanType,
                settings,
            })
            chartEvents.$emit('loadDrawingData', false, context.state.selectedTab)
            // if we are not drawing anything
            if (val) {
                return val
            }
            return false
        },
        async changeSymbolToScannedSymbolDarvasDrawing(
            context,
            { symbolData, scanType, settings }
        ) {
            context.state.SelectedScanSymbol = symbolData.symbol
            let val = await context.dispatch('addDrawingForScannedSymbol', {
                symbolData,
                scanType,
                settings,
            })
            // chartEvents.$emit('loadDrawingData')
            // if we are not drawing anything
            if (val) {
                return val
            }
            return false
        },
        async updateDrawing(context, payload) {
            let selectedTab = context.state.selectedTab
            let symbolName = context.state.multiChartSymbol[selectedTab]?.symbol
            let drawingData = { ...context.state.multiDrawingData[selectedTab] };
            if (drawingData?.hasOwnProperty(payload.ref)) {
                drawingData[payload.ref] = payload.data
            } else {
                drawingData[payload.ref] = payload.data
            }
            let newMapData = {}
            for (let key in drawingData) {
                let data = JSON.parse(drawingData[key])

                if (data?.settings?.$uuid === key) {
                    newMapData[key] = drawingData[key]
                }

            }
            let data = {
                symbolName: symbolName,
                data: {
                    modeId: payload.ref,
                    data: payload.data,
                    type: payload?.type,
                    newTool: payload?.newTool,
                    pointsData: payload?.pointsData
                }

            }

            const updatedDrawingData = context.state.multiDrawingData.map((data, i) => {
                let symbol = context.state.multiChartSymbol[i].symbol
                let drawingsaved = context.state.savedDrawingData?.find(x => x.symbolName == symbol)?.drawingData;
                return { ...drawingsaved, ...(selectedTab === i ? newMapData : data) }
            })
            if (context.state.layout == '1tab' || context.state.isFullScreen) {
                let res = await updateDrawingDataV2({ ...data, userId: context.state.userId })

                const updatedSavedDrawingData = context.state.savedDrawingData.map((x, i) => {
                    if (context.state.multiChartSymbol[i].symbol == x.symbolName) {
                        return {
                            ...x, drawingData: updatedDrawingData[i]
                        }
                    }
                    else return x;
                });
                context.state.savedDrawingData = updatedSavedDrawingData
                context.state.multiDrawingData = updatedDrawingData
            }
            else {
                context.state.multiDrawingData = updatedDrawingData
            }

            return true
        },
        async deleteDrawing(context, payload) {
            const chartIndex = payload.index
            const selectedSymbolName = context.state.multiChartSymbol[chartIndex]?.symbol
            let symbolInx = []
            context.state.multiChartSymbol.map((x, i) =>
                x.symbol === selectedSymbolName && symbolInx.push(i)
            )

            const parts = payload?.t?.split('.');
            let toolType = parts?.[1]?.split('-')
            let chartType = parts?.[0]
            const drawingList = [
                "FibonacciRetrace",
                "FibonacciTime",
                "HLineTool",
                "TrendLine",
                "HeadShoulderTool",
                "ArcTool",
                "BrushTool",
                "ChannelTool",
                "TradeVisualizerTool",
                "RectangleTool",
                "TrailingStopTool",
                "TextTool",
                "RangeTool",
                "EmojiTool"
            ]

            toolType = drawingList.find(d => {
                const startsWith = toolType?.[0]?.startsWith(d);
                return startsWith
            })
            let elementDeleted = false
            // let localDrawData = copyObject(context.state.drawingData)
            let deletedData
            let localDrawData = copyObject(context.state.multiDrawingData[chartIndex])

            if (Object.keys(localDrawData).includes(payload.t)) {
                let currentData = context.getters.multiTv[chartIndex].data.get_one(payload.t)
                deletedData = currentData ? JSON.stringify(currentData) : context.state.multiDrawingData[chartIndex][payload.t]
                delete localDrawData[payload.t]
                elementDeleted = true
            }
            let newMapData = {}
            let deletedTypes = []
            let chartTypeList = context.getters.multiTv[chartIndex].data.get(`${chartType}.${toolType}`)
            // let chartTypeList = context.getters.tv.data.get(`${chartType}.${toolType}`)
            for (let chartTypeListElement of chartTypeList) {
                context.getters.multiTv[chartIndex].data.del(chartTypeListElement.settings.$uuid)
                // context.getters.tv.data.del(chartTypeListElement.settings.$uuid)
            }
            for (let key in localDrawData) {
                let data = JSON.parse(localDrawData[key])
                if (toolType === data.type) {
                    deletedTypes.push({
                        data: data,
                        key: key
                    })
                } else {
                    if (data?.settings?.$uuid === key) {
                        newMapData[key] = localDrawData[key]
                    }
                }
            }
            let deletedIterator = 0
            let drawingRefs = []
            if (deletedTypes.length) {
                for (let item of deletedTypes) {

                    let deletedType = item.data
                    let _chartType = deletedType.id.split('.')[0]
                    let timeStamp = Utils.now()
                    if (_chartType === chartType) {
                        deletedType.name = `${deletedType.type} ${deletedIterator}`
                        deletedType.id = `${_chartType}.${deletedType.type}${deletedIterator}`
                        deletedType.settings.$uuid = `${_chartType}.${deletedType.type}${deletedIterator}-${timeStamp}`
                        deletedIterator++;
                        newMapData[deletedType.settings.$uuid] = JSON.stringify(deletedType)
                    } else {
                        newMapData[deletedType.settings.$uuid] = JSON.stringify(deletedType)
                    }
                    drawingRefs.push({
                        oldVal: item.key,
                        newVal: deletedType.settings.$uuid
                    })
                }
                context.dispatch('action/changeDrawingRef', drawingRefs)
            }
            let updatedArr = context.state.multiDrawingData.map((item, index) =>
                index === chartIndex ? newMapData : item
            );
            let secupdatedArr
            let res;

            if (elementDeleted) {
                try {

                    if (!payload.isUndoAction) {

                        context.dispatch('action/setUndoAction', {
                            type: actionsubType.DRAWING_REMOVE,
                            actionType: actionType.DRAWING_ACTION,
                            payload: {
                                chartIndex: payload.index,
                                drawingRef: payload.t,
                                data: deletedData
                            }
                        })
                    }

                    if (context.state.layout == '1tab' || context.state.isFullScreen) {
                        await updateDrawingDataV1({
                            data: newMapData,
                            symbolName: selectedSymbolName,
                            userId: context.state.userId
                        })
                        secupdatedArr = updatedArr.map((item, index) =>
                            symbolInx.includes(index) ? newMapData : item
                        );

                        let newSaved = context.state.savedDrawingData.map((data) => {
                            if (data.symbolName === selectedSymbolName) {
                                return {
                                    ...data,
                                    drawingData: newMapData
                                };
                            } else {
                                return data;
                            }
                        });
                        // context.state.multiDrawingData = secupdatedArr
                        // context.state.savedDrawingData = newSaved        
                        context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', secupdatedArr)
                        context.commit('SET_SAVED_DRAWING', newSaved)
                        return true
                    }
                    else {
                        context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', updatedArr)
                        return true
                    }
                }
                catch (err) {
                    context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', updatedArr)
                    return false;
                }


            } else {
                context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', updatedArr)
                return false
            }
        },
        async deleteAllDrawing(context, payload) {
            let elementDeleted = false
            let res = []
            context.state.multiChartSymbol.map(async (chart, i) => {

                elementDeleted = await deleteAllDrawingDataV1(
                    chart?.symbol,
                    context.state.userId
                )
                res[i] = {}
            })
            context.state.multiDrawingData = res
            // context.commit('SET_SAVED_DRAWING', [])
            context.state.savedDrawingData = []
            return elementDeleted
        },
        async deleteAllDrawingNew(context, payload) {
            let elementDeleted = false
            let res = []
            let symbolNameDeleted = []
            let removedDrawings = []
            for (let i = 0; i < context.state.multiChartSymbol.length; i++) {
                const x = context.state.multiChartSymbol[i];
                for (let index = 0; index < context.state.tabCount && index < context.state.multiChartSymbol.length; index++) {
                    const y = context.state.multiChartSymbol[index];
                    if (x.symbol === y.symbol) {

                        removedDrawings.push({
                            chartIndex: i,
                            drawingData: context.state.multiDrawingData[i]
                        })

                        elementDeleted = await deleteAllDrawingDataV1(
                            x?.symbol,
                            context.state.userId
                        )
                        let chartDc = context.state.multiDc[i]

                        chartDc.del('Tool')
                        chartDc.del('Fibonacci')
                        chartDc.del('Trend')
                        chartDc.del('TrendLine')
                        chartDc.del('DarvasBox')

                        chartDc.tv.custom_event({
                            event: 'remove-all-tools-event',
                            args: []
                        })
                        res[i] = {}
                        !symbolNameDeleted.includes(x.symbol) && symbolNameDeleted.push(x.symbol)
                        break;
                    }
                    else res[i] = context.state.multiDrawingData[i]
                }
            }
            context.dispatch('action/setUndoAction', {
                type: actionsubType.DRAWING_REMOVE_ALL,
                actionType: actionType.DRAWING_ACTION,
                payload: removedDrawings
            })
            let savedDataArr = context.state.savedDrawingData.map((draw) => {
                if (symbolNameDeleted.includes(draw.symbolName)) {
                    return {
                        ...draw, drawingData: {}
                    }
                }
                else return draw
            })
            context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', res)
            context.commit('SET_SAVED_DRAWING', savedDataArr)
            return elementDeleted
        },
        // async toggleWatchesModal(context) {
        //     
        //     context.state.showWatchesModal = !context.state.showWatchesModal
        // },
        // async toggleWatchesRenameModal(context) {
        //     context.state.showWatchRenameModal = !context.state.showWatchRenameModal
        // },
        // async toggleWatchesDeleteModal(context) {
        //     context.state.showWatchesDeleteModal =
        //         !context.state.showWatchesDeleteModal
        // },
        // async toggleWatchesImportModal(context) {
        //     context.state.showWatchesImportModal =
        //         !context.state.showWatchesImportModal
        // },
        async toggleWatchesModal(context, payload) {
            context.state.showWatchesModal = payload
        },
        async toggleWatchesRenameModal(context, payload) {
            context.state.showWatchRenameModal = payload
        },
        async toggleWatchesDeleteModal(context, payload) {
            context.state.showWatchesDeleteModal = payload
        },
        async toggleWatchesImportModal(context, payload) {
            context.state.showWatchesImportModal = payload
        },

        async renameWatchListItem(context, payload) {
            let newWatch = context.getters.selectedWatchData
            if (newWatch) {
                let arrayData = context.state.watchLists
                newWatch.newName = payload
                let newWatchRes = await saveWatches(newWatch)
                if (newWatchRes) {
                    // arrayData[context.state.selectedWatchCode] = newWatchRes
                    // for (let k in arrayData) {
                    //   if (Number(k) === context.state.selectedWatchCode) {
                    //     arrayData[k] = newWatchRes
                    //   }
                    // }
                    context.state.watchLists = newWatchRes?.data
                    const index = newWatchRes?.data.findIndex(item => item.id === newWatch.id);
                    context.dispatch("setSelectedWatch", index)
                    // this.setSelectedWatch(index)
                }
            }
            context.state.showWatchRenameModal = !context.state.showWatchRenameModal
        },
        async createNewWatchList(context, payload, callback) {
            let array = []
            if (payload.ScanResults) {
                for (const iterator in payload.ScanResults) {
                    if (
                        payload.ScanResults[iterator].scanId == context.state.SelectedScanId
                    ) {
                        for (const i of payload.ScanResults[iterator].results) {
                            array.push({ name: i.symbol, id: context.state.marketId })
                        }
                        break
                    }
                }
            }
            let watches = {
                symbolList: array,
                name: payload.name,
                userId: context.state.userId,
            }
            let newWatch = await saveWatches(watches)
            // let w =context.state.watchLists
            // w[payload] = []
            if (newWatch) {
                context.state.watchLists = newWatch?.data
                // context.state.selectedWatch = payload
            }
            if (payload.updateModal) {
                context.state.showWatchesModal = !context.state.showWatchesModal
            }
            return newWatch
        },
        async updateWatchList(context, payload) {
            let newWatch = await saveWatches(payload.value)
            if (newWatch) {
                context.state.watchLists = newWatch?.data
                context.state.showWatchesImportModal = false
                return true
            } else {
                return false
            }
        },
        async deleteWatchList(context, payload) {
            let deleteWatchListRes = await deleteWatchList(payload)
            // context.state.selectedWatch = ''
            context.dispatch('toggleWatchesDeleteModal', false)
            if (!deleteWatchListRes.isError) {
                let newWatchList = context.state.watchLists.filter(
                    (s) => s.id !== payload
                )
                context.state.watchLists = newWatchList

                context.state.selectedWatch = "";
                context.state.selectedWatchCode = "";
                context.state.watchListsData = "";
            }
        },
        async setSelectedWatch(context, payload) {
            let watchListDataObj = context.state.watchLists[payload]
            if (watchListDataObj && watchListDataObj.symbolList) {
                context.state.selectedWatch = watchListDataObj.id
                context.state.selectedWatchCode = payload
                context.state.watchListsData = watchListDataObj.symbolList
            }
        },
        async addNewSymbolToList(context, payload) {
            // context.state.selectedWatch = payload
            let currentList = context.getters.selectedWatchData
            let saveIt = false
            let alreadyInList = currentList.symbolList.find(
                (s) => s.id === payload.id && s.name === payload.name
            )
            if (!alreadyInList) {
                currentList.symbolList.push(payload)
                let response = await saveWatches(currentList)
                let updatedList = response.find((d) => d.id === currentList.id)
                let index = updatedList.symbolList?.findIndex(
                    (d) => d.name === payload.name
                )
                context.state.watchLists = response?.data
                context.state.watchListsData = updatedList?.symbolList
                return index > -1 ? index : currentList.symbolList.length - 1
            }
            return -1
            // if(false)
            // if(context.state.watchListsData[context.state.selectedWatch]){
            //     currentList =  context.state.watchListsData[context.state.selectedWatch]
            //     if(currentList && currentList.length){
            //         if(!currentList.includes(payload)){
            //             currentList.push(payload)
            //         }
            //     }else{
            //         currentList.push(payload)
            //     }
            //     let watches = {symbolList:currentList,name:context.state.selectedWatch,userId:context.state.userId}
            //
            //     context.state.watchListsData[context.state.selectedWatch] = currentList
            // }
        },
        async removeCurrentSymbolFromList(context, payload) {
            // context.state.selectedWatch = payload
            let currentList = context.getters.selectedWatchData
            // let saveIt = false
            let alreadyInList = currentList.symbolList.find(
                (s) => s.id === payload.id && s.name === payload.name
            )
            if (alreadyInList) {
                const _index = currentList.symbolList.findIndex(
                    (s) => s.id === payload.id && s.name === payload.name
                )
                currentList.symbolList.splice(payload.index, 1)
                await saveWatches(currentList)
                context.watchLists = currentList
                if (_index == currentList.symbolList.length) return currentList.symbolList.length - 1
                return payload.index //-1
            }
            return payload.index //-1
        },
        async setSelectedWatchCode(context, payload) {
            if (
                payload.name &&
                payload.name.length > 0 &&
                payload.name !== context.state.currentSymbol.symbol
            ) {
                const timeFrame = context.state.multiChartSymbol[context.state.selectedTab]?.timeFrame
                await context.dispatch('setSymbolData', {
                    symbolName: payload.name,
                    timeFrame: timeFrame || "D",
                    chartIndex: context.state.selectedTab
                })
                chartEvents.$emit('setChartRange', undefined, 'WatchSymbolSelect')
                chartEvents.$emit('symbolChangeVerifyScanDetails')
                chartEvents.$emit('loadDrawingData', false, context.state.selectedTab)
            }
            context.state.selectedWatchSymbolCode = payload.id
        },
        async getUserWatches(context, payload) {
            let watches = await getWatchListData(context.state.userId)
            if (watches && watches.data) {
                if (context.state.user.subscriptionList.length > 0) {

                    context.state.watchLists = watches.data
                }
            }
        },
        async getSPXDataFunc(context, payload) {
            let spx_data = await getSPXData()
            let [parsedData, ohlcvMap] = parseToChartCandleData(spx_data.data)
            context.commit('SET_SPX', parsedData)
        },
        async getUserScanList(context, isDefault = false) {
            let scannerList = await scanner.getScanList(context.state.userId)
            let scannerListForStore = []

            if (scannerList && scannerList.data) {
                for (const scan of scannerList.data) {
                    let newObj = scan
                    newObj.data = JSON.parse(scan.data)

                    scannerListForStore.push(newObj)
                }
                context.commit('UPDATE_USER_SCAN_LIST', scannerListForStore)
                if (isDefault == true) {

                    context.commit('SET_DEFAULT_SAVED_SCAN', scannerListForStore)
                }
                // context.state.userSavedScans = scannerListForStore
            }
        },
        async toggleDarkMode(context, id) {
            if (id !== 'dark') {
                context.commit('UPDATE_DEFAULT_THEME', 'dark')
                context.commit('THEME_MODE', true)
                localStorage.setItem('themeDarkModeSave', 'dark')
            } else {
                context.commit('UPDATE_DEFAULT_THEME', 'classic')
                context.commit('THEME_MODE', false)
                localStorage.setItem('themeDarkModeSave', 'classic')
            }
            await context.dispatch('saveUserSettings')
            return true
        },
        async updateProfileData(context, payload) {

            context.commit('SET_USER_DATA', payload)
            if ('GuruRequests' in payload) {
                localStorage.setItem('GuruRequests', JSON.stringify(JSON.parse(payload.GuruRequests)))
            } else {
                localStorage.setItem('GuruRequests', "{}")
            }

            if ('ScanRequests' in payload) {
                localStorage.setItem('ScanRequests', JSON.stringify(JSON.parse(payload.ScanRequests)))
            } else {
                localStorage.setItem('ScanRequests', "{}")
            }

            if ('chartType' in payload) {
                context.commit('SET_CHART_TYPE', payload['chartType'])
                if (payload['chartType'] === "CompareChartMain") {
                    localStorage.setItem("isComparisonChart", "true")
                }
            }

            if ('symbol' in payload) {
                localStorage.setItem('symbol', payload.symbol)
            }
            if ('symbolMap' in payload) {
                context.commit('changeSymbol', { propName: "symbol1", propValue: payload.symbolMap?.symbol1 || "" })
                context.commit('changeSymbol', { propName: "symbol2", propValue: payload.symbolMap?.symbol2 || "" })
                context.commit('changeSymbol', { propName: "symbol3", propValue: payload.symbolMap?.symbol3 || "" })
                context.commit('changeSymbol', { propName: "symbol4", propValue: payload.symbolMap?.symbol4 || "" })
            }

            if ('timeFrame' in payload) {
                context.commit('SET_TIME_FRAME', payload['timeFrame'])
            }
            if ('proTrader.chart.0.indicators' in payload) {
                context.commit('SET_USER_CHART_LIST', {
                    data: payload['proTrader.chart.0.indicators'],
                })
            }

            if ('proTrader.themeSettings' in payload) {
                let themeSettings = payload['proTrader.themeSettings']
                if (!isThemePrimary(themeSettings)) {
                    context.commit('UPDATE_CUSTOM_THEME', themeSettings.settings)
                    // context.commit('UPDATE_DEFAULT_THEME', '')
                } else {
                    const id = payload['proTrader.themeSettings'].id
                    context.commit('UPDATE_DEFAULT_THEME', id)
                    if ('dark' === id) {
                        context.commit('THEME_MODE', true)
                    }
                    // context.dispatch('toggleDarkMode',id)
                }
            }
            if ('logScale' in payload) {
                context.commit('SET_LOGSCALE', payload['logScale'])
            }
            if ('autoPlaySpeedScan' in payload) {
                context.commit('autoplay/SET_AUTOPLAY_SPEED_SCAN', payload['autoPlaySpeedScan'])
            }
            if ('autoPlaySpeedWatch' in payload) {
                context.commit('autoplay/SET_AUTOPLAY_SPEED_WATCH', payload['autoPlaySpeedWatch'])
            }
            if ('appTour' in payload) {
                context.commit('SET_APP_TOUR', payload['appTour'])
            }
            else {
                context.commit('SET_APP_TOUR', false)
            }
        },
        async updateGuruMarketAccordingTODataSettings(context, payload) {
            let value = ''
            context.commit('SET_SCAN_DATA_SETTINGS2', {
                id: payload.id,
                settings: payload.dataSettings,
                type: 'gurus',
            })
            if (payload.dataSettings.isWatch) {
                value = 'watch-list'
            } else if (payload.dataSettings.isScan) {
                value = 'scan-result'
            } else {
                value = 'market'
            }

            await context.dispatch('setSelectedMarketNew', {
                id: payload.id,
                value: value,
                type: 'gurus',
            })
        },
        async updateMarketAccordingTODataSettings(context, payload) {
            if (payload.id == 'candlesticks') {
            }
            let value = ''
            context.commit('SET_SCAN_FILTER_SETTINGS2', {
                id: payload.id,
                settings: payload.filterSettings,
            })
            context.commit('SET_EVENTS_SETTINGS', {
                id: payload.id,
                settings: payload.events,
            })
            context.commit('SET_SCAN_DATA_SETTINGS2', {
                id: payload.id,
                settings: payload.dataSettings,
                type: 'scanner',
            })
            context.commit('SET_SCAN_SETTINGS', {
                id: payload.id,
                settings: payload.settings,
            })

            if (payload.dataSettings.isWatch) {
                value = 'watch-list'
            } else if (payload.dataSettings.isScan) {
                value = 'scan-result'
            } else {
                value = 'market'
            }

            await context.dispatch('setSelectedMarketNew', {
                id: payload.id,
                value: value,
                type: 'scanner',
            })
        },
        async setSelectedMarketNew(context, payload) {

            if (payload.type === 'scanner') {
                context.state.scans.scanner[payload.id].selectedMarket = payload.value
                if (payload.value === 'watch-list') {
                    context.state.scans.scanner[payload.id].dataSettings.isScan = false
                    context.state.scans.scanner[payload.id].dataSettings.isWatch = true
                } else if (payload.value === 'scan-result') {
                    context.state.scans.scanner[payload.id].dataSettings.isScan = true
                    context.state.scans.scanner[payload.id].dataSettings.isWatch = false
                } else {
                    context.state.scans.scanner[payload.id].dataSettings.isScan = false
                    context.state.scans.scanner[payload.id].dataSettings.isWatch = false
                }
            } else if (payload.type === 'guru') {
                context.state.scans.gurus[payload.id].selectedMarket = payload.value
                if (payload.value === 'watch-list') {
                    context.state.scans.gurus[payload.id].dataSettings.isScan = false
                    context.state.scans.gurus[payload.id].dataSettings.isWatch = true
                } else if (payload.value === 'scan-result') {
                    context.state.scans.gurus[payload.id].dataSettings.isScan = true
                    context.state.scans.gurus[payload.id].dataSettings.isWatch = false
                } else {
                    context.state.scans.gurus[payload.id].dataSettings.isScan = false
                    context.state.scans.gurus[payload.id].dataSettings.isWatch = false
                }
            }
        },

        async setSelectedMarket(context, payload) {
            context.state.selectedMarket = payload
            if (payload === 'watch-list') {
                context.state.scans.dataSettings.isScan = false
                context.state.scans.dataSettings.isWatch = true
            } else if (payload === 'scan-result') {
                context.state.scans.dataSettings.isScan = true
                context.state.scans.dataSettings.isWatch = false
            } else {
                context.state.scans.dataSettings.isScan = false
                context.state.scans.dataSettings.isWatch = false
            }
        },
        async showBrushData(context) {
            if (
                context.state.brushChartReference &&
                context.state.tradingChartReference
            )
                context.state.brushChartReference.setBrushed(
                    context.state.tradingChartReference.getRange(),
                    '{store function}'
                )
        },

        async saveLayout(context, payload) {
            const layoutObj = {
                "layoutName": payload,
                "layoutType": context.state.layout,
                "userId": context.state.userId,
                "symbolList": context.state.multiChartSymbol.map((data) => {
                    return {
                        "symbol": data.symbol,
                        "timeframe": data.timeFrame
                    }
                }),
                "chartType": context.state.type
            }

            let res = await saveLayout(layoutObj)

            if (!res.isError && res.data) {
                let layout = context.state.layoutList.find(x => x.id == res.data.id)
                if (!layout) {
                    context.state.layoutList.push(res.data)
                }
            }
            else {
                return res
            }


        },
        async getSavedLayouts(context, payload) {
            let layouts = await getLayoutListData(context.state.userId)
            if (layouts && layouts.data) {
                context.state.layoutList = layouts.data
            }
        },
        async deleteLayout(context, payload) {
            let deleteLayoutRes = await deleteLayout(payload)
            if (!deleteLayoutRes.isError) {
                let newWatchList = context.state.layoutList.filter(
                    (s) => s.id !== payload
                )
                context.state.layoutList = newWatchList
            }
        },
        async selectLayout(context, payload) {

            const dispatchPromises = payload?.symbolList.map((sym, i) => {
                return context.dispatch('setSymbolData', {
                    symbolName: sym.symbol,
                    timeFrame: sym.timeframe,
                    chartIndex: i,
                    selectTemplate: true
                }).then((d) => {
                    chartEvents.$emit('setChartRange', undefined, 'MarketIntraDayChange');
                    chartEvents.$emit('symbolChangeVerifyScanDetails');
                    chartEvents.$emit('loadDrawingData', false, context.state.selectedTab);
                });
            });
            await Promise.all(dispatchPromises);
            return true
        },
        async reloadSymbol(context) {
            for (let i = 0; i < context.state.multiChartSymbol.length; i++) {
                const element = context.state.multiChartSymbol[i];

                context
                    .dispatch('setSymbolData', {
                        symbolName: element.symbol,
                        timeFrame: element.timeFrame,
                        reForce: true,
                        chartIndex: i
                    })
                    .then((d) => {
                        chartEvents.$emit('setChartRange', undefined, 'MarketIntraDayChange')
                        chartEvents.$emit('symbolChangeVerifyScanDetails')
                        chartEvents.$emit('loadDrawingData', false, i)
                    })
            }
        },
        setRSLineData(context, payload) {
            context.commit('SET_RS_LINE_DATA', payload)
        },
        async setLogScale(context, payload) {
            try {
                let userData = {
                    ...context.state.userData,
                }
                userData['logScale'] = payload
                const result = await updateUserSettings({
                    userData: userData,
                }, "setLogScale")
                context.state.userData = userData
                context.commit('SET_LOGSCALE', payload)
                return result.updated
            } catch (error) {
                return null
            }
        },
        changeAuthModal(context, payload) {
            context.commit('SET_AUTH_MODAL', payload)
        },
        changeSvgColor(context, payload) {
            context.commit('UPDATE_SVG_COLOR', payload)
        },
        updateTradePlannerStepper(context, payload) {
            context.commit('SET_STEPPER', payload)
        },
        resetSavedScan(context, payload) {
            let index = context.state.userSavedScans.findIndex(x => x.id == payload)
            let data = context.state.userSavedScansDefault.find(x => x.id == payload)
            context.state.userSavedScans[index].data = JSON.parse(JSON.stringify(data.data))
        },
        changeRightBoxWidth(context, payload) {
            context.commit('SET_RIGHT_BOX_WIDTH', payload)
        },
        setProductPageTrial(context, payload) {
            context.commit('PRODUCT_PAGE_TRIAL', payload)
        },
        async updateIndicatorSettings(context, payload) {
            const {
                selectedOverlay,
                indicatorSettingsChanged,
                propUpdates,
                originMultiValue,
                originSingleIndicatorValue,
                originAdditionalIndicatorValue
            } = payload
            console.log("selectedOverlay", selectedOverlay);

            let overlay_tv = Object.values(Overlays)
            const newArr = selectedOverlay.map(x => x.name)
            const oldArr = context.getters.allChartOverlays.filter(x => x.selected == true).map(x => x.name)
            let editedList = []
            newArr.map((x) => {
                if (!oldArr.includes(x)) {

                    let config = context.getters.allChartOverlays.find((n) => n.name === x)
                    let overlay = overlay_tv.find(
                        (n) => n.name.toUpperCase() === x.toUpperCase()
                    )
                    if (overlay && overlay.methods.meta_info && config) {

                        editedList.push({
                            name: x,
                            chartName: config.chartId,
                            isAdd: true,
                            isRemove: false
                        })
                    }
                }
            })
            oldArr.map((x) => {
                if (!newArr.includes(x)) {

                    let config = context.getters.allChartOverlays.find((n) => n.name === x)
                    let overlay = overlay_tv.find(
                        (n) => n.name.toUpperCase() === x.toUpperCase()
                    )
                    if (overlay && overlay.methods.meta_info && config) {

                        editedList.push({
                            name: x,
                            chartName: config.chartId,
                            isAdd: false,
                            isRemove: true
                        })
                    }
                }
            })
            const isUndoRequire = await context.dispatch('processChartList', { editedList: editedList })
            // let propsArr = []
            if (indicatorSettingsChanged) {
                let res = await context.dispatch('saveUserSettings')
                if (res) {
                    // if (propUpdates.length > 0) {
                    //     propUpdates.map((prop, index) => {
                    //         let propObj = originMultiValue[prop] ?
                    //             {
                    //                 overlayValue: originMultiValue[prop],
                    //                 overlay: prop,
                    //                 type: indicatorParam.MULTI_VALUE_INDICATOR
                    //             }
                    //             : originSingleIndicatorValue[prop] ?
                    //                 {
                    //                     overlayValue: originSingleIndicatorValue[prop],
                    //                     overlay: prop,
                    //                     type: indicatorParam.SINGLE_INDICATOR
                    //                 }
                    //                 : originAdditionalIndicatorValue[prop] ?
                    //                     {
                    //                         overlayValue: originAdditionalIndicatorValue[prop],
                    //                         overlay: prop,
                    //                         type: indicatorParam.ADDITIONAL_INDICATOR
                    //                     }
                    //                     : null
                    //         if (propObj) {
                    //             propsArr.push(propObj)
                    //         }
                    //     })
                    // }
                    context.commit('USER_SET_UPDATE_CHARTS', propUpdates)
                }
            }
            if (isUndoRequire) {

                context.dispatch('action/setUndoAction', {
                    type: actionsubType.INDICATOR_UPDATE,
                    actionType: actionType.INDICATOR_ACTION,
                    payload: {
                        overlayData: editedList,
                        // overlaySettings: propsArr
                    }
                })
            }

        },
        async processChartList(context, payload) {

            const { editedList } = payload
            let isUndoRequire = false
            let chartList = JSON.parse(JSON.stringify(context.state.userChartlist))
            if (editedList.length > 0) {

                if (
                    await context.dispatch('saveMultiChartSettings', editedList)
                ) {
                    if (!payload.isUndoAction) {
                        isUndoRequire = true
                    }
                    editedList.map(async (item, index) => {
                        let config = context.getters.allChartOverlays.find((n) => n.name === item.name)
                        let overlay_tv = Object.values(Overlays)
                        let overlay = overlay_tv.find(
                            (n) => n.name.toUpperCase() === item.name.toUpperCase()
                        )

                        let overlayItem = {
                            data: config,
                            overlay: overlay,
                            isAdd: item.isAdd,
                            isRemove: item.isRemove
                        }
                        let { name, chartId, tool_type } = overlayItem.data
                        const userSettings = overlayItem.data.getData()

                        if (overlayItem.isRemove) {
                            let ind = chartList.indexOf(chartId)
                            if (ind > -1) {
                                chartList.splice(ind, 1)
                                chartEvents.$emit('remove_overlay_new', overlayItem.overlay, name)
                                if (name == "Ichi") {
                                    chartEvents.$emit('removeIchiData')
                                }

                            }
                        } else {
                            let isArray = Array.isArray(userSettings)
                            if (isArray) {
                                for (const settings of userSettings) {
                                    settings['chartId'] = chartId
                                    settings['tool_type'] = tool_type
                                }
                            } else {
                                userSettings['chartId'] = chartId
                                userSettings['tool_type'] = tool_type
                            }

                            let grid = {}
                            if (overlayItem.data.childRef === 'VolumeOVB') {
                                if (!context.state.chartToggleVolume) {
                                    await context.dispatch('toggleVolumeChart')
                                }
                                let gridMap = context.state?.dc?.dcgl
                                const volumeKey = 'offchart.VolumeOBV0'
                                if (gridMap && volumeKey in gridMap) {
                                    let gridID = gridMap[volumeKey].split('_')[0].slice(1)
                                    grid.id = Number(gridID)
                                } else {
                                    return
                                }


                            }
                            chartList.push(chartId)
                            chartEvents.$emit(
                                'add_overlay_new',
                                overlayItem.overlay,
                                name,
                                userSettings,
                                false,
                                true,
                                grid
                            )
                        }
                    })
                }
                context.commit('SET_USER_CHART_LIST', { data: chartList })
            }
            return isUndoRequire
        },
        async setAppTour(context, payload) {
            try {
                let userData = {
                    ...context.state.userData,
                }
                userData['appTour'] = payload
                const result = await updateUserSettings({
                    userData: userData,
                }, "setAppTour")
                context.state.userData = userData
                // context.commit('SET_LOGSCALE', payload)
                context.commit('SET_APP_TOUR', payload)
                return result.updated
            } catch (error) {
                return null
            }
        },
        setTourStep(context, payload) {
            context.commit('SET_TOUR_STEP', payload)
        },
        setScanLoading(context, payload) {
            context.commit('SET_SCAN_LOADING', payload)
        },
        setGridHeight(context, payload) {
            context.commit('SET_GRID_HEIGHT', payload)
        },
        setAIView(context, payload) {
            context.commit('SET_AI_VIEW', payload)
            // Force chart resize after AI view toggle
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 300) // Match the transition duration
        }


    },
    getters: {
        getChartType: (state) => {
            return state.type
        },
        getScanFavListTypes: (state) => {
            return state.scanFavListTypes
        },
        getGuruFavListTypes: (state) => {
            return state.guruFavListTypes
        },
        mainChartProps: (state) => {
            return state.mainChartProps
        },
        comparisionHigherHigh: (state) => {
            return state.comparisionHigherHigh
        },
        comparisionLowestLow: (state) => {
            return state.comparisionLowestLow
        },
        compareChartSymbols: (state) => {
            return state.compareChartSymbols
        },
        chartUpperRange: (state) => {
            return state.chartUpperRange
        },
        comparisionIndex: (state) => {
            return state.comparisionIndex
        },
        chartLowerRange: (state) => {
            return state.chartLowerRange
        },
        trainingModeDataRaw: (state) => {
            return state.trainingModeDataRaw
        },
        trainingModeData: (state) => {
            return state.trainingModeData
        },
        ohlcv: (state) => {
            return state.ohlcv
        },
        spxData: (state) => {
            return state.spx
        },
        ohlcvTimeMap: state => state.ohlcvTimeMap,
        chartRangeObj: (state) => state.chartRangeObj,
        SelectedScanSymbol: (state) => state.SelectedScanSymbol,
        candleIndexSelected: (state) => state.candleIndexSelected,
        candleIndexJumpSelected: (state) => state.candleIndexJumpSelected,
        trainingOffset: (state) => state.trainingOffset - 1,
        chartOverlays: (state) => state.chartOverlays,
        scanOverlay: (state) => state.scanOverlay,
        showOverlay: (state) => state.showOverlay,
        searchBoxUpdates: (state) => state.searchBoxUpdates,
        themeDarkMode: (state) => state.proTrader.themeSettings.themeDarkMode,
        selectedDrawingID: (state) => state.selectedDrawingID,
        userChoice: (state) => state.userChoice,
        favSelectedScanId: (state) => state.favSelectedScanId,
        chartPatternObject: (state) => state.scans.scanner.patterns,
        getUserId: (state) => state.userId,
        getUserEmail: (state) => state.emailId,
        eventUpdates: (state) => state.scans.eventUpdates,
        userSavedScans: (state) => state.userSavedScans,
        scans: (state) => state.scans,
        scanDeletePopup: (state) => state.scanDeletePopup,
        scanPopup: (state) => state.scanPopup,
        watchlistPopupGetter: (state) => state.watchlistPopup,
        topListSymbolName: (state) => state.topListSymbolName,
        topListSymbol: (state) => state.topListSymbol,
        scrollRight: (state) => state.scrollRight,
        scanCopyBtn: (state) => state.scanCopyBtn,
        userMultiSettings: (state) => state.userData.multi,
        userGeneralSettings: (state) => state.userData.generalSettings,
        userData: (state) => state.userData,
        drawingDataList: (state) => state.drawingDataList,
        drawingData: (state) => state.drawingData,
        multiDrawingData: (state) => state.multiDrawingData,
        drawingDataSaveSettings: (state) => state.drawingDataSaveSettings,
        getUserSettingData: (state) => state.userData,
        themeSettings: (state) => state.proTrader.themeSettings,
        userThemeSettings: (state) => state.userData['proTrader.themeSettings'],
        defaultThemeSettings: (state) => state.DEFAULT_THEME_SETTINGS,
        settingUpdatesForCharts: (state) => state.settingUpdatesForCharts,
        getDarvasBoxSettings: (state) => state.userData.darvasBoxSettings,
        getSingleIndicator: (state) => {
            return state.userData.indicatorSettings.single
        },
        getAdditionalIndicator: (state) => {
            return state.userData.indicatorSettings.additional
        },
        getMultiIndicator: (state) => {
            return state.userData.multi
        },
        getGeneralUserSettings: (state) => {
            return state.userData.generalSettings
        },
        protraderGeneralSettings: (state) =>
            state.protraderCharts.protraderGeneralSettings.config,
        chartSettingUpdatedDate: (state) => state.chartSettingUpdatedDate,
        chartSettings: (state) => state.chartSettings,
        allChartOverlays: (state) => [
            ...state.chartOverlays.trendCharts.data,
            ...state.chartOverlays.momentumCharts.data,
            ...state.chartOverlays.volatilityCharts.data,
            ...state.chartOverlays.volumeCharts.data,
            ...state.chartOverlays.plusCharts.data,
        ],
        trendCharts: (state) => state.chartOverlays.trendCharts,
        momentumCharts: (state) => state.chartOverlays.momentumCharts,
        volatilityCharts: (state) => state.chartOverlays.volatilityCharts,
        volumeCharts: (state) => state.chartOverlays.volumeCharts,
        plusCharts: (state) => state.chartOverlays.plusCharts,
        defaultChartSettings: (state) => state.defaultChartSettings,
        scanningIndicators: (state) => state.scans.scanner.indicators,
        chartToggleVolume: (state) => state.chartToggleVolume,
        getSavedTradePlans: (state) => state.savedTradePlans,
        symbolName: (state) => (id) => {
            return state.multiChartSymbol[id]?.symbol || '';
        },
        exchangeName: (state) => (id) => {
            return state.multiChartSymbol[id]?.metaData?.exchange || '';
        },
        companyName: (state) => state.currentSymbol.companyName,
        timeFrame: (state) => state.currentSymbol.timeFrame,
        getChartVisibleRange: (state) => state.chartVisibleRange,
        getSymbolsList: (state) => state.symbolsList,
        getIndustryGroup: (state) => state.industryGroup,
        getSubIndustryGroup: (state) => state.subIndustryGroup,
        getSectorGroup: (state) => state.sectorGroup,
        getMarketId: (state) => state.marketId,
        getMarketDesc: (state) => state.marketDesc,
        getSymbolData: (state) => state.ohlcv,
        getSPXSymbolData: (state) => state.spx,
        formattedSymbolData: (state) => state.currentSymbol.data,
        getSymbolByIndex: (state) => state.symbolsList[state.symbolIndex],
        isChartLoading: (state) => state.isChartLoading,
        dc: (state) => state.tradingChartReference?.data,
        tv: (state) => state.tradingChartReference,
        multiTv: (state) => state.tradingMultiChartReference,
        capitulationSettings: (state) => state.scans.gurus.capitulation,
        samsPatternSettings: (state) => state.scans.scanner.samsPattern.settings,
        gurusScanSettings: (state) => state.scans.gurus,
        scannerScanSettings: (state) => state.scans.scanner,
        dataSettings: (state) => state.scans.dataSettings,
        selectedMarket: (state) => state.selectedMarket,
        eventsSettings(state) {
            return (scanId) => {
                return state.scans.scanner[scanId].eventsSettings
            }
        },
        selectedMarketForScan(state) {

            return (scanId, scanType) => {
                if (scanType === 'scanner') {
                    return state.scans.scanner[scanId].selectedMarket
                } else if (scanType === 'guru') {
                    return state.scans.gurus[scanId].selectedMarket
                }
            }
        },
        dataSettingsForScan(state) {

            return (scanId, scanType) => {

                if (scanId && scanType === 'scanner') {
                    return state.scans.scanner[scanId].dataSettings
                } else if (scanId && scanType === 'guru') {

                    return state.scans.gurus[scanId].dataSettings
                } else if (scanId && scanType === 'favourite') {

                    return state.scans.gurus[scanId].dataSettings
                } else return state.scans.dataSettings
            }
        },
        filterSettingsForScan(state) {
            return (scanId) => {
                if (scanId) return state.scans.scanner[scanId].filterSettings
                else return state.scans.filterSettings
            }
        },
        filterSettingsForGuruScan(state) {
            return (scanId) => {
                if (scanId) return state.scans.gurus[scanId].filterSettings
                else return state.scans.filterSettings
            }
        },


        filterSettings: (state) => state.scans.filterSettings,
        scanResults: (state) => state.scans.results,
        symbolMetaData: (state) => state.currentSymbol.metaData,
        symbolClassificationInfo: (state) => {
            return state.currentSymbol.classificationInfo
        },
        defaultIndicatorSettings: (state) => state.indicatorDefaults,
        getSymbolHealth: (state) => state.currentSymbol.health,
        isTrainingMode: (state) => state.trainingMode,
        symbolIsMissing: (state) => state.symbolIsMissing,
        isIntradayMode: (state) => state.intradayMode, // && getMarketTime().isMarketOpened,
        trainingModeStartingIndex: (state) => state.trainingModeStartingIndex,
        trainingModeStartingIndexSubset: (state) =>
            state.trainingModeStartingIndexSubset,
        userChartlist: (state) => JSON.parse(JSON.stringify(state.userChartlist)),
        chartIDList: (state) => JSON.parse(JSON.stringify(state.chartIDList)),
        themePrimaryColor: (state) => {
            if (isThemePrimary(state.proTrader.themeSettings)) {
                return {
                    backgroundColor:
                        THEME_DETAILS[state.proTrader.themeSettings.id].primary,
                }
            } else {
                return {
                    backgroundColor: state.proTrader.themeSettings.settings.primary,
                }
            }
        },
        themeSecondaryColor: (state) => {
            if (isThemePrimary(state.proTrader.themeSettings)) {
                return {
                    backgroundColor:
                        THEME_DETAILS[state.proTrader.themeSettings.id].secondary,
                }
            } else {
                return {
                    backgroundColor: state.proTrader.themeSettings.settings.secondary,
                }
            }
        },
        themeFontColor: (state) => {
            if (isThemePrimary(state.proTrader.themeSettings)) {
                return { color: THEME_DETAILS[state.proTrader.themeSettings.id].font }
            } else {
                return { color: state.proTrader.themeSettings.settings.font }
            }
        },
        isThemePrimary: (state) => isThemePrimary(state.proTrader.themeSettings),
        showWatchesModal: (state) => state.showWatchesModal,
        showWatchRenameModal: (state) => state.showWatchRenameModal,
        showWatchesDeleteModal: (state) => state.showWatchesDeleteModal,
        showWatchesImportModal: (state) => state.showWatchesImportModal,
        watchLists: (state) => state.watchLists,
        selectedWatch: (state) => state.selectedWatch,
        selectedWatchCode: (state) => state.selectedWatchCode,
        selectedWatchSymbolCode: (state) => state.selectedWatchSymbolCode,
        watchListsData: (state) => state.watchListsData,
        selectedWatchData: (state) =>
            state.watchLists && state.watchLists[state.selectedWatchCode]
                ? state.watchLists[state.selectedWatchCode]
                : null,
        watchListsData1: (state) => {
            if (state.selectedWatch.length > 0) {
                if (state.watchListsData[state.selectedWatch]) {
                    return state.watchListsData[state.selectedWatch]
                } else {
                    return []
                }
            } else {
                return []
            }
        },
        deleteFavScanLoader: (state) => state.deleteFavScanLoader,
        onlyMatHasAccess: (state) => {
            // return state.emailId === 'mat@loop2.com.au'
            return true
        },
        getSelectedEmoji: (state) => state.selectedEmoji,
        getLayout: (state) => state.layout,
        getTabCount: (state) => state.tabCount,
        selectedTab: (state) => state.selectedTab,
        multiChartSymbol: (state) => state.multiChartSymbol,
        multiOhlcv: (state) => state.multiOhlcv,
        fullScreenIndex: (state) => state.fullScreenIndex,
        isFullScreen: (state) => state.isFullScreen,
        layoutPopup: (state) => state.layoutPopup,
        layoutList: (state) => state.layoutList,
        savedDrawingData: (state) => state.savedDrawingData,
        logScale: (state) => state.logScale,
        isRSSelected: (state) => {
            return state.chartOverlays?.momentumCharts?.data?.find(x => x.name == 'RS').selected || state.scanResultRS
        },
        rsLineData: (state) => state.rsLineData,
        isRestrictModal: (state) => state.isRestrictModal,
        isIntervalModal: (state) => state.isIntervalModal,
        isSubExpireModal: (state) => state.isSubExpireModal,
        isAuthModal: (state) => state.isAuthModal,
        selectedPriceId: (state) => state.selectedPriceId,
        svgColor: (state) => state.svgColor,
        tradePlannerSteper: (state) => state.tradePlannerSteper,
        rightContainerwidth: (state) => state.rightContainerwidth,
        productPageTrial: (state) => state.productPageTrial,
        appTour: (state) => state.appTour,
        tourStep: (state) => state.tourStep,
        scanLoading: (state) => state.scanLoading,
        gridHeight: (state) => state.gridHeight,
        isAIOpen: (state) => state.isAIOpen
    },
})
