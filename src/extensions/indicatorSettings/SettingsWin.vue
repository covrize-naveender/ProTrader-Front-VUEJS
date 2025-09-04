<template>
  <window :title="data.ov.name" class="sett-win" :tv="tv" @close="on_close">
    <div v-for="k in settlist" class="sett-win-item" :key="k">
      <label>{{ s2d(k) }}</label>
      <std-input :value="sett[k]" @input="update_sett(k, $event)" :type="getType(k)" :step="getStep(k)" />
    </div>

    <div v-for="k in styleSettings" class="sett-win-item" :key="k">
      <label>{{ s2d(k).replace(' Enable', '') }}</label>
      <std-input :value="sett[k]" @input="update_sett(k, $event)" :type="getType(k)" :step="getStep(k)" />
    </div>


    <div v-for="(k, i) in groupSettings" :key="i" class="sett-win-item p-d-flex p-ai-center p-jc-between">
      <div>

        <label>{{ s2d(k).replace(' Group', '') }}</label>
      </div>
      <div class="p-d-flex p-ai-center">

        <div v-for="(keys, index) in Object.keys(sett[k])" :key="index">
          <!-- {{  sett[k][keys] }} -->
          <std-input :value="sett[k][keys]" @input="update_sett_grp(k, keys, $event)" :type="getType(keys)"
            :step="getStep(keys)" :classGrp="true" />
        </div>
      </div>
      <!-- {{ Object.keys(sett[k]) }} -->

    </div>
    <span v-if="!settlist.length && !styleSettings.length" class="sett-win-empty">
      <i>No settings</i>
    </span>
  </window>
</template>
<script>
import Window from '../shared/Window.vue'
import StdInput from '../shared/StdInput.vue'
import Utils from './utils.js'

export default {
  name: 'SettingsWin',
  components: { Window, StdInput },
  props: ['id', 'main', 'dc', 'tv', 'data'],
  computed: {
    sett() {

      return this.$props.data.ov.settings
    },
    settlist() {
      return Object.keys(this.sett).filter(
        x => x[0] !== '$' && this.sett.$props && this.sett.$props.includes(x)
      )
    },
    styleSettings() {

      return Object.keys(this.sett).filter(
        x => x[0] !== '$' && x.match(/(color|width|enable)/i) != null
      )
    },
    groupSettings() {
      let dataList = Object.keys(this.sett).filter(
        x => x[0] !== '$' && x.match(/(group)/i) != null
      )
      return dataList

    }
  },
  mounted() { },
  methods: {
    getType(field) {
      if (field.match(/color/i) != null) return 'color'
      if (field.match(/(period|length|width)/i) != null) return 'number'
      if (field.match(/(enable)/i) != null) return 'bool'
      return 'number'
    },
    getStep(field) {
      // if (field.match(/width/i) != null) return 0.25
      return 1
    },
    s2d(str) {
      return Utils.sett2desc(str)
    },
    on_close() {
      this.$props.main.remove_widget(this.$props.id)
    },
    update_sett(k, val) {
      let dcid = this.$props.data.ov.id

      let valN = parseFloat(val)
      if (valN !== valN) valN = val

      this.$props.dc.merge(`${dcid}.settings`, { [k]: valN })
    },
    update_sett_grp(grp, k, val) {
      
      let dcid = this.$props.data.ov.id
      
      let valN = parseFloat(val)
      if (valN !== valN) valN = val
      let grpVal = this.sett[grp]
      grpVal[k] = val
      this.$props.dc.merge(`${dcid}.settings`, { [grp]: grpVal })
    }
  }
}
</script>
<style scoped>
.tvjs-x-window.sett-win {
  padding-bottom: 30px;
}

.sett-win-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-content: center;
  align-items: center;
}

.sett-win-item label {
  min-width: 80px;
}

.sett-win-empty {
  opacity: 0.5;
}
</style>
