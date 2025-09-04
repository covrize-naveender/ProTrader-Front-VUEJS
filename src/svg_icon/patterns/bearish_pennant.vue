<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="19.959" height="19.962"
	 viewBox="0 0 19.959 19.962" overflow="visible" enable-background="new 0 0 19.959 19.962" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="1" y1="19.001" x2="1" y2="0"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="1" y1="18.962" x2="18.959" y2="8.572"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="18.959" y1="8.572" x2="2" y2="10.468"/>
</svg>
  </template>
  <script>
  export default {
    name: "bearish_pennant",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>