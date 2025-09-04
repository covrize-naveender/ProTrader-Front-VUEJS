import moment from 'moment'

class Turn {
  constructor(start, startHigh, startLow, end, endHigh, endLow, startIndex) {
    this.start = start
    this.startHigh = startHigh
    this.startLow = startLow
    this.end = end
    this.endHigh = endHigh
    this.endLow = endLow
    this.startIndex = startIndex
    // this.range = range
    // this.candles=candleSet
  }
}

export const ETrend = {
  Up: 2,
  Down: 0,
  Unchanged: 1
}

export default class Trender {
  constructor() {
    this._triggerUp
    this._triggerDown
    this._triggerCandle
    this._triggerType
    this._maxHigh
    this._maxLow
    this._currentCandle
    this._size
    this._highData // []
    this._lowData // []
    this._lowPoints // []
    this._highPoints // []
    this._startCandle
    this._highSlope
    this._highIntercept
    this._lowSlope
    this._lowIntercept
    this._trend // [ETrend]
    this._turns // [Turn]
  }

  get Trend() {
    return this._trend
  }
  get TriggerCandle() {
    return this._triggerCandle
  }
  get TriggerTrend() {
    return this._triggerType
  }
  get Turns() {
    return this._turns
  }

  get TrendPeriod() {
    return this._size
  }

  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   * @param {Number} endDate
   * @param {Number} length
   */
  Calculate(candlesData, endDate, length) {
    this._size = length
    this._currentCandle = 0
    this._startCandle = 0
    this._triggerCandle = 0
    this._maxHigh = 0
    this._maxLow = 0
    this._triggerUp = false
    this._triggerDown = false

    this._highData = new Array(this.TrendPeriod)
    this._lowData = new Array(this.TrendPeriod)
    this._lowPoints = new Array(this.TrendPeriod)
    this._highPoints = new Array(this.TrendPeriod)

    this._trend = new Array(endDate + 1)
    this._turns = []


    const createNewTurn = (
      start,
      startHigh,
      startLow,
      end,
      endHigh,
      endLow,
      triggerType
    ) => {
      return new Turn(
        candlesData[start]?.date,
        startHigh,
        startLow,
        candlesData[end]?.date,
        endHigh,
        endLow,
        start
      )
    }

    // not enough data for a trend
    if (candlesData.length <= this.TrendPeriod + 1) {
      for (let i = 0; i < this._trend.length; i++) {
        this._trend[i] = null
      }
    }

    this.CreateChannels(candlesData, endDate)
    while (this._currentCandle <= endDate) {
      if (this._currentCandle < endDate - this.TrendPeriod) {
        if (!this._triggerUp && !this._triggerDown) {
          this.FindTrigger(candlesData)
        }

        if (
          (this._triggerUp || this._triggerDown) &&
          this.ConfirmTurn(candlesData, endDate)
        ) {
          let endHigh =
            this.ExtrapolateHigh(this._triggerCandle - 1) + this._maxHigh
          let endLow =
            this.ExtrapolateLow(this._triggerCandle - 1) - this._maxLow
          let startHigh =
            this.ExtrapolateHigh(this._startCandle) + this._maxHigh
          let startLow = this.ExtrapolateLow(this._startCandle) - this._maxLow
          this._turns.push(
            createNewTurn(
              this._startCandle,
              startHigh,
              startLow,
              this._triggerCandle - 1,
              endHigh,
              endLow,
              this._triggerType
            )
          )

          this._startCandle = this._triggerCandle
          this.CreateChannels(candlesData, endDate)
        } else {
          this._trend[this._currentCandle] = this._trend[
            this._currentCandle > 0 ? this._currentCandle - 1 : 0
          ]
          this._triggerCandle = this._startCandle
        }
      } else if (!this._triggerUp && !this._triggerDown) {
        this.FindTrigger(candlesData)
      } else {
        if (this.ReEnter(candlesData, endDate)) {
          this._trend[this._currentCandle] = this._trend[
            this._currentCandle > 0 ? this._currentCandle - 1 : 0
          ]
          this._triggerCandle = this._startCandle
        }

        this._currentCandle++
      }
    }

    if (this._triggerCandle === this._startCandle) {
      const endHigh = this.ExtrapolateHigh(endDate) + this._maxHigh
      const endLow = this.ExtrapolateLow(endDate) - this._maxLow
      const startHigh = this.ExtrapolateHigh(this._startCandle) + this._maxHigh
      const startLow = this.ExtrapolateLow(this._startCandle) - this._maxLow
      this._turns.push(
        createNewTurn(
          this._startCandle,
          startHigh,
          startLow,
          endDate,
          endHigh,
          endLow,
          this._triggerType
        )
      )
    } else {
      const endHigh =
        this.ExtrapolateHigh(this._triggerCandle - 1) + this._maxHigh
      const endLow = this.ExtrapolateLow(this._triggerCandle - 1) - this._maxLow
      const startHigh = this.ExtrapolateHigh(this._startCandle) + this._maxHigh
      const startLow = this.ExtrapolateLow(this._startCandle) - this._maxLow
      this._turns.push(
        createNewTurn(
          this._startCandle,
          startHigh,
          startLow,
          this._triggerCandle - 1,
          endHigh,
          endLow,
          this._triggerType
        )
      )

      for (let i = this._triggerCandle; i <= endDate; i++) {
        this._trend[i] = null
      }
    }
  }

  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   * @param {Number} today
   */
  ConfirmTurn(candlesData, today) {
    let confirm = false
    if (today - this._triggerCandle >= this.TrendPeriod) {
      for (
        let i = this._triggerCandle;
        i < this._triggerCandle + this.TrendPeriod;
        i++
      ) {
        if (this._triggerUp) {
          if (candlesData[i].low > this.ExtrapolateHigh(i) + this._maxHigh) {
            confirm = true
            this._triggerType = ETrend.Down
          } else {
            confirm = false
            this._triggerUp = false
            for (let j = this._triggerCandle; j < i; j++) {
              this._trend[j] = this._trend[this._triggerCandle]
            }

            this._currentCandle = i
            break
          }
        }

        if (!this._triggerDown) {
          continue
        }

        if (candlesData[i].high < this.ExtrapolateLow(i) - this._maxLow) {
          confirm = true
          this._triggerType = ETrend.Up
          continue
        }

        confirm = false
        this._triggerDown = false

        for (let j = this._triggerCandle; j < i; j++) {
          this._trend[j] = this._trend[this._triggerCandle]
        }

        this._currentCandle = i
        break
      }

      if (confirm) {
        this._triggerUp = false
        this._triggerDown = false
      }
    }

    return confirm
  }

