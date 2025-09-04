import http from './http'
import LocalStorageHelper from './localStorage'
import symbolSet from '../symbolSet.json'
import singleSymbolSet from '../singleSymbolSet.json'
import { marketsData } from '../data/markets'

/**
 * Get list of symbols
 *
 * @returns {[[]]}
 */
export async function getListOfSymbols() {
  try {
    // return symbolSet.data
    const res = await http.get(`/symbols`)
    if (res.status === 200) {
      return res.data.data
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}
/**
 * Get list of symbols
 *
 * @returns {[[]]}
 */
let cancelToken
export async function getListOfSymbolsStartWith(symbol, isRange = false, selectedMarket, categoriesAlphabet = false, fromSearchBox = false) {
  try {
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.")
    }
    //Save the cancel token for the current request
    cancelToken = http.CancelToken.source()

    const res = await http.get(`/symbols/startWith/${symbol}?market=${selectedMarket}${isRange ? '&isRange=Y' : ''}${categoriesAlphabet ? '&categoriesAlphabet=Y' : ''}${isRange ? '&isRange=Y' : ''}${fromSearchBox ? '&fromSearchBox=Y' : ''}`,
      { cancelToken: cancelToken.token })
    if (res.status === 200) {
      return res.data.data
    } else {
      return fromSearchBox ? res : []
    }
  } catch (error) {
    return fromSearchBox ? "Error" : []
  }
}

/**
 * @param {String} symbolName symbol name
 * @param {String} timeFrame time frame of the requested data
 * @returns {[[Number]]}
 */
export async function getData(symbolName, timeFrame = 'D', isIntra = false, market, minusIndex = 0) {

  try {
    // return singleSymbolSet.data
    symbolName = symbolName.replace(/%/g, '__PERCENT_PLACEHOLDER__');
    const res = await http.get(`/symbols/${encodeURIComponent(symbolName)}`, {
      params: { timeFrame, isIntra, market, minusIndex }
    })
    if (res.status === 200) {
      if (res.data.data) {
        return res.data.data
      } else {
        return { symbol: 'Error', ohlcvData: [] }
      }

    } else {
      return { symbol: 'Error', ohlcvData: [] }
    }
  } catch (error) {
    return { symbol: 'Error', ohlcvData: [] }
  }
}
/**
 * @param {String} symbolName symbol name
 * @param {String} timeFrame time frame of the requested data
 * @returns {[{}]}
 */
export async function getLatestCandle(symbolName, timeFrame = 'D', market) {
  try {
    const res = await http.get(`/symbols/${symbolName}/real-time`, {
      params: { timeFrame, market }
    })
    if (res.status === 200) {
      return res.data.data
    } else {
      return { symbol: 'Error', ohlcvData: [] }
    }
  } catch (error) {
    return { symbol: 'Error', ohlcvData: [] }
  }
}

/**
 * Get symbol close price
 * @param {String} symbolName symbol name
 * @param {String} timeFrame time frame of the requested data
 * @returns {Number}
 */
export async function getSymbolClosePrice(symbolName, timeFrame = 'D') {
  try {
    const res = await http.get(`/symbols/closePrice/${symbolName}`, {
      params: { timeFrame }
    })
    if (res.status === 200) {
      return res.data.data
    } else {
      return 0
    }
  } catch (error) {
    return 0
  }
}

/**
 * @param {String[]} symbolList symbol names
 * @param {String} timeFrame time frame of the requested data
 * @returns {[{}]}
 */
export async function getMultipleSymbolData(symbolList, timeFrame = 'D', symbolName = '', rangeMap = []) {
  try {
    const res = await http.post('/symbols/multiple-symbol-data', {
      symbolList,
      timeFrame,
      symbolName,
      rangeMap
    })
    if (res.status === 200) {
      return res.data
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

/**
 * Get the last symbol
 * @returns {String | null} last symbol
 */
export function getLastSymbol() {
  return LocalStorageHelper.getItem('symbol')
}
/**
 * Get the last symbol
 * @param {String} symbol symbol name
 * @returns {String | null} last symbol
 */
export function setLastSymbol(symbol) {
  return LocalStorageHelper.setItem('symbol', symbol)
}

export default {
  getListOfSymbols,
  getListOfSymbolsStartWith,
  getData,
  getLatestCandle,
  getMultipleSymbolData,
  getSymbolClosePrice
}

function getSymbolData(obj, isStr) {
  if (isStr) {
    return obj.name;
  } else {
    return { code: obj.name, name: 'Symbol Name', selected: false }
  }
}

export async function fetchSymbolByName(self, text, isStr = true, isRange = false, selectedMarket = "", fromSearchBox = false, categoriesAlphabet = false) {
  
  const symbolsList = await getListOfSymbolsStartWith(text, isRange, selectedMarket, categoriesAlphabet, fromSearchBox)
  const exchangeOrder = marketsData.filter(x => x.filterOrder).sort((a, b) => a.filterOrder - b.filterOrder).map(x => x.code);

  
  let reorderedObj = {};
  exchangeOrder.forEach(key => {
    if (symbolsList.hasOwnProperty(key)) {
      reorderedObj[key] = symbolsList[key];
    }
  });
  Object.keys(symbolsList).forEach(key => {
    if (!exchangeOrder.includes(key)) {
      reorderedObj[key] = symbolsList[key];
    }
  });
  if (fromSearchBox) {
    // let filtered2 = []
    // for (const key in symbolsList) {
    //   let newObj = symbolsList[key];
    //   // if(isStr){
    //   //   newObj = newObj.slice(0, self.limit)
    //   // }
    //   filtered2.push({
    //     name:key,
    //     data: newObj.map(m => ({symbol:m.symbol,companyName:m.companyName}))
    //   })
    // }
    return reorderedObj
  } else {
    let filtered2 = []
    for (const key in reorderedObj) {
      let newObj = reorderedObj[key];
      if (isStr) {
        newObj = newObj.slice(0, self.limit)
      }
      filtered2.push({
        name: key,
        data: newObj.map(m => ({ symbol: m.symbol, companyName: m.companyName }))
      })
    }
    return filtered2
  }

}

export async function get_RS_Rating_Value(symbolName, timeFrame = 'D') {

  try {
    const res = await http.get(`symbols/RSrating?Symbol=${encodeURIComponent(symbolName)}`
      // , {
      //   params: { timeFrame }
      // }
    )
    if (res.status === 200) {
      if (res.data.data) {
        return res.data.data
      } else {
        return null
      }

    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

export async function getSPXData(isIntra = false, minusIndex = 0) {

  try {
    const res = await http.get(`/symbols/spx_symbol`, {
      params: { isIntra, minusIndex }
    })
    if (res.status === 200) {
      if (res.data.data) {
        return res.data.data
      } else {
        return { symbol: 'Error', spxData: [] }
      }

    } else {
      return { symbol: 'Error', spxData: [] }
    }
  } catch (error) {
    return { symbol: 'Error', spxData: [] }
  }
}