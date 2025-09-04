<template>
    <div class="autoplay-container p-mr-3">
        <!-- <span class="p-mr-3"> -->
        <div class="p-d-flex">
            <p-button class="p-button-light p-button-text" :disabled="disablePlayBackward" @click="startPlay(false)"
                style="padding: 0.25rem;">
                <span
                    :class="`${!isAutoPlay ? 'custom-btn-primary' : 'custom-btn-secondary'} play-backward-btn`"></span>
            </p-button>
            <p-button class="p-button-light p-button-text" :disabled="disablePlayForward" @click="startPlay(true)"
                style="padding: 0.25rem;">
                <span :class="`${!isAutoPlay ? 'custom-btn-primary' : 'custom-btn-secondary'} play-forward-btn`"></span>
            </p-button>
            <p-button class="p-button-light p-button-text" :disabled="disablePause" @click="stopPlay"
                style="padding: 0.5rem;">
                <span :class="`${isAutoPlay ? 'custom-btn-primary' : 'custom-btn-secondary'} pause-btn`"></span>
            </p-button>
        </div>
        <!-- </span> -->
        <div class="p-d-flex">
            <p-dropdown v-model="currentSpeed" :options="speeds" name="speeds" id="speeds" optionLabel="label"
                optionValue="value" class="speed-drp" :disabled="disableSpeed" @change="changeSpeed" v-tooltip.top="'Playback speed'"/>
        </div>
    </div>
</template>

<script>
export default {
    name: "AutoPlay",
    props: {
        disablePlayForward: {
            type: Boolean,
            default: false
        },
        disablePlayBackward: {
            type: Boolean,
            default: false
        },
        disablePause: {
            type: Boolean,
            default: false
        },
        disableSpeed: {
            type: Boolean,
            default: false
        },
        isAutoPlay: {
            type: Boolean,
            default: false
        },
        currentSpeed: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            speeds: [
                { label: '0.5x', value: 0.5 },
                { label: '1x', value: 1 },
                { label: '1.5x', value: 1.5 }
            ]
        }
    },
    methods: {
        startPlay(isForward) {
            this.$emit('startAutoPlay', isForward)
        },
        stopPlay() {
            this.$emit('stopAutoPlay')
        },
        changeSpeed() {
            this.$emit('speedChange', this.currentSpeed)
        },
        handleKeyDown(event) {
            if (event.code === 'Space' && this.isAutoPlay) {
                this.stopPlay()
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeyDown)
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeyDown)
    }
}
</script>

<style lang="scss" scoped>
.autoplay-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.speed-dropdown {
    margin-left: 0.5rem;
}

.speed-select {
    width: 60px;
    height: 28px;

    :deep(.p-dropdown) {
        padding: 0.25rem;
        font-size: 0.875rem;
    }
}
</style>