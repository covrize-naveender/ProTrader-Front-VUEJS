<template>
    <div class="chart-sidebar" :class="{ 'sidebar-collapsed': !isVisible, 'fullscreen': isFullscreen }">
        <div class="sidebar-controls">
            <button class="toggle-button" @click="toggleSidebar">
                <i :class="isVisible ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
            </button>
            <div class="button-set">

                <button class="fullscreen-button" @click="toggleFullscreen" v-if="isVisible"
                    v-tooltip.bottom="isFullscreen ? 'Minimize' : 'Full Screen'">
                    <i :class="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"></i>
                </button>
                <button class="fullscreen-button" @click="onClickClose" v-if="isVisible"
                    v-tooltip.bottom="'Close'">
                    <i :class="'pi pi-times'"></i>
                </button>
            </div>
        </div>
        <div class="sidebar-content">
            <iframe ref="iframeRef" class="floating-iframe" :src="iframeUrl" :class="{ open: true }"></iframe>
        </div>
    </div>
</template>

<script>
import config from '../../config'
export default {
    name: 'ChartSidebar',
    props: {
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            iframeUrl: config.IFRAME_URL,
            isFullscreen: false
        };
    },
    methods: {
        toggleSidebar() {
            this.$emit('toggle', !this.isVisible)
            // Emit resize event after a short delay to ensure DOM updates
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 300) // Match the transition duration
        },
        toggleFullscreen() {
            this.isFullscreen = !this.isFullscreen;
            // Emit resize event after a short delay to ensure DOM updates
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 300) // Match the transition duration
        },
        onClickClose(){
            if (this.isFullscreen) {
                this.isFullscreen = !this.isFullscreen
            }
            this.toggleSidebar()
        }
    }
}
</script>

<style lang="scss" scoped></style>