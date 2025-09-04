<template>
    <p-dialog :visible.sync="visible" :closable="false" @hide="onClose" :modal="true" class="searchStock-modal">

        <!-- Header Content -->
        <template #header>
            <div class="custom-header-container">
                <div class="custom-header-box-start">

                    <h2>ProTrader Search </h2>
                    <div class="custom-header-input-container">
                        <p-inputText placeholder="Filtered" icon="" fluid v-model="filteredtext"
                            v-on:keyup="keyUpSearch" class="p-inputtext-lg" />
                    </div>
                </div>
                <div class="custom-header-box-end">
                    <p-button icon="pi pi-refresh" class="p-button-secondary p-button-outlined"
                        @click="clearSymbolSearch" ref="clearSearch" v-tooltip.bottom="`Reset`" />
                    <p-button label="Confirm" :disabled="selectedTicker == null" @click.native="onSaveSettings" />
                    <p-button icon="pi pi-times" class="p-button-secondary p-button-outlined" @click="onClose"
                        v-tooltip.bottom="`Cancel`" />
                </div>
            </div>
        </template>

        <LoaderPanel :loading="loading">
            <div class="p-d-flex">

                <!-- Exchange List -->
                <div style="flex: 0.9;">
                    <p-accordion :activeIndex="0" class="exchange-accordian Searchmodal-heightStyle">
                        <p-accordiontab header="Exchange">
                            <p-listbox v-model="selectedMarketObj" :options="markets" optionLabel="desc"
                                class="exchange-menu" @change="tickerChange">
                                <template #option="slotProps">
                                    <div v-show="slotProps.option.show" class="header"
                                        :ref="`marketDiv_${slotProps.option.code}`">
                                        {{ slotProps.option.desc }}
                                    </div>
                                </template>
                            </p-listbox>
                        </p-accordiontab>
                    </p-accordion>

                </div>

                <!-- Category list -->
                <div style="flex: 0.5;">

                    <p-accordion :activeIndex="0" class="filter-accordian Searchmodal-heightStyle">
                        <p-accordiontab header="Filter">
                            <p-listbox v-model="selectedCatObj" :options="categoryByMarket" optionLabel="desc"
                                class="input-menu" @change="listchange">
                                <template #option="slotProps">

                                    <div class="header" :ref="`categoryDiv_${slotProps.option.desc}`">
                                        {{ slotProps.option.title }}
                                    </div>

                                </template>
                            </p-listbox>
                        </p-accordiontab>
                    </p-accordion>



                </div>

                <!-- Ticker Table -->
                <div style="flex: 2;">
                    <p-panel header="Search Results" class="result-data Searchmodal-heightStyle">
                        <p-datatable :value="symbolData" responsiveLayout="scroll" v-if="symbolData.length > 0 && !loading"
                            :selection.sync="selectedTicker" selectionMode="single" dataKey="symbol"
                            @row-select="onRowSelect" class="result-data-table">
                            <p-column field="symbol" header="Ticker" sortable>
                                <template #body="slotProps">
                                    {{ getSymbolName(slotProps.data) }}
                                </template>
                            </p-column>
                            <p-column field="companyName" header="Company" sortable>
                                <template #body="slotProps">
                                    {{ getCompanyName(slotProps.data) }}
                                </template>
                            </p-column>
                        </p-datatable>
                    </p-panel>
                </div>
            </div>
        </LoaderPanel>
    </p-dialog>
</template>

<script>
import { marketsData } from 'Data/markets'
import { mapGetters } from 'vuex'
import { fetchSymbolByName } from '../../services/symbol'
import LoaderPanel from '../Loader/LoaderPanel.vue'

