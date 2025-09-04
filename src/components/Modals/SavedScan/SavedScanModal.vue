<template>
    <p-dialog :visible.sync="visible" header="Favourite Scan" @hide="onClose" :modal="true" class="fav-scan-modal">
        <LoaderPanel :loading="isLoading">
            <div v-if="favouriteScanList.length > 0">
                <div class="p-grid p-mt-4 p-mb-4">
                    <div class="p-col-4 p-pb-4 p-d-flex p-ai-center" style="gap: 0.5rem;"
                        v-for="(scan, index) in favouriteScanList">

                        <p-radiobutton :id="`Favourite_scan~${scan.scanName}_${index}`" :name="`Favourite_scan`"
                            :value="scan.id" v-model="selectedFavScan" />

                        <label :for="`Favourite_scan~${scan.scanName}_${index}`"
                            style="font-size: larger; font-weight: 500; cursor: pointer;">{{ scan.scanName }}</label>

                    </div>
                </div>
                <DataSettings :favouriteScanId="selectedFavScan" type="favourite" v-if="selectedFavScan" />
            </div>
            <div v-else>
                <h3>There are no favourite scans saved.</h3>
            </div>
        </LoaderPanel>
        <DeleteSavedScan :deleteFavScanItem="deleteFavScanItem" :visible.sync="showDeleteDialog"
            @SureDeleteFavScanItem="SureDeleteFavScanItem" @HideDeletePopup="HideDeletePopup" />
        <template #footer>
            <p-button class="p-button-secondary p-button-outlined p-pr-2 p-pl-2" icon="pi pi-times" @click="Delete"
                :disabled="!valid || isLoading" />
            <p-button label="Scan" @click="runScan" :disabled="!valid || isLoading" />
            <p-button class="p-button-secondary" label="Cancel" @click="onClose" :disabled="isLoading"/>
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DataSettings from './../ScanToolbox/DataSettings.vue';
import DeleteSavedScan from './DeleteSavedScan.vue';
import LoaderPanel from '../../Loader/LoaderPanel.vue';
export default {
    name: 'SavedScanModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    components: {
        DataSettings,
        DeleteSavedScan,
        LoaderPanel
    },
    data() {
        return {
            isLoading: false,
            valid: false,
            selectedFavScan: null,
            deleteFavScan: false,
            showDeleteDialog: false,
            deleteFavScanItem: '',
        }
    },
    methods: {
        ...mapActions([
            'runAndUpdateScanSettings',
            'deleteScanSettings',
            'getUserScanList'
        ]),
        onClose() {
            this.selectedFavScan = null
            this.$emit('toggleModal', false)
        },
        async runScan() {


            this.isLoading = true
            const index = this.userSavedScans.findIndex((x) => { return x.id == this.selectedFavScan })
            await this.runAndUpdateScanSettings(index)
            await this.getUserScanList()
            this.isLoading = false
            this.$emit('toggleModal', false)

        },
        Delete() {

            if (this.selectedFavScan) {
                this.$store.commit(
                    'FAV_SELECTED_SCAN_ID',
                    this.selectedFavScan
                )
                this.deletedScan(this.userSavedScans.find(x => x.id === this.selectedFavScan).scanName)
                this.$store.commit('SCAN_DELETE_POPUP', true)
            }

        },
        SureDeleteFavScanItem(check) {
            this.deleteFavScan = check
            this.deletedScan()
        },
        HideDeletePopup() {
            this.showDeleteDialog = false
        },
        async deletedScan(selectedScanName) {
            this.deleteFavScanItem = selectedScanName
            this.showDeleteDialog = true
            if (this.deleteFavScan) {
                await this.deleteScanSettings(this.favSelectedScanId)
                this.$store.commit('SCAN_DELETE_POPUP', false)
                this.selectedFavScan = null
            }
            this.deleteFavScan = false
        },
    },
    computed: {
        ...mapGetters([
            'getScanFavListTypes',
            'themeFontColor',
            'themeSecondaryColor',
            'themeDarkMode',
            'userSavedScans',
            'getScanFavListTypes',
            'getGuruFavListTypes',
            'themePrimaryColor',
            'themeFontColor',
            'favSelectedScanId',
        ]),
        favouriteScanList() {
            const guruFavScans = this.userSavedScans.filter((scan) => (this.getScanFavListTypes.includes(scan.scanType) || this.getGuruFavListTypes.includes(scan.scanType)));
            return guruFavScans;
        }
    },
    watch: {
        selectedFavScan(newVal, oldVal) {
            if (newVal != null) {
                this.valid = true
            }
            else {
                this.valid = false
            }

        }
    }
}
</script>

<style lang="scss" scoped></style>