// import moment from 'moment'
import moment from "moment-timezone"
// import moment from 'moment'
import {marketsData} from "Data/markets";
export function isDefined(d) {
  return d !== null && typeof d != 'undefined'
}
export function path(loc = []) {
  const key = Array.isArray(loc) ? loc : [loc]
  const length = key.length

  return function(obj, defaultValue) {
    if (length === 0) return isDefined(obj) ? obj : defaultValue

    let index = 0
    while (obj != null && index < length) {
      obj = obj[key[index++]]
    }
    return index === length ? obj : defaultValue
  }
}
export function copy(obj, mod) {
  let copy = JSON.parse(JSON.stringify(obj))
  return Object.assign(copy, mod)
}
export function functor(v) {
  return typeof v === 'function' ? v : () => v
}

export function isNotDefined(d) {
  return !isDefined(d)
}

//--- indicators
export function atr(data, atrPeriod, highAccessor, lowAccessor) {
  if (!highAccessor) highAccessor = d => d.high
  if (!lowAccessor) lowAccessor = d => d.low
  let sum = 0
  const startingIndex = Math.min(atrPeriod, data.length - 1)
  for (let index = startingIndex; index >= 0; index--) {
    sum += highAccessor(data[index]) - lowAccessor(data[index])
  }
  return sum / Math.max(Math.min(atrPeriod, data.length), 1)
}

// get market times
export function getMarketTime(marketId = "ASX") {
  if(marketId !== "ASX"){
    return false
  }
  let marketInfo = marketsData.find(m => m.code === marketId)
  let marketInfoData = {
    zone: 'Australia/Sydney',
    startTime: 9,
    endTime: 16
  }
  
  if(marketInfo && marketInfo.marketTime){
    marketInfoData = marketInfo.marketTime
  }

  // import {isBetween} from 'moment';
  
  const currentZoneTime = moment.tz(marketInfoData.zone)
  
  const marketStartTime = moment(currentZoneTime).startOf('day').add(marketInfoData.startTime, 'hours')
  const marketEndTime = moment(currentZoneTime).startOf('day').add(marketInfoData.endTime, 'hours')

  const isMarketOpened =  (currentZoneTime.day()  !== 0 && currentZoneTime.day()  !== 6) && moment(currentZoneTime).isBetween(marketStartTime, marketEndTime)
  const disp = (str, dt) => {
  }
  // disp("currentZoneTime", currentZoneTime)
  
  
  return { currentZoneTime, marketStartTime, marketEndTime, isMarketOpened }
}

export { parseToChartCandleData, dataAccessors } from './candle'

export function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if(d > 0){//Use timestamp until depleted
      r = (d + r)%16 | 0;
      d = Math.floor(d/16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2/16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
