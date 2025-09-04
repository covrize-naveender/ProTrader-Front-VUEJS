import { mapGetters, mapActions } from "vuex";
import { copy as copyObject } from "../utils";
import { Utils } from "trading-vue-js";

export default {
    methods: {
        ...mapActions([]),
        findGridId(ref, self) {
            let gid = 0;
            let findVal = false;

            for (const gldcKey in self.chart.gldc) {
                if (gldcKey.startsWith("g0")) {
                    continue;
                }
                let cid = self.chart.gldc[gldcKey];
                if (ref === cid) {
                    gid++;
                    findVal = true;
                    break;
                } else {
                    gid++;
                }
            }
            return findVal ? gid : -1;
        },
        addingChartDrawings(e, self) {
            let ref = `${e.side}.${e.type}0`;
            let currentId = this.findGridId(ref, self);
            let chartIndex = self.chart.data.chart.chartIndex;
            if (currentId > -1 && this.drawingDataList[chartIndex]?.length) {
                let drawingData = this.drawingDataList[chartIndex].filter(f => f.gridRef === e.type);

                if (drawingData.length) {
                    for (const drawingDatum of drawingData) {
                        if (drawingDatum.settings && drawingDatum.settings.$selected) {
                            drawingDatum.settings.$selected = false;
                        }
                        drawingDatum.grid.id = currentId;
                        drawingDatum.settings.gridRef = drawingDatum.gridRef;
                        self.chart.data.offchart.push(drawingDatum);
                    }
                }
            }
        },
        updateChartDrawings(symbolDrawingDataArr) {
            if (this.chart && this.chart.data && symbolDrawingDataArr?.length > 0) {
                let chartIndex = this.chart.data.chart.chartIndex;
                let symbolDrawingData = symbolDrawingDataArr[chartIndex];
                let drawingDataList = [];
                for (let dataRef in symbolDrawingData) {
                    let settings = JSON.parse(symbolDrawingData[dataRef]);
                    const toolId = dataRef.split('-')[0];
                    let type = dataRef.split('.', 1)?.[0];

                    const tool = this.chart.data[type].find(
                        (tool) => tool.id === toolId
                    );
                    drawingDataList.push(settings);
                    let drawIt = true;
                    let gridData;
                    let gridCurrentId;
                    if (type === 'offchart') {
                        let offChartGridId = `${type}.${settings.gridRef}`;
                        gridData = this.chart.get(offChartGridId);
                        gridCurrentId = this.findGridId(`${offChartGridId + '0'}`, this);
                        drawIt = gridData.some(d => !d.scanResults);
                    }

                    if (!tool && drawIt) {
                        if (settings && settings.settings && settings.settings.$selected) {
                            settings.settings.$selected = false;
                            settings.settings['gridRef'] = settings.gridRef;
                        }
                        settings['gridRef'] = settings.gridRef;

                        const p1 = settings?.settings?.p1;
                        const p2 = settings?.settings?.p2;
                        const p3 = settings?.settings?.p3;
                        const brushStrokes = settings?.settings?.brushStrokes;
                        const tiMap = this.multiTv[chartIndex]?.$refs?.chart?.ti_map;

                        if (tiMap && brushStrokes && brushStrokes?.length >= 0 && this.timeFrame != settings?.timeFrame) {
                            for (let i = 0; i < brushStrokes.length; i++) {
                                const element = brushStrokes[i];
                                if (tiMap && element && element?.length >= 2) {
                                    let calculateDataIndexWithoutTiMap = Utils.calculate_data_index_without_ti_map(this.ohlcvTimeMap[chartIndex], element?.[2]);
                                    settings.settings.brushStrokes[i] = [calculateDataIndexWithoutTiMap?.index, element[1], element[2]];
                                }
                            }
                        }
                        if (tiMap && p1 && p1?.length >= 2) {
                            let calculateDataIndexWithoutTiMap = Utils.calculate_data_index_without_ti_map(this.ohlcvTimeMap[chartIndex], p1?.[2]);
                            settings.settings.p1 = [calculateDataIndexWithoutTiMap?.index, p1[1], p1[2]];
                        }
                        if (tiMap && p2 && p2?.length >= 2) {
                            let calculateDataIndexWithoutTiMap2 = Utils.calculate_data_index_without_ti_map(this.ohlcvTimeMap[chartIndex], p2?.[2]);
                            settings.settings.p2 = [calculateDataIndexWithoutTiMap2?.index, p2[1], p2[2]];
                        }
                        if (tiMap && p3 && p3?.length >= 2) {
                            let calculateDataIndexWithoutTiMap3 = Utils.calculate_data_index_without_ti_map(this.ohlcvTimeMap[chartIndex], p3?.[2]);
                            settings.settings.p3 = [calculateDataIndexWithoutTiMap3?.index, p3[1], p3[2]];
                        }

                        settings['timeFrame'] = settings.timeFrame;
                        settings['saveTimeFrame'] = settings.timeFrame;
                        if (settings?.modeId)
                            settings['modeId'] = settings.modeId;

                        let copy = copyObject(settings);

                        if (type === 'offchart') {
                            copy.grid.id = gridCurrentId;
                        }
                        copy.settings.$selected = false;
                        copy.settings.timeFrame = settings.timeFrame;
                        copy.settings.$state = 'finished';
                        this.multiTv[chartIndex].data.add(type, copy);
                    }
                }

                this.$store.commit('UPDATE_USER_DRAWING_LIST', { index: chartIndex, drawingDataList: drawingDataList });
            }
        }
    },
    computed: {
        ...mapGetters(["ohlcvTimeMap", "drawingData", "drawingDataList", "timeFrame", "tv", "multiDrawingData", "multiTv"])
    },
    watch: {
        multiDrawingData: {
            async handler(symbolDrawingDataArr) {

                this.updateChartDrawings(symbolDrawingDataArr);
            },
            deep: true
        },
    }
};
