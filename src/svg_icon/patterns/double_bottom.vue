<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20.001" height="20.103"
	 viewBox="0 0 20.001 20.103" overflow="visible" enable-background="new 0 0 20.001 20.103" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="5.531" y1="19.103" x2="10" y2="1"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="5.531" y1="19.103" x2="1" y2="1"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="1" y1="1" x2="10" y2="1"/>
<g>
	<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="14.532" y1="19.103" x2="19.001" y2="1"/>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="14.532" y1="19.103" x2="10.001" y2="1"/>
	<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="10.001" y1="1" x2="19.001" y2="1"/>
</g>
</svg>
  </template>
  <script>
  export default {
    name: "double_bottom",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>