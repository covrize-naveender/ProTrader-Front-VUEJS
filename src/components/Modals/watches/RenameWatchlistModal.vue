<template>
    <p-dialog class="rename-watch small-dialog" header="Rename Watch" :visible.sync="visible" @hide="onClose"
        :modal="true">
        <div class="rename-watch-data">
            Please enter a name for your new watchlist:
            <div>
                <p-inputText type="text" v-model="watchName" @keypress.enter="onRenameWatch" />
            </div>
            <div style="color: red;" v-if="duplicationError"><b>A watchlist with that name already exists</b></div>
        </div>
        <template #footer>
            <p-button label="Rename" :disabled="!(watchName && watchName.trim())" @click="onRenameWatch" />
            <p-button label="Cancel" @click="onClose"  class="p-button-secondary"/>
        </template>
    </p-dialog>
</template>

<script>
export default {
    name: 'RenameWatchlistModal',
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
        newWatchName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            watchName: this.newWatchName,
        }
    },
    methods: {
        onRenameWatch() {
            this.$emit('renameWatch', this.watchName)
        },
        onClose() {
            this.$emit('toggleModal')
        }
    },
    watch: {
        newWatchName(newVal) {
            this.watchName = newVal;
        }
    },
}
</script>

<style lang="scss" scoped>
.rename-watch-data {
    margin: 2rem;
}
.rename-watch-data .p-inputtext {
    width: 100%;
    margin: 0.5rem 0;
}</style>