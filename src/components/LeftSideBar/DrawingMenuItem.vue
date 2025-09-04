<template>
    <div>
        <div @click="onItemSelect" class="left-sidebar-item" v-if="!isDropDown && !isEmoji">
            <i :class="icon" v-if="isIcon" v-tooltip.right="`${toolTip}`"></i>
            <LeftSideSvg :path="svgPath" v-tooltip.right="`${toolTip}`" v-else />

        </div>
        <div class="" style="display: flex;" v-else @mouseenter="showArrow = true" @mouseleave="showArrow = false"
            @click="isEmoji ? onEmojiDrp(index, $event) : onClickDrp()">
            <div class="left-sidebar-drp-btn">
                <i v-if="isDropDown && !isEmoji">
                    <LeftSideSvg :path="selectedItemDrp?.svgPath || dropdownItem[0].svgPath"
                        v-tooltip.right="`${toolTip}`" />
                </i>
                <i :class="icon" v-else-if="isIcon" v-tooltip.right="`${toolTip}`"></i>

                <LeftSideSvg :path="svgPath" v-tooltip.right="`${toolTip}`" v-else />

            </div>
            <div class="left-sidebar-drp-icon"
                :style="{ visibility: (showArrow || isListVisible) ? 'visible' : 'hidden' }">
                <i :class="isListVisible ? 'pi pi-angle-left' : 'pi pi-angle-right'"></i>
            </div>
            <p-listbox v-model="selectedItemDrp" @change="onDrpItemSelect" optionLabel="id" :options="dropdownItem"
                :style="{ display: isListVisible && !isEmoji ? 'block' : 'none' }" class="drp-drawing">
                <template #option="slotProps">
                    <LeftSideSvg :path="slotProps.option.svgPath" v-tooltip.right="`${slotProps.option.toolTip}`" />
                </template>
            </p-listbox>
        </div>


    </div>
</template>

<script>

import { Picker } from 'emoji-mart-vue-2'
import 'emoji-mart-vue-2/css/emoji-mart.css'
import svg_icon from '../../svg_icon';
import LeftSideSvg from '../../svg_icon/LeftSideSvg.vue';
export default {
    name: 'DrawingMenuItem',
    components: { Picker, LeftSideSvg },
    props: {
        index: {
            type: Number,
        },
        isEmoji: {
            type: Boolean,
            default: false
        },
        isDropDown: {
            type: Boolean,
            default: false
        },
        onItemSelect: {
            type: Function,
        },
        toolTip: {
            type: String,
            default: ''
        },
        isIcon: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ''
        },
        dropdownItem: {
            type: Array,
            default: []
        },
        svgPath: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showArrow: false,
            isListVisible: false,
            selectedItemDrp: null,
            showEmojiArrow: false,
            componentRef: undefined,
        }
    },
    methods: {
        onClickDrp() {
            this.isListVisible = !this.isListVisible
        },
        onEmojiDrp(index, event) {
            this.isListVisible = !this.isListVisible
            this.onItemSelect(index, event)
        },
        onDrpItemSelect(val) {
            this.isListVisible = !this.isListVisible;
            this.selectedItemDrp = val.value
            val.value.onClick()

        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.isListVisible = false;
                this.selectedItemDrp = null
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.componentRef = svg_icon.find(d => d.name === this.path)

    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    }
}
</script>

<style lang="scss" scoped>
.left-sidebar-item {
    padding: 0.5rem;
    margin: 0.4rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;
}

.left-sidebar-drp-btn {
    padding: 0.5rem;
    margin: 0 0 0 0.8rem;
    border-radius: 5px;
    cursor: pointer;
}

.left-sidebar-drp-icon {
    padding: 0.5rem 0 0.5rem 0;
    margin: 0 0 0 0;
    border-radius: 5px;
    cursor: pointer;
}

.p-listbox.drp-drawing {
    display: block;
    position: absolute;
    margin-left: 4.2rem;
    // margin-top: 0.4rem;
    z-index: 11;
}
</style>