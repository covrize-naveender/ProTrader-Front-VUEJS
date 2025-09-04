<template>
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_471_119)">
      <path
        d="M15.8333 15.9512C14.3302 17.4247 12.2712 18.3333 10 18.3333C5.39762 18.3333 1.66666 14.6023 1.66666 9.99996C1.66666 5.39759 5.39762 1.66663 10 1.66663C12.3312 1.66663 14.4388 2.62382 15.9512 4.16663"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.66666 12.5C7.42677 13.512 8.63694 14.1667 10 14.1667C10.5926 14.1667 11.1563 14.0429 11.6667 13.8199"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.67414 7.5L6.66666 7.5" :stroke="color" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" />
      <ellipse cx="13.3333" cy="8.33331" rx="2.5" ry="2.5" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M18.3333 9.99998C18.1605 9.67007 18.0741 9.50511 17.96 9.36065C17.6679 8.99114 17.232 8.70054 16.7132 8.52946C16.5104 8.46258 16.2847 8.41949 15.8333 8.33331"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_471_119">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>


</template>
<script>
export default {
  name: "emoji_tool",
  props: {
    color: {
      type: String,
      default: "#000000"
    }
  }
}
</script>