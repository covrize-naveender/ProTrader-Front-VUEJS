// Extension's controller

import { Utils } from 'trading-vue-js'
import ToolSettings from './ToolSettings.vue'
import store from '@/store'
import { actionsubType, actionType } from '../../utils/action'
export default class Main {
  constructor(tv, dc) {
    this.widgets = {}
    this.tv = tv
    this.dc = dc
  }

  // Listens to all tvjs events, creates new widgets
  update(e) {

    if (e.event === 'grid-mousedown' || e.event === 'remove-all-tools-event') {
      this.removeAllWidgets()
    } else if (e.event === 'line-is-changed') {

      const ref = e.args[0]
      const gridRef = e.args[1]
      const timeFrame = e.args[2]
      const toolId = ref.split('-')[0]
      const type = ref.split('.', 1)?.[0] || 'onchart'
      const tool = this.dc.data[type].find((tool) => tool.id === toolId)



      if (tool) {
        tool.gridRef = gridRef
        tool.timeFrame = timeFrame
        if (tool?.settings?.$uuid && ref && tool?.settings?.$uuid === ref) {

          let newTool = JSON.parse(JSON.stringify(tool))

          const data = JSON.stringify(newTool)
          const pins = (tool?.settings?.p1 && tool?.settings?.p2) ? {
            p1: tool?.settings?.p1,
            p2: tool?.settings?.p2
          } : null

          const payload = {
            newTool,
            data: data,
            ref: ref,
            pointsData: tool?.type == 'TrendLine' || tool?.type == 'HLineTool' ? pins : null,
            type: tool?.type,
          }

          const currentData = store.state.multiDrawingData[this.tv.data.data.chart.chartIndex]?.[ref]
          if (currentData) {


            const currentSettings = JSON.parse(currentData)?.settings
            const newSettings = tool?.settings
            let oldPoints = {};
            let newPoints = {};
            let isPointchanged = false
            Object.keys(currentSettings).forEach(key => {
              if (/^p\d+$/.test(key) || key== 'brushStrokes') {
                oldPoints[key] = currentSettings[key];
                newPoints[key] = newSettings[key];
                if (JSON.stringify(currentSettings[key]) != JSON.stringify(newSettings[key])) {
                  isPointchanged = true
                }
              }
            });
            if (isPointchanged) {
              
              store.dispatch('action/setUndoAction', {
                type: actionsubType.DRAWING_UPDATE,
                actiontype: actionType.DRAWING_ACTION,
                payload: {
                  chartIndex: this.tv.data.data.chart.chartIndex,
                  drawingRef: ref,
                  data: oldPoints
                }
              })
            }
          }
          else {
            store.dispatch('action/setUndoAction', {
              type: actionsubType.DRAWING_ADD,
              actiontype: actionType.DRAWING_ACTION,
              payload: {
                chartIndex: this.tv.data.data.chart.chartIndex,
                drawingRef: ref
              }
            })
          }
          
          store.dispatch('updateDrawing', payload)
        }
      }

      // store.actions.updateDrawing(data)
    } else if (e.event === 'remove-tool') {
      
      store.dispatch('deleteDrawing', { t: this.dc.data.selected, e: 'remove-tool', index: this.tv.data.data.chart.chartIndex }).then((res) => {
        if (res) {

          this.remove_widget(store.state.selectedDrawingID)
          store.commit("SET_DRAWING_ID", "")
          let uuid = e.args[2]?.split('.')
          const type = uuid?.[0] || 'onchart'
          const tool = this.dc.data[type].find((tool) => tool.id === uuid?.[1].split('-')?.[1])
          const isSettingsWindowAlreadyOpened = Object.values(
            this.widgets
          ).find((x) => x.data.tool === tool)
          if (
            isSettingsWindowAlreadyOpened &&
            isSettingsWindowAlreadyOpened.id
          ) {
            this.tv.$delete(this.widgets, isSettingsWindowAlreadyOpened.id)
          } else {
            this.tv.$delete(this.widgets)
          }
          this.dc.data.selected = ""
        }
      })
    } else if (
      e.event ===
      'object-selected' /*|| e.event === 'tool-selected' || e.event === 'drawing-mode-off'*/
    ) {
      let id = `ToolSettings-${Utils.uuid2()}`

      this.removeAllWidgets()
      try {

        const type = e.args[2]?.split('.', 1)?.[0] || 'onchart'
        let toolId = e.args[1]?.replace('_', '')
        toolId = `${type}.${toolId}`
        const toolType = e.args[1].split('_', 1)?.[0]
        const tool = this.dc.data[type].find((tool) => tool.id === toolId)
        const toolByType = this.dc.data[type].find(
          (tool) => tool.type === toolType
        )
        const isSettingsWindowAlreadyOpened = Object.values(this.widgets).find(
          (x) => x.data.tool === tool
        )


        if (isSettingsWindowAlreadyOpened) {
          // this.tv.$delete(this.widgets, isSettingsWindowAlreadyOpened.id)
          return
        }

        const lastSettingsStr = localStorage.getItem('toolSettingsMetaData')
        const lastLocation = lastSettingsStr
          ? JSON.parse(lastSettingsStr)
          : { x: 100, y: 100 }

        //--- show the settings window
        this.tv?.$set(this.widgets, id, {
          id,
          cls: ToolSettings,
          data: {
            tool,
            lastLocation,
            openDialog: tool.settings?.firstRun || false,
          },
        })

        //--- set flag to false, so that the input dialog box won't show up every time
        tool.settings.firstRun = false
      } catch (e) {
      }
    }
  }

  removeAllWidgets() {

    Object.values(this.widgets).forEach((tool) => {
      this.tv.$delete(this.widgets, tool.id)
    })
  }

  remove_widget(id) {

    // debugger

    this.tv.$delete(this.widgets, id)
  }
  // drag_update(){
  // }
}
