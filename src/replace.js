const { entity, id, proxy, foreignKey } = require('./symbols')
const specialSymbols = [entity, id, proxy, foreignKey]
const Validator = require('./validators')
const V = new Validator(entity)

function replaceEntity(oldValue, newValue, normalizedData, rootEntity) {
    const proxyKey = oldValue[proxy]
    let path = normalizedData[proxy][proxyKey].path
    const entityType = path[0].entityType
    const entityId = path[0][foreignKey]
    const oldTable = normalizedData[entityType]
    const oldEntity = oldTable[entityId]
    path = path.slice(1)
    const newEntity = deepUpdateAt(path, oldEntity, newValue, normalizedData)
    const newTable = { ...oldTable, [entityId]: newEntity }
    const newProxyTable = clearProxyAndParentProxies(proxyKey, normalizedData)
    const newNormalized = { ...normalizedData, [entityType]: newTable, [proxy]: newProxyTable }
    return {
        newNormalized,
        newRoot: rootEntity === oldEntity ? newEntity : rootEntity
    }
}

function deepUpdateAt(path, oldValue, newValue, normalizedData) {
    if (path.length === 0) return deepMerge(oldValue, newValue, normalizedData)
    let key = path[0]
    if (V.typeOf(oldValue) === 'object')
        return {
            ...oldValue,
            [key]: deepUpdateAt(path.slice(1), oldValue[key], newValue, normalizedData)
        }
    else if (V.typeOf(oldValue) === 'array') {
        const newElement = deepUpdateAt(path.slice(1), oldValue[key], newValue, normalizedData)
        const firstHalf = oldValue.slice(0, key)
        const secondHalf = oldValue.slice(key + 1)
        return [...firstHalf, newElement, ...secondHalf]
    }
}

function deepMerge(oldValue, newValue, normalizedData) {
    //check for entity boundry
    if (getProxy(oldValue, normalizedData) === newValue) return oldValue

    let symbols = Object.getOwnPropertySymbols(oldValue)
        .filter(s => specialSymbols.includes(s))
    symbols.forEach(s => newValue[s] = oldValue[s])


    return newValue
}

function getProxy(obj, normalizedData) {
    const proxyId = obj[proxy]
    return normalizedData[proxy][proxyId]
}

function clearProxyAndParentProxies(proxyId, normalizedData) {
    const oldProxyTable = normalizedData[proxy]
    const newProxyTable = { ...oldProxyTable }
    const parentIds = getAllParents(oldProxyTable, proxyId)
    for (let pId of parentIds) {
        const proxyRecordCopy = { ...newProxyTable[pId] }
        delete proxyRecordCopy.proxy
        newProxyTable[pId] = proxyRecordCopy
    }
    return newProxyTable
}

function getAllParents(proxies, proxyId) {
    const proxy = proxies[proxyId]
    const parents = Object.keys(proxy.parents)
    let parentList = [proxyId]
    parents.forEach(primaryKey => {
        parentList = parentList.concat(getAllParents(proxies, primaryKey))
    })
    return parentList
}

module.exports = replaceEntity