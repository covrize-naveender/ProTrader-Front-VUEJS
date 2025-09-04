<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20" height="19.985" viewBox="0 0 20 19.985"
	 overflow="visible" enable-background="new 0 0 20 19.985" xml:space="preserve">

<rect x="1" y="2.985" :stroke="color" stroke-width="2" width="6" height="14"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="4.004" y1="2" x2="4.004" y2="0"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="3.996" y1="19.985" x2="3.996" y2="17.985"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="16" y1="17" x2="16" y2="5"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="20" y1="11" x2="12" y2="11"/>
</svg>

  </template>
  <script>
  export default {
    name: "bullish_harami_cross",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>