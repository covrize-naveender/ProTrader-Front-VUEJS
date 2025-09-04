
// Extension's controller

import { Utils } from 'trading-vue-js'
import SettingsWin from './SettingsWin.vue'
import store from "../../store";
import Vue from 'vue'

export default class Main {

    constructor(tv, dc) {
        this.widgets = {}
        this.tv = tv
        this.dc = dc
    }

    // Listens to all tvjs events, creates new widgets
    update(e) {
        
        switch(e.event) {
            case 'legend-button-click':
                let args = e.args[0]
                let id = `${args?.type}.${args?.overlay?.replaceAll('_','')}-SettingsWin`
                if (!args.button.includes("settings")) break
                try {
                    
                    if(args.button === 'settings'){
                        let ov = this.dc.data[args.type][args.dataIndex]
                        let f = Object.values(this.widgets)
                            .find(x => x.data.ov === ov)
                        if(f) {
                            this.tv.$delete(this.widgets, f.id)
                            break
                        }
                        this.tv.$set(this.widgets, id, {
                            id, cls: SettingsWin, data: { ov: ov }
                        })
                    }else if(args.button === 'main_settings'){
                        
                        
                        store.commit('MAIN_CHART_PROPS',true)
                    }
                    
                } catch(e) {
                }
                break
            case 'remove-settings-popup':
                let widgetData = e.args?.[0]
                let idsToRemove = e.args?.[1]
                
                if(widgetData && widgetData.length){
                    for (const ids of widgetData) {
                        
                        // this.tv.$delete(this.widgets, ids)
                        if(widgetData.includes(ids)){
                           this.tv.$delete(this.widgets, ids)
                        }
                    }
                }
        }
    }

    remove_widget(id) {
        this.tv.$delete(this.widgets, id)
    }

}
