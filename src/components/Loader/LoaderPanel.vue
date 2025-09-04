<template>
    <BlockWithLoader :blocked="loading">
        <p-panel class="hidden-panel">
            <LoaderSpinner :loading="loading" />
            <slot></slot>
        </p-panel>
    </BlockWithLoader>


</template>

<script>
import BlockWithLoader from './BlockWithLoader.vue';
import LoaderSpinner from './LoaderSpinner.vue';

export default {
    name: 'LoaderPanel',
    components:{
        BlockWithLoader,
        LoaderSpinner
    },
    props: {
        panelclass: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped></style>