<template>
  <div class="loader-style">
    <rotate-square5 v-if="showLoader" class="m-auto"></rotate-square5>
  </div>
</template>

<script>
import RotateSquare5 from "./Rotate5.vue"

export default {
  name: 'Loader',
  components: {
    RotateSquare5
  },
  props: {
    showLoader: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.loader-style {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 5000;
  height: 80%;
}
</style>