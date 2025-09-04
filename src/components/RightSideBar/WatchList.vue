<template>
  <div class="side-bar-cardStyle" id="watchlist">
    <div class="p-d-flex p-jc-between">
      <span class="right-tool-title-text" :style="themeFontColor">
        Watchlist</span>
      <AutoPlay :disablePlayBackward="!(watchListsData.length > 0) || autoPlayWatch || stopBackwardWatchList"
        :disablePlayForward="!(watchListsData.length > 0) || autoPlayWatch || stopForwardWatchList"
        :disableSpeed="!(watchListsData.length > 0)" :disablePause="!(watchListsData.length > 0) || !autoPlayWatch"
        @startAutoPlay="startAutoPlay" @stopAutoPlay="stopAutoPlay" :isAutoPlay="autoPlayWatch"
        :currentSpeed="playbackSpeed" @speedChange="handleSpeedChange" />
    </div>

    <div class="watch-result-first">
      <p-dropdown placeholder="--NONE--" v-if="watchLists.length === 0" :disabled="true" />
      <p-dropdown v-model="selectedWatchLocal" :options="watchLists.map((w, i) => ({ name: w.name, value: i }))"
        optionLabel="name" optionValue="value" name="watchListData" id="watchListData" v-else />
      <p-button icon="pi pi-list" class="p-button-secondary p-button-light" @click="toggleWatchlist" />
      <p-menu ref="watchlistMenu" :model="watchlistMenu" :popup="true" appendTo="body" />
    </div>

    <div class="watch-result-second">
      <p-dropdown placeholder="--NONE--" v-if="watchLists.length === 0" :disabled="true" />

      <p-dropdown v-model="selectedWatchCodeLocal" :options="watchListsData
        ? watchListsData.map((w, i) => ({ name: w.name, value: i }))
        : []
        " optionLabel="name" optionValue="value" name="watchListDataIndex" id="watchListDataIndex" v-else />

      <p-button class="p-button-secondary" icon="pi pi-angle-left" :disabled="stopBackwardWatchList"
        @click="goBackward" />

      <p-button class="p-button-secondary" icon="pi pi-angle-right" :disabled="stopForwardWatchList"
        @click="goForward" />

      <p-button class="p-button-secondary" icon="pi pi-plus"
        :disabled="selectedWatchData == null || isCurrentNodeAlreadyExist" @click="addCurrentCode()" />
      <p-button class="p-button-secondary" icon="pi pi-minus"
        :disabled="selectedWatchData == null || !isCurrentNodeAlreadyExist || watchListsData.length === 0"
        @click="removeCurrentCode()" />
    </div>

    <!-- Modals -->
    <!----------------------- Create Watchlist Dialog ----------------------->
    <CreateWatchlistModal :visible.sync="showWatchesModal" :showLoader="showLoader" :duplicationError="duplicationError"
      @createWatches="createWatches" @toggleModal="toggleWatchesModalInner" />

    <!----------------------- Rename Watchlist Dialog ----------------------->
    <RenameWatchlistModal :visible.sync="showWatchRenameModal" :showLoader="showLoader" :newWatchName="newWatchName"
      @renameWatch="renameWatch" :duplicationError="duplicationError" @toggleModal="toggleWatchesRenameModalInner" />

    <!----------------------- Delete Watchlist Dialog ----------------------->
    <DeleteWatchlistModal :visible.sync="showWatchesDeleteModal" :showLoader="showLoader"
      :deleteWatchName="deleteWatchName" @deleteWatches="deleteWatches" @toggleModal="toggleWatchesDeleteModalInner" />

    <!----------------------- Import Watchlist Dialog ----------------------->
    <ImportWatchlistModal ref="importWatchRef" :visible.sync="showWatchesImportModal" :showLoader="showLoader"
      :duplicationError="duplicationError" :createWatches="createWatchesFromImport"
      :toggleWatchesModalInner="toggleImportWatchesModalInner" @toggleModal="toggleImportDirect" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { handleButtonClick } from '../../handleRestrictFeature'
import { saveAs } from 'file-saver'
import CreateWatchlistModal from 'Components/Modals/watches/CreateWatchlistModal.vue'
import RenameWatchlistModal from 'Components/Modals/watches/RenameWatchlistModal.vue'
import ImportWatchlistModal from 'Components/Modals/watches/ImportWatchlistModal.vue'
import DeleteWatchlistModal from 'Components/Modals/watches/DeleteWatchlistModal.vue'
import AutoPlay from './AutoPlay.vue'

