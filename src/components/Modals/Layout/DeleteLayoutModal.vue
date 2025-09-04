<template>
  <p-dialog class="small-dialog" header="Delete Layout" :visible.sync="visible" @hide="$emit('toggleModal')"
    :modal="true" >
    <h4 class="ui">
      Are you sure you want to remove your
      <span style="color: red">({{ deleteLayoutName }})</span> Layout Template?
    </h4>
    <template #footer>

      <p-button label="Yes" @click="removeLayout" :disabled="showLoader"/>
      <p-button label="No" @click="$emit('toggleModal')" :disabled="showLoader" class="p-button-secondary" />
    </template>
  </p-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DeleteLayoutModal',
  computed: {
    ...mapGetters([
      'themeSecondaryColor',
      'themeDarkMode',
    ]),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    deleteLayoutName: {
      type: String
    },
    deleteLayoutId: {
      type: String
    }

  },
  data() {
    return {
      showLoader: false,
    }
  },
  methods: {
    ...mapActions([
      'deleteLayout'
    ]),
    async removeLayout() {
      this.showLoader = true
      this.deleteLayout(this.deleteLayoutId)
      setTimeout(() => {
        this.showLoader = false
        this.$emit('toggleModal')
      }, 1000)

    }
  },

}
</script>

<style scoped></style>