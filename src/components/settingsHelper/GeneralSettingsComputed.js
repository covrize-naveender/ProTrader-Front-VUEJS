export default {
    chartLineColor: {
        get() {
            let lineColor = this.$store.state.userData.generalSettings.chart.lineColor.value
            return lineColor
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{lineColor:{value}})
        },
    },
    chartSideColor: {
        get() {
            return this.$store.state.userData.generalSettings.chart.sideColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{sideColor:{value}})
        },
    },
    chartUpColor: {
        get() {
            return this.$store.state.userData.generalSettings.chart.upColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{upColor:{value}})
        },
    },
    chartDownColor: {
        get() {
            return this.$store.state.userData.generalSettings.chart.downColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{downColor:{value}})
        },
    },
    chartBarChange: {
        get() {
            return this.$store.state.userData.generalSettings.chart.barChange.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{barChange:{value}})
        },
    },
    chartSemiLogAxis: {
        get() {
            return this.$store.state.userData.generalSettings.chart.semiLogAxis.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{semiLogAxis:{value}})
        },
    },
    chartVolumeColor: {
        get() {
            return this.$store.state.userData.generalSettings.chart.volumeColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{volumeColor:{value}})
        },
    },
    chartUpColorVolume: {
        get() {
            return this.$store.state.userData.generalSettings.chart.upColorVolume.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{upColorVolume:{value}})
        },
    },
    chartDownColorVolume: {
        get() {
            return this.$store.state.userData.generalSettings.chart.downColorVolume.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{downColorVolume:{value}})
        },
    },
    chartBarChangeVolume: {
        get() {
            return this.$store.state.userData.generalSettings.chart.barChangeVolume.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{barChangeVolume:{value}})
        },
    },
    chartObvColor: {
        get() {
            return this.$store.state.userData.generalSettings.chart.obvColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CHART_GENERAL_SETTINGS',{obvColor:{value}})
        },
    },
    crossHairEnabled: {
        get() {
            return this.$store.state.userData.generalSettings.crossHair.enabled.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CROSSHAIR_GENERAL_SETTINGS',{enabled:{value}})
        },
    },
    crossHairLineColor: {
        get() {
            return this.$store.state.userData.generalSettings.crossHair.lineColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CROSSHAIR_GENERAL_SETTINGS',{lineColor:{value}})
        },
    },
    crossHairBoxColor: {
        get() {
            return this.$store.state.userData.generalSettings.crossHair.boxColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CROSSHAIR_GENERAL_SETTINGS',{boxColor:{value}})
        },
    },
    crossHairTextColor: {
        get() {
            return this.$store.state.userData.generalSettings.crossHair.textColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_CROSSHAIR_GENERAL_SETTINGS',{textColor:{value}})
        },
    },
    markerEnabled: {
        get() {
            return this.$store.state.userData.generalSettings.marker.enabled.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_MARKER_GENERAL_SETTINGS',{enabled:{value}})
        },
    },
    markerLineColor: {
        get() {
            return this.$store.state.userData.generalSettings.marker.lineColor.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_MARKER_GENERAL_SETTINGS',{lineColor:{value}})
        },
    },
    markerHidePopup: {
        get() {
            return this.$store.state.userData.generalSettings.misc.hidePopup.value
        },
        set(value) {
            this.changesNotSaved = true;
            this.$store.commit('SET_MISC_GENERAL_SETTINGS',{hidePopup:{value}})
        },
    },
}