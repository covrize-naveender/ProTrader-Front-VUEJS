<template>
<svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="12" height="20" viewBox="0 0 12 20"
	 overflow="visible" enable-background="new 0 0 12 20" xml:space="preserve">

<rect x="1" y="1" class="no-fill" :stroke="color" stroke-width="2" width="10" height="5"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="6.015" y1="20" x2="6.015" y2="7"/>
</svg>
  </template>
  <script>
  export default {
    name: "hanging_man",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>