const { entity, id, foreignKey, proxy } = require('./symbols')
const Validator = require('./validators')
const V = new Validator(entity)
const replace = require('./normalizedDataReplacement')


class NormalizedState {
    constructor({ schema, normalizedData, rootEntity }) {
        this.schema = schema
        this.normalizedData = normalizedData
        this.rootEntity = rootEntity
    }

    getEntity(type, primaryKey) {
        return this.normalizedData[type][primaryKey]
    }

    getSchema() {
        return this.schema
    }

    getRoot() {
        return this.rootEntity
    }

    getNormalizedData() {
        return this.normalizedData
    }

    getProxyFromCache(obj) {
        const primaryKey = obj[proxy]
        const proxyRecord = this.normalizedData[proxy][primaryKey]
        return proxyRecord.proxy
    }

    setProxyInCache(obj, proxObj) {
        const primaryKey = obj[proxy]
        const proxyRecord = this.normalizedData[proxy][primaryKey]
        proxyRecord.proxy = proxObj
    }

    replace(target, value) {
        const { normalizedData, rootEntity } = replace(this.normalizedData, this.rootEntity, target, value)
        const schema = this.schema
        return new NormalizedState({ normalizedData, rootEntity, schema })
    }
}

module.exports = NormalizedState