<template>
    <p-dialog class="delete-watch small-dialog" header="Delete Watch" :visible.sync="visible" @hide="onClose"
        :modal="true" >
        <div class="delete-watch-data">
            Are you sure you want to remove your
            <span style="color: red">({{ deleteWatchName }})</span> watchlist?
        </div>
        <template #footer>
            <p-button label="Yes" @click="deleteWatchFun" />
            <p-button label="No" @click="onClose" class="p-button-secondary" />
        </template>
    </p-dialog>
</template>

<script>
export default {
    name: 'DeleteWatchlistModal',
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        showLoader: {
            type: Boolean,
            default: false,
        },
        deleteWatchName: {
            type: String,
            default: ''
        }
    },
    methods: {
        deleteWatchFun() {
            this.$emit('deleteWatches')
        },
        onClose() {
            this.$emit('toggleModal')
        }
    },
}
</script>

<style lang="scss" scoped></style>