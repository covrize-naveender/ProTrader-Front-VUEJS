<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20.029" height="20.002"
	 viewBox="0 0 20.029 20.002" overflow="visible" enable-background="new 0 0 20.029 20.002" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="0" y1="1" x2="20.029" y2="1"/>
<g>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="10.043" y1="6.139" x2="10.073" y2="20"/>
	<polygon points="12.27,7.592 10.045,6.78 7.824,7.599 10.037,3.042 	"/>
</g>
<g>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="2.341" y1="6.139" x2="2.37" y2="20"/>
	<polygon points="4.567,7.592 2.342,6.78 0.122,7.599 2.334,3.042 	"/>
</g>
<g>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="17.755" y1="6.139" x2="17.784" y2="20"/>
	<polygon points="19.981,7.592 17.757,6.78 15.536,7.599 17.749,3.042 	"/>
</g>
</svg>

  </template>
  <script>
  export default {
    name: "tri_point_resistance",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>