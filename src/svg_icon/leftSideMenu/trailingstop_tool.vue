<template>
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8333 2.5L17.5 2.5" :stroke="color" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path d="M8.33333 7.5H15" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 12.5H11.6667" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M2.5 17.5H9.16667" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>


</template>
<script>
export default {
  name: "trailingstop_tool",
  props: {
    color: {
      type: String,
      default: "#000000"
    }
  }
}
</script>