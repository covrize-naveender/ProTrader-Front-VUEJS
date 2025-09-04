<template>
    <i class="custom-svg-icon">
        <component class="leftsideSvg" :is="componentRef" v-if="componentRef" :color="svgColor" />
    </i>
</template>

<script>
import SvgIconList from "./index";
import { mapGetters } from 'vuex'
export default {
    name: 'LeftSideSvg',
    props: {
        path: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            componentRef: undefined,
        }
    },
    computed: {
        ...mapGetters([
            'svgColor'
        ]),
    },
    async mounted() {
        this.componentRef = SvgIconList.find(d => d.name === this.path)

    },
}
</script>

<style lang="scss" scoped></style>