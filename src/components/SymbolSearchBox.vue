<template>
  <div class="symbol-search-container toptool-gap-small" :style="flexDirectionStyle">
    <div class="search-container" id="symbol-search">
      <vue-autosuggest :isDisabled="isDisabled" ref="autoSuggestRef" class="right-header-search-combo"
        :suggestions="filteredOptions" :section-configs="sectionConfigs" :on-selected="onSelected"
        :input-props="inputProps" :renderSuggestion="renderSuggestion" @input="onInputChange"
        :value="value || selected">
      </vue-autosuggest>
    </div>
    <div class="chart-change-btn toptool-gap-small" style="display: flex;" id="exchange-btn-grp">
      <p-button class="p-button-secondary p-button-outlined" icon="pi pi-angle-left" :disabled="isDisabled"
        @click="selectPreviousSymbol" />
      <p-button class="p-button-secondary p-button-outlined" icon="pi pi-angle-right" :disabled="isDisabled"
        @click="selectNextSymbol" />
      <p-button icon="pi pi-angle-double-down" class="p-button-secondary" :disabled="isDisabled"
        @click="selectSymbolModal" id="exchange-btn"/>

    </div>
    <p-button icon="pi pi-angle-double-down" class="chart-change-drp p-button-secondary" @click="toggleTickerMenu" id="exchange-btn-small"/>
    <p-menu class="symbol-menu" ref="tickerChangeMenu" :model="tickerMenuItems" :popup="true" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VueAutosuggest } from '../extensions/autoSuggest/vue-autosuggest'
import { fetchSymbolByName } from '../services/symbol'
import { sectionConfig } from '@/constants/sectionConfig'


