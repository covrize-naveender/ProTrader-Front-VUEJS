<template>
    <p-dialog  :visible.sync="visible" :modal="true" @hide="HidePopup"  header="Save Scan" class="small-dialog">
        <div class="fav-modal-data">
            Please enter a name for favourite scan:
            <div>
                <p-inputText type="text" v-model="FavouriteName" @keypress.enter="SaveSettings()" />
            </div>
        </div>
        <template #footer>
            <p-button label="Save" :disabled="!FavouriteName.length" @click="SaveSettings()" />
            <p-button class="p-button-secondary" label="Cancel" @click="HidePopup()" />
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'FavouriteScanModal',
    components: {},
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        ...mapGetters([
            'scanPopup',
            'scans',
            'userSavedScans',
            'themeSecondaryColor',
            'themePrimaryColor',
            'themeFontColor',
            'themeDarkMode',
        ]),
    },
    data() {
        return {
            FavouriteName: '',
            FavouritePopupParent: false,
        }
    },
    methods: {
        HidePopup() {
            this.$store.commit('SCAN_POPUP', false)
            this.FavouritePopupParent = false
        },
        SaveSettings() {
            if (this.FavouriteName.length) {
                this.FavouritePopupParent = true
                this.$emit('saveScanSettings', this.FavouriteName)
                this.FavouriteName = ''
            }
        },
    },
}
</script>

<style scoped>
.fav-modal-data {
    margin: 2rem;
}

.fav-modal-data .p-inputtext {
    width: 100%;
    margin: 0.5rem 0;
}
</style>