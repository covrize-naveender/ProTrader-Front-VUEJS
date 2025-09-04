<template>
<svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="10" height="20.029" viewBox="0 0 10 20.029"
	 overflow="visible" enable-background="new 0 0 10 20.029" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="5" y1="0" x2="5" y2="20.029"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="0" y1="9" x2="10" y2="9"/>
</svg>
  </template>
  <script>
  export default {
    name: "doji",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>