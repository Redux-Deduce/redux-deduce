const { replace, entity } = require('../symbols')
const Validator = require('../validators')
const V = new Validator(entity)

function checkForEntities(state, hasEntities = false) {
    if (V.typeOf(state) === 'object') {
        if (V.isEntity(state)) return true
        return Object.values(state).reduce((acc, value) => {
            return acc || checkForEntities(value, hasEntities)
        }, hasEntities)
    }
    if (V.typeOf(state) === 'array') {
        return state.reduce((acc, value) => {
            return acc || checkForEntities(value, hasEntities)
        }, hasEntities)
    }
    else return false
}

module.exports = checkForEntities