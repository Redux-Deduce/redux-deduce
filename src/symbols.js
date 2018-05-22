//internal symbols
const id = Symbol('id')
const foreignKey = Symbol('foreign key')
const proxy = Symbol('proxy')

//tagging symbol
const entity = Symbol('entity')

//data access symbols
const getNormalized = Symbol('get-normalized')
const getSchema = Symbol('get-schema')
const getRootData = Symbol('root data')

//method access symbols
const replace = Symbol('replace')

module.exports = {
    entity,
    id,
    foreignKey,
    getNormalized,
    getSchema,
    getRootData,
    replace,
    proxy,
}
