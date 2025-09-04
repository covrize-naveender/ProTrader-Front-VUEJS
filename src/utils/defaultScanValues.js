import { DEFAULT_DATA_SETTINGS, DEFAULT_EVENT_SETTINGS, DEFAULT_FILTER_SETTINGS } from "../settings/USER_SETTINGS_DEFAULT"

export const CAPITALISATION = {
    selectedMarket: 'market',
    volumeMultiplier: 2,
    lastVolumeAvgPeriod: 5,
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
}

export const BOLLINGER_SQUEEZE = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    minScanningPeriod: 200,
    maxScanningPeriod: 250,
    dayFromToday: 5,
    minSqueezeLength: 200,
    maxSqueezeLength: 250,
    ratioOfSpikeHeight: 10,
}

export const DIVERGENCE_SCAN = {
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
}

export const BIG_CANDLE = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    candleSizeMultiplier: 2,
    previousCandlePeriod: 5,
}

export const POCKET_PIVOT = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    period: 5,
}

export const HEIKEN_ASHI = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    period: 10,
}

export const FRANKS_PATTERN = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS))
}

export const HHHL = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
}

export const SAMS_PATTERN_SETT = {
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
    },
    within: {
        isActive: false,
        type: 'close', // 'close' | 'high'
        pricePoints: 0,
    },
    restrictBoxToMaxBox: {
        isActive: false,
        maxBoxes: 0,
    },
    restrictCurrentBoxWidth: {
        isActive: false,
        start: 0,
        end: 10,
    },
    onlyShowBoxOfTopBottomOnFirstBar: false,
}

export const PATTERN_SETT = {
    saucerBottom: false,
    doubleBottom: false,
    bearishKeyReversal: false,
    bullishPennant: false,
    bearishFlag: false,
    ascendingTriangle: false,
    doubleTop: false,
    triPointResistance: false,
    bearishPennant: false,
    descendingTriangle: false,
    bullishKeyReversal: false,
    triPointSupport: false,
    bullishFlag: false,
}

export const ACTIVITY_SETT = {
    mode: 'top',
    topCount: 10,
    topMethod: 'volume',
    withinPct: 1.0,
    priceRangeStart: 1,
    priceRangeEnd: 5,
}

export const CANDLE_SETT = {
    doji: false,
    bullishHarami: false,
    bearishHarami: false,
    bullishHaramiCross: false,
    bearishHaramiCross: false,
    hammer: false,
    invertedHammer: false,
    shootingStar: false,
    hangingMan: false,
    bullishEngulfing: false,
    bearishEngulfing: false,
    insideBar: false,
    multipleInsideBar: false,
    multipleInsideBarInput: 2,
    gtMultipleInsideBar: false,
    gtMultipleInsideBarInput: 5
}

export const INDICATOR_SETT = {
    crossesAndAboveBelow: {
        isActive: false,
        left: 'close',
        leftPeriod: 14,
        operatorType: 'above',
        right: 'ma',
        rightPeriod: 14,
    },
    ROC: {
        isActive: false,
        period: 10,
        mode: 'overbought',
    },
    RSI: {
        isActive: false,
        period: 14,
        mode: 'overbought',
    },
    RSR: {
        isActive: false,
        period: 80,
    },
    STOC: {
        isActive: false,
        period: 15,
        kPercent: 3,
        dPercent: 3,
        mode: 'overbought',
    },
    BANDS: {
        isActive: false,
        period: 21,
        breakMode: 'top',
    },
    guppyMMA: {
        isActive: false,
        GuppyMMAItems: [
            { period: 3, isShort: true },
            { period: 5, isShort: true },
            { period: 8, isShort: true },
            { period: 10, isShort: true },
            { period: 12, isShort: true },
            { period: 15, isShort: true },
            
            { period: 30, isShort: false },
            { period: 35, isShort: false },
            { period: 40, isShort: false },
            { period: 45, isShort: false },
            { period: 50, isShort: false },
            { period: 60, isShort: false },
        ]
    }
}

export const DARVAS_SETT = {
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
    },
    within: {
        isActive: false,
        type: 'close', // 'close' | 'high'
        pricePoints: 0,
    },
    restrictBoxToMaxBox: {
        isActive: false,
        maxBoxes: 0,
    },
    restrictCurrentBoxWidth: {
        isActive: false,
        start: 0,
        end: 10,
    },
}
export const FUNDAMENTALS_SETT = {
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

export const SAMS_PATTERN = {
    selectedMarket: 'market',
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    settings: SAMS_PATTERN_SETT,
}

export const PATTERNS = {
    selectedMarket: 'market',
    settings: PATTERN_SETT,
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    eventsSettings: JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS)),
}

export const ACTIVITY = {
    selectedMarket: 'market',
    settings: ACTIVITY_SETT,
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
}

export const CANDLESTICKS = {
    selectedMarket: 'market',
    settings: CANDLE_SETT,
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
}

export const INDICATORS = {
    selectedMarket: 'market',
    settings: INDICATOR_SETT,
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
    eventsSettings: JSON.parse(JSON.stringify(DEFAULT_EVENT_SETTINGS)),

}

export const DARVAS = {
    selectedMarket: 'market',
    settings: DARVAS_SETT,
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),
}

export const FUNDAMENTALS = {
    selectedMarket: 'market',
    settings: FUNDAMENTALS_SETT,
    dataSettings: JSON.parse(JSON.stringify(DEFAULT_DATA_SETTINGS)),
    filterSettings: JSON.parse(JSON.stringify(DEFAULT_FILTER_SETTINGS)),

}