const categoryList = [
    {
        show: true,
        id: 0,
        desc: '0-9',
        title: '0-9',
        keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        selected: false,
    },
    { show: true, id: 1, desc: 'A-B', title: 'A-B', keys: ['A', 'B'], selected: false },
    {
        show: true,
        id: 2,
        desc: 'C-F',
        title: 'C-F',
        keys: ['C', 'D', 'E', 'F'],
        selected: false,
    },
    {
        show: true,
        id: 3,
        desc: 'G-M',
        title: 'G-M',
        keys: ['G', 'H', 'I', 'J', 'K', 'L', 'M'],
        selected: false,
    },
    {
        show: true,
        id: 4,
        desc: 'N-R',
        title: 'N-R',
        keys: ['N', 'O', 'P', 'Q', 'R'],
        selected: false,
    },
    {
        show: true,
        id: 5,
        desc: 'S-Z',
        title: 'S-Z',
        keys: ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        selected: false,
    },
    {
        show: true,
        id: 6,
        desc: 'sp',
        title: '@-#-%-&',
        keys: ['@', '#', '%', '&'],
        selected: false,
    },
]
const localMarket = marketsData.map((m, i) => {
    return { ...m, show: true, categoryList, indexAfter: i }
})

const getLocalMarketClone = () => {
    return JSON.parse(JSON.stringify(localMarket))
}
export default {
    name: 'SearchSymbol',
    components: {
        LoaderPanel
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            cannotUpdateSymbol: true,
            searchMode: false,
            activateSearch: true,
            loading: false,
            filtered2: [],
            filteredtext: '',
            selectedMarket: 'ASX',
            selectedRange: '0-9',
            selectedSymbol: '',
            markets: getLocalMarketClone(),
            selectedMarketObj: null,
            selectedMarketObjRep: null,
            selectedCatObj: null,
            selectedCatObjRep: null,
            selectedTicker: null,
            category: JSON.parse(JSON.stringify(categoryList)),
            symbolData: [
                // { code: 'AAF', name: 'Symbol Name', selected: false },
            ],
            userData: {},
            multiItems: 0,
            changesNotSaved: false,
            showCategory: true,
            showContracts: false,
            theme_type: 1,
            selected_theme: 1,
            darkBackColor: 'white',
            darkFontColor: 'black',
            darkBorderColor: '#eee',
        }
    },
    methods: {
        onRowSelect(event) {
            this.symbolChange(event.index, event.data);
        },
        listchange(event) {
            if (event.value == null) {
                this.selectedCatObj = this.selectedCatObjRep
            }
            else {
                this.updateContract(event.value.id, event.value.desc, 'category', 'showContracts')
                this.selectedCatObjRep = event.value
            }

        },
        tickerChange(event) {

            if (event.value == null) {
                this.selectedMarketObj = this.selectedMarketObjRep
            }
            else {

                this.changeMarketState(event.value.indexAfter, 'markets', 'showCategory')
                this.selectedMarketObjRep = event.value
            }

        },
        async keyUpSearch(e) {
            
            const ignoredKeyCodes = [13, 35, 36, 37, 38, 39, 40, 16, 17]
            const { keyCode, target } = e
            const searchText = target.value.trim()
            if (searchText === '') {
                if (this.searchMode) {
                    await this.filteredText(searchText)
                }
                this.clearSymbolSearch()
                this.searchMode = false
                return
            } else {
                this.searchMode = true
            }

            if (ignoredKeyCodes.indexOf(keyCode) > -1) {
                return
            }
            this.activateSearch = true
            await this.filteredText(searchText)
        },
        async onSaveSettings() {
            this.onClose()
            this.$emit(
                'selectSymbolModalData',
                this.selectedSymbol + '~' + this.selectedMarket
            )
        },
        getSymbolName(symbol) {
            let res = ''
            let symbolName = symbol.symbol
            if (symbolName) {
                let symbolNameParts = symbolName.replace(".au", "").replace(".ca", "")
                if (symbolNameParts.length) {
                    res = symbolNameParts
                }
            }
            return res
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
        onClose() {
            this.$emit('closeModal')

        },
        closeModal() {
            if (this.changesNotSaved) {
                this.$store.commit('RESET_CHART_SETTINGS', {
                    chartSettings: this.defaultChartSettings,
                })
                this.$store.commit('UPDATE_CHART_STATE', new Date().getTime())
            }
            // this.settings = this.defaultIndicatorSettings
            this.onClose()
        },
        async changeMarketState(id, prop, changeProp) {
            
            this[prop] = this[prop].map((v, i) => {
                if (i === id) {
                    v.selected = true
                } else {
                    v.selected = false
                }
                return v
            })
            this[changeProp] = true
            this.selectedMarket = this[prop][id].code
            this.symbolData = []
            let filterMarket = this.markets.find(
                (m) => m.code === this.selectedMarket
            )
            if (
                filterMarket &&
                filterMarket.categoryList &&
                filterMarket.categoryList.length
            ) {
                
                if (this.categoryByMarket && this.categoryByMarket[0]) {
                    await this.updateContract(this.categoryByMarket[0].id, this.categoryByMarket[0].desc, 'category', 'showContracts')
                    this.selectedCatObj = this.categoryByMarket[0]
                    this.selectedCatObjRep = this.categoryByMarket[0]
                }
            }
        },
        async updateContract(id, desc) {
            this.selectedRange = desc
            let allMarkets = this.markets
            if (allMarkets && allMarkets.length) {
                let selectedMarket = allMarkets.find(
                    (m) => m.code === this.selectedMarket
                )
                if (selectedMarket) {
                    let categoryList = selectedMarket.categoryList
                    categoryList = categoryList.map((v, i) => {
                        if (i === id) {
                            v.selected = true
                        } else {
                            v.selected = false
                        }
                        return v
                    })
                    selectedMarket.categoryList = categoryList
                }
            }

            if (this.filteredtext && this.filteredtext.length) {
                this.activateSearch = false
            }
            await this.filteredText(desc, false)
        },
        clearSymbolSearch() {
            this.filteredtext = ''
            this.filtered2 = []
            this.symbolData = []
            this.activateSearch = true
            this.markets = getLocalMarketClone()
            // this.category= JSON.parse(JSON.stringify(categoryList))
        },
        async filteredText(text, updateText = true) {
            
            let isRange = !updateText
            this.selectedTicker = null
            if (this.activateSearch) {
                if (!this.searchMode) {
                    this.loading = true
                }
                let filtered2 = await fetchSymbolByName(
                    this,
                    text,
                    false,
                    isRange,
                    isRange ? this.selectedMarket : '',
                    true,
                    true
                )
                if (typeof filtered2 !== 'string') {
                    this.filtered2 = filtered2
                    await this.filterData(updateText)
                    this.loading = false
                } else {
                    let textIsNotExist = text === null || text.length === 0
                    if (textIsNotExist) {
                        this.clearSymbolSearch()
                        this.loading = false
                    }
                }
            } else {
                if (!this.searchMode) {
                    this.loading = true
                }
                await this.filterData(updateText)
                this.loading = false
            }
            
        },
        async filterData(updateText) {
            let filterData = this.filtered2
            if (filterData) {
                let selectedRange = this.category.find(
                    (d) => d.desc === this.selectedRange
                )
                let selectedMarketData = filterData[this.selectedMarket]
                let filterMarkets = []
                let firstMarketKey
                let firstCategory
                if (updateText) {
                    let marketKeys = Object.keys(filterData)
                    if (marketKeys.length) {
                        for (const marketKey of marketKeys) {
                            let marketData = filterData[marketKey]
                            if (!firstMarketKey) firstMarketKey = marketKey
                            let keys = Object.keys(marketData)

                            let localMarketClone = getLocalMarketClone()
                            let filterMarket = localMarketClone.find(
                                (m) => m.code === marketKey
                            )
                            if (filterMarket) {
                                let categoryList = filterMarket.categoryList
                                let filteredCatList = categoryList.filter((m) => {
                                    let categoryKeys = m.keys
                                    // let result = categoryKeys.includes(keys)
                                    let result = categoryKeys.find((element) =>
                                        keys.includes(element)
                                    )
                                    return result
                                })
                                // filteredCatList = Object.assign({},filteredCatList)
                                if (filteredCatList.length) {
                                    filterMarket.categoryList = filteredCatList
                                    firstCategory = filteredCatList[0].desc
                                }

                                filterMarkets.push(filterMarket)
                            }
                        }
                    }


                    this.markets = filterMarkets.map((m, i) => {
                        return { ...m, indexAfter: i }
                    })
                }
                let alphaCategoryData = []
                if (selectedRange) {
                    let keys = selectedRange.keys
                    for (const selectedMarketDataKey in selectedMarketData) {
                        if (keys.includes(selectedMarketDataKey)) {
                            alphaCategoryData.push(
                                ...selectedMarketData[selectedMarketDataKey]
                            )
                        }
                    }
                }


                this.symbolData = alphaCategoryData
                this.showCategory = true
                this.showContracts = true

                if (firstMarketKey) {
                    this.selectedMarket = firstMarketKey
                    setTimeout(() => {
                        this.selectMarketRef(this.selectedMarket)
                    })
                }
            }
        },
        symbolChange(id, obj) {
            this.selectedSymbol = obj.symbol
            let datamine = this.symbolData.map((v, i) => {
                if (i === id) {
                    v.selected = true
                    this.cannotUpdateSymbol = false
                } else {
                    v.selected = false
                }
                return v
            })
        },
        selectMarketRef(selectedMarket) {
            if (this.markets && this.markets[0]) {
                this.changeMarketState(0, 'markets', 'showCategory')
                this.selectedMarketObj = this.markets[0]
                this.selectedMarketObjRep = this.markets[0]
            }
        },
    },

    watch: {
        themeDarkMode(val) {
            if (val) {
                this.darkBackColor = '#505050'
                this.darkFontColor = '#A2A2A2'
                this.darkBorderColor = '#505050'
            } else {
                this.darkBackColor = 'white'
                this.darkFontColor = 'black'
                this.darkBorderColor = '#eee'
            }
        },
        visible(n, o) {
            if (n) {
                this.selectMarketRef(this.selectedMarket)
            }
        },
    },
    computed: {
        ...mapGetters([
            'getUserSettingData',
            'themePrimaryColor',
            'themeSecondaryColor',
            'themeFontColor',
            'themeDarkMode',
        ]),
        categoryByMarket() {
            if (this.markets && this.markets.length) {
                let selectedCategory = this.markets.find(
                    (m) => m.code === this.selectedMarket
                )
                return selectedCategory && selectedCategory.categoryList
                    ? selectedCategory.categoryList
                    : []
            }
            return []
        }
    },
    mounted() {
    },
}
</script>

<style>
.selected-chart {
    /* background-color: red; */
    color: #ffffff !important;
    border-bottom: 0px !important;
}

.scrollbar-hidden::-webkit-scrollbar {
    display: none;
}

.header {
    font-size: 12.3px;
}

.ui.fluid.input>input {
    background-color: v-bind(darkBackColor);
    color: v-bind(darkFontColor);
    border: 1px solid v-bind(darkBorderColor);
}

.p-tree {
    border: none !important;
}

.symbol-container {
    width: 300px;
    margin: 0 auto;
}

.symbol-item-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.symbol-symbol {
    font-weight: bold;
    margin-right: 10px;
}

.symbol-description {
    font-size: 14px;
    color: #555;
}

.p-listbox.exchange-menu,
.p-listbox.input-menu {
    border: none !important;
}

.p-panel.result-data .p-panel-content {
    padding: 0;
}

.p-listbox.exchange-menu .p-listbox-list,
.p-listbox.input-menu .p-listbox-list {
    padding: 0;
}

.p-accordion.exchange-accordian .p-accordion-content,
.p-accordion.filter-accordian .p-accordion-content {
    padding: 0;
}

.loader-spinner.p-progress-spinner {
    display: block;
    top: 200px;
}
</style>
