import moment from 'moment'
import { symbolIndexes } from '../constants'

/**
 * Parse the OHLCV and Time data from the backend to the charts accepted format
 * @param {[{ open: Number, high: Number, low: Number, close: Number, volume: Number, value: Number, date: String }]} data
 */
export function parseToChartCandleData(data) {
  const timeFrameMap = []
  const dataMap = data.map((candle) => {
    let timeStamp = moment(candle.date).valueOf()
    timeFrameMap.push([timeStamp])
    let percentageChange = calculatePercentageChange(candle.open, candle.close)

    return [
      timeStamp,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
      candle.volume,
      null,
      candle.value,
      percentageChange,
    ]
  })
  return [dataMap, timeFrameMap]
}

/**
 * Check if 2 numbers are equal
 * @param {Number} num1 number 1
 * @param {Number} num2 number 2
 * @returns {Boolean}
 */
const isEqual = (num1, num2) => {
  return Math.abs(num1 - num2) < Number.EPSILON
}

/**
 * Find the highest candle in a given period
 * @param {[{ open: Number, high: Number, low: Number, close: Number, volume: Number, date: String }]} data candlestick data
 * @param {Number} period look back period
 * @param {Number} startIndex starting index
 * @param {String} accessorMode accessor mode(open|high|low|close|volume|date)
 * @returns {{ value: Number, index: Number }} returns the max value and its index
 */
export function highest(data, period, startIndex, accessorMode = 'high') {
  const accessor = (candle) => candle[accessorMode]
  const comparator = (curr, prev) => curr > prev
  return timeSeriesAction(accessor, data, startIndex, period, comparator)
}

/**
 * Find the lowest candle in a given period
 * @param {[{ open: Number, high: Number, low: Number, close: Number, volume: Number, date: String }]} data candlestick data
 * @param {Number} period look back period
 * @param {Number} startIndex starting index
 * @param {String} accessorMode accessor mode(open|high|low|close|volume|date)
 * @returns {{ value: Number, index: Number }} returns the max value and its index
 */
export function lowest(data, period, startIndex, accessorMode = 'low') {
  const accessor = (candle) => candle[accessorMode]
  const comparator = (curr, prev) => curr < prev
  return timeSeriesAction(accessor, data, startIndex, period, comparator)
}
export const FormatUnixDate = (d) => {
  return moment.unix(d / 1000).format('MM/DD/YYYY')
}
export const DaysDiffByTimeStamp = (t1, t2) => {
  return moment.unix(t1 / 1000).diff(moment.unix(t2 / 1000), 'days')
}
/**
 * Accessor function for getting data from the main chart's tOHLCV array
 * @constant {{ date: {Function}, open: {Function}, high: {Function}, low: {Function}, close: {Function}, volume: {Function}, value: {Function} }} dataAccessors
 */
export const dataAccessors = {
  date: (arr) => arr[symbolIndexes.DATE],
  open: (arr) => arr[symbolIndexes.OPEN],
  high: (arr) => arr[symbolIndexes.HIGH],
  low: (arr) => arr[symbolIndexes.LOW],
  close: (arr) => arr[symbolIndexes.CLOSE],
  volume: (arr) => arr[symbolIndexes.VOLUME],
  value: (arr) => arr[symbolIndexes.VALUE],
}

/**
 * Run a specific comparator over a given amount of timeseries data
 * @param {Function} accessor accessor function
 * @param {[{ open: Number, high: Number, low: Number, close: Number, volume: Number, date: String }]} data candlestick data
 * @param {Number} startIndex starting index
 * @param {Number} period look back period
 * @param {Function} comparator function that compares 2 values curr & prev
 * @returns {{ value: Number, index: Number }} returns the max value and its index
 */
function timeSeriesAction(accessor, data, startIndex, period, comparator) {
  let index = 0
  let value = accessor(data[0])
  for (let i = startIndex; i >= Math.max(0, startIndex - period); i--) {
    if (comparator(accessor(candle[i]), value)) {
      value = accessor(candle[i])
      index = i
    }
  }
  return { value, index }
}

export const calculatePercentageChange = (open, close) => {
  return ((close - open) / open) * 100
}
