import moment from "moment/moment";

export function getTimeCalculation(rangeObj,endingTime){
    let startingTime
    if (rangeObj.range === '3M') {
        // let calculateThreeM = moment(endingTime).subtract(10, 'days');
        let calculateThreeM = moment(endingTime).subtract(3, 'months');
        startingTime = calculateThreeM.valueOf()
        
    }
    else if (rangeObj.range === '6M') {
        let calculateSixM = moment(endingTime).subtract(6, 'months');
        startingTime = calculateSixM.valueOf()
        
        
    }
    else if (rangeObj.range === 'YTD') {
        
        startingTime = moment().startOf('year').valueOf()
        
    }
    else if (rangeObj.range.includes('Y')) {
        const numOfYears = parseInt(
            rangeObj.range.substring(0, rangeObj.range.length - 1)
        )
        let calculatedStartingTimeForYears = moment(endingTime)
            .subtract(numOfYears, 'year')
            .valueOf()

        
        let checkValidDate = moment(calculatedStartingTimeForYears)
        if (checkValidDate.isValid()) {
            startingTime = calculatedStartingTimeForYears;
        }
    }
    return startingTime;
}