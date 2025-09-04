<template>
  <p-dialog class="small-dialog" header="Save Layout" :visible.sync="visible" @hide="onClose" :modal="true" >
    <div v-if="getTabCount == 1">
      <h4>Please use multi screen to save template.</h4>

    </div>
    <div class="p-d-flex p-ai-center p-flex-column p-mr-3 p-ml-3" v-else>
      Please enter a name for saving layout:
      <p-inputText type="text" v-model="layoutName" @keypress.enter="addLayout" class="save-layout-input" />
      <div style="color: red;" v-if="errorMsg">
        {{ errorMsg }}
      </div>
      <div style="color: red;" v-if="resError">
        {{ resError }}
      </div>

    </div>
    <template #footer>
      <p-button label="Ok" v-if="getTabCount == 1" class="p-button-secondary" @click="onClose"/>
      <p-button label="Save" v-if="getTabCount !== 1" @click="addLayout"
        :disabled="!(layoutName && layoutName.trim()) || errorMsg.length > 0 || showLoader" />
      <p-button label="Cancel" :disabled="showLoader" v-if="getTabCount !== 1" @click="onClose"
        class="p-button-secondary" />
    </template>
  </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SaveLayoutModal',
  computed: {
    ...mapGetters([
      'themeSecondaryColor',
      'themeDarkMode',
      'getLayout',
      'getTabCount'
    ]),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {
      layoutName: '',
      showLoader: false,
      errorMsg: '',
      resError: ''
    }
  },
  methods: {
    ...mapActions([
      'saveLayout',
    ]),
    async addLayout(event) {
      event.preventDefault();
      this.showLoader = true
      if (!(this.layoutName && this.layoutName.trim())) return;
      if (this.layoutName.length) {
        let layoutName = this.layoutName
        const res = await this.saveLayout(layoutName)
        if (res?.isError) {
          this.layoutName = ""
          this.showLoader = false
          this.resError = res.data
        } else {
          this.layoutName = ""
          this.showLoader = false
          this.$store.commit('LAYOUT_POPUP', false)
        }
      }
    },
    onClose() {
      this.layoutName = ''
      this.$store.commit('LAYOUT_POPUP', false)
    }
  },
  watch: {
    layoutName(n, o) {
      if (n.length > 8) {
        this.errorMsg = 'Name cannot exceed 8 characters.'
      }
      else {
        this.errorMsg = ''
      }
    }
  }
}
</script>

<style scoped>
/* .Favourite-Popup {
    height: 200px;
    width: 350px;
    box-shadow: 0px 0.2px 20px 2px #afa7a7;
    z-index: 106;
    background-color: #ffffff;
    position: relative;
    top: 10px;
  }
  
  .popup-firstChild {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60%;
    width: 100%;
  
    padding-bottom: 10px;
    box-sizing: border-box;
  }
  
  .popup-secondChild {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    height: 40%;
    width: 100%;
    padding: 8px 13px;
    gap: 4px;
  }
  
  input {
    width: 80%;
    height: 30%;
    border: none;
    border-radius: 3px;
    box-shadow: inset 0px 0.2px 1.2px 1.5px #dddddd;
  } */
.save-layout-input.p-inputtext {
  width: 80%;
  margin: 0.5rem 0;
}
</style>