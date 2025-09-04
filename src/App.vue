<template>
  <div class="f-h" :class="themeDarkMode ? 'pt-dark-mode' : 'pt-classic-mode'">
    <!-- <error-dialog
      :open="isDialogOpen"
      :on-click-yes="onClickYes"
      :on-click-no="onClickNo"
    /> -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HomeComponent from './components/HomeComponent.vue'
import { THEME_DETAILS } from './settings/THEME_DETAILS';

export default {
  name: 'App',
  components: {
    HomeComponent,
  },
  computed: {
    ...mapGetters(['themeSettings', 'themeDarkMode']),
  },
  mounted() {
    if (this.themeDarkMode) {
      this.$store.commit('UPDATE_DEFAULT_THEME', 'dark')
    } else {
      this.$store.commit('UPDATE_DEFAULT_THEME', 'classic')
    }
    // userHttp.interceptors.response.use(null, (error) => {
    //   if (error.response && error.response.status === 550) {
    //     try {
    //       this.openErrorDialog()
    //     } catch (error) {
    //     }
    //   } else {
    //     onGetError(error)
    //   }
    // })
  },

  watch: {
    themeSettings(val) {
      let primary
      let cardColor
      let font
      document.documentElement.classList.remove('classic-theme', 'dark-theme', 'grey-theme', 'custom-theme');
      if (val?.id) {
        const themeColors = THEME_DETAILS[val.id]
        if (val?.id !== 'classic') {
          document.documentElement.classList.add(`${val?.id}-theme`);
        }
        primary = themeColors.secondary
        cardColor = themeColors.primary
        font = themeColors.font
      }
      else {
        document.documentElement.classList.add(`custom-theme`);
        primary = val.settings.secondary
        cardColor = val.settings.primary
        font = val.settings.font
      }
      document.documentElement.style.setProperty('--primary-color', primary);
      document.documentElement.style.setProperty('--card-background', cardColor);
      document.documentElement.style.setProperty('--text-color', font);
      this.changeSvgColor(getComputedStyle(document.documentElement).getPropertyValue("--text-color").trim())
    },
    
  },
  methods: {
    ...mapActions([
      'changeSvgColor'
    ])
  },
}
</script>

<style>
#app {
  user-select: none;
}


/* .ui.selection.dropdown {
  color: v-bind(inputFontColor) !important;
}

.ui.selection.dropdown .menu>.item {
  color: v-bind(SelectedItem) !important;
} */

input[type='number']:hover::-webkit-inner-spin-button,
input[type='number']:hover::-webkit-outer-spin-button {
  opacity: 0.4;
}

input[type='number']:focus::-webkit-inner-spin-button,
input[type='number']:focus::-webkit-outer-spin-button {
  opacity: 0.4;
}

/* .ui.form select {
  background-color: v-bind(inputBackColor) !important;
  color: v-bind(inputFontColor) !important;
}

option {
  background-color: v-bind(inputBackColor) !important;
  color: v-bind(inputFontColor) !important;
}

select {
  background-color: v-bind(inputBackColor) !important;
  color: v-bind(inputFontColor) !important;
}

.p-inputtext {
  background-color: v-bind(inputBackColor) !important;
  color: v-bind(inputFontColor) !important;
  box-shadow: inset 0 0 0 0 transparent;
} */
</style>
