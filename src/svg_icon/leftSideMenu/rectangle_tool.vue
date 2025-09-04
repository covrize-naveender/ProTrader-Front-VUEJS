<template>
  <svg  viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M3.75 3.125C3.40482 3.125 3.125 3.40482 3.125 3.75V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V3.75C16.875 3.40482 16.5952 3.125 16.25 3.125H3.75ZM1.875 3.75C1.875 2.71447 2.71447 1.875 3.75 1.875H16.25C17.2855 1.875 18.125 2.71447 18.125 3.75V16.25C18.125 17.2855 17.2855 18.125 16.25 18.125H3.75C2.71447 18.125 1.875 17.2855 1.875 16.25V3.75Z"
      :fill="color" />
  </svg>


</template>
<script>
export default {
  name: "rectangle_tool",
  props: {
    color: {
      type: String,
      default: "#000000"
    }
  }
}
</script>