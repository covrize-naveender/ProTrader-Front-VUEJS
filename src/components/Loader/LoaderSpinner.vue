<template>
    <div class="spinner-custom" v-if="loading">
        <p-progressspinner />
    </div>
</template>

<script>
export default {
    name: 'LoaderSpinner',
    props: {
        loading: {
            type: Boolean,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.spinner-custom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 152;
}
</style>