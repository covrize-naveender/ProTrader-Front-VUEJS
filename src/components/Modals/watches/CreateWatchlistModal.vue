<template>
    <p-dialog class="create-watch small-dialog" header="Add Watch" :visible.sync="visible" @hide="onClose" :modal="true">
        <!-- <p class="m-0">Create Watchlist</p> -->
        <div class="create-watch-data">
            Please enter a name for your new watchlist:
            <div>
                <p-inputText type="text" v-model="newWatchName" @keypress.enter="createWatches"/>
            </div>
            <div style="color: red;" v-if="duplicationError"><b>A watchlist with that name already exists</b></div>
        </div>
        <template #footer>
            <p-button label="Create" :disabled="!(newWatchName && newWatchName.trim())" @click="createWatches" />
            <p-button label="Cancel" :disabled="showLoader"  @click="onClose" class="p-button-secondary"/>
        </template>
    </p-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'CreateWatchlistModal',
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
    },
    data() {
        return {
            FavouriteName: '',
            newWatchName: '',
            FavouritePopupParent: false,
        }
    },
    methods: {
        createWatches(event) {
            event.preventDefault();
            if (!(this.newWatchName && this.newWatchName.trim())) return;
            if (this.newWatchName.length) {
                let newWatchName = this.newWatchName
                this.newWatchName = ''
                this.$emit('createWatches', newWatchName)
            }
        },
        onClose() {
            this.newWatchName = ''
            this.$emit('toggleModal')
        }
    },
    computed: {
        ...mapGetters([
            'themeSecondaryColor',
            'themePrimaryColor',
            'themeFontColor',
            'themeDarkMode',
        ])
    }
}
</script>

<style lang="scss" scoped>
.create-watch-data {
    margin: 2rem;
}
.create-watch-data .p-inputtext {
    width: 100%;
    margin: 0.5rem 0;
}
</style>