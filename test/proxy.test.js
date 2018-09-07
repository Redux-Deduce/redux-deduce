const { entity, id, getNormalized, getSchema, getRootData, foreignKey, replace, replaceMany } = require('../src/symbols')
const processState = require('../src/proxy')


describe('the inferred schema', () => {
    it('adds a tag to the root entity if no tag exists', () => {
        const withoutTag = { test: 'abc' }
        const proxy = processState(withoutTag)
        expect(proxy[getSchema]).toEqual({ ROOT: { test: 'string' } })
        const withTag = { test: 'abc', [entity]: 'BASE' }
        const proxy2 = processState(withTag)
        // expect(proxy2[getSchema]).toEqual({ BASE: { test: 'string' } })
    })

    it('gives an array type the type of its first element', () => {
        const state = {
            list: [{ [entity]: 'User', name: 'Chris' }]
        }
        const proxy = processState(state)
        expect(proxy[getSchema]).toEqual({ ROOT: { list: ['User'] }, User: { name: 'string' } })
    })

    it('infers type shape from initial value', () => {
        const state = {
            firstComment: { [entity]: 'Comment', name: 'Bob' },
            list: [{ [entity]: 'Comment' }],
        }
        const proxy = processState(state)
        expect(proxy[getSchema]).toEqual({
            ROOT: { list: ['Comment'], firstComment: 'Comment' },
            Comment: { name: 'string' }
        })
    })

    it('throws when no initial value is provided to infer type shape', () => {
        const arrayTypeDefinition = [{ [entity]: 'Comment' }]
        const state = {
            list: arrayTypeDefinition,
        }
        expect(() => processState(state)).toThrow(/Comment/)
    })

    it('throws when inconsistant data definitions are provided', () => {
        const commentDef1 = { [entity]: 'Comment', id: 1 }
        const commentDef2 = { [entity]: 'Comment', key: 1 }
        const state = {
            comment: commentDef1,
            other: commentDef2
        }
        expect(() => processState(state)).toThrow(/Comment/)
    })

    it('throws when an invalid tag is used', () => {
        function useTag(tag) {
            return processState({ key: 'text', [entity]: tag })
        }
        const valid1 = 'number'
        const valid2 = 'User'
        const valid3 = { name: 'Comment' }
        const invalid1 = {}
        const invalid2 = 'nothing'
        expect(() => useTag(valid1)).not.toThrow()
        expect(() => useTag(valid2)).not.toThrow()
        expect(() => useTag(valid3)).not.toThrow()
        expect(() => useTag(invalid1)).toThrow()
        expect(() => useTag(invalid2)).toThrow()
    })

    it('handles string and object tags', () => {
        const stringTag = 'User'
        const objTag = { name: 'User' }
        const data = (tag) => ({
            author: 'steve',
            date: 'September 3rd',
            id: 7,
            [entity]: tag
        })
        const schema1 = processState(data(stringTag))[getSchema]
        const schema2 = processState(data(objTag))[getSchema]
        expect(schema1).toEqual(schema2)
        expect(schema2).toEqual({
            User: { author: 'string', date: 'string', id: 'number' }
        })

        const data2 = (tag) => ({
            group: 1,
            members: [{ [entity]: tag, name: 'steve' }],
        })
        const schema3 = processState(data2(stringTag))[getSchema]
        const schema4 = processState(data2(objTag))[getSchema]
        expect(schema3).toEqual(schema4)
        expect(schema4).toEqual({
            ROOT: { group: 'number', members: ['User'] },
            User: { name: 'string' }
        })
    })
})

describe('the normalized data', () => {
    it('is generated from the hierarchical data', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)

        expect(proxied[getNormalized]).toEqual({
            "Trainer": {
                [0]: { [id]: 0, name: 'Bill', age: 27, pokemon: [{ [foreignKey]: 0, entityType: 'Pokemon' }] },
            },
            'Pokemon': {
                [0]: { [id]: 0, name: 'Pikachu' },
            }
        })
    })
})

