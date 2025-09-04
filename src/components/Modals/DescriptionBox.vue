<template>
    <div class="desc-block">
        <span style="font-weight: 600;">{{ title }}</span>
        <img :src="resolvedImagePath" />
        <p>{{ description }}</p>
    </div>
</template>

<script>
export default {
    name: 'DescriptionBox',
    props: {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        imagePath: {
            type: String,
            default: "indicator-desc.png"
        }
    },
    computed: {
        resolvedImagePath() {
            try {
                return require(`@/assets/descriptionBox/${this.imagePath}`);
            } catch (e) {
                console.error("Image not found:", this.imagePath);
                return ''; // Provide a fallback if image is missing
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>