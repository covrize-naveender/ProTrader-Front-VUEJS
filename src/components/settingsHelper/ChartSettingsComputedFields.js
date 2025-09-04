export default {    
    semiLogPriceAxis: {
        get() {
            return this.$store.state.chartSettings.semiLogPriceAxis
        },
        set(value) {
            this.setPropInStore('semiLogPriceAxis',value)
        },
    },
    colorCandleInVolume: {
        get() {
            return this.$store.state.chartSettings.colorCandleInVolume
        },
        set(value) {
            this.setPropInStore('colorCandleInVolume',value)            
        },
    },
    lineColor: {
        get() {
            return this.$store.state.chartSettings.lineColor
        },
        set(value) {
            this.setPropInStore('lineColor',value)            
        },
    },
    sideColor: {
        get() {
            return this.$store.state.chartSettings.sideColor
        },
        set(value) {
            this.setPropInStore('sideColor',value)            
        },
    },
    upColor: {
        get() {
            return this.$store.state.chartSettings.upColor
        },
        set(value) {
            this.setPropInStore('upColor',value)            
        },
    },
    unchangedColor: {
        get() {
            return this.$store.state.chartSettings.unchangedColor
        },
        set(value) {
            this.setPropInStore('unchangedColor',value)            
        },
    },
    colorCandleUp: {
        get() {
            return this.$store.state.chartSettings.colorCandleUp
        },
        set(value) {
            this.setPropInStore('colorCandleUp',value)
            
        },
    },
    /** @returns {String} */
    colorCandleDw: {
        get() {            
            return this.$store.state.chartSettings.colorCandleDw
        },
        set(value) {            
            this.setPropInStore('colorCandleDw',value)
            
        },
    },
    /** @returns {String} */
    colorWickUp: {
        get() {
            return this.$store.state.chartSettings.colorWickUp
        },
        set(value) {
            this.setPropInStore('colorWickUp',value)
            
        },
    },
    /** @returns {String} */
    colorWickDw: {
        get() {
            return this.$store.state.chartSettings.colorWickDw
        },
        set(value) {
            this.setPropInStore('colorWickDw',value)
            
        },
    },
    /** @returns {String} */
    colorVolUp: {
        get() {
            return this.$store.state.chartSettings.colorVolUp
        },
        set(value) {
            this.setPropInStore('colorVolUp',value)
            
        },
    },
    /** @returns {String} */
    colorVolDw: {
        get() {
            return this.$store.state.chartSettings.colorVolDw
        },
        set(value) {
            this.setPropInStore('colorVolDw',value)
            
        },
    },
    colorVol: {
        get() {
            return this.$store.state.chartSettings.colorVol
        },
        set(value) {
            this.setPropInStore('colorVol',value)
            
        },
    },
    useUpDownInVolChart: {
        get() {
            return this.$store.state.chartSettings.useUpDownInVolChart
        },
        set(value) {
            this.setPropInStore('useUpDownInVolChart',value)
            
        },
    },
    colorVolumeOnBalance: {
        get() {
            return this.$store.state.chartSettings.colorVolumeOnBalance
        },
        set(value) {
            this.setPropInStore('colorVolumeOnBalance',value)
            
        },
    },
    showMarkers: {
        get() {
            return this.$store.state.chartSettings.showMarkers
        },
        set(value) {
            this.setPropInStore('showMarkersCS',value)
            
        },
    },
    colorMarker: {
        get() {
            return this.$store.state.chartSettings.colorMarker
        },
        set(value) {
            this.setPropInStore('colorMarker',value)
            
        },
    },
    showCrossHair: {
        get() {
            return this.$store.state.chartSettings.showCrossHair
        },
        set(value) {
            this.setPropInStore('showCrossHair',value)
            
        },
    },
    colorCrossHairLine: {
        get() {
            return this.$store.state.chartSettings.colorCrossHairLine
        },
        set(value) {
            this.setPropInStore('colorCrossHairLine',value)
            
        },
    },
    colorCrossHairBox: {
        get() {
            return this.$store.state.chartSettings.colorCrossHairBox
        },
        set(value) {
            this.setPropInStore('colorCrossHairBox',value)
            
        },
    },
    colorCrossHairText: {
        get() {
            return this.$store.state.chartSettings.colorCrossHairText
        },
        set(value) {
            this.setPropInStore('colorCrossHairText',value)
            
        },
    },
    hidePopupModal: {
        get() {
            return this.$store.state.chartSettings.hidePopupModal
        },
        set(value) {
            this.setPropInStore('hidePopupModal',value)
            
        },
    },
    /** @returns {Boolean} */
    isVolumeHidden() {
        return true
    },
}