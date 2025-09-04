<template>
    <div>
        <!-- {{ userMultiSettings[type] }} -->
        <div v-for="(multi, index) in userMultiSettings[type]" :key="index" class="field-card">

            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Period</label>
                </div>
                <div class="p-col">
                    <p-inputText type="number" v-model.number="multi.period" placeholder="20"
                        @input="updateSettings()" />
                </div>
                <!-- <div class="p-col">
                    <p-button icon="pi pi-times" class="remove-button p-button-light p-button-sm"
                        v-if="userMultiSettings[type].length > 1" />

                </div> -->
            </div>
            <div class="overlay-field p-grid">
                <div class="p-col">
                    <label>Colour</label>
                </div>
                <div class="p-col">
                    <color-picker v-model="multi.color" :isSettingsPicker="true" :isIconVisible="false" type="color"
                        @input="updateSettings()" />
                </div>
                <!-- <div class="p-col"></div> -->
            </div>
        </div>
        <!-- <div class="field-card">

            <div class="overlay-field p-grid">
                <div class="p-col"></div>
                <div class="p-col">

                    <p-button icon="pi pi-plus" label="Add" class="add-button" />
                </div>

            </div>
        </div> -->


    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ColorPicker from '@/baseComponents/ColorPicker.vue'

export default {
    name: 'MultiValueIndicator',
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    components: {
        ColorPicker
    },
    computed: {
        ...mapGetters([
            'userMultiSettings'
        ])
    },
    methods: {
        updateSettings() {
            this.$emit('updateProp', this.type);
        },
    }
}
</script>

<style lang="scss" scoped></style>