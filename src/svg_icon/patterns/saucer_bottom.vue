<template>
  <svg  version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="20.041" height="20.031"
	 viewBox="0 0 20.041 20.031" overflow="visible" enable-background="new 0 0 20.041 20.031" xml:space="preserve">
<line class="no-fill" :stroke="color" stroke-width="2" x1="0.011" y1="1" x2="20.027" y2="1.029"/>
<path class="no-fill" :stroke="color" stroke-width="2" d="M1,1.001c0,9.961,4.051,18.019,9.057,18.019"/>
<path class="no-fill" :stroke="color" stroke-width="2" d="M19.041,1.012c0,9.96-4.044,18.019-9.041,18.019"/>
</svg>
</template>
<script>
export default {
  name: "saucer_bottom",
  props: {
    color: {
      type: String,
      default: "#000000"
    }
  }
}
</script>