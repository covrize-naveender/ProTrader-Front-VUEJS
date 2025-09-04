<template>
<svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="12" height="20" viewBox="0 0 12 20"
	 overflow="visible" enable-background="new 0 0 12 20" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="6" y1="20" x2="6" y2="17.015"/>
<rect x="1" y="11.5" :stroke="color" stroke-width="2" width="10" height="5"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="5.985" y1="0" x2="5.985" y2="11"/>
</svg>
  </template>
  <script>
  export default {
    name: "inverted_hammer",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>