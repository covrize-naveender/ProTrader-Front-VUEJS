import { IndicatorSettingsDefaults } from "../components/settingsHelper/GeneralSettingsDefaults";

export const combineObject = (val) => {

    let indiArr = Object.keys(val)
    for (let i = 0; i < indiArr.length; i++) {
        const key = indiArr[i];
        try {

            let fetchObj = val[key]
            let defaultObj = IndicatorSettingsDefaults.indicatorSettings.single[key]

            const allowedKeys = [];
            const filteredObj = Object.keys(fetchObj).reduce((acc, key) => {
                if (defaultObj.hasOwnProperty(key) || allowedKeys.includes(key)) {
                    acc[key] = fetchObj[key];
                }
                return acc;
            }, {});

            val[key] = { ...defaultObj, ...filteredObj };
        } catch (error) {
            val[key] = val[key]
        }

    }
    return val
}