<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20" height="20.103" viewBox="0 0 20 20.103"
	 overflow="visible" enable-background="new 0 0 20 20.103" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="10.062" y1="19.103" x2="19" y2="1"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="10.062" y1="19.103" x2="1" y2="1"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="1" y1="1" x2="19" y2="1"/>
</svg>
  </template>
  <script>
  export default {
    name: "descending_triangle",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>