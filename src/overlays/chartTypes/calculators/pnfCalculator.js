import { atr, isNotDefined, isDefined } from 'Utils'

const defaultOptions = {
  boxSize: 20,
  reversal: 2,
  sourcePath: 'high/low' // "close", "high/low"

  /* source: d => ({ high: d.high, low: d.low }), // "close", "hi/lo"
	dateAccessor: d => d.date,
	dateMutator: (d, date) => { d.date = date; }, */
}

function getColumns(layout, plotData, rawData) {
  const xScale = layout.t2screen,
    yScale = layout.$2screen

  let lastIndex = plotData.length - 1,
    firstIndex = 0
  let startDate = plotData[firstIndex].date,
    endDate = plotData[lastIndex].date

  for (let boxIndex = 0; boxIndex < plotData.length; boxIndex++) {
    if (!startDate && plotData[boxIndex].date)
      startDate = plotData[boxIndex].date

    if (!endDate && plotData[lastIndex - boxIndex].date)
      startDate = plotData[boxIndex].date

    if (startDate && endDate) break
  }

  let anyBox,
    j = 0
  while (isNotDefined(anyBox)) {
    if (isDefined(plotData[j].close)) {
      anyBox = plotData[j].boxes[0]
    } else {
      break
    }
    j++
  }
  if (!anyBox) return

  const anyBoxOpen = anyBox.open;
  const yScaleOpen = yScale(anyBoxOpen);
  const anyBoxClose = anyBox.close;
  const yScaleClose = yScale(anyBoxClose);
  const boxHeight = Math.abs(yScaleOpen - yScaleClose)
  const width = xScale(endDate) - xScale(startDate)
  const columnWidth =
    xScale(layout.ti_map.i2t(1)) - xScale(layout.ti_map.i2t(0)) //width / (plotData.length - 1)

  let lastDate = 0
  const filteredColumns = plotData.filter(
    d => isDefined(d.close) && isDefined(d.open)
  )

  const startingIndex = Math.max(0, rawData.length - filteredColumns.length * 2)
  const columns = filteredColumns.map((d, index) => {
    let max = -Infinity,
      min = Infinity
    const boxes = d.boxes
      .filter(d => isDefined(d.close) && isDefined(d.open))
      .map(box => {
        max = Math.max(box.open, box.close, max)
        min = Math.min(box.open, box.close, min)
        return {
          columnWidth: columnWidth,
          boxHeight: boxHeight,
          open: box.open,
          close: box.close
        }
      })
    let xOffset = xScale(d.date) - columnWidth / 2
    if (lastDate > 0) {
      xOffset = lastDate + layout.px_step * 3
    }

    lastDate = xOffset

    return {
      boxes: boxes,
      direction: d.direction,
      offset: [index, 0],
      volume: d.volume,
      date:d.date,
      value: d.value,
      width: columnWidth,
      max,
      min
    }
  })
  return columns
}

function createBox(d, dateAccessor, dateMutator) {
  const box = {
    open: d.open,
    fromDate: dateAccessor(d),
    toDate: dateAccessor(d),
    startOfYear: d.startOfYear,
    startOfQuarter: d.startOfQuarter,
    startOfMonth: d.startOfMonth,
    startOfWeek: d.startOfWeek
  }
  dateMutator(box, dateAccessor(d))
  return box
}

function updateColumns(columnData, dateAccessor, dateMutator) {
  columnData.forEach(function(d) {
    // var lastBox = d.boxes[d.boxes.length - 1];

    d.startOfYear = false
    d.startOfQuarter = false
    d.startOfMonth = false
    d.startOfWeek = false

    d.boxes.forEach(function(eachBox) {
      if (isNotDefined(d.open)) d.open = eachBox.open
      d.close = eachBox.close
      d.high = Math.max(d.open, d.close)
      d.low = Math.min(d.open, d.close)

      if (isNotDefined(d.fromDate)) d.fromDate = eachBox.fromDate
      if (isNotDefined(d.date)) d.date = eachBox.date
      d.toDate = eachBox.toDate

      if (eachBox.startOfYear) {
        d.startOfYear = d.startOfYear || eachBox.startOfYear
        d.startOfQuarter = eachBox.startOfQuarter
        d.startOfMonth = eachBox.startOfMonth
        d.startOfWeek = eachBox.startOfWeek

        dateMutator(d, dateAccessor(eachBox))
      }
      if (d.startOfQuarter !== true && eachBox.startOfQuarter) {
        d.startOfQuarter = eachBox.startOfQuarter
        d.startOfMonth = eachBox.startOfMonth
        d.startOfWeek = eachBox.startOfWeek
        // d.displayDate = eachBox.displayDate;
        dateMutator(d, dateAccessor(eachBox))
      }
      if (d.startOfMonth !== true && eachBox.startOfMonth) {
        d.startOfMonth = eachBox.startOfMonth
        d.startOfWeek = eachBox.startOfWeek
        // d.displayDate = eachBox.displayDate;
        dateMutator(d, dateAccessor(eachBox))
      }
      if (d.startOfWeek !== true && eachBox.startOfWeek) {
        d.startOfWeek = eachBox.startOfWeek
        // d.displayDate = eachBox.displayDate;
        dateMutator(d, dateAccessor(eachBox))
      }
    })
  })
  return columnData
}

