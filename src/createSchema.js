const { entity, id, proxy } = require('./symbols')
const Validator = require('./validators')
const V = new Validator(entity)

class SchemaCreator {
    constructor() {
        this._schema = { [proxy]: {} }
    }

    addType(entityObj) {
        const tag = entityObj[entity]
        V.validateTag(tag)
        const name = V.getName(tag)
        delete entityObj[entity]
        if (!this._schema[name]) this._schema[name] = entityObj
        else V.checkForInconsistencies(entityObj, this.schema[name], name)
        return name
    }

    addVacantType(vacantEntity) {
        const tag = vacantEntity[entity]
        V.validateTag(tag)
        const name = V.getName(tag)
        if (!this._schema[name]) this._schema[name] = undefined
        return name
    }

    getSchema() {
        const tables = Reflect.ownKeys(this._schema)
        V.checkForUndefinedEntities(this._schema)
        tables.forEach(type => this._schema[type][id] = 0)
        return this._schema
    }
}

function createSchema(state) {
    const schemaCreator = new SchemaCreator()
    if (!state[entity]) state[entity] = 'ROOT'
    process(state)
    return schemaCreator.getSchema()


    function process(state) {
        if (V.typeOf(state) === 'array') return [process(state[0])]
        if (V.typeOf(state) === 'object') {
            if (V.isVacentTag(state)) return schemaCreator.addVacantType(state)
            const obj = { ...state }
            Object.entries(obj).forEach(
                ([key, value]) => obj[key] = process(value)
            )
            return V.isEntity(obj) ? schemaCreator.addType(obj) : obj
        } else return V.typeOf(state)
    }
}

module.exports = createSchema