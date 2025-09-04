<template>
    <p-button :disabled="isDisabled" :class="btnClass" :label="label" :icon="icon" v-if="!isSvgIcon"
        @click="onClickButton" />
        
    <p-button :disabled="isDisabled" :class="btnClass" v-else @click="onClickButton" type="button">
        <span v-for="(item,index) in svgIconClass" :key="index" :class="item"></span>  <span v-if="label != ''" class="p-ml-2">{{ label }} </span>
    </p-button>
</template>

<script>
export default {
    name: 'CustomButton',
    props: {
        isSvgIcon: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        btnClass: {
            type: String,
            default: ''
        },
        svgIconClass: {
            type: Array,
            default: []
        }
    },
    methods: {
        onClickButton() {
            this.$emit('onClick')
        }
    }
}
</script>

<style lang="scss" scoped></style>