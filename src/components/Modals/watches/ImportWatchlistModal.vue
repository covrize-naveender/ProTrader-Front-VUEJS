<template>
    <p-dialog class="import-watch" header="WatchList Import" :visible.sync="visible" @hide="onClose" :modal="true" >

        <div class="import-watch-data">
            <p class="import-paragraph" :style="themeDarkMode ? { color: '#A2A2A2' } : {}">
                The imported file should be in a csv or text format. The first column
                should contain the symbol while the second should contain the exchange.
                These can be separated by a comma, @, fullstop or space. There should
                only be one stock per line/row.
            </p>

            <div class="import-content-div">
                <div class="import-field">

                    <label for="watchlistStore"> Select import target:</label>
                    <div class="p-d-flex" style="gap: 0.2rem;">
                        <p-dropdown v-model="responseObj.watchCode" :options="getWatchListFromStore" optionLabel="text"
                            placeholder="--None--" optionValue="value" name="watchlistStore" id="watchlistStore"
                            append="body" />
                        <p-button icon="pi pi-file" @click="ShowPopup" />
                    </div>
                </div>
                <div class="import-field">

                    <label> Select import source file:</label><br />
                    <p-inputText type="file" ref="importFileRef" @change="fileChange" />
                </div>
                <div class="import-field" v-if="responseObj.hasFile">
                    <label>Response:</label>
                    <p-inputText placeholder="" type="text" disabled :value="responseObj.status" />
                </div>
            </div>
        </div>

        <CreateWatchlistModal :visible.sync="watchlistPopupGetter" :showWatchesModal="watchlistPopupGetter"
            :showLoader="showLoader" :duplicationError="duplicationError" @createWatches="createWatches"
            @toggleModal="toggleWatchesModalInner" />


        <template #footer>
            <p-button label="Import" @click="createWatchList" :disabled="!hasAllParams"/>
            <p-button label="Cancel" @click="onClose"  class="p-button-secondary"/>
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CreateWatchlistModal from './CreateWatchlistModal.vue'
export default {
    name: 'ImportWatchlistModal',
    components: { CreateWatchlistModal },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        showLoader: {
            type: Boolean,
            default: false,
        },
        duplicationError: {
            type: Boolean,
            default: false,
        },
        createWatches: {
            type: [Function, Object],
        },
        toggleWatchesModalInner: {
            type: [Function, Object],
        },
    },
    data() {
        return {
            reader: null,
            selectedFileName: '',
            responseObj: {
                content: '',
                watchCode: null,
                status: '',
                hasFile: false,
                addAbleWatches: [],
            },
        }
    },
    methods: {
        ...mapActions(['toggleWatchesImportModal', 'updateWatchList']),
        updateWatchCode(code) {
            this.responseObj = { ...JSON.parse(JSON.stringify(this.responseObj)), watchCode: code }
        },
        showCreateWatchList() {
            this.$store.dispatch('toggleWatchesModal')
        },
        ShowPopup() {
            this.$store.commit('WATCHLIST_POPUP', true)
        },

        async createWatchList() {
            let watchList = this.watchLists
            for (let i in watchList) {
                let watchListElement = watchList[i]
                if (watchListElement.id === this.responseObj.watchCode) {
                    let newSymbolList = watchListElement.symbolList
                    if (newSymbolList.length > 0) {
                        for (let addAbleWatch of this.responseObj.addAbleWatches) {
                            let hasAlready = newSymbolList.find(
                                (s) => s.id === addAbleWatch.id && s.name === addAbleWatch.name
                            )
                            if (!hasAlready) {
                                newSymbolList.push(addAbleWatch)
                            }
                        }
                    } else {
                        for (let addAbleWatch of this.responseObj.addAbleWatches) {
                            newSymbolList.push(addAbleWatch)
                        }
                    }
                    watchListElement.symbolList = newSymbolList
                    await this.updateWatchList({ index: i, value: watchListElement })
                }
            }
            this.responseObj = {
                content: '',
                status: '',
                hasFile: false,
                addAbleWatches: [],
            }
            this.$refs.importFileRef.value = null;
            this.$emit('change', !open)
        },
        fileChange(event) {
            const fileList = event.target.files
            if (fileList.length > 0) {
                if (this.reader) this.reader.readAsText(fileList[0])
            }
        },
        processFile() {
            let sepratorArray = ['@', ',', ' ']

            if (this.reader) {
                let text = this.reader.result
                let records = text.split('\n')

                let addTheseToWatch = []
                for (let record of records) {
                    let findRec

                    if (record && record.length) {
                        for (let sep of sepratorArray) {
                            if (record.includes(sep)) {
                                findRec = record.split(sep)
                                break
                            }
                        }

                        if (findRec && findRec.length === 2) {
                            let id = findRec[1].trim();
                            let name = findRec[0].trim();
                            if (id === "ASX") {
                                let nameSplit = name.split(".");
                                if (nameSplit.length !== 2) {
                                    name = name + ".au";
                                }
                            }
                            let symbolRef = `${name}~${id}`


                            let symbolList = this.$store.state.symbolsList
                            if (symbolList && symbolList.includes(symbolRef)) {
                                addTheseToWatch.push({ id: id, name: name })
                            }
                        }
                    }
                }

                if (addTheseToWatch && addTheseToWatch.length > 0) {
                    this.responseObj.addAbleWatches = addTheseToWatch
                    this.responseObj.status = `SuccessFully Process have ${addTheseToWatch.length} Valid Symbols`
                    this.responseObj.hasFile = true
                }
            }
        },
        onClose() {
            // this.responseObj = {
            //     content: '',
            //     status: '',
            //     hasFile: false,
            //     addAbleWatches: [],
            // }
            // this.$refs.importFileRef.value = null;
            this.$emit('toggleModal')
        }
    },
    computed: {
        ...mapGetters([
            'watchlistPopupGetter',
            'watchLists',
            'showWatchesModal',
            'themeDarkMode',
            'themeSecondaryColor',
        ]),
        getWatchListFromStore() {
            return this.watchLists.map((v, k) => {
                return { value: v.id, text: v.name }
            })
        },
        hasAllParams() {
            let decision = this.responseObj.hasFile &&
                this.responseObj.addAbleWatches.length &&
                this.responseObj.watchCode
            return decision
        },
    },

    mounted() {
        const reader = new FileReader()
        reader.onload = this.processFile
        this.reader = reader
    },
}
</script>

<style lang="scss" scoped>
.import-paragraph {
    margin: 0.5rem;
}

.import-watch-data {
    margin: 1rem;
}

.import-field .p-dropdown {
    width: 90%;
}

.import-field .p-inputtext {
    width: 95%;
}

.import-field {
    margin: 0.5rem;
}

.import-content-div {
    margin: 1rem 0;
}
</style>