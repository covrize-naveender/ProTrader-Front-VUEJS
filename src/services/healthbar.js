
import TCI from '../overlays/indicators/calculators/tci'
export function exponentialMovingAverageTest(data) {
    const ema34 = calEMA(data, 34)
    const ema55 = calEMA(data, 55)

    const lastClose = data[data.length - 1]
    if (lastClose > ema34 && lastClose > ema55) {
        return 100
    }
    return 0
}

export const onBalanceVolumeTest = (data) => {
    const last_13_days_vol = data.slice(-13)
    const prior_21_days_vol = data.slice(0, 21)
    const avg_21 = prior_21_days_vol.reduce((x, y) => x + y, 0) / 21
    const avg_13 = last_13_days_vol.reduce((x, y) => x + y, 0) / 13


    // return 0
    return avg_13 > avg_21 ? 100 : 0
}

export const priceTest = (data) => {
    const tci = new TCI()
    if(data.length >1){

        tci.Calculate(
            data,
            data.length - 1,
            21
        )
        let tciRes = 0
        const trends = tci.Trend.filter(x => x != null)
        if (trends.length > 0) {
            const Res = trends[trends.length - 1]
            tciRes = Res == 2 ? 100 : Res == 0 ? 0 : 50
        }
    
        // const res = calTCI(data, 21)
        return tciRes
    }
    return 0
}

export const volumeTest = (data) => {
    const sum_vol = data.reduce((x, y) => x + y.volume, 0)
    const max_val = 2500000
    const max_test_val = 20
    const testVol = sum_vol > max_val ? max_test_val : (sum_vol * 20) / max_val

    return testVol
}

export const valueTest = (data) => {
    const sum_val = data.reduce((x, y) => x + (y.volume * y.close), 0)
    const max_val = 1500000
    const max_test_val = 20
    const testVal = sum_val > max_val ? max_test_val : (sum_val * 20) / max_val

    return testVal
}

const calEMA = (data, period) => {
    if (data.length < period) {
    }

    const multiplier = 2 / (period + 1);
    let ema = 0;
    for (let i = 0; i < period; i++) {
        ema += data[i];
    }
    ema /= period;

    for (let i = period; i < data.length; i++) {
        ema = (data[i] - ema) * multiplier + ema;
    }

    return ema;
}


const calTCI = (candleData, period) => {
    if (candleData.length < period) {
        return 0
    }

    // Extracting high and low prices from the candle data
    const highs = candleData.map(candle => candle.high);
    const lows = candleData.map(candle => candle.low);

    // Calculate highest high and lowest low over the last 21 days
    const highestHigh = Math.max(...highs.slice(-period));
    const lowestLow = Math.min(...lows.slice(-period));

    // Current close price
    const currentClose = candleData[candleData.length - 1].close;

    // Calculate midline (average of highest high and lowest low)
    const midline = (highestHigh + lowestLow) / 2;

    // Determine direction
    if (currentClose > midline) {
        return 100;
    } else if (currentClose < midline) {
        return 0;
    } else {
        return 50;
    }
}


export default { exponentialMovingAverageTest, onBalanceVolumeTest, volumeTest, valueTest, priceTest }

