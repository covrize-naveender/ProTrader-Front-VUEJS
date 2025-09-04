<template>
    <p-blockui :blocked="blocked" :class="blocked? 'loader_bg':''">

        <div class="blockui-content">
            <!-- Slot for content -->
            <slot></slot>
        </div>
    </p-blockui>
</template>

<script>
export default {
    name: "BlockWithLoader",
    props: {
        blocked: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style scoped>
.blockui-content {
    position: relative;
}

.custom-loader {
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
    z-index: 10;
}


</style>