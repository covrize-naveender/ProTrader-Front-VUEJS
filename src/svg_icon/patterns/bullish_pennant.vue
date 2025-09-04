<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="19.959" height="19.961"
	 viewBox="0 0 19.959 19.961" overflow="visible" enable-background="new 0 0 19.959 19.961" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="1" y1="0.961" x2="1" y2="19.961"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="1" y1="1" x2="18.959" y2="11.389"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="18.959" y1="11.389" x2="2" y2="9.493"/>
</svg>
  </template>
  <script>
  export default {
    name: "bullish_pennant",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>