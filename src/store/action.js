import {
    updateDrawingDataV2,
    updateDrawingDataV1,
} from '@/services/drawing'
import { actionsubType, indicatorParam } from '../utils/action';
import { Utils } from 'trading-vue-js'
export default {
    namespaced: true,
    state: () => ({
        undoActionStore: [],
        redoActionStore: [],
        currentUndoValue: null,
        currentRef: null,
    }),
    mutations: {
        SET_UNDO_ACTION(state, payload) {
            if (state.undoActionStore.length >= 5) {
                state.undoActionStore.shift()
            }
            state.undoActionStore.push(payload)
        },
        SET_REDO_ACTION(state, payload) {
            state.redoActionStore.push(payload);
        },
        REMOVE_LAST_UNDO(state) {
            state.undoActionStore.pop();
        },
        SET_CURRENT_UNDO(state, payload) {
            state.currentUndoValue = payload
        },
        SET_CURRENT_REF(state, payload) {
            state.currentRef = payload
        },
        UPDATE_DRAWING_REF_MANY(state, payload) {
            state.undoActionStore.map((item, index) => {
                let newRefObj = payload.find(x => x.oldVal == item.payload?.drawingRef)
                if (newRefObj) {
                    state.undoActionStore[index].payload.drawingRef = newRefObj.newVal
                }
            })

        },
        UPDATE_DRAWING_REF(state, payload) {
            state.undoActionStore.map((item, index) => {
                if (item.payload?.drawingRef == payload.oldVal) {
                    state.undoActionStore[index].payload.drawingRef = payload.newVal
                }
            })

        },
        RESET_ACTIONS(state) {
            state.undoActionStore = []
            state.redoActionStore = []
        }
    },
    actions: {
        setUndoAction(context, val) {

            context.commit('SET_UNDO_ACTION', val)
        },
        resetActions(context) {
            context.commit("RESET_ACTIONS")
        },
        async onUndoSelect(context) {
            if (context.state.undoActionStore.length > 0) {

                const lastAction = context.state.undoActionStore[context.state.undoActionStore.length - 1];
                const payload = lastAction.payload

                if (lastAction.type == actionsubType.DRAWING_UPDATE) {
                    context.commit('SET_CURRENT_REF', payload)
                    context.commit('SET_CURRENT_UNDO', payload.data)
                    let undoVal = context.rootGetters.multiTv[payload.chartIndex]?.data.get_one(payload.drawingRef)?.settings?.undo
                    let newUndo = undoVal ? undoVal + 1 : 1
                    context.rootGetters.multiTv[payload.chartIndex]?.data.merge(payload.drawingRef + '.settings', {
                        undo: newUndo
                    })

                }
                else if (lastAction.type == actionsubType.DRAWING_PARAM_UPDATE) {

                    context.rootGetters.multiTv[payload.chartIndex]?.data.merge(payload.drawingRef + '.settings', payload.data)


                    context.dispatch('saveUndoAction', {
                        chartIndex: payload.chartIndex,
                        val: payload.drawingRef,
                        data: payload.data
                    })
                }
                else if (lastAction.type == actionsubType.DRAWING_ADD) {
                    let res = await context.dispatch('deleteDrawing', { t: payload.drawingRef, e: 'onRemoveTool', index: payload.chartIndex, isUndoAction: true }, { root: true });
                    if (res) {
                        let chartDc = context.rootState.multiDc[payload.chartIndex]
                        
                        chartDc.tv.custom_event({
                            event: 'remove-all-tools-event',
                            args: []
                        })
                        
                    }


                }
                else if (lastAction.type == actionsubType.DRAWING_REMOVE) {
                    let newRef
                    let newObj
                    let updatedArr = context.rootGetters.multiDrawingData.map((item, index) => {
                        if (index == payload.chartIndex) {
                            let newIndex = Object.keys(item).length

                            let timeStamp = Utils.now()
                            let newDrawingData = JSON.parse(payload.data)
                            let _chartType = newDrawingData.id.split('.')[0]

                            newDrawingData.name = `${newDrawingData.type} ${newIndex}`
                            newDrawingData.id = `${_chartType}.${newDrawingData.type}${newIndex}`
                            newDrawingData.settings.$uuid = `${_chartType}.${newDrawingData.type}${newIndex}-${timeStamp}`

                            item[newDrawingData.settings.$uuid] = JSON.stringify(newDrawingData)
                            newRef = newDrawingData.settings.$uuid
                            newObj = newDrawingData
                            return item
                        }
                        return item
                    });

                    context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', updatedArr, { root: true })
                    context.commit('UPDATE_DRAWING_REF', {
                        oldVal: payload.drawingRef,
                        newVal: newRef
                    })

                    context.dispatch('saveUndoDrawing', {
                        chartIndex: payload.chartIndex,
                        data: newObj
                    })

                }

                else if (lastAction.type == actionsubType.DRAWING_REMOVE_ALL) {
                    if (payload.length > 0) {
                        let drawingRefs = []
                        let newObj
                        let counter = {}
                        let updateArr = payload.map((item, index) => {
                            let drawingObj = JSON.parse(JSON.stringify(context.rootGetters.multiDrawingData[item.chartIndex]))
                            Object.keys(item.drawingData).map((key, i) => {

                                let timeStamp = Utils.now()
                                let newDrawingData = JSON.parse(item.drawingData[key])
                                let _chartType = newDrawingData.id.split('.')[0]
                                let drawingType = newDrawingData.type

                                if (counter[drawingType] != undefined) {
                                    counter[drawingType] = counter[drawingType] + 1
                                }
                                else {
                                    counter[drawingType] = 0
                                }
                                newDrawingData.name = `${drawingType} ${counter[drawingType]}`
                                newDrawingData.id = `${_chartType}.${drawingType}${counter[drawingType]}`
                                newDrawingData.settings.$uuid = `${_chartType}.${drawingType}${counter[drawingType]}-${timeStamp}`
                                drawingObj[newDrawingData.settings.$uuid] = JSON.stringify(newDrawingData)

                                if (!drawingRefs.find(x => x.oldVal == key)) {

                                    drawingRefs.push({
                                        oldVal: key,
                                        newVal: newDrawingData.settings.$uuid
                                    })
                                }

                            })
                            if (index == 0) {
                                newObj = drawingObj
                            }
                            return drawingObj
                        })

                        context.commit('UPDATE_USER_DRAWING_TOOLS_MULTI', updateArr, { root: true })
                        context.dispatch('changeDrawingRef', drawingRefs)
                        context.dispatch('saveUndoAllDrawing', {
                            chartIndex: 0,
                            data: newObj
                        })
                        // newObj.map((obj)=>{

                        // })
                    }

                }

                else if (lastAction.type == actionsubType.INDICATOR_UPDATE) {
                    // if (payload.overlaySettings?.length > 0) {
                    //     payload.overlaySettings.map((item, index) => {
                    //         if (item.type == indicatorParam.SINGLE_INDICATOR) {
                    //             context.commit('SET_INDICATOR_SETTINGS_SINGLE', { [item.overlay]: item.overlayValue }, { root: true })
                    //         }
                    //         else if (item.type == indicatorParam.MULTI_VALUE_INDICATOR) {
                    //             context.commit('SET_INDICATOR_MULTI_SETTINGS', { [item.overlay]: item.overlayValue }, { root: true })
                    //         }
                    //         else if (item.type == indicatorParam.ADDITIONAL_INDICATOR) {
                    //             context.commit('SET_INDICATOR_SETTINGS_ADDITIONAL', { [item.overlay]: item.overlayValue }, { root: true })
                    //         }
                    //     })
                    //     let res = await context.dispatch('saveUserSettings', { root: true })
                    //     if (res) {

                    //         context.commit('USER_SET_UPDATE_CHARTS', payload.overlaySettings.map(x => x.overlay), { root: true })
                    //     }

                    // }
                    if (payload.overlayData?.length > 0) {
                        payload.overlayData.map((item, index) => {
                            item.isAdd = !item.isAdd
                            item.isRemove = !item.isRemove
                            return item
                        })
                        context.dispatch('processChartList', {
                            editedList: payload.overlayData,
                            isUndoAction: true
                        }, { root: true })
                    }

                }




                context.commit('SET_REDO_ACTION', payload);
                context.commit('REMOVE_LAST_UNDO');

            }
        },
        saveUndoAction(context, payload) {

            const xx = context.rootGetters.multiTv[payload.chartIndex]?.data.get_one(payload.val)

            if ((context.rootGetters.getLayout == '1tab' || context.rootGetters.isFullScreen) && xx) {
                updateDrawingDataV2({
                    data: {
                        data: JSON.stringify(xx),
                        modeId: xx.settings?.$uuid
                        // modeId:xx.settings.modeId, 
                    }, userId: context.rootGetters.getUserId, symbolName: context.rootGetters.multiChartSymbol[payload.chartIndex]?.symbol,
                })
                if (payload.data) {
                    context.rootGetters.multiDrawingData.map((item, index) => {
                        if (index == payload.chartIndex) {
                            let changedObj = item[payload.val]
                            if (changedObj) {
                                let oldObj = JSON.parse(changedObj)
                                let updatedSettings = { ...JSON.parse(changedObj).settings, ...payload.data }
                                oldObj.settings = updatedSettings

                                item[payload.val] = JSON.stringify(oldObj)
                            }
                            // return item
                        }
                        // return item
                    });
                }

            }
        },

        saveUndoDrawing(context, payload) {

            const xx = payload.data

            if ((context.rootGetters.getLayout == '1tab' || context.rootGetters.isFullScreen) && xx) {
                updateDrawingDataV2({
                    data: {
                        data: JSON.stringify(xx),
                        modeId: xx.settings?.$uuid
                        // modeId:xx.settings.modeId
                    }, userId: context.rootGetters.getUserId, symbolName: context.rootGetters.multiChartSymbol[payload.chartIndex]?.symbol,
                })
            }
        },
        async saveUndoAllDrawing(context, payload) {
            await updateDrawingDataV1({
                data: payload.data,
                symbolName: context.rootGetters.multiChartSymbol[payload.chartIndex]?.symbol,
                userId: context.rootGetters.getUserId
            })
        },

        changeDrawingRef(context, payload) {
            context.commit('UPDATE_DRAWING_REF_MANY', payload);
        }
    },
    getters: {
        undoActionStore: (state) => state.undoActionStore,
        redoActionStore: (state) => state.redoActionStore,
        currentUndoValue: (state) => state.currentUndoValue,
        currentRef: (state) => state.currentRef,
    },
}
