let def = (configItem, defaultValue) => {
    if (configItem) {
        return configItem
    }
    return defaultValue
}

const Utils = {def}
export default Utils