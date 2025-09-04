<template>
  <div class="tvjs-x-window" :style="style" ref="win">
    <div class="tvjs-x-window-head">
      <div class="tvjs-x-window-title" @mousedown="onMouseDown">
        {{ title }}
      </div>
      <div class="tvjs-x-window-close" @click="$emit('close')">
        ╳
      </div>
    </div>
    <div class="tvjs-x-window-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Dragg from './drag'

export default {
  name: 'Window',
  mixins: [Dragg],
  props: ['title', 'tv'],
  mounted() {
    this.ww = this.$refs.win.clientWidth
    this.wh = this.$refs.win.clientHeight
    this.x = this.tvw * 0.5 - this.ww * 0.5
    this.y = this.tvh * 0.5 - this.wh * 0.5
  },
  computed: {
    style() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`
      }
    },
    tvw() {
      return this.$props.tv.width
    },
    tvh() {
      return this.$props.tv.height
    }
  },
  data() {
    return {
      ww: 0,
      wh: 0,
      x: 0,
      y: 0
    }
  }
}
</script>
<style scoped>
.tvjs-x-window {
  position: absolute;
  border-radius: 3px;
  pointer-events: all;
  /*padding-left: 7px;*/
  z-index: 100;
  box-sizing: border-box;
  font-size: 1rem;
}
.tvjs-x-window-body {
  padding: 1rem;
}
.tvjs-x-window-title {
  user-select: none;
  width: 100%;
  min-width: 250px;
  padding: 1rem;
}
.tvjs-x-window-head {
  padding-right: 0;
  display: flex;
  justify-content: space-between;
}
.tvjs-x-window-close {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-right: 0.25rem; */
  padding: 0 1rem;
}

</style>
