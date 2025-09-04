/**
 * Calculate the SMA
 * @param {[Number]} sourceDataArray source data array
 * @param {Number} period period of the EMA
 * @returns {[Number]}
 */
function sma(sourceDataArray, period = 5) {
  if (!sourceDataArray || sourceDataArray.length < period) {
    return []
  }

  let index = period - 1
  const length = sourceDataArray.length + 1
  const sma = []
  while (++index < length) {
    const windowSlice = sourceDataArray.slice(index - period, index)
    const sum = windowSlice.reduce((prev, curr) => prev + curr, 0)
    sma.push(sum / period)
  }
  return sma
}

/**
 * Calculate the EMA
 * @param {[Number]} sourceDataArray source data array
 * @param {Number} period period of the EMA
 * @returns {[Number]}
 */
function ema(sourceDataArray, period) {
  if (!sourceDataArray || sourceDataArray.length < period) {
    return []
  }
  const k = 2 / (period + 1)
  // first item is just the same as the first item in the input
  const emaArray = [sourceDataArray[0]]
  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < sourceDataArray.length; i++) {
    emaArray.push(sourceDataArray[i] * k + emaArray[i - 1] * (1 - k))
  }
  return emaArray
}

/**
 * Calculate obv
 * @param {[{ open: Number, high: Number, low: Number, close: Number, volume: Number, value: Number, date: String }]} ohlcv
 * @returns {[Number]}
 */
function obv(ohlcv) {
  let prevObv = 0
  const obv = []
  for (const curr of ohlcv) {
    let currObv = 0
    if (curr.close > curr.open) {
      currObv = prevObv + curr.volume
    } else if (curr.close < curr.open) {
      currObv = prevObv - curr.volume
    }
    prevObv = currObv
    obv.push(currObv)
  }
  return obv
}

/**
 * Get the SMA OBV of the nth candle
 * @param {[{ open: Number, high: Number, low: Number, close: Number, volume: Number, value: Number, date: String }]} ohlcv
 * @param {Number} period SMA period
 * @param {Number} shift Candle index from the end
 * @returns {Number}
 */
function obvSma(ohlcv, period, shift = 0) {
  if (
    !ohlcv ||
    ohlcv.length < period ||
    period < 1 ||
    shift < 0 ||
    shift >= ohlcv.length
  ) {
    return null
  }

  const obvArr = obv(ohlcv)
  const endIndex = obvArr.length - 1 - shift
  const startIndex = endIndex - period + 1
  const obvOfPeriod = obv
    .slice(startIndex, endIndex + 1)
    .reduce((sum, curr) => sum + curr, 0)

  return obvOfPeriod / period
}
