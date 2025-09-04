<template>
  <div class="symbol-search-container p-d-flex p-jc-center" style="gap: 0.2rem; ">
    <div class="search-container2">
      <vue-autosuggest ref="autoSuggestRef2" class="right-header-search-combo" :suggestions="filteredOptions"
        :section-configs="sectionConfigs" :on-selected="onSelected" :get-suggestion-value="getSuggestionValue"
        :input-props="inputProps" :renderSuggestion="renderSuggestion" @input="onInputChange" :value="value">

      </vue-autosuggest>
    </div>
    <div class="chart-change-btn p-d-flex" style="gap: 0.2rem;">


      <p-button type="button" class="p-button-secondary" icon="pi pi-angle-double-down" @click="$emit('searchModalOpen')" />
      <p-button type="button" class="p-button-secondary" icon="pi pi-times" @click="clearData" v-if="showCloseButton"/>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { VueAutosuggest } from '../../../extensions/autoSuggest/vue-autosuggest';
import { fetchSymbolByName } from '../../../services/symbol';
import { sectionConfig } from "@/constants/sectionConfig";
import SearchStockModal from '../SearchStockModal.vue';


export default {
  name: 'SymbolSearchBoxModal',
  components: { VueAutosuggest, SearchStockModal },
  props: {
    showCloseButton: {
      type: Boolean,
      default: true
    },
    value: {
      type: String
    },
    symbolNameProp: {
      type: String,
      default: ""
    },
    selectedSymbolType: {
      type: String,
      default: "ASX"
    },
    flexStart: {
      type: Boolean
    },
    manualNavigation: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hoverColorDrpd: 'black',
      arrowIcon: 'arrow left',
      symbolIndex: 0,
      symbolSearch: false,
      currentSymbolType: '',
      selected: '',
      filteredOptions: [],
      inputProps: {
        id: 'autosuggest__input' + Date.now().toString(),
        placeholder: 'search'
      },
      sectionConfigs: sectionConfig(this.onSelected),
      limit: 10
    }
  },
  methods: {
    ...mapMutations(['changeSymbol', 'deleteSymbol']),
    selectSymbolModalData(val) {
      this.changeSymbol({ propName: this.symbolNameProp, propValue: val })
    },
    getSuggestionValue(suggestion) {
      let symbol = suggestion.item?.symbol;
      let shortSymboName = "";
      if (symbol) {
        let symbolShortArray = symbol.replace(".au", "").replace(".ca", "");
        if (symbolShortArray.length) {
          shortSymboName = symbolShortArray
        }
      }
      return shortSymboName
    },
    renderSuggestion(suggestion) {
      let currentItem = this.$refs.autoSuggestRef2.$data?.currentItem
      let currentIndex = this.$refs.autoSuggestRef2.$data?.currentIndex
      let selected = currentItem?.item === suggestion.item
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

      let styles = { backgroundColor: this.themeSecondaryColor.backgroundColor, 'color': 'white', 'display': 'flex', 'align-items': 'center' }
      let stylesNull = { backgroundColor: 'transparent', 'display': 'flex', 'align-items': 'center' }

      let stylesObj = selected
        ? { style: selected ? styles : stylesNull }
        : { style: topSymbolColor ? styles : stylesNull }

      let shortSymboName = suggestion.item.symbol.replace(".au", "").replace(".ca", "")
      return this.$createElement('div', stylesObj, [
        this.$createElement('span', { 'style': { 'font-weight': 'bold', 'margin-right': '15px' } }, shortSymboName),
        this.$createElement('span', { 'style': { 'flex-basis': '60%', 'text-align': 'left', 'font-weight': '100' } }, this.getCompanyName(suggestion.item))
      ]);
    },
    getCompanyName(symbol) {
      let res = ""
      let companyName = symbol.companyName;
      if (companyName) {

        if (companyName.length > 30) {
          res = `${companyName.substring(0, 30)} ...`
        } else {
          res = companyName
        }
      }
      return res
    },
    clearData() {
      this.selected = ''
      this.$emit('input', "")
    },
    Scroll() {
      if (this.scrollRight == true) {
        document.getElementById("right-container").style.display = 'block '
        document.getElementById("left-container").style.width = '50%'
        this.$store.commit('SCROLL_RIGHT', false)
        this.arrowIcon = 'arrow right'
      }
      else {
        document.getElementById("right-container").style.display = 'none '
        this.$store.commit('SCROLL_RIGHT', true)
        this.arrowIcon = 'arrow left'

      }
      // content.scrollLeft += 80;
    },
    onSelected(option) {
      let optionalParams = option.item.symbol;
      let optionalLabel = option.label;
      this.selected = optionalParams
      this.currentSymbolType = optionalLabel
      this.symbolIndex = this.getSymbolsList.findIndex(
        sym => sym === optionalParams
      )
      this.$emit('input', optionalParams + "~" + optionalLabel)
    },
    TopSymbol() {

      let currentIndex = this.$refs.autoSuggestRef.$data?.currentIndex
      if (currentIndex == null) {
        this.onSelected(this.topSymbolSelect)
      }

    },
    async onInputChange(text) {
      if (text === '' || text === undefined) {
        this.$emit('input', '')
        let filtered2 = await fetchSymbolByName(this, "1")
        this.filteredOptions = filtered2
        this.$emit('TextMatchSymbolBox', this.filteredOptions.length)
        this.$store.commit('TOP_LIST_SYMBOL', '1')
        this.$store.commit('TOP_LIST_SYMBOL_NAME', '1')
        this.optionDisplays = 'none'

        return
      }
      let filtered2 = await fetchSymbolByName(this, text)
      if (filtered2 && filtered2.length > 0 && filtered2[0].data && filtered2[0].data.length > 0) {
        this.$store.commit('TOP_LIST_SYMBOL', JSON.stringify(filtered2[0].data[0].symbol))
        this.$store.commit('TOP_LIST_SYMBOL_NAME', JSON.stringify(filtered2[0].name))
        this.filteredOptions = filtered2
      }
    },
    selectNextSymbol() {
      if (this.manualNavigation) {
        return this.$emit('nextSymbol'),
          this.dc.tv.resetChart(true)
      }
      if (this.getSymbolsList.length - 1 > this.symbolIndex) {
        this.symbolIndex++
        this.selected = this.getSymbolsList[this.symbolIndex]
        this.$emit('input', this.getSymbolsList[this.symbolIndex])
      }
    },
    selectPreviousSymbol() {
      if (this.manualNavigation) {
        return this.$emit('prevSymbol'),
          this.dc.tv.resetChart(true)
      }

      if (1 < this.symbolIndex) {
        this.symbolIndex--
        this.selected = this.getSymbolsList[this.symbolIndex]
        this.$emit('input', this.getSymbolsList[this.symbolIndex])
      }
    },
    selectSymbolModal(val) {
      this.symbolSearch = val
      // return this.$emit('selectSymbolModal')
    }
  },
  computed: {
    ...mapGetters(['themeDarkMode', 'dc', 'tv', 'getSymbolsList', 'getMarketDesc', 'topListSymbol', 'topListSymbolName', 'scrollRight', 'themeFontColor', 'themePrimaryColor', 'themeSecondaryColor']),
    fieldColor() {
      return this.themeDarkMode ? { background: '#707070 !important', borderColor: '#555555', color: '#C6C6C6', borderRadius: 0 } : {}
    },
    // selectedSymbolType() {
    //   if(this.value && this.value.length){
    //     let splitMarket = this.value.split("~")
    //     if(splitMarket.length === 2){
    //       return splitMarket[1].toUpperCase()
    //     }
    //   }
    //   return this.getMarketDesc || 'ASX'
    // },
    flexDirectionStyle() {
      const dir = this.flexStart ? 'flex-start' : 'flex-end'
      return `justify-content: ${dir};`
    }
  },
  watch: {
    themeSecondaryColor() {
      this.hoverColorDrpd = this.themeSecondaryColor.backgroundColor
    }

  },
  mounted() {
    this.hoverColorDrpd = this.themeSecondaryColor.backgroundColor
  }
}
</script>

