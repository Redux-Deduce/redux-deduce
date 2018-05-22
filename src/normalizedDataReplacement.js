const { entity, id, foreignKey, proxy } = require('./symbols')
const secretSymbols = [entity, id, foreignKey, proxy]
const Validator = require('./validators')
const V = new Validator(entity)


class NormalizedDataReplacement {
    constructor(oldNormalizedData, oldRoot) {
        this._old = oldNormalizedData
        this._new = {}
        this._oldRoot = oldRoot
        this._proxyRemovalList = new Set()
    }

    getEntity(entityType, fk) {
        return this._old[entityType][fk]
    }

    getPath(target) {
        const proxyId = target[proxy]
        return this._old[proxy][proxyId].path
    }

    addNewEntity(newEntity) {
        const type = V.getName(newEntity[entity])
        const primaryKey = newEntity[id]
        if (!this._new[type]) this._new[type] = {}
        this._new[type][primaryKey] = newEntity
    }

    mergeAtPath(path, oldValue, newValue) {
        if (path.length === 0) return this.merge(oldValue, newValue)
        this.addToProxyRemovalList(oldValue)
        let [key, ...remainingPath] = path
        const merged = insertAt(key, oldValue, this.mergeAtPath(remainingPath, oldValue[key], newValue))
        if (V.isEntity(merged)) this.addNewEntity(merged)
        else return merged
    }

    merge(oldValue, newValue) {
        if (isForeignKey(oldValue)) {
            const nextEntity = this.getEntity(oldValue.entityType, oldValue[foreignKey])
            this.merge(nextEntity, newValue)
            return oldValue
        }

        const elements = V.getElements(newValue)
        if (!elements) return newValue
        if (this.getEntity(proxy, oldValue[proxy]).proxy === newValue) {
            return oldValue
        }
        const ownSecretSymbols = Object.getOwnPropertySymbols(oldValue).filter(s => secretSymbols.includes(s))
        ownSecretSymbols.forEach(s => newValue[s] = oldValue[s])
        elements.forEach(
            ([key, value]) => newValue[key] = this.merge(oldValue[key], value)
        )
        this.addToProxyRemovalList(newValue)
        if (V.isEntity(newValue)) this.addNewEntity(newValue)
        else return newValue

    }

    addToProxyRemovalList(entity) {
        this._proxyRemovalList.add(entity[proxy])
    }

    addParentProxies(proxyId) {
        const parents = this.getProxyParents(proxyId)
        parents.forEach(pId => {
            if (!this._proxyRemovalList.has(pId)) {
                this._proxyRemovalList.add(pId)
                this.addParentProxies(pId)
            }
        })
    }

    getProxyParents(proxyId) {
        const parents = this._old[proxy][proxyId].parents
        return Object.keys(parents)
    }

    clearProxies() {
        let proxiesToRemove = this._proxyRemovalList.values()
        for (let pId of proxiesToRemove) this.addParentProxies(pId)
        proxiesToRemove = this._proxyRemovalList.values()
        const newProxyTable = {}
        Object.entries(this._old[proxy]).forEach(([key, table]) => newProxyTable[key] = { ...table })
        for (let pId of proxiesToRemove) newProxyTable[pId].proxy = undefined
        this._new[proxy] = newProxyTable
    }

    mergeInOldData() {
        const tables = Object.entries(this._old)
        tables.forEach(([tableName, table]) => {
            if (!this._new[tableName]) this._new[tableName] = table
            else this._new[tableName] = { ...table, ...this._new[tableName] }
        })
    }

    getNewRoot() {
        const type = this._oldRoot[entity]
        const primaryKey = this._oldRoot[id]
        return this._new[type][primaryKey]
    }

    getNewData() {
        return this._new
    }
}

//export
function replace(oldNormalizedData, oldRoot, target, value) {
    const newNorm = new NormalizedDataReplacement(oldNormalizedData, oldRoot)
    const [{ [foreignKey]: entityId, entityType }, ...path] = newNorm.getPath(target)
    const targetEntity = newNorm.getEntity(entityType, entityId)
    newNorm.mergeAtPath(path, targetEntity, value)
    newNorm.clearProxies()
    newNorm.mergeInOldData()
    const newNormData = newNorm.getNewData()
    const newRoot = newNorm.getNewRoot()
    return { normalizedData: newNormData, rootEntity: newRoot }
}

function insertAt(key, collection, value) {
    if (V.typeOf(collection) === 'object') return { ...collection, [key]: value }
    else if (V.typeOf(collection) === 'array') {
        const firstHalf = collection.slice(0, key)
        const secondHalf = collection.slice(key + 1)
        return [...firstHalf, value, ...secondHalf]
    }
}

function isForeignKey(data) {
    if (V.typeOf(data) !== 'object') return false
    const syms = Object.getOwnPropertySymbols(data)
    return syms.includes(foreignKey)
}

module.exports = replace