export default {
    "proTrader.chart.0.indicators":" get indicator data ",
    propName: "proTrader.chart.settings",    
    "proTrader.chart.settings": {
        "chart": {
            "properties": {
                "lineColor": {
                    "value": "#2780E3"
                },
                "sideColor": {
                    "value": "#2e2f2f"
                },
                "upColor": {
                    "value": "#2780E3"
                },
                "downColor": {
                    "value": "#ff0039"
                },
                "barChange": {
                    "value": false
                },
                "semiLogAxis": {
                    "value": false
                },
                "volumeColor": {
                    "value": "#2780E3"
                },
                "upColorVolume": {
                    "value": "#2780E3"
                },
                "downColorVolume": {
                    "value": "#ff0039"
                },
                "barChangeVolume": {
                    "value": true
                },
                "obvColor": {
                    "value": "#2e2f2f"
                }
            }
        },
        "crosshairs": {
            "properties": {
                "enabled": {
                    "value": true
                },
                "lineColor": {
                    "value": "#b4b4b9"
                },
                "boxColor": {
                    "value": "#48484a"
                },
                "textColor": {
                    "value": "#ffffff"
                }
            }
        },
        "marker": {
            "properties": {
                "enabled": {
                    "value": true
                },
                "color": {
                    "value": "#b4b4b9"
                }
            }
        },
        "misc": {
            "properties": {
                "hidePopup": {
                    "value": false
                }
            }
        }
    },    
    config:[
        {
            children:[
                {
                    properties: [
                        {"fieldRef":"chart.lineColor", "propName":"lineColor","value": "#2780E3","label": "Line Colour","type": "color" },
                        {"fieldRef":"chart.sideColor", "propName":"sideColor",  "value": "#2e2f2f",  "label": "Unchanged Colour",  "type": "color"},
                        { "fieldRef":"chart.upColor","propName": "upColor",  "value": "#2780E3",  "label": "Up Colour",  "type": "color"},
                        { "fieldRef": "chart.downColor",  "propName": "downColor",  "value": "#ff0039",  "label": "Down Colour",  "type": "color"},
                        { "fieldRef": "chart.barChange",  "propName": "barChange",  "value": false,  "label": "Use Up/Down Colour on Bar Chart",  "type": "check"},
                        {"fieldRef": "chart.semiLogAxis", "propName": "semiLogAxis", "value": false, "label": "Semi Log Price Axis", "type": "check"},
                        { "fieldRef":"chart.volumeColor",  "propName":"volumeColor",  "value": "#2780E3",  "label": "Volume Colour",  "type": "color"},
                        { "fieldRef":"chart.upColorVolume",  "propName":"upColorVolume",  "value": "#2780E3",  "label": "Up Volume Colour",  "type": "color"},
                        { "fieldRef":"chart.downColorVolume",  "propName":"downColorVolume",  "value": "#ff0039",  "label": "Down Volume Colour",  "type": "color"},
                        { "fieldRef":"chart.barChangeVolume",  "propName":"barChangeVolume",  "value": true,  "label": "Use Up/Down Colours on Volume Chart",  "type": "check"},
                        { "fieldRef":"chart.obvColor",  "propName":"obvColor",  "value": "#2e2f2f",  "label": "On-Balance Volume Colour",  "type": "color"}
                    ],
                    "heading": "Chart",
                    "propName":"chart"
                }
            ]
        },
        {
            children:[
                {
                    "properties": [                        
                        { "fieldRef":"crosshairs.enabled",  "propName": "enabled",  "value": true,  "type":"check",  "label":"Enabled"},
                        { "fieldRef":"crosshairs.lineColor",  "propName":"lineColor",  "value": "#b4b4b9",  "type":"color",  "label":"Line Colour" },
                        {"fieldRef":"crosshairs.boxColor", "propName":"boxColor", "value": "#48484a", "type":"color", "label":"Box Colour" },
                        { "fieldRef":"crosshairs.textColor",  "propName":"textColor",  "value": "#ffffff",  "type":"color",  "label":"Text Colour" }
                    ],
                    "heading": "Crosshairs",
                    "propName":"crosshairs"
                },{
                    "properties": [
                        { "fieldRef":"marker.enabled",  "propName":"enabled",  "value": true,  "type":"check",  "label":"Enabled"},
                        { "fieldRef":"marker.color",  "propName":"color",  "value": "#b4b4b9",  "type":"color",  "label":"Colour"}
                    ],
                    "heading": "Marker",
                    "propName":"marker"
                }, {
                    "properties": [
                         { "fieldRef":"misc.hidePopup",  "propName":"hidePopup",  "value": false,  "type":"check",  "label":"Hide popup modal windows"}
                    ],
                    "heading": "Misc",
                    "propName":"misc"
                }
            ]
        }
    ]
    
}