export default {
  name: 'WatchList',
  data() {
    return {
      showLoader: false,
      duplicationError: false,
      newWatchName: '',

      playInterval: null,
      directionForward: true,
      playbackSpeed: 1
    }
  },
  components: {
    CreateWatchlistModal,
    RenameWatchlistModal,
    ImportWatchlistModal,
    DeleteWatchlistModal,
    AutoPlay
  },
  computed: {
    ...mapGetters([
      'themeFontColor',
      'watchLists',
      'selectedWatchCode',
      'selectedWatchSymbolCode',
      'watchListsData',
      'selectedWatch',
      'selectedTab',
      'multiChartSymbol',
      'selectedWatchData',
      'getMarketId',
      'showWatchesModal',
      'scanCopyBtn',
      'scanResults',
      'showWatchRenameModal',
      'showWatchesDeleteModal',
      'showWatchesImportModal',
      'isTrainingMode'
    ]),
    ...mapGetters('autoplay', [
      'autoPlayWatch',
      'autoPlaySpeedWatch'
    ]),
    playSpeed() {
      return this.autoPlaySpeedWatch;
    },
    selectedWatchLocal: {
      get() {
        return this.selectedWatchCode
      },
      set(value) {
        this.setSelectedWatch(value)
        this.selectedWatchCodeLocal = -1
      },
    },
    selectedWatchCodeLocal: {
      get() {
        return this.selectedWatchSymbolCode
      },
      set(value) {
        if (
          value !== -1 &&
          this.watchListsData[value] &&
          this.watchListsData[value].name
        )
          this.setSelectedWatchCode({
            id: value,
            name: this.watchListsData[value].name,
          })
      },
    },
    stopForwardWatchList() {
      return (
        this.selectedWatchData == null ||
        this.selectedWatchCodeLocal === this.watchListsData.length ||
        this.selectedWatchCodeLocal + 1 === this.watchListsData.length
      )
    },
    stopBackwardWatchList() {
      return (
        this.selectedWatchData == null ||
        this.selectedWatchCodeLocal === 0 ||
        this.selectedWatchCodeLocal === -1
      )
    },
    getSymbolName() {
      return this.multiChartSymbol?.[this.selectedTab]?.symbol
    },
    isCurrentNodeAlreadyExist() {
      if (this.watchListsData.length) {
        let filter = this.watchListsData.filter(
          (f) => f.name === this.getSymbolName
        )
        return filter.length > 0
      }
      return false
    },
    watchlistMenu() {
      return [
        {
          label: 'Create',
          visible: true,
          command: () => {
            this.handleButtonClick(this.showCreateWatchList)
          },
        },
        {
          label: 'Rename',
          visible: this.selectedWatch.length > 0,
          command: () => {
            this.handleButtonClick(this.showCreateWatchRename)
          },
        },
        {
          label: 'Delete',
          visible: this.selectedWatch.length > 0,
          command: () => {
            this.handleButtonClick(this.showDeleteWatch)
          },
        },
        {
          label: 'Import',
          visible: true,
          command: () => {
            this.handleButtonClick(this.importWatches)
          },
        },
        {
          label: 'Export',
          visible: this.selectedWatch.length > 0,
          command: () => {
            this.handleButtonClick(this.downloadWatches)
          },
        },
      ]
    },
    watchlistSubMenu() {
      return [
        {
          icon: 'pi pi-plus',
          disabled:
            this.selectedWatchData == null || this.isCurrentNodeAlreadyExist,
          command: () => {
            this.addCurrentCode()
          },
        },
        {
          icon: 'pi pi-minus',
          disabled:
            this.selectedWatchData == null ||
            this.selectedWatchCodeLocal === -1 ||
            this.watchListsData.length === 0,
          command: () => {
            this.removeCurrentCode()
          },
        },
      ]
    },
    deleteWatchName() {
      if (
        this.watchLists &&
        this.selectedWatchData &&
        this.selectedWatchData.name
      )
        return this.selectedWatchData.name
      else return ''
    },
    showWatchesImportModalLocal: {
      get() {
        return this.showWatchesImportModal
      },
      set(value) {
        this.toggleWatchesImportModal(value)
      },
    },
  },
  methods: {
    handleButtonClick,
    ...mapActions([
      'setSelectedWatch',
      'setSelectedWatchCode',
      'toggleWatchesModal',
      'toggleWatchesRenameModal',
      'toggleWatchesDeleteModal',
      'toggleWatchesImportModal',
      'addNewSymbolToList',
      'removeCurrentSymbolFromList',
      'createNewWatchList',
      'renameWatchListItem',
      'deleteWatchList'
    ]),
    ...mapActions('autoplay', [
      'changeAutoPlayWatch',
      'setAutoPlaySpeedWatch'
    ]),
    toggleWatchlist(event) {
      this.$refs.watchlistMenu.toggle(event)
    },
    toggleWatchlistSub(event) {
      this.$refs.watchlistSubMenu.toggle(event)
    },
    async goBackward() {
      this.selectedWatchCodeLocal = this.selectedWatchCodeLocal - 1
    },
    async goForward() {
      this.selectedWatchCodeLocal = this.selectedWatchCodeLocal + 1
    },
    showCreateWatchList() {
      this.toggleWatchesModal(true)
    },
    showCreateWatchRename() {
      this.toggleWatchesRenameModal(true)
    },
    showDeleteWatch() {
      this.toggleWatchesDeleteModal(true)
    },
    importWatches() {
      this.toggleWatchesImportModal(true)
    },
    downloadWatches() {
      let selectedWatchData = ''
      for (let i in this.watchLists) {
        if (this.watchLists[i].id === this.selectedWatch) {
          selectedWatchData = this.watchLists[i]
        }
      }
      let resData = []
      for (let selectedWatchDatum of selectedWatchData.symbolList) {
        resData.push(`${selectedWatchDatum.name},${selectedWatchDatum.id}\n`)
      }
      let blob = new Blob(resData, { type: 'text/txt;charset=utf-8' })
      saveAs(blob, `${this.selectedWatch}.txt`)
    },
    async addCurrentCode() {
      let index = await this.addNewSymbolToList({
        name: this.getSymbolName,
        id: this.getMarketId,
      })
      this.selectedWatchCodeLocal = index
    },
    async removeCurrentCode() {
      let index = this.selectedWatchCodeLocal
      let symbolName = this.getSymbolName
      if (this.selectedWatchCodeLocal == -1) {
        index = this.selectedWatchData.symbolList.findIndex((x) => x.name == this.getSymbolName)

      }
      else {
        symbolName = this.selectedWatchData.symbolList[index].name
      }

      this.selectedWatchCodeLocal = await this.removeCurrentSymbolFromList({
        name: symbolName,
        id: this.getMarketId,
        index: index,
      })
    },

    async createWatches(name, updateModal = true) {
      // createNewWatchList
      this.showLoader = true
      let resp
      this.newWatchName = ''
      let watchObj = this.watchLists.find((s) => s.name === name)
      if (watchObj) {
        this.duplicationError = true
        this.showLoader = false
      } else {
        if (this.scanCopyBtn) {
          resp = await this.createNewWatchList({
            name: name,
            ScanResults: this.scanResults,
            updateModal,
          })
          this.$store.commit('SCAN_COPY_BUTTON', false)
        } else {
          resp = await this.createNewWatchList({ name: name, updateModal })
          const index = resp.data.findIndex((x) => {
            return x.name == name
          })
          this.setSelectedWatch(index)
        }
        // this.showLoader = false
        setTimeout(() => {
          this.showLoader = false
        }, 1000)
      }
      return resp
    },
    toggleWatchesModalInner() {
      this.newWatchName = ''
      this.duplicationError = false

      this.toggleWatchesModal(false)
    },

    renameWatch(watchName) {
      if (!(watchName && watchName.trim())) return
      this.showLoader = true
      let name = watchName
      watchName = ''
      let watchObj = this.watchLists.find((s) => s.name === name)
      if (watchObj) {
        this.duplicationError = true
      } else {
        this.renameWatchListItem(name)
      }
      setTimeout(() => {
        this.showLoader = false
      }, 1000)
    },
    toggleWatchesRenameModalInner() {
      this.newWatchName = ''
      this.duplicationError = false
      this.toggleWatchesRenameModal(false)
    },

    deleteWatches() {
      this.showLoader = true
      this.deleteWatchList(this.selectedWatchData.id)
      setTimeout(() => {
        this.showLoader = false
      }, 1000)
    },
    toggleWatchesDeleteModalInner() {
      this.toggleWatchesDeleteModal(false)
    },

    createWatchesFromImport(name) {
      this.createWatches(name, false).then((d) => {
        if (this.$refs?.importWatchRef?.updateWatchCode) {
          this.$refs?.importWatchRef?.updateWatchCode(d?.watchlist?.id)
        }
        this.toggleImportWatchesModalInner()
      })
    },
    toggleImportWatchesModalInner() {
      this.newWatchName = ''
      this.duplicationError = false
      this.$store.commit('WATCHLIST_POPUP', false)
    },
    toggleImportDirect() {
      this.toggleWatchesImportModal(false)
    },
    startAutoPlay(isForward) {
      this.directionForward = isForward
      this.changeAutoPlayWatch(true)
      this.startPlayback()
    },
    stopAutoPlay() {
      this.changeAutoPlayWatch(false)
      this.stopPlayback()
      this.setAutoPlaySpeedWatch(this.playbackSpeed)
    },
    startPlayback() {
      if (this.playInterval) {
        clearInterval(this.playInterval)
      }

      const interval = 2000 / this.playbackSpeed // Adjust interval based on speed
      this.playInterval = setInterval(() => {
        if (this.directionForward) {
          this.goForward()
        } else {
          this.goBackward()
        }
      }, interval)
    },
    stopPlayback() {
      if (this.playInterval) {
        clearInterval(this.playInterval)
        this.playInterval = null
      }
    },
    handleSpeedChange(speed) {
      this.playbackSpeed = speed
      if (this.autoPlayWatch) {
        this.startPlayback() // Restart playback with new speed
      }
    },
  },
  watch: {
    playSpeed(val) {
      this.playbackSpeed = val
    },
    stopBackwardWatchList(n, o) {
      if (n == true) {
        this.stopAutoPlay()
      }
    },
    stopForwardWatchList(n, o) {
      if (n == true) {
        this.stopAutoPlay()
      }
    },
    autoPlayWatch(n, o) {
      if (n == true) {
        this.startPlayback()
      }
      else {
        this.stopAutoPlay()
      }
    }
  },
  beforeDestroy() {
    this.stopPlayback()
  },
}
</script>

<style lang="scss" scoped></style>
