export const allToolbox = [
    {
        label: "Guru's Toolbox",
        id:"guru-tool",
        type: "guru",
        item: [
            {
                label: "Bollinger Band",
                value: "bollingerSqueeze",
                scanType: "bollingerSqueeze",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Bollinger Squeeze",
                descriptionBox: true,
                image: 'bollinger-squeeze.png',
                description: 'From contraction comes expansion.'
            },
            {
                label: "Big Candle",
                value: "bigCandle",
                scanType: "bigCandleScan",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Big Candle",
                descriptionBox: true,
                image: 'big-candle.png',
                description: 'Find stocks making powerful moves with engulfing candles.'
            },
            {
                label: "Capitulation Days",
                value: "capitulation",
                scanType: "capitulation",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Capitulation",
                descriptionBox: true,
                image: 'capitulation.png',
                description: 'Identify potential turning points, where traders and investors lose hope in their positions and capitulate, providing opportunity for the patient trader.'
            },
            {
                label: "Divergence Scan",
                value: "divergenceScan",
                scanType: "divergenceScan",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Divergence Scan",
                descriptionBox: true,
                image: 'divergence.png',
                description: 'When an oscillator diverges from price, it can potentially signal changes in momentum and help predict future price swings.'
            },
            {
                label: "Frank's Pattern",
                value: "franksPattern",
                scanType: "franksPattern",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: false,
                contentTitle: "Frank's Pattern",
                descriptionBox: true,
                image: 'franks.png',
                description: 'Scan for stocks in pre-existing uptrends, that pause and base sideways, before potentially breaking out and starting their next leg upwards.'
            },
            {
                label: "Heiken Ashi",
                value: "heikenAshi",
                scanType: "heikenAshiScan",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Heiken Ashi",
                descriptionBox: true,
                image: 'heiken-ashi.png',
                description: 'A Japanese trading indicator that means "average bar". Heikin-Ashi charts resemble candlestick charts, but have a smoother appearance as they track a range of price movements, rather than tracking every price movement as with candlesticks.'
            },
            {
                label: "Higher High, higher Low",
                value: "hhhl",
                scanType: "hhhl",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: false,
                contentTitle: "Higher High Higher Low",
                descriptionBox: true,
                image: 'hhhl.png',
                description: 'Find stocks in official uptrends that are about to make new price highs.'
            },
            {
                label: "Pocket Pivot",
                value: "pocketPivot",
                scanType: "pocketPivotScan",
                type: "guru",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Pocket Pivot",
                descriptionBox: true,
                image: 'pocket-pivot.png',
                description: "A Pocket Pivot occurs when a current bar/candle's up volume is larger than any of the down volume bars/candles in the prior 10 days. It must occur within a well structured base pattern to be significant."
            },
            {
                label: "Sam's Darvas Boxes",
                value: "samsPattern",
                type: "scanner",
                isEvent: false,
                isFilter: false,
                isContent: true,
                contentTitle: "Sam's Darvas Box",
                descriptionBox: true,
                image: 'sams-darvas.png',
                description: 'Find Darvas Boxes formed with all the bars/candles falling inside the range of the first bar/candle of the Box.'
            },

        ]
    },
    {
        label: "Scanning Toolbox",
        id:"scan-tool",
        type: "scanner",
        item: [
            {
                label: "Patterns & Events",
                value: "patterns",
                type: "scanner",
                isEvent: true,
                isFilter: true,
                isContent: true,
                contentTitle: "Chart Pattern",
                descriptionBox: false
            },
            {
                label: "Activity",
                value: "activity",
                type: "scanner",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Activity",
                descriptionBox: false
            },
            {
                label: "Candles",
                value: "candlesticks",
                type: "scanner",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Candlestick Patterns",
                descriptionBox: false
            },
            {
                label: "Indicator & Events",
                value: "indicators",
                type: "scanner",
                isEvent: true,
                isFilter: true,
                isContent: true,
                contentTitle: "Indicators",
                descriptionBox: false
            },
            {
                label: "Darvas Boxes",
                value: "darvasScan",
                type: "scanner",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Darvas Boxes",
                descriptionBox: true,
                image: 'darvas-box.png',
                description: 'The world’s first and premier Darvas Box scanner.  Scan for stocks in uptrends that pause, base, then breakout. Trail your stop loss just like Darvas did in the 1960’s.'
            },
            {
                label: "Fundamentals",
                value: "fundementals",
                type: "scanner",
                isEvent: false,
                isFilter: true,
                isContent: true,
                contentTitle: "Fundamentals",
                descriptionBox: false
            },

        ]
    }

]