export default {
  name: 'SymbolSearchBox',
  components: { VueAutosuggest },
  props: {
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
    },
    flexStart: {
      type: Boolean,
    },
    manualNavigation: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textInputEvent: null,
      textInputRef: null,
      optionDisplays: 'block',
      topSymbolSelect: '',
      arrowIcon: 'arrow left',
      symbolName: '',
      symbolIndex: 0,
      val: '',
      renderItem: '',
      currentSymbolType: '',
      selected: '',
      filteredOptions: [],
      inputProps: {
        id: 'autosuggest__input' + Date.now().toString(),
        placeholder: 'Search Stocks...',
      },
      sectionConfigs: sectionConfig(this.onSelected),
      limit: 10,
    }
  },
  methods: {
    getSuggestionValue(suggestion) {
      let symbol = suggestion.item?.symbol
      let shortSymboName = ''
      if (symbol) {
        let symbolShortArray = symbol.replace(".au", "").replace(".ca", "")
        if (symbolShortArray.length) {
          shortSymboName = symbolShortArray
        }
      }
      return shortSymboName
    },
    selectAllText(event) {
      // debugger
      // this.textInputRef = event.target.$options._parentVnode.data.ref
      this.textInputEvent = event
      event.target.select()
    },
    renderSuggestion(suggestion) {
      let currentItem = this.$refs.autoSuggestRef.$data?.currentItem
      let currentIndex = this.$refs.autoSuggestRef.$data?.currentIndex
      let selected = currentItem?.item === suggestion.item

      // this.value = currentItem?.item === suggestion.item
      let topSymbol = {
        label: this.filteredOptions[0].name.toUpperCase(),
        item: this.filteredOptions[0].data[0],
      }
      this.topSymbolSelect = topSymbol
      let topSymbolColor =
        !currentIndex && !currentItem?.item
          ? topSymbol.item == suggestion.item
          : ''
      let tagName = 'div'

      let styles = {
        backgroundColor: this.themeSecondaryColor.backgroundColor,
        color: 'white',
        display: 'flex',
        'align-items': 'center',
      }
      let stylesNull = {
        backgroundColor: 'transparent',
        display: 'flex',
        'align-items': 'center',
      }

      // debugger
      let stylesObj = selected
        ? { style: selected ? styles : stylesNull }
        : { style: topSymbolColor ? styles : stylesNull }
      let shortSymboName = suggestion.item.symbol.replace(".au", "").replace(".ca", "")

      return this.$createElement(
        'div',
        {
          ...stylesObj,
        },
        [
          this.$createElement(
            'span',
            { style: { 'font-weight': 'bold', width: '90px' } },
            [
              this.$createElement(
                'span',
                { style: { 'font-weight': 'bold' } },
                shortSymboName
              ),
            ]
          ),
          this.$createElement(
            'span',
            {
              style: {
                width: 'max-content',
                'text-align': 'right',
                'flex-basis': '50%;',
              },
            },
            this.getCompanyName(suggestion.item)
          ),
        ]
      )
    },
    getCompanyName(symbol) {
      let res = ''
      let companyName = symbol.companyName
      if (companyName) {
        if (companyName.length > 30) {
          res = `${companyName.substring(0, 30)} ...`
        } else {
          res = companyName
        }
      }
      return res
    },
    Scroll() {
      if (this.scrollRight == true) {
        document.getElementById('right-container').style.display = 'block '
        document.getElementById('left-container').style.width = '50%'
        this.$store.commit('SCROLL_RIGHT', false)
        this.arrowIcon = 'arrow right'
      } else {
        document.getElementById('right-container').style.display = 'none '
        this.$store.commit('SCROLL_RIGHT', true)
        this.arrowIcon = 'arrow left'
      }
    },
    onSelected(option) {
      let optionalParams = option.item.symbol
      let optionalLabel = option.label
      this.selected = optionalParams
      // this.value = optionalParams
      this.currentSymbolType = optionalLabel
      this.symbolIndex = this.getSymbolsList.findIndex(
        (sym) => sym === optionalParams
      )
      this.$emit('input', optionalParams + '~' + optionalLabel)
      this.$emit('refreshInput', optionalParams + '~' + optionalLabel)
      this.selected = ''
    },

    handleSelect() {
    },

    TopSymbol() {
      let currentIndex = this.$refs.autoSuggestRef.$data?.currentIndex
      if (currentIndex == null) {
        this.onSelected(this.topSymbolSelect)
      }
    },

    async onInputChange(text) {
      if (!text) {
        let filtered2 = await fetchSymbolByName(this, '1')
        this.filteredOptions = filtered2
        this.$store.commit('TOP_LIST_SYMBOL', '1')
        this.$store.commit('TOP_LIST_SYMBOL_NAME', '1')
        this.optionDisplays = 'none'
        return
      } else {
        //TEMP_COMMENT
        let filtered2 = await fetchSymbolByName(this, text)
        this.optionDisplays = 'block'
        this.filteredOptions = filtered2
        this.$emit('TextMatchSymbolBox', this.filteredOptions.length, text)
        if (this.filteredOptions && this.filteredOptions.length) {
          this.$store.commit(
            'TOP_LIST_SYMBOL',
            JSON.stringify(filtered2[0].data[0].symbol)
          )
          this.$store.commit(
            'TOP_LIST_SYMBOL_NAME',
            JSON.stringify(filtered2[0].name)
          )
        } else {
          this.$store.commit('TOP_LIST_SYMBOL', '')
          this.$store.commit('TOP_LIST_SYMBOL_NAME', '')
          this.optionDisplays = 'none'
        }
      }
    },
    selectNextSymbol() {
      if (this.manualNavigation) {
        return this.$emit('nextSymbol')
      }

      if (this.getSymbolsList.length - 1 > this.symbolIndex) {
        this.symbolIndex++
        this.selected = this.getSymbolsList[this.symbolIndex]
        this.$emit('input', this.getSymbolsList[this.symbolIndex])
      }
    },
    selectPreviousSymbol() {
      if (this.manualNavigation) {
        return this.$emit('prevSymbol')
      }

      if (1 < this.symbolIndex) {
        this.symbolIndex--
        this.selected = this.getSymbolsList[this.symbolIndex]
        this.$emit('input', this.getSymbolsList[this.symbolIndex])
      }
    },
    selectSymbolModal() {
      return this.$emit('selectSymbolModal')
    },
    toggleTickerMenu(event) {
      this.$refs.tickerChangeMenu.toggle(event);
    },
  },

  computed: {
    ...mapGetters([
      'themeDarkMode',
      'dc',
      'tv',
      'getSymbolsList',
      'getMarketDesc',
      'topListSymbol',
      'topListSymbolName',
      'scrollRight',
      'themeFontColor',
      'themePrimaryColor',
      'themeSecondaryColor',
      'multiChartSymbol',
      'selectedTab'
    ]),
    fieldColor() {
      return this.themeDarkMode
        ? {
          background: '#707070 !important',
          borderColor: '#555555',
          color: '#C6C6C6',
          borderRadius: 0,
        }
        : {}
    },
    selectedSymbolType() {
      return this.multiChartSymbol[this.selectedTab]?.metaData?.exchange || 'ASX'
    },
    flexDirectionStyle() {
      const dir = this.flexStart ? 'flex-start' : 'flex-start'
      return `justify-content: ${dir};`
    },
    tickerMenuItems() {
      return [
        { label: 'Browse', icon: 'pi pi-search', command: () => { this.selectSymbolModal() } },
        { label: 'Previous', icon: 'pi pi-angle-left', command: () => { this.selectPreviousSymbol() } },
        { label: 'Next', icon: 'pi pi-angle-right', command: () => { this.selectNextSymbol() } },
      ]
    }
  },
  watch: {
    // themeSecondaryColor(){
    //   this.hoverColorDrpd = this.themeSecondaryColor.backgroundColor
    // }
    //
  },
}
</script>

