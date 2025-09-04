export const DEFAULT_DATA_SETTINGS = {
    timeFrame: 'D',
    type: 'ASX',
    filterBy: 'all',
    sector: '',
    industry: '',
    watchCode: '',
    scanCode: '',
    watchCodeId: -1,
    isWatch: false,
    isScan: false,
    scanList: [],
    subIndustry: '',
}
export const DEFAULT_FILTER_SETTINGS = {
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
        start: 0,
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
        value: 25000,
    },
    ignoreResultsWithVolumeLess: {
        isActive: false,
        volume: 25000,
    },
    includeIntraDayData: false,
    matchFilterCombination: false,
    excludeWatchlists: false
}
export const DEFAULT_EVENT_SETTINGS = {
    break: {
        isActive: false,
        period: 30,
        direction: 'up',
        type: 'close',
    },
    prebreak: {
        isActive: false,
        period: 50,
        pct: 2,
        type: 'high',
    },
    volumeIncrease: {
        isActive: false,
        period: 4,
    },
    tciBreak: {
        isActive: false,
        direction: 'down',
    },
    tciTrend: {
        isActive: false,
        direction: 'up',
        period: 21,
    },
    macd: {
        isActive: false,
        period: 2,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
    },
    obv: {
        isActive: false,
        pctAbove: 2,
        period: 2,
    },
    volumeMore: {
        isActive: false,
        pct: 1300,
        period: 1,
    },
    trendLineCrossing: {
        isActive: false,
        period: 1,
    },
    gapUp: {
        isActive: false,
        cents: 10,
    },
    gapDown: {
        isActive: false,
        cents: 10,
    },
    matchCombination: false,
}

export const defaultChartSettings = {
    showCrossHair: true,
    colorCrossHairLine: '#B4B4B9',
    colorCrossHairBox: '#48484A',
    colorCrossHairText: '#FFFFFF',

    showMarkers: true,
    colorMarker: '#B4B4B9',

    hidePopupModal: false,

    semiLogPriceAxis: true,
    colorCandleInVolume: true,
    useUpDownInVolChart: true,
    lineColor: '#2780E3',
    unchangedColor: '#242425',
    colorVolumeOnBalance: '#242425',
    colorCandleUp: '#2780E3',
    colorCandleDw: '#FF0039',
    colorWickUp: '#23a77688',
    colorWickDw: '#e5415088',
    colorVol: '#2780E3',
    colorVolUp: '#2780E3',
    colorVolDw: '#FF0039'
}
export const protraderCharts = {
    protraderGeneralSettings: {
        propName: 'proTrader.chart.settings',
        config: {
            chart: {
                properties: {
                    lineColor: {
                        value: '#2780E3',
                        label: 'Line Colour',
                        type: 'color',
                    },
                    sideColor: {
                        value: '#2e2f2f',
                        label: 'Unchanged Colour',
                        type: 'color',
                    },
                    upColor: {
                        value: '#2780E3',
                        label: 'Up Colour',
                        type: 'color',
                    },
                    downColor: {
                        value: '#ff0039',
                        label: 'Down Colour',
                        type: 'color',
                    },
                    barChange: {
                        value: false,
                        label: 'Use Up/Down Colour on Bar Chart',
                        type: 'check',
                    },
                    semiLogAxis: {
                        value: false,
                        label: 'Semi Log Price Axis',
                        type: 'check',
                    },
                    volumeColor: {
                        value: '#2780E3',
                        label: 'Volume Colour',
                        type: 'color',
                    },
                    upColorVolume: {
                        value: '#2780E3',
                        label: 'Up Volume Colour',
                        type: 'color',
                    },
                    downColorVolume: {
                        value: '#ff0039',
                        label: 'Down Volume Colour',
                        type: 'color',
                    },
                    barChangeVolume: {
                        value: true,
                        label: 'Use Up/Down Colours on Volume Chart',
                        type: 'check',
                    },
                    obvColor: {
                        value: '#2e2f2f',
                        label: 'On-Balance Volume Colour',
                        type: 'color',
                    },
                },
                heading: 'Chart',
            },
            crosshairs: {
                properties: {
                    enabled: {
                        value: true,
                    },
                    lineColor: {
                        value: '#b4b4b9',
                    },
                    boxColor: {
                        value: '#48484a',
                    },
                    textColor: {
                        value: '#ffffff',
                    },
                },
            },
            marker: {
                properties: {
                    enabled: {
                        value: true,
                    },
                    color: {
                        value: '#b4b4b9',
                    },
                },
            },
            misc: {
                properties: {
                    hidePopup: {
                        value: false,
                    },
                },
            },
        },
    },
}
