<template>
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M13.8793 2.45451C14.2271 2.10667 14.7729 2.10667 15.1207 2.45451L17.5455 4.8793C17.8933 5.22714 17.8933 5.77286 17.5455 6.1207L7.25 16.4162L3.75 17.5L4.83384 14L15.1293 3.70452L13.8793 2.45451ZM14.5 4.43934L15.5607 5.5L14.25 6.81066L13.1893 5.75L14.5 4.43934ZM6.16616 14.8338L6.81066 13.1893L13.1893 6.81066L14.25 7.87134L7.87134 14.25L6.16616 14.8338Z"
            :fill="color" />
    </svg>
</template>

<script>
export default {
    name: "pencil_tool",
    props: {
        color: {
            type: String,
            default: "#000000"
        }
    }
}
</script>