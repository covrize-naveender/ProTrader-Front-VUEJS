export default {
    propName: "proTrader.indicators.settings",
    "proTrader.indicators.settings": {
        "multi": {
            "sma": {
                "items": [
                    {
                        "parameters": {
                            "period": {
                                "value": 50
                            }
                        },
                        "series": [
                            {
                                "color": "#ffffff",
                                "forProp": "period",
                                "visible": true
                            }
                        ]
                    }
                ]
            },
            "smaobv": {
                "items": [
                    {
                        "parameters": {
                            "period": {
                                "value": 30
                            }
                        },
                        "series": [
                            {
                                "color": "#2780e3",
                                "forProp": "period",
                                "visible": true
                            }
                        ]
                    }
                ]
            },
            "smavolume": {
                "items": [
                    {
                        "parameters": {
                            "period": {
                                "value": 30
                            }
                        },
                        "series": [
                            {
                                "forProp": "period",
                                "color": "#2780e3",
                                "visible": true
                            }
                        ]
                    }
                ]
            },
            "obvvolume": {
                "items": [
                    {
                        "parameters": {
                            "period": {
                                "value": 1
                            }
                        },
                        "series": [
                            {
                                "forProp": "period",
                                "color": "#2780e3",
                                "visible": true
                            }
                        ]
                    }
                ]
            },
            // "volumeobv": {
            //     "items": [
            //         {
            //             "parameters": {
            //                 "period": {
            //                     "value": 30
            //                 }
            //             },
            //             "series": [
            //                 {
            //                     "forProp":"period",
            //                     "color": "#2780e3",
            //                     "visible": true
            //                 }
            //             ]
            //         }
            //     ]
            // },
            "wma": {
                "items": [
                    {
                        "parameters": {
                            "period": {
                                "value": 10
                            }
                        },
                        "series": [
                            {
                                "forProp": "period",
                                "color": "#ffffff",
                                "visible": true
                            }
                        ]
                    }
                ]
            },
            "xma": {
                "items": [
                    {
                        "parameters": {
                            "period": {
                                "value": 3
                            }
                        },
                        "series": [
                            {
                                "forProp": "period",
                                "color": "#61e436",
                                "visible": true
                            }
                        ]
                    },
                    {
                        "parameters": {
                            "period": {
                                "value": 10
                            }
                        },
                        "series": [
                            {
                                "forProp": "period",
                                "color": "#6f378b",
                                "visible": true
                            }
                        ]
                    },
                    {
                        "parameters": {
                            "period": {
                                "value": 30
                            }
                        },
                        "series": [
                            {
                                "forProp": "period",
                                "color": "#ff0039",
                                "visible": true
                            }
                        ]
                    }
                ]
            }
        },
        "single": {
            "tci": {
                "parameters": {
                    "period": {
                        "value": 21
                    }
                },
                "series": [
                    {
                        "forProp": "period",
                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            },
            "boll": {
                "parameters": {
                    "period": {
                        "value": 9
                    },
                    "deviation": {
                        "value": 2
                    }
                },
                "series": [
                    {
                        "forProp": "period",
                        "color": "#2780e3",
                        "visible": true
                    },
                    {
                        "forProp": "deviation",
                        "color": "#ff7518",
                        "visible": true
                    }
                ]
            },
            "atr": {
                "parameters": {
                    "period": {
                        "value": 14
                    },
                    "multiplier": {
                        "value": 1
                    },
                    "lineWidth": {
                        "value": 2
                    }
                },
                "series": [
                    {
                        "forProp": "period",
                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            },
            "macd": {
                "parameters": {
                    "fastPeriod": {
                        "value": 12
                    },
                    "slowPeriod": {
                        "value": 26
                    },
                    "signalPeriod": {
                        "value": 9
                    }
                },
                "series": [
                    {
                        "forProp": "fastPeriod",
                        "color": "#2780e3",
                        "visible": true
                    },
                    {
                        "forProp": "slowPeriod",
                        "color": "#ff7518",
                        "visible": true
                    },
                    {
                        "forProp": "signalPeriod",
                        "color": "#9954bb",
                        "visible": true
                    }
                ]
            },
            "roc": {
                "parameters": {
                    "period": {
                        "value": 10
                    }
                },
                "series": [
                    {
                        "forProp": "period",
                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            },
            "rsi": {
                "parameters": {
                    "period": {
                        "value": 14
                    }
                },
                "series": [
                    {
                        "forProp": "period",
                        "color": "#ff0039",
                        "visible": true
                    }
                ]
            },
            "stoc": {
                "parameters": {
                    "period": {
                        "value": 5
                    },
                    "kPeriod": {
                        "value": 5
                    },
                    "dPeriod": {
                        "value": 5
                    }
                },
                "series": [
                    {
                        "forProp": "kPeriod",
                        "color": "#ffffff",
                        "visible": true
                    },
                    {
                        "forProp": "dPeriod",
                        "color": "#ff7518",
                        "visible": true
                    }
                ]
            },
            "will": {
                "parameters": {
                    "period": {
                        "value": 3
                    }
                },
                "series": [
                    {
                        "forProp": "period",
                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            },
            "sar": {
                "parameters": {
                    "start": {
                        "value": 0.02
                    },
                    "increment": {
                        "value": 0.02
                    },
                    "max": {
                        "value": 0.02
                    }
                },
                "series": [
                    {
                        "forProp": "period",

                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            },
            "valueTraded": {
                "series": [
                    {
                        "forProp": "series",
                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            },
            "vwap": {
                "series": [
                    {
                        "forProp": "series",
                        "color": "#2780e3",
                        "visible": true
                    }
                ]
            }
        }
    },
    config: {
        multi: [
            {
                propName: "sma",
                items: [
                    { period: 30, color: "#165ba8", }
                ],
                size: 7,
                min: 1,
                label: "Simple Moving Average"
            },
            {
                propName: "smaobv",
                items: [
                    { period: 30, color: "#165ba8", }
                ],
                size: 7,
                min: 1,
                label: "Simple Moving Average of OBV"
            },
            {
                propName: "smavolume",
                items: [
                    { period: 30, color: "#165ba8", }
                ],
                size: 7,
                min: 1,
                label: "Simple Moving Average of OBV of Volume"
            },
            {
                propName: "obvvolume",
                items: [
                    { period: 30, color: "#165ba8", }
                ],
                size: 7,
                min: 1,
                label: "OBV of Volume"
            },
            {
                propName: "wma",
                items: [
                    { period: 9, color: "#165ba8" },
                    { period: 27, color: "#ff7518" },
                ],
                size: 7,
                min: 2,
                label: "Weighted Moving Average"
            },
            {
                propName: "xma",
                items: [
                    { period: 15, color: "#165ba8" },
                    { period: 45, color: "#ff7518" },
                    { period: 60, color: "#6f378b" },
                ],
                size: 7,
                min: 3,
                label: "Exponential Moving Average"
            },
            {
                propName: "gxma",
                items: [
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
                ],
                size: 7,
                min: 3,
                label: "Guppy Multiple Moving Average"
            },
        ],
        single: [
            {
                propName: "tci",
                children: [
                    { "fieldRef": "tci.period", propName: "period", type: "number-color", value: 21, color: "#165ba8", label: "Period" },
                    // {propName:"a",type:"color",value:"#441b1b",label:"Colour"},
                ],
                label: "Trend Channels",
            },
            {
                propName: "boll",
                children: [
                    { "fieldRef": "boll.period", propName: "period", type: "number-color", value: 21, color: "#165ba8", label: "Period" },
                    { "fieldRef": "boll.deviation", propName: "deviation", type: "number-color", value: 2, color: "#ff7518", label: "Deviations" },
                    // {propName:"a",type:"color",value:"#441b1b",label:"Colour"},
                ],
                label: "Bollinger Bands",
            },
            {
                propName: "atr",
                children: [
                    { "fieldRef": "atr.period", propName: "period", type: "number-color", value: 14, color: "#165ba8", label: "Period" },
                    { "fieldRef": "atr.lineWidth", propName: "lineWidth", type: "number", value: 2, label: "Line Width" },
                    { "fieldRef": "atr.multiplier", propName: "multiplier", type: "number", value: 5, label: "Multiplier" },
                ],
                label: "Average True Range",
            },
            {
                propName: "macd",
                children: [
                    { "fieldRef": "macd.fastPeriod", propName: "fastPeriod", type: "number-color", value: 12, color: "#2780e3", label: "Fast Period" },
                    { "fieldRef": "macd.slowPeriod", propName: "slowPeriod", type: "number-color", value: 26, color: "#ff7518", label: "Slow Period" },
                    { "fieldRef": "macd.signalPeriod", propName: "signalPeriod", type: "number-color", value: 9, color: "#9954bb", label: "Signal Period" },
                ],
                label: "MACD",
            },
            {
                propName: "roc",
                children: [
                    { "fieldRef": "roc.period", propName: "period", type: "number-color", value: 10, color: "#2780e3", label: "Period" },
                ],
                label: "Rate Of Change",
            },
            {
                propName: "rsi",
                children: [
                    { "fieldRef": "rsi.period", propName: "period", type: "number-color", value: 14, color: "#2780e3", label: "Period" },
                ],
                label: "Relative Strength Index",
            },
            {
                propName: "stoc",
                children: [
                    { "fieldRef": "stoc.period", propName: "period", type: "number", value: 15, color: "#441b1b", label: "Period" },
                    { "fieldRef": "stoc.kPeriod", propName: "kPeriod", type: "number-color", value: 5, color: "#2780e3", label: "%K Period" },
                    { "fieldRef": "stoc.dPeriod", propName: "dPeriod", type: "number-color", value: 5, color: "#ff7518", label: "%D Period" },
                ],
                label: "Stochastic Oscillator",
            },
            {
                propName: "will",
                children: [
                    { "fieldRef": "will.period", propName: "period", type: "number-color", value: 14, color: "#2780e3", label: "Period" },

                ],
                label: "Williams %R",
            },
            {
                propName: "sar",
                children: [
                    { "fieldRef": "sar.start", propName: "start", type: "number", value: 0.02, color: "#441b1b", label: "Start" },
                    { "fieldRef": "sar.increment", propName: "increment", type: "number", value: 0.02, color: "#441b1b", label: "Increment" },
                    { "fieldRef": "sar.max", propName: "max", type: "number", value: 0.2, color: "#441b1b", label: "Max" },
                    { "fieldRef": "sar.series", propName: "series", type: "color", value: "#2780e3", color: "#2780e3", label: "Colour" },

                ],
                label: "Parabolic SAR",
            },
            {
                propName: "valueTraded",
                children: [
                    { "fieldRef": "valueTraded.series", propName: "series", type: "color", value: "#2780e3", color: "#2780e3", label: "Colour" },
                ],
                label: "Value",
                colorOnly: true
            },
            {
                propName: "vwap",
                children: [
                    { "fieldRef": "vwap.series", propName: "series", type: "color", value: "#2780e3", color: "#2780e3", label: "Colour" },
                ],
                label: "VWAP",
                colorOnly: true
            }
        ],
        propName: "proTrader.indicators.settings"
    }
}