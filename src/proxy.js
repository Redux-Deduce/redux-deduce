//hidden property access symbols
const { entity, id, foreignKey, getNormalized, getSchema, getRootData, replace, proxy, dataProxy, schemaProxy, normalizedProxy } = require('./symbols')
const secretSymbols = [entity, id, foreignKey, proxy, getNormalized, normalizedProxy, getSchema, schemaProxy, getRootData, dataProxy, replace]
const allowedKeyList = {
    data: [],
    schema: [entity],
    normalized: [id, foreignKey]
}

const Validator = require('./validators')
const V = new Validator(entity)

const createSchema = require('./createSchema')
const NormalizedState = require('./normalizedState')
const normalizeState = require('./normalizedDataCreation')

//exported
function processState(state) {
    const schema = createSchema(state)
    const data = normalizeState(schema, state)
    const normalData = new NormalizedState(data)
    return new StateProxy(normalData)
}

class StateProxy {
    constructor(normalizedData, proxyType = 'data') {
        this._proxyType = proxyType
        this._normalizedData = normalizedData
        if (proxyType === 'data') return this._getProxy(normalizedData.getRoot())
        if (proxyType === 'normalized') return this._getProxy(normalizedData.getNormalizedData())
        if (proxyType === 'schema') return this._getProxy(normalizedData.getSchema())
    }

    _getProxy(obj) {
        if (this._proxyType !== 'data') return this._createProxy(obj)
        else {
            let cachedProxy = this._normalizedData.getProxyFromCache(obj)
            if (!cachedProxy) {
                cachedProxy = this._createProxy(obj)
                this._normalizedData.setProxyInCache(obj, cachedProxy)
            }
            return cachedProxy
        }
    }

    _createProxy(obj) {
        const allowedKeys = allowedKeyList[this._proxyType]
        const handler = {
            get: (target, prop) => {
                if (prop === getNormalized) {
                    return new StateProxy(this._normalizedData, 'normalized')
                }
                if (prop === getSchema) {
                    return new StateProxy(this._normalizedData, 'schema')
                }
                if (prop === getRootData) return this._getProxy(this._normalizedData.getRoot())
                if (prop === replace) return this._updateFn(target)
                if (allowedKeys.includes(prop)) return this._lookupValue(target[prop])
                if (secretSymbols.includes(prop)) return undefined
                return this._lookupValue(target[prop])
            },
            ownKeys(target) {
                const hiddenKeys = secretSymbols.filter(x => !allowedKeys.includes(x))
                return Reflect.ownKeys(target).filter(x => !hiddenKeys.includes(x))
            }
        }
        return new Proxy(obj, handler)
    }

    _updateFn(target) {
        return (newValue) => {
            const newNormalData = this._normalizedData.replace(target, newValue)
            return new StateProxy(newNormalData)
        }
    }

    _lookupValue(value) {
        const type = V.typeOf(value)
        if (type !== 'object' && type !== 'array') return value
        if (type === 'object' && this._proxyType === 'data') {
            const symbols = Object.getOwnPropertySymbols(value)
            if (symbols.includes(foreignKey)) {
                const linkedEntity = this._normalizedData.getEntity(value.entityType, value[foreignKey])
                return this._getProxy(linkedEntity)
            }
        }
        return this._getProxy(value)
    }
}

module.exports = processState



//TESTING
const state = {
    numbers: [5, 7, 9],
    thing: { prop1: 'hello', prop2: 'world' },
}
// const proxied = processState(state)
// proxied.numbers[0]
// const newState2 = proxied.thing[replace]({ prop1: 'goodbye', prop2: 'world' })
// console.log('\nreplaced state\n', newState2)
// console.log('\nnormal data before lookup\n', proxied[getNormalized].ROOT)
// console.log('\nproxied first\n', proxied[getNormalized].ROOT)
// newState2.numbers[0]
// console.log(proxied[getSchema])
// console.log(proxied.thing === proxied.thing)
// console.log('\nproxied after\n', proxied[getNormalized].ROOT)
// console.log('\nproxied after\n', proxied)
// console.log('\nnormal data after lookup\n', proxied[getNormalized].ROOT)
// proxied.numbers[0]
// newState2.thing.prop1
// console.log(proxied.thing)
// const newState1 = proxied.numbers[replace]([1, 2])
// console.log(newState1)
// newState1.thing.prop1
// console.log('\nnew state 1 is \n', newState1)
// const newState2 = proxied.nu[replace]({ ...proxied.thing, prop1: 'goodbye' })
// console.log('\nnew state 2 is \n', newState2)
// console.log('\nthe origional state is \n', proxied)