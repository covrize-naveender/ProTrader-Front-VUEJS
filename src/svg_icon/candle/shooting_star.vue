<template>
<svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20" height="20.5" viewBox="0 0 20 20.5"
	 overflow="visible" enable-background="new 0 0 20 20.5" xml:space="preserve">

<line class="no-fill" :stroke="color" stroke-width="2" x1="4.5" y1="20.5" x2="4.5" y2="18.301"/>
<rect x="1" y="11.699" class="no-fill" :stroke="color" stroke-width="2" width="7" height="5.867"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="4.464" y1="10.967" x2="4.464" y2="9.5"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="15.379" y1="7" x2="15.379" y2="0"/>
<rect x="12" y="7.984" :stroke="color" stroke-width="2" width="7" height="3.031"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="15.5" y1="12.969" x2="15.5" y2="11.969"/>
</svg>
  </template>
  <script>
  export default {
    name: "shooting_star",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>