/** Average True Range
 * @param {[{ date: Number, open: Number,high: Number,low: Number,close: Number,volume: Number }]} data candle data
 * @param {number} period ATR period
 * @return {[[Number, Number]]} ATR values
 */
export default function atr(data, period) {
  let globalIndex = 0
  const atrOutput = []
  const trueRange = [0]
  for (let i = 1; i < data.length; i++) {
    trueRange.push(
      Math.max(data[i].high, data[i - 1].close) -
        Math.max(data[i].low, data[i - 1].close)
    )
  }

  let firstValue = 0
  for (let i = 1; i <= period; i++) {
    firstValue += trueRange[i]
  }
  //--- calculating the first value of the indicator
  firstValue /= period
  atrOutput[globalIndex++] = [data[period].date, firstValue]
  const limit = period + 1
  //--- the main loop of calculations
  for (let i = limit; i < data.length; i++) {
    trueRange[i] =
      Math.max(data[i].high, data[i - 1].close) -
      Math.max(data[i].low, data[i - 1].close)
    atrOutput[globalIndex] = [
      data[i].date,
      atrOutput[globalIndex - 1][1] +
        (trueRange[i] - trueRange[i - period]) / period
    ]
    globalIndex++
  }
  return atrOutput
}
