<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="19.906" height="20.073"
	 viewBox="0 0 19.906 20.073" overflow="visible" enable-background="new 0 0 19.906 20.073" xml:space="preserve">
<ellipse :stroke="color" cx="4.507" cy="3.633" rx="4.007" ry="3.024"/>
<ellipse class="no-fill" cx="2.89" cy="3.53" rx="1.641" ry="1.673"/>
<ellipse class="no-fill" cx="6.077" cy="3.529" rx="1.662" ry="1.705"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="4.393" y1="6.957" x2="4.422" y2="19.073"/>
<g>
	<line class="no-fill" :stroke="color" stroke-width="2" x1="16.943" y1="0" x2="16.943" y2="15.435"/>
	<polygon points="13.98,13.259 16.943,14.478 19.906,13.259 16.943,20.058 	"/>
</g>
<line class="no-fill" :stroke="color" x1="7.316" y1="18.061" x2="5.316" y2="18.061"/>
<line class="no-fill" :stroke="color" x1="7.379" y1="14.186" x2="5.379" y2="14.186"/>
<line class="no-fill" :stroke="color" x1="8.316" y1="16.123" x2="5.316" y2="16.123"/>
</svg>
  </template>
  <script>
  export default {
    name: "bearish_key_reversal",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>