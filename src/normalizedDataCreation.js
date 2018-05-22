const { entity, id, foreignKey, proxy } = require('./symbols')
const Validator = require('./validators')
const V = new Validator(entity)

class NormalizedDataCreator {
    constructor(schema, rootEntity) {
        this._schema = schema
        this._rootEntity = rootEntity
        this._normalized = newTables(schema)
    }

    addToTable(data) {
        const entityType = V.getName(data[entity])
        const newId = this._schema[entityType][id]++
        data[id] = newId
        this._normalized[entityType][newId] = data

        return { [foreignKey]: newId, entityType }
    }

    addProxy(data, proxyData) {
        const proxyId = this._schema[proxy][id]++
        data[proxy] = proxyId
        this._normalized[proxy][proxyId] = { ...proxyData, [id]: proxyId }
        return proxyId
    }

    getNormalizedData() {
        return {
            normalizedData: this._normalized,
            rootEntity: this._rootEntity,
            schema: this._schema,
        }
    }
}

function newTables(schema) {
    let newTables = {}
    Reflect.ownKeys(schema).forEach(name => newTables[name] = {})
    return newTables
}

//exported
function normalizeState(schema, state) {
    const normalizer = new NormalizedDataCreator(schema, state) //performs side effects
    process(state, { parents: {}, path: [] })
    return normalizer.getNormalizedData()

    function process(state, { parents, path }) {
        const elements = V.getElements(state)
        if (!elements) return state
        if (isVacantArray(state)) return []
        const foreignKey = V.isEntity(state) && normalizer.addToTable(state) //side effect
        if (foreignKey) path = [foreignKey]
        const proxyId = normalizer.addProxy(state, { parents, path }) //side effect

        parents = { ...parents, [proxyId]: true }
        elements.forEach(([key, value]) => {
            state[key] = process(value, { parents, path: [...path, key] })
        })

        return foreignKey || state
    }
}

function isVacantArray(collection) {
    return V.typeOf(collection === 'array') && V.isVacentTag(collection[0])
}

module.exports = normalizeState
