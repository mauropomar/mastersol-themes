objUtil = {}
const findByElementInArray = (arr, value) => {
    const resultado = arr.find(element => element.id === value);
    return resultado
}

objUtil.findByElementInArray = findByElementInArray
module.exports = objUtil

