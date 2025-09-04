import http from './http'
import store from '../store/index'
import { getMarketTime } from '../utils'
const { CancelToken } = http
let cancel
const scansUrlBase = 'scans/'
/**
 * Send the Darvas Scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ scanType: String, scanPeriod: Number, topConfirmationPeriod: Number, bottomConfirmationPeriod: Number, percentageRiskBuffer, limitTotalRisk: Number, volumeIncreasedOver: { percent: Number, previousBars: Number }, inBox: String, within: { type: String, pricePoints: Number, restrictBoxToMaxBox: Number, restrictCurrentBoxWidth: {start: Number, end: Number}, onlyShowBoxOfTopBottomOnFirstBar: Boolean } }} settings
 * @param userId : String
 */
export async function darvasScan(
  settings,
  filterSettings,
  dataSettings,
  userId
) {
  const payload = {
    scanType: 'darvasScan',
    filterSettings,
    dataSettings,
    settings,
    userId,
  }
  handleSaveScanInLocalStorage(payload)
  return http.post(
    scansUrlBase + 'darvasScan',
    {
      scanType: 'darvasScan',
      filterSettings,
      dataSettings,
      settings,
      userId,
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
 * Send the Fundementals Scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ scanType: String, scanPeriod: Number, topConfirmationPeriod: Number, bottomConfirmationPeriod: Number, percentageRiskBuffer, limitTotalRisk: Number, volumeIncreasedOver: { percent: Number, previousBars: Number }, inBox: String, within: { type: String, pricePoints: Number, restrictBoxToMaxBox: Number, restrictCurrentBoxWidth: {start: Number, end: Number}, onlyShowBoxOfTopBottomOnFirstBar: Boolean } }} settings
 * @param userId : String
 */
export async function fundementalScan(
  settings,
  filterSettings,
  dataSettings,
  userId
) {

  const payload = {
    scanType: 'fundementals',
    filterSettings,
    dataSettings,
    settings,
    userId,
  }
  handleSaveScanInLocalStorage(payload)

  return http.post(
    scansUrlBase + 'fundementalScan',
    {
      scanType: 'fundementals',
      filterSettings,
      dataSettings,
      settings,
      userId,
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
 * Send the Activity Scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ scanType: String, scanPeriod: Number, topConfirmationPeriod: Number, bottomConfirmationPeriod: Number, percentageRiskBuffer, limitTotalRisk: Number, volumeIncreasedOver: { percent: Number, previousBars: Number }, inBox: String, within: { type: String, pricePoints: Number, restrictBoxToMaxBox: Number, restrictCurrentBoxWidth: {start: Number, end: Number}, onlyShowBoxOfTopBottomOnFirstBar: Boolean } }} settings
 * @param userId : String
 */
export async function activityScan(
  settings,
  filterSettings,
  dataSettings,
  userId
) {
  const payload = {
    scanType: 'activity',
    filterSettings,
    dataSettings,
    settings,
    userId,
  }
  handleSaveScanInLocalStorage(payload)

  return http.post(
    scansUrlBase + 'activityScan',
    {
      scanType: 'activity',
      filterSettings,
      dataSettings,
      settings,
      userId,
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
 * Send the Candlestick Scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ patternName: Boolean }} settings
 * @param userId : String
 */
export async function candlestickScan(
  settings,
  filterSettings,
  dataSettings,
  userId
) {
  const payload = {
    scanType: 'candlesticks',
    filterSettings,
    dataSettings,
    settings,
    userId,
  }
  handleSaveScanInLocalStorage(payload)

  return http.post(
    scansUrlBase + 'candlestickScan',
    {
      scanType: 'candlesticks',
      filterSettings,
      dataSettings,
      settings,
      userId,
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
 * Send the Chart pattern Scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ patternName: Boolean }} settings
 * @param events
 * @param userId : String
 */
export async function patternsScan(
  settings,
  filterSettings,
  dataSettings,
  events,
  userId
) {

  const payload = {
    scanType: 'patterns',
    userId: userId,
    filterSettings,
    dataSettings,
    settings,
    events,
  }
  handleSaveScanInLocalStorage(payload)

  return http.post(
    scansUrlBase + 'patternsScan',
    payload,
    {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      }),
    }
  )
}

//  For Favourite Scan Popup


/**
 * Send the Indicators Scan request to the API
 * @param filterSettings
 * @param {{ timeFrame: String, type: String, filterBy: String, sector: String, industry: String, subIndustry: String }} dataSettings
 * @param {{ patternName: Boolean }} settings
 * @param events
 * @param userId : String
 */
export async function indicatorsScan(
  settings,
  filterSettings,
  dataSettings,
  events,
  userId
) {
  let options = {
    timeout: 600000,
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c
    }),
  }
  const { isMarketOpened } = getMarketTime(dataSettings.type)
  const payload = {
    scanType: 'indicators',
    userId,
    filterSettings,
    dataSettings,
    settings,
    events,
  }
  handleSaveScanInLocalStorage(payload)
  return http.post(
    scansUrlBase + 'indicatorsScan',
    {
      scanType: 'indicators',
      userId,
      filterSettings,
      dataSettings,
      settings,
      events,
    },
    options
  )
}

//  For Favourite Scan Popup


export async function saveScannersScan(
  settings,
  filterSettings,
  dataSettings,
  events,
  userId,
  scanName,
  scanType,
  scanId

) {
  let savedSettings = {
    scanType,
    userId,
    filterSettings,
    dataSettings,
    settings
  }
  if (scanType == 'patterns' || scanType == 'indicators') {
    savedSettings.events = events
  }
  let options = {
    timeout: 120000,
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c
    }),
  }

  let scanIdStr = ''
  if (scanId !== null) {
    scanIdStr = `?scanId=${scanId}`
  }

  return http.post(
    scansUrlBase + 'saveScannerScan'+scanIdStr,
    {
      savedSettings,
      scanName,
    },
    options
  )
}

function cancelScan() {
  cancel?.()
}

export function handleSaveScanInLocalStorage(value) {
  let scans = {}
  const scanResult = localStorage.getItem('ScanRequests')
  if (!scanResult) {
    scans[value.scanType] = value
    localStorage.setItem('ScanRequests', JSON.stringify(scans))
  } else {
    scans = JSON.parse(scanResult)
    scans[value.scanType] = value
    localStorage.setItem('ScanRequests', JSON.stringify(scans))
  }
  store.dispatch("updateScansSettingForLatestScans", value)

}

export async function deleteScanId(userId, scanId) {
  const token = localStorage.getItem('state')
  try {
    const { data } = await http.get(
      `${scansUrlBase}deleteScanSettings?userId=${userId}&scanId=${scanId}`
    )

    return data
  } catch (e) {
    // alert(e)
    // logout()
    return null
  }
}

export async function getScanList(userId) {
  const token = localStorage.getItem('state')
  try {
    const { data } = await http.get(`/users/scanList/${userId}`)

    return data
  } catch (e) {
    // alert(e)
    // logout()
    return null
  }
}
export async function getDarvasBoxDrawing(settings) {
  try {
    return http.post(
      scansUrlBase + 'darvasBoxDrawing',
      settings,
      {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c
        }),
      }
    )
  }
  catch (e) {

  }
}
export default {
  darvasScan,
  fundementalScan,
  activityScan,
  candlestickScan,
  patternsScan,
  indicatorsScan,
  cancelScan,
  saveScannersScan,
  getScanList,
  deleteScanId,
}
