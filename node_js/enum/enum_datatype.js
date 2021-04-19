const datatypes = ['_uuid', '_char', '_varchar']
const objUtil = {}

const getDatatypesAll = () => {
    return datatypes;
}

const isTypeString = (value) => {    
    return datatypes.includes(value)
}

objUtil.getDatatypesAll = getDatatypesAll
objUtil.isTypeString = isTypeString
module.exports = objUtil

