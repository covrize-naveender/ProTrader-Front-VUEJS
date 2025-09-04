<template>
<svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20" height="20" viewBox="0 0 20 20"
	 overflow="visible" enable-background="new 0 0 20 20" xml:space="preserve">

<line class="no-fill" :stroke="color" stroke-width="2" x1="4.5" y1="15.5" x2="4.5" y2="13.301"/>
<rect x="1" y="6.699" :stroke="color" stroke-width="2" width="7" height="5.867"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="4.464" y1="6.733" x2="4.464" y2="3.733"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="15.379" y1="7" x2="15.379" y2="0"/>
<rect x="12" y="4" class="no-fill" :stroke="color" stroke-width="2" width="7" height="11"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="15.5" y1="20" x2="15.5" y2="15"/>
</svg>
  </template>
  <script>
  export default {
    name: "bullish_engulfing",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>