describe('the proxied state', () => {
    it('looks like the original state', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)
        expect(proxied).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })
    })

    it('maintains referential value', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)
        expect(proxied.name).toBe(proxied.name)
        expect(proxied.pokemon[0]).toBe(proxied.pokemon[0])
        proxied[getNormalized]
        expect(proxied.name).toBe(proxied.name)
    })

    it('allows mutable updates', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)

        proxied.name = 'Sally'
        expect(proxied).toEqual({
            name: 'Sally',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })

        proxied.pokemon[0].name = "Not Pikachu"
        expect(proxied).toEqual({
            name: 'Sally',
            age: 27,
            pokemon: [{ name: 'Not Pikachu' }]
        })
    })

    it('it allows immutable updates', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)
        expect({ ...proxied }).toEqual(proxied)
        const newState = proxied[replace]({ ...proxied, name: 'Goofy' })
        expect(proxied).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })
        expect(newState).toEqual({
            name: 'Goofy',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })
    })

    it('correctly updates parent references on an immutable update', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)

        const newState1 = proxied[replace]({ ...proxied, name: 'George' })
        expect(proxied).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })
        expect(newState1).toEqual({
            name: 'George',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })
        expect(newState1).not.toBe(proxied)
        expect(newState1.pokemon).toBe(proxied.pokemon)
        expect(newState1.pokemon[0]).toBe(proxied.pokemon[0])
        const newState2 = proxied.pokemon[0][replace]({ name: 'Charmander' })
        expect(proxied).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [{ name: 'Pikachu' }]
        })
        expect(newState2).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [{ name: 'Charmander' }]
        })
        expect(newState2).not.toBe(proxied)
        expect(newState2.pokemon).not.toBe(proxied.pokemon)
        expect(newState2.pokemon[0]).not.toBe(proxied.pokemon[0])
    })

    it('allows updates on nested data', () => {
        const state = {
            numbers: [5, 7, 9],
            thing: { prop1: 'hello', prop2: 'world' },
        }
        const proxied = processState(state)

        const newState1 = proxied.numbers[replace]([1, 2])
        expect(newState1).toEqual({
            numbers: [1, 2],
            thing: { prop1: 'hello', prop2: 'world' }
        })

        const newState2 = proxied.thing[replace]({ ...proxied.thing, prop1: 'goodbye' })
        expect(newState2).toEqual({
            numbers: [5, 7, 9],
            thing: { prop1: 'goodbye', prop2: 'world' }
        })

        const newState3 = proxied[replace]({ numbers: [1, 2], thing: { ...proxied.thing, prop1: "what's up" } })
        expect(newState3).toEqual({
            numbers: [1, 2],
            thing: { prop1: "what's up", prop2: "world" }
        })
    })

    it('allows updates across entity boundries', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
        }
        const proxied = processState(state)

        const newState = proxied[replace]({
            ...proxied,
            age: 40,
            pokemon: [{ ...proxied.pokemon[0], name: 'Charmander' }]
        })
        expect(newState).toEqual({
            name: 'Bill',
            age: 40,
            pokemon: [{ name: 'Charmander' }]
        })
    })

    it('performs updates on multiple entities', () => {
        const state = {
            [entity]: 'Trainer',
            name: 'Bill',
            age: 27,
            pokemon: [
                { [entity]: 'Pokemon', name: 'Pikachu', level: 2 },
                { [entity]: 'Pokemon', name: 'Charmander', level: 7 },
                { [entity]: 'Pokemon', name: 'Meowth', level: 3 }
            ]
        }
        const proxied = processState(state)
        const newState = proxied[replaceMany](
            'Pokemon',
            (p) => p.level < 5,
            p => ({ ...p, name: p.name.toUpperCase() })
        )
        expect(newState).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [
                { name: 'PIKACHU', level: 2 },
                { name: 'Charmander', level: 7 },
                { name: 'MEOWTH', level: 3 }
            ]
        })
    })
})