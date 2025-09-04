import { atr, isNotDefined, isDefined, path, functor } from 'Utils'

const defaultOptions = {
  reversalType: 'ATR', // "ATR", "FIXED"
  windowSize: 14,
  reversal: 2,
  sourcePath: 'close' // "high", "low", "open", "close"
}

const xAccessor = d => d.date

export default function() {
  let options = defaultOptions
  let dateAccessor = d => d.date
  let dateMutator = (d, date) => {
    d.date = date
  }

  function calculator(data) {
    const { reversal, sourcePath } = options

    const source = path(sourcePath)
    const atrValue = atr(data, 10)
    const reversalThreshold = functor(atrValue || reversal)

    const kagiData = []

    let prevPeak, prevTrough, direction
    let line = {}

    data.forEach(function(d) {
      if (isNotDefined(line.from)) {
        dateMutator(line, dateAccessor(d))
        line.from = dateAccessor(d)

        if (!line.open) line.open = d.open
        line.high = d.high
        line.low = d.low
        if (!line.close) line.close = source(d)
        line.startOfYear = d.startOfYear
        line.startOfQuarter = d.startOfQuarter
        line.startOfMonth = d.startOfMonth
        line.startOfWeek = d.startOfWeek
      }

      if (!line.startOfYear) {
        line.startOfYear = d.startOfYear
        if (line.startOfYear) {
          line.date = d.date
          // line.displayDate = d.displayDate;
        }
      }

      if (!line.startOfQuarter) {
        line.startOfQuarter = d.startOfQuarter
        if (line.startOfQuarter && !line.startOfYear) {
          line.date = d.date
          // line.displayDate = d.displayDate;
        }
      }

      if (!line.startOfMonth) {
        line.startOfMonth = d.startOfMonth
        if (line.startOfMonth && !line.startOfQuarter) {
          line.date = d.date
          // line.displayDate = d.displayDate;
        }
      }
      if (!line.startOfWeek) {
        line.startOfWeek = d.startOfWeek
        if (line.startOfWeek && !line.startOfMonth) {
          line.date = d.date
          // line.displayDate = d.displayDate;
        }
      }
      line.volume = (line.volume || 0) + d.volume
      line.high = Math.max(line.high, d.high)
      line.low = Math.min(line.low, d.low)
      line.to = dateAccessor(d)

      const priceMovement = source(d) - line.close

      
      if (
        (line.close >= line.open /* going up */ &&
          priceMovement > 0) /* and moving in same direction */ ||
        (line.close < line.open /* going down */ &&
          priceMovement < 0) /* and moving in same direction */
      ) {
        line.close = source(d)
        if (prevTrough && line.close < prevTrough) {
          // going below the prevTrough, so change from yang to yin
          // A yin line forms when a Kagi line breaks below the prior trough.
          line.changePoint = prevTrough
          if (line.startAs !== 'yin') {
            line.changeTo = 'yin'
            // line.startAs = "yang";
          }
        }
        if (prevPeak && line.close > prevPeak) {
          // going above the prevPeak, so change from yin to yang
          // A yang line forms when a Kagi line breaks above the prior peak
          line.changePoint = prevPeak
          if (line.startAs !== 'yang') {
            line.changeTo = 'yang'
            // line.startAs = "yin";
          }
        }
      } else if (
        (line.close >= line.open /* going up */ &&
        priceMovement < 0 /* and moving in other direction */ &&
          Math.abs(priceMovement) >
            reversalThreshold(
              d
            )) /* and the movement is big enough for reversal */ ||
        (line.close < line.open /* going down */ &&
        priceMovement > 0 /* and moving in other direction */ &&
          Math.abs(priceMovement) >
            reversalThreshold(
              d
            )) /* and the movement is big enough for reversal */
      ) {
        // reverse direction
        const nextLineOpen = line.close

        direction = (line.close - line.open) / Math.abs(line.close - line.open)

        let nextChangePoint, nextChangeTo
        if (direction < 0 /* if direction so far has been -ve*/) {
          // compare with line.close becomes prevTrough
          if (isNotDefined(prevPeak)) prevPeak = line.open
          prevTrough = line.close
          if (source(d) > prevPeak) {
            nextChangePoint = prevPeak
            nextChangeTo = 'yang'
          }
        } else {
          if (isNotDefined(prevTrough)) prevTrough = line.open
          prevPeak = line.close
          if (source(d) < prevTrough) {
            nextChangePoint = prevTrough
            nextChangeTo = 'yin'
          }
        }
        if (isNotDefined(line.startAs)) {
          line.startAs = direction > 0 ? 'yang' : 'yin'
        }

        const startAs = line.changeTo || line.startAs
        line.added = true
        kagiData.push(line)
        direction = -1 * direction // direction is reversed

        line = { ...line }
        line.open = nextLineOpen
        line.close = source(d)
        line.startAs = startAs
        line.changePoint = nextChangePoint
        line.changeTo = nextChangeTo
        line.added = false
        line.from = undefined
        line.volume = 0
      } else {
        
      }
      line.current = source(d)
      let dir = line.close - line.open
      dir = dir === 0 ? 1 : dir / Math.abs(dir)
      line.reverseAt =
        dir > 0
          ? line.close - reversalThreshold(d)
          : line.open - reversalThreshold(d)
    })
    if (!line.added) kagiData.push(line)
    return helper(kagiData)
  }
  calculator.options = function(x) {
    if (!arguments.length) {
      return options
    }
    options = { ...defaultOptions, ...x }
    return calculator
  }
  calculator.dateMutator = function(x) {
    if (!arguments.length) return dateMutator
    dateMutator = x
    return calculator
  }
  calculator.dateAccessor = function(x) {
    if (!arguments.length) return dateAccessor
    dateAccessor = x
    return calculator
  }
  return calculator
}

function helper(plotData) {
  const kagiLine = []
  let kagi = {}
  let d = plotData[0]
  let idx = xAccessor(d)

  for (let i = 0; i < plotData.length; i++) {
    d = plotData[i]

    if (isNotDefined(d.close)) continue
    if (isNotDefined(kagi.type)) kagi.type = d.startAs
    if (isNotDefined(kagi.plot)) kagi.plot = []

    idx = xAccessor(d)
    kagi.plot.push([idx, d.open])

    if (isDefined(d.changeTo)) {
      kagi.plot.push([idx, d.changePoint])
      kagi.added = true
      kagiLine.push(kagi)

      kagi = {
        type: d.changeTo,
        plot: [],
        added: false
      }
      kagi.plot.push([idx, d.changePoint])
    }
  }

  if (!kagi.added) {
    kagi.plot.push([idx, d.close, d.current, d.reverseAt])
    kagiLine.push(kagi)
  }

  

  return kagiLine
}
