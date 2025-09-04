export function GetIterationData(timeFrame) {
    let iterations = 5;
    let type = "day";
    if (timeFrame === "W") {
        iterations = 2
        type = "week"
    } else if (timeFrame === "M") {
        iterations = 1
        type = "month"
    }
    return {iterations, type};
}