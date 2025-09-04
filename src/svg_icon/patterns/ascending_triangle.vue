<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20" height="20.103" viewBox="0 0 20 20.103"
	 overflow="visible" enable-background="new 0 0 20 20.103" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="9.938" y1="1" x2="1" y2="19.103"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="9.938" y1="1" x2="19" y2="19.103"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="19" y1="19.103" x2="1" y2="19.103"/>
</svg>
  </template>
  <script>
  export default {
    name: "ascending_triangle",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>