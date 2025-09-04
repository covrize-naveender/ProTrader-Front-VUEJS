import { mapGetters } from 'vuex'
import { Utils } from 'trading-vue-js'

export default {
    data(){
        return {
            settingsJson:'',
            gridRef:'',
            timeFrameData:"",
            saveTimeFrame:"",
        }
    },
    methods:{
        registerMouseEvent(self){
            self.mouse.on('mouseup',(e)=>{
                this.saveSettings(self)
            })
        },
        saveSettings(self){

            let uid = self.$props.settings.$uuid

            if("finished" === self.$props.settings.$state){
                let currentSettings = self.$props.settings;
                if(!self.$props.settings?.drawingId){
                    let uuidGenerated = Utils.uuid2()
                    self.$props.settings.drawingId = uuidGenerated
                }
                let {$selected, ...currentSettingsData} = currentSettings;
                let currentSettingsJson = JSON.stringify(currentSettingsData)
                let changeOccurs = false
                if (currentSettingsJson !== self.settingsJson) {
                    changeOccurs = true
                    self.settingsJson = currentSettingsJson
                }
                if(changeOccurs){
                    self.timeFrameData =this.timeFrame
                    self.$emit('line-is-changed',uid,self.gridRef,self.timeFrameData)
                }
            }
        },
        updateSettingsState(self,trn){
            try{
                
                let settings = self.$props.settings;
                // let gridId = self.$props.grid_id
                // let uuid = settings.$uuid
                // let typeData = uuid.split(".",1)[0]
                // let gridType =
                if(
                    (settings.p1 && settings.p1[0] === 0)
                ){
                    self.p1[0] = self.layout.ti_map.t2i(self.p1[2])
                }
                if((settings.p2 && settings.p2[0] === 0)){
                    /*const p2Node = Math.round( self.layout.ti_map.t2i(self.p2[2]))
                    if(this.p2[0] !== p2Node){
                        self.p2[0] = p2Node
                    }*/
                    self.p2[0] = self.layout.ti_map.t2i(self.p2[2])
                }
                if((settings.p3 && settings.p3[0] === 0)){
                    /*const p3Node = Math.round( self.layout.ti_map.t2i(self.p3[2]))
                    if(this.p3[0] !== p3Node){
                        self.p3[0] = p3Node
                    }*/
                    self.p3[0] = self.layout.ti_map.t2i(self.p3[2])
                }
                let gridRef = settings.gridRef;
                if(self.$props.grid_id && !gridRef && self.$props.cursor && self.$props.cursor.values && Object.keys(self.$props.cursor.values).length > 0){
                    let gridValues = Object.keys(self.$props.cursor.values[self.$props.grid_id])
                    for (let gridValue of gridValues) {
                        if(gridValue !== "ohlcv"){
                            gridRef = gridValue.split("_")[0]
                            break;
                        }
                    }
                }

                // let chartData = this.dc.data[typeData]
                let {$selected, ...settingsJson} = settings;
                self.settingsJson = JSON.stringify(settingsJson)
                self.gridRef = gridRef
                self.timeFrameData = this.timeFrame
                return true
            }catch (e) {
                return false
            }
        },
    },
    created() {
    },
    computed:{
        ...mapGetters(['timeFrame',"drawingDataSaveSettings"]),
        uuidData() {
            return `${this.sett?.$uuid}`
        },
        savedSettings(){
            return this.drawingDataSaveSettings[this.uuidData]
        },
    }
}
