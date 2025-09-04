<template>
    <p-dialog :visible.sync="scanDeletePopup" :modal="true" class="small-dialog" @hide="HideDeletePopup" header="Delete Saved Scan">
        <div class="fav-modal-data">
            Are you sure you want to delete your <span style="font-weight: 700;"> {{scanName || deleteFavScanItem || deleteFavScanName}} </span> scan from favourites?
        </div>
        <template #footer>
            <p-button label="Yes" @click="DeleteList()" />
            <p-button class="p-button-secondary" label="No" @click="HideDeletePopup()" />
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'DeleteSavedScan',
    props: ['deleteFavScanItem','scanName'],
    data() {
        return {
            deleteFavScanName: '',
        }
    },
    computed: { ...mapGetters(['scanDeletePopup', 'deleteFavScanLoader']) },
    methods: {
        DeleteList() {
            this.deleteFavScanName = this.deleteFavScanItem
            this.$store.commit('SET_DEL_FAV_SCAN_LOADER', true)
            this.$emit('SureDeleteFavScanItem', true)
        },
        HideDeletePopup() {
            this.$store.commit('SCAN_DELETE_POPUP', false)
        },
    },
}
</script>

<style lang="scss" scoped></style>