<style>
.symbol-search-container {
  display: flex;
}

#autosuggest {
  height: 100% !important;
}

#autosuggest div[role='combobox'] {
  height: 100%;
}

#autosuggest div[role='combobox'] input {
  height: 100%;
}

#autosuggest div[role='combobox'] input {
  text-transform: uppercase;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

#autosuggest div[role='combobox'] input:focus {

  border: 1px solid #66afe9;
  outline: 0;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(102 175 233 / 60%);
}

.search-results {
  position: absolute;
  background-color: red;
  top: 100%;
  width: 100%;
  height: 500px;
  z-index: 200;
}

.n-input {
  padding: 0.8rem !important;
}

.search-container {
  position: relative;
}

.avatar {
  height: 25px;
  width: 25px;
  border-radius: 20px;
  margin-right: 10px;
}

#autosuggest div[role='combobox'] input {
  outline: none;
  position: relative;
  /* right: 15px; */
  display: block;
  /* padding: 10px; */
  padding: 0.5rem;
  width: 100%;
  border-radius: 5px;
  /* padding: 9px !important; */
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

@media screen and (max-width: 345px) {
  #autosuggest div[role='combobox'] input {
    left: 0.1rem;
  }
}

.autosuggest__results-container {
  position: relative;
  right: 25px;
  width: 229%;

  /* display: v-bind(optionDisplays); */
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  /* right: 0; */
  left: 2rem;
  /* margin-left: 10px; */
  z-index: 10000001;
  min-width: 240px;
  width: max-content;
  max-width: inherit !important;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background: white;
  padding: 0px;
  max-height: 40vh;
  overflow-y: scroll;
  /* box-shadow: 0px 0px 15px 1px grey; */
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

/* .autosuggest__results ul .autosuggest__results-before{
  
} */

.autosuggest__results .autosuggest__results-item {
  cursor: pointer;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: normal;
}

#autosuggest ul:nth-child(1)>.autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results-before {
  color: #000000;
  font-size: 11px;
  margin-left: 0;
  padding: 5px 10px;
  font-weight: 400;
  background-color: #ebebeb;
  text-transform: uppercase;
}

.right-header-market-button {
  padding: 10px 10px !important;
  background-color: #f0f0f0 !important;
}

@media screen and (max-width: 560px) {
  .right-header-mob-dropdn-buttonn {
    display: block !important;
  }

  .right-header-button {
    display: none !important;
  }

  .right-header-mob-dropdn-button {
    display: flex !important;
    padding: 0.78571429em 0.78571429em !important;
    /* margin-right: 13px !important; */
    justify-content: center !important;
  }
}

@media screen and (max-width: 470px) {
  .right-header-button {
    display: none !important;
  }

  .autosuggest__results-container {
    position: relative;
    right: 0;
    width: 130%;

    /* display: v-bind(optionDisplays); */
  }

  .right-header-market-button {
    /* display:none !important; */
  }

}

@media screen and (max-width: 420px) {
  

  .autosuggest__results-container {
    position: relative;
    right: 0;
    width: 160%;

    /* display: v-bind(optionDisplays); */
  }
}

@media screen and (max-width: 370px) {
  .right-header-market-button {
    font-size: 10px !important;
    /* display: none !important; */
  }


  .autosuggest__results-container {
    position: relative;
    right: 0;
    width: 130%;

    /* display: v-bind(optionDisplays); */
  }
}

.right_attached .ui.button>.icon:not(.button) {
  margin: 0 !important;
}

.autosuggest__results .autosuggest__results-item {
  padding: 0;
}

.autosuggest__results .autosuggest__results-item div {
  padding: 5px 10px;
}

.autosuggest__results::-webkit-scrollbar {
  display: none;
}

#autosuggest div[role='combobox'] input::selection {
  color: white !important;
  background: #3390ff !important;
}
</style>
