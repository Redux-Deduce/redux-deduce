const deepEqual = require('deep-equal')

class Validator {
    constructor(entity) {
        this._entity = entity
    }

    typeOf(value) {
        const type = typeof value
        if (type !== 'object') return type
        if (value === null) return 'null'
        if (Array.isArray(value)) return 'array'
        return 'object'
    }

    getElements(data) {
        if (this.typeOf(data) === 'object') return Object.entries(data)
        else if (this.typeOf(data) === 'array') return data.map((e, i) => [i, e])
    }

    getName(name) {
        if (this.typeOf(name) === 'string') return name
        else return (name.name)
    }

    isEntity(val) {
        return !!(this.typeOf(val) === 'object' && val[this._entity])
    }

    isVacentTag(obj) {
        if (!this.isEntity(obj)) return false
        const keysAndSymbols = Object.getOwnPropertySymbols(obj).concat(Object.getOwnPropertyNames(obj))
        return keysAndSymbols.length === 1 && keysAndSymbols[0] === this._entity
    }

    validateTag(tag) {
        if (this.typeOf(tag) === 'string') {
            return validateStringTag(tag)
        } else if (this.typeOf(tag) === 'object') {
            if (this.typeOf(tag.name) === 'string') return validateStringTag(tag.name)
            else throw new Error(`Invalid Tag. \n
            ${JSON.stringify(tag)} \n
            Tag must contain a 'name' property with a string value`)
        }
        throw new Error(`Invalid Tag. \n
         ${tag} \n
         Tag must be a string or an object with a 'name' property and a string value`)

        function validateStringTag(tag) {
            if (tag[0].toUpperCase() === tag[0]) return
            const validPrimitives = [
                'number',
                'string',
                'boolean',
                'function',
                'null',
                'undefined',
                'object',
                'array'
            ]
            if (!validPrimitives.includes(tag))
                throw new Error(`Invalid Tag. ${tag} is not a valid primitive.`)
        }
    }

    checkForInconsistencies(entity1, entity2, name) {
        if (!entity1 || !entity2) return
        if (!deepEqual(entity1, entity2, { strict: true }))
            throw new Error(`Conflicting Schema definitions for ${name}. \n
        ${JSON.stringify(entity1)} \n
        does not match \n
        ${JSON.stringify(entity2)}`)
    }

    checkForUndefinedEntities(entities) {
        Object.entries(entities).forEach(([key, value]) => {
            if (value === undefined) throw new Error(`Could not infer Schema on ${key}`)
        })
    }
}


module.exports = Validator