  Round(val, digit = 3) {
    return +(Math.round(val + `e+${digit}`) + `e-${digit}`)
  }

  ExtrapolateHigh(point) {
    return this.Round(this._highIntercept + this._highSlope * point, 3)
  }

  ExtrapolateLow(point) {
    return this.Round(this._lowIntercept + this._lowSlope * point, 3)
  }
  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   */
  FindTrigger(candlesData) {
    if (
      candlesData[this._currentCandle].low >
      this.ExtrapolateHigh(this._currentCandle) + this._maxHigh
    ) {
      this._triggerUp = true
      this._triggerCandle = this._currentCandle
      this._triggerType = ETrend.Up
      return
    }

    if (
      candlesData[this._currentCandle].high <
      this.ExtrapolateLow(this._currentCandle) - this._maxLow
    ) {
      this._triggerDown = true
      this._triggerCandle = this._currentCandle
      this._triggerType = ETrend.Down
      return
    }

    this._trend[this._currentCandle] = this._trend[
      this._currentCandle > 0 ? this._currentCandle - 1 : 0
    ]
    this._currentCandle++
  }

  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   */
  GetRegressionData(candlesData) {
    for (let i = 0; i < this.TrendPeriod; i++) {
      this._highData[i] = candlesData[i + this._startCandle].high
      this._lowData[i] = candlesData[i + this._startCandle].low
    }
  }

  RegressHigh() {
    const { slope, intercept } = this.LinearRegression(
      this._highData,
      this._startCandle
    )
    this._highSlope = slope
    this._highIntercept = intercept
  }

  RegressLow() {
    const { slope, intercept } = this.LinearRegression(
      this._lowData,
      this._startCandle
    )
    this._lowSlope = slope
    this._lowIntercept = intercept
  }

  LinearRegression(points, start) {
    let slope, intercept
    let sigmaX = 0
    let sigmaY = 0
    let sigmaXSq = 0
    let sigmaXY = 0
    let meanX = 0
    let meanY = 0
    let n = points.length

    for (let i = 0; i < n; i++) {
      sigmaX += i + start
      sigmaY += points[i]
      sigmaXSq += (i + start) * (i + start)
      sigmaXY += (i + start) * points[i]
    }

    meanX = sigmaX / n
    meanY = sigmaY / n
    slope = this.Round(
      (n * sigmaXY - sigmaX * sigmaY) / (n * sigmaXSq - sigmaX * sigmaX),
      3
    )
    intercept = this.Round(meanY - slope * meanX, 3)

    return {
      slope,
      intercept
    }
  }

  FillHighPoints() {
    for (let i = 0; i < this._highData.length; i++) {
      this._highPoints[i] = this.ExtrapolateHigh(i + this._startCandle)
    }
  }

  FillLowPoints() {
    for (let i = 0; i < this._lowData.length; i++) {
      this._lowPoints[i] = this.ExtrapolateLow(i + this._startCandle)
    }
  }

  MakeHighLine(candlesData) {
    this._maxHigh = 0
    for (let i = 0; i < this._highPoints.length; i++) {
      const diff = Math.abs(
        candlesData[this._startCandle + i].high - this._highPoints[i]
      )
      if (
        diff > this._maxHigh &&
        candlesData[this._startCandle + i].high > this._highPoints[i]
      ) {
        this._maxHigh = diff
      }
    }

    for (let i = 0; i < this._highPoints.length; i++) {
      this._highPoints[i] += this._maxHigh
    }
  }

  MakeLowLine(candlesData) {
    this._maxLow = 0
    for (let i = 0; i < this._lowPoints.length; i++) {
      const diff = Math.abs(
        candlesData[this._startCandle + i].low - this._lowPoints[i]
      )
      if (
        diff > this._maxLow &&
        candlesData[this._startCandle + i].low < this._lowPoints[i]
      ) {
        this._maxLow = diff
      }
    }

    for (let i = 0; i < this._lowPoints.length; i++) {
      this._lowPoints[i] -= this._maxLow
    }
  }

  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   * @param {Number} today
   */
  CreateChannels(candlesData, today) {
    if (today - this._currentCandle >= this.TrendPeriod) {
      this.GetRegressionData(candlesData)
      this.RegressHigh()
      this.RegressLow()
      this.FillHighPoints()
      this.FillLowPoints()
      this.MakeLowLine(candlesData)
      this.MakeHighLine(candlesData)

      let trendSlope = this.FindTrend(candlesData)
      this._trend[this._currentCandle] = null

      for (
        let i = this._currentCandle + 1;
        i <= this._currentCandle + this.TrendPeriod;
        i++
      ) {
        this._trend[i] = trendSlope
      }

      this._currentCandle += this.TrendPeriod
    } else {
      this._currentCandle++
    }
  }

  IsEqual(value1, value2, digits = 4) {
    return value1.toFixed(digits) === value2.toFixed(digits)
  }

  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   * @param {Number} today
   * @returns {ETrend}
   */
  FindTrend(candlesData) {
    let slope = null
    if (
      this._lowSlope > 0 ||
      this._highSlope > 0 ||
      (this._highSlope <= 0 &&
        this._startCandle > 0 &&
        this._lowData[this.TrendPeriod - 1] >=
          candlesData[this._startCandle - 1].high)
    ) {
      slope = ETrend.Up
    } else if (
      this.IsEqual(this._lowSlope, 0) &&
      this.IsEqual(this._highSlope, 0) &&
      this._triggerCandle > 0
    ) {
      if (
        candlesData[this._triggerCandle].low >
        candlesData[this._triggerCandle - 1].low
      ) {
        slope = ETrend.Up
      } else if (
        candlesData[this._triggerCandle].high <
        candlesData[this._triggerCandle - 1].high
      ) {
        slope = ETrend.Down
      } else {
        slope = this._trend[this._triggerCandle - 1]
      }
    } else if (
      this._highSlope <= 0 ||
      (this._startCandle > 0 &&
        this._highData[this.TrendPeriod - 1] <=
          candlesData[this._startCandle - 1].low)
    ) {
      slope = ETrend.Down
    }

    return slope
  }

  /**
   *
   * @param {Map<DateTime, Candle>} candlesData
   * @param {Number} today
   */
  ReEnter(candlesData, today) {
    let reEnter = false
    let i = this._triggerCandle
    do {
      if (i > today) {
        break
      }
      if (
        candlesData[i].low < this.ExtrapolateHigh(i) + this._maxHigh &&
        candlesData[i].high > this.ExtrapolateLow(i) - this._maxLow
      ) {
        this._triggerUp = false
        this._triggerDown = false
        reEnter = true
        break
      }
      i++
    } while (true)

    return reEnter
  }
}