export default function() {
  let options = defaultOptions
  let dateAccessor = d => d.date
  let dateMutator = (d, date) => {
    d.date = date
  }

  function calculator(
    layout,
    rawData,
    boxSize = 0.02,
    reversal = 2,
    sourcePath = 'high/low'
  ) {
    const {
      reversal: reversalDefault,
      boxSize: defaultBoxSize
      // sourcePath
    } = options

    // const reversal = 2 /* rawData[0].open * 0.05 0.01*/ || reversalDefault
    // const boxSize = 0.02
    //atr(rawData, 10) /*rawData[0].open * 0.02 0.005*/ || defaultBoxSize

    const source =
      sourcePath === 'high/low'
        ? d => {
            return { high: d.high, low: d.low }
          }
        : d => {
            return { high: d.close, low: d.close }
          }

    const pricingMethod = source
    const columnData = []
    let column = {
        boxes: [],
        open: rawData[0].open,
        date: rawData[0].date,
      },
      box = createBox(rawData[0], dateAccessor, dateMutator)

    columnData.push(column)

    rawData.forEach(function(d) {
      column.volume = (column.volume || 0) + d.volume
      column.value = (column.value || 0) + d.value
      column.date = (d.date || 0)

      if (!box.startOfYear) {
        box.startOfYear = d.startOfYear
        if (box.startOfYear) {
          dateMutator(box, dateAccessor(d))
          // box.displayDate = d.displayDate;
        }
      }

      if (!box.startOfYear && !box.startOfQuarter) {
        box.startOfQuarter = d.startOfQuarter
        if (box.startOfQuarter && !box.startOfYear) {
          dateMutator(box, dateAccessor(d))
          // box.displayDate = d.displayDate;
        }
      }

      if (!box.startOfQuarter && !box.startOfMonth) {
        box.startOfMonth = d.startOfMonth
        if (box.startOfMonth && !box.startOfQuarter) {
          dateMutator(box, dateAccessor(d))
          // box.displayDate = d.displayDate;
        }
      }
      if (!box.startOfMonth && !box.startOfWeek) {
        box.startOfWeek = d.startOfWeek
        if (box.startOfWeek && !box.startOfMonth) {
          dateMutator(box, dateAccessor(d))
          // box.displayDate = d.displayDate;
        }
      }

      if (columnData.length === 1 && column.boxes.length === 0) {
        const upwardMovement = Math.max(pricingMethod(d).high - column.open, 0) // upward movement
        const downwardMovement = Math.abs(
          Math.min(column.open - pricingMethod(d).low, 0)
        ) // downward movement
        column.direction = upwardMovement > downwardMovement ? 1 : -1
        if (
          boxSize * reversal < upwardMovement ||
          boxSize * reversal < downwardMovement
        ) {
          // enough movement to trigger a reversal
          box.toDate = dateAccessor(d)
          box.open = column.open
          const noOfBoxes =
            column.direction > 0
              ? Math.floor(upwardMovement / boxSize)
              : Math.floor(downwardMovement / boxSize)
          for (let i = 0; i < noOfBoxes; i++) {
            box.close = box.open + column.direction * boxSize
            const prevBoxClose = box.close
            column.boxes.push(box)
            box = createBox(box, dateAccessor, dateMutator)
            // box = cloneMe(box);
            box.open = prevBoxClose
          }
          box.fromDate = dateAccessor(d)
          box.date = dateAccessor(d)
        }
      } else {
        // one or more boxes already formed in the current column
        const upwardMovement = Math.max(pricingMethod(d).high - box.open, 0) // upward movement
        const downwardMovement = Math.abs(
          Math.min(pricingMethod(d).low - box.open, 0)
        ) // downward movement

        if (
          (column.direction > 0 &&
            upwardMovement >
              boxSize) /* rising column AND box can be formed */ ||
          (column.direction < 0 &&
            downwardMovement >
              boxSize) /* falling column AND box can be formed */
        ) {
          // form another box
          box.close = box.open + column.direction * boxSize
          box.toDate = dateAccessor(d)
          const prevBoxClose = box.close
          column.boxes.push(box)
          box = createBox(d, dateAccessor, dateMutator)
          box.open = prevBoxClose
          box.fromDate = dateAccessor(d)
          dateMutator(box, dateAccessor(d))
        } else if (
          (column.direction > 0 &&
            downwardMovement >
              boxSize *
                reversal) /* rising column and there is downward movement to trigger a reversal */ ||
          (column.direction < 0 &&
            upwardMovement >
              boxSize *
                reversal) /* falling column and there is downward movement to trigger a reversal */
        ) {
          // reversal

          box.open = box.open + -1 * column.direction * boxSize
          box.toDate = dateAccessor(d)
          // box.displayDate = d.displayDate;
          dateMutator(box, dateAccessor(d))
          // box.startOfYear = d.startOfYear;
          // box.startOfQuarter = d.startOfQuarter;
          // box.startOfMonth = d.startOfMonth;
          // box.startOfWeek = d.startOfWeek;
          // console.table(column.boxes);
          // var idx = index + 1;
          column = {
            boxes: [],
            volume: 0,
            value: 0,
            direction: -1 * column.direction
          }
          const noOfBoxes =
            column.direction > 0
              ? Math.floor(upwardMovement / boxSize)
              : Math.floor(downwardMovement / boxSize)
          for (let i = 0; i < noOfBoxes; i++) {
            box.close = box.open + column.direction * boxSize
            const prevBoxClose = box.close
            column.boxes.push(box)
            box = createBox(d, dateAccessor, dateMutator)
            box.open = prevBoxClose
          }

          columnData.push(column)
        }
      }
    })
    updateColumns(columnData, dateAccessor, dateMutator)
    return getColumns(layout, columnData, rawData)
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