<style scoped>
#autosuggest ul .autosuggest__results-item:hover {
  background-color: v-bind(hoverColorDrpd);
  /* owais */
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
.avatar {
  height: 25px;
  width: 25px;
  border-radius: 20px;
  margin-right: 10px;
}

#autosuggest div[role='combobox'] input {
  outline: none;
  position: relative;
  display: block;
  border: 1px solid #e0dddd;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.autosuggest__results-container {
  position: relative;
  width: 330%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: inherit;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
  max-height: 400px;
  overflow-y: scroll;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results-item {
  cursor: pointer;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
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

@media screen and (max-width: 560px) {
  .right-header-mob-dropdn-buttonn {
    /* display:block !important; */
  }

  .right-header-buttonn {
    /* display:none !important; */
  }

  .right-header-mob-dropdn-button {
    display: block !important;
    padding: .78571429em .78571429em !important;
  }
}

@media screen and (max-width: 470px) {
  .right-header-buttonn {
    /* display:none !important; */
  }

  .right-header-market-button {
    /* display:none !important; */
  }
}

@media screen and (max-width: 420px) {}

@media screen and (max-width: 370px) {
  .right-header-market-button {
    display: none !important;
  }
}

.right_attached .ui.button>.icon:not(.button) {
  margin: 0 !important;
}
</style>