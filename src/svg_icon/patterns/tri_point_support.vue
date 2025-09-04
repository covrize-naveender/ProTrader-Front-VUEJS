<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20.029" height="20.001"
	 viewBox="0 0 20.029 20.001" overflow="visible" enable-background="new 0 0 20.029 20.001" xml:space="preserve">
     <g>
    <line class="no-fill" :stroke="color" stroke-width="2" x1="20.029" y1="19.001" x2="0" y2="19.001"/>
    <polygon points="7.76,12.41 9.984,13.222 12.205,12.402 9.992,16.96 	"/>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="9.986" y1="13.863" x2="9.957" y2="0.002"/>
</g>
<g>
    <polygon points="15.463,12.41 17.688,13.222 19.908,12.402 17.695,16.96 	"/>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="17.688" y1="13.863" x2="17.659" y2="0.002"/>
</g>
<g>
    <polygon points="0.048,12.41 2.272,13.222 4.493,12.402 2.28,16.96 	"/>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="2.274" y1="13.863" x2="2.245" y2="0.002"/>
</g>
</svg>
  </template>
  <script>
  export default {
    name: "tri_point_support",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>