import http from './http'
import store from '../store/index'
import {handleSaveScanInLocalStorage} from "./scans";
const { CancelToken } = http
let cancel
const gurusUrlBase = 'gurus/'

/**
 * Send the capitulation scan request to the API
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ volumeMultiplier: Number, lastVolumeAvgPeriod: Number }} settings
 * @param userId : String
 */
export async function capitulation(settings,filterSettings, dataSettings, userId) {
  const payload={
    scanType: 'capitulation',
    dataSettings,
    settings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  debugger
  return http.post(
    gurusUrlBase + 'capitulation',
    {
      scanType: 'capitulation',
      dataSettings,
      settings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Frank's pattern scan request to the API
 *
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function franksPattern(settings,filterSettings,dataSettings, userId) {
  const payload={
    scanType: 'franksPattern',
    dataSettings,
    settings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'franksPattern',
    {
      scanType: 'franksPattern',
      dataSettings,
      settings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Sam's pattern scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ scanType: String, scanPeriod: Number, topConfirmationPeriod: Number, bottomConfirmationPeriod: Number, percentageRiskBuffer, limitTotalRisk: Number, volumeIncreasedOver: { percent: Number, previousBars: Number }, inBox: String, within: { type: String, pricePoints: Number, restrictBoxToMaxBox: Number, restrictCurrentBoxWidth: {start: Number, end: Number}, onlyShowBoxOfTopBottomOnFirstBar: Boolean } }} settings
 * @param userId : String
 */
export async function samsPattern(
  settings,
  filterSettings,
  dataSettings,
  userId
) {
  const payload={
    scanType: 'samsPattern',
    filterSettings,
    dataSettings,
    settings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveScanInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'samsPattern',
    {
      scanType: 'samsPattern',
      filterSettings,
      dataSettings,
      settings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Higher High Higher Low pattern scan request to the API
 *
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function higherHighHigherLow(settings,filterSettings,dataSettings,userId) {
  const payload={
    scanType: 'hhhl',
    dataSettings,
    settings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'hhhl',
    {
      scanType: 'hhhl',
      dataSettings,
      settings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Bollinger Squeeze pattern scan request to the API
 *
 * @param {{ minScanningPeriod: Number, maxScanningPeriod: Number, dayFromToday: Number, minSqueezeLength: Number, maxSqueezeLength: Number, ratioOfSpikeHeight: Number }} settings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function bollingerSqueeze(settings,filterSettings, dataSettings, userId) {
  const payload={
    scanType: 'bollingerSqueeze',
    dataSettings,
    settings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'bollingerSqueeze',
    {
      scanType: 'bollingerSqueeze',
      dataSettings,
      settings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Divergence Scan request to the API
 *
 * @param {{ selectedScan: String, maxRange: Number, stoc: {kPeriod: Number, dPeriod: Number, period: Number}, rsi: Number, macd: { fast, slow, signal }  }} settings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function divergenceScan(settings,filterSettings, dataSettings, userId) {
  const payload={
    scanType: 'divergenceScan',
    settings,
    dataSettings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'divergenceScan',
    {
      scanType: 'divergenceScan',
      settings,
      dataSettings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Big Candle Scan request to the API
 *
 * @param {{ candleSizeMultiplier: Number, previousCandlePeriod: Number}} settings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function bigCandleScan(settings,filterSettings, dataSettings, userId) {
  const payload= {
    scanType: 'bigCandleScan',
    settings,
    dataSettings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'bigCandleScan',
    {
      scanType: 'bigCandleScan',
      settings,
      dataSettings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Pocket Pivot Scan request to the API
 *
 * @param {{ period: Number }} settings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function pocketPivotScan(settings,filterSettings, dataSettings, userId) {
  const payload = {
    scanType: 'pocketPivotScan',
    settings,
    dataSettings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'pocketPivotScan',
    {
      scanType: 'pocketPivotScan',
      settings,
      dataSettings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

/**
 * Send the Heiken Ashi Scan request to the API
 *
 * @param {{ period: Number }} settings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param userId : String
 */
export async function heikenAshiScan(settings,filterSettings, dataSettings, userId) {
  const payload = {
    scanType: 'heikenAshiScan',
    settings,
    dataSettings,
    filterSettings,
    userId: dataSettings.isWatch ? userId : null,
  }
  handleSaveGurusInLocalStorage(payload)
  return http.post(
    gurusUrlBase + 'heikenAshiScan',
    {
      scanType: 'heikenAshiScan',
      settings,
      dataSettings,
      filterSettings,
      userId: dataSettings.isWatch ? userId : null,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

export async function saveGuruScan(
  settings,
  filterSettings,
  dataSettings,
  userId,
  scanName,
  scanType,
  scanId
) {
  
  let savedSettings = {
    scanType,
    filterSettings,
    dataSettings,
    settings,
    userId,
  }
  let scanIdStr = ''
  if (scanId !== null) {
    scanIdStr = `?scanId=${scanId}`
  }
  return http.post(
    gurusUrlBase + 'saveGuruScan'+scanIdStr,
    {
      savedSettings,
      scanName,
    },
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}






function handleSaveGurusInLocalStorage(value) {
  let scans = {}
  const scanResult = localStorage.getItem('GuruRequests')
  if (!scanResult) {
    scans[value.scanType] = value
    localStorage.setItem('GuruRequests', JSON.stringify(scans))
  } else {
    scans = JSON.parse(scanResult)
    scans[value.scanType] = value
    localStorage.setItem('GuruRequests', JSON.stringify(scans))
  }
  store.dispatch("updateGuruSettingForLatestScans",value)
}

function cancelGuruScan() {
  cancel?.()
}

export default {
  capitulation,
  franksPattern,
  samsPattern,
  higherHighHigherLow,
  bollingerSqueeze,
  divergenceScan,
  bigCandleScan,
  pocketPivotScan,
  heikenAshiScan,
  cancelGuruScan,
  saveGuruScan
}
