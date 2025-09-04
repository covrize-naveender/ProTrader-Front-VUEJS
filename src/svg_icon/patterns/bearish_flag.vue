<template>
    <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20.014" height="20.001"
	 viewBox="0 0 20.014 20.001" overflow="visible" enable-background="new 0 0 20.014 20.001" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="1" y1="19.001" x2="1.04" y2="0.002"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="1" y1="19.001" x2="18.994" y2="12.503"/>
<line class="no-fill" :stroke="color" stroke-width="2" x1="1.02" y1="9.462" x2="19.014" y2="2.964"/>
<line class="no-fill" :stroke="color" stroke-width="2" stroke-linecap="round" x1="18.994" y1="12.503" x2="19.014" y2="2.964"/>
</svg>
  </template>
  <script>
  export default {
    name: "bearish_flag",
    props: {
      color: {
        type: String,
        default: "#000000"
      }
    }
  }
  </script>