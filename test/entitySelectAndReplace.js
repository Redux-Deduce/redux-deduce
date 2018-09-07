const { entity } = require('../src/symbols')

describe('dedux actions apply to selections of entities', () => {
    let reducer;
    const initialState = {
        [entity]: 'Trainer',
        name: 'Bill',
        age: 27,
        pokemon: [
            { [entity]: 'Pokemon', name: 'Pikachu', level: 2 },
            { [entity]: 'Pokemon', name: 'Charmander', level: 7 },
            { [entity]: 'Pokemon', name: 'Meowth', level: 3 }
        ]
    }
    before(() => {
        reducer = (state = initialState, action) => {
            switch (action.type) {
                default:
                    return state;
            }
        };
        reducer = deduce(reducer);
    });

    it('updates all actions when using from', () => {
        const startState = reducer(undefined, {})
        expect(reducer(startState,
            {
                type: 'INCREMENT_IN',
                from: 'Pokemon',
                value: 1,
                key: 'level'
            }
        )).toEqual({
            name: 'Bill',
            age: 27,
            pokemon: [
                { name: 'Pikachu', level: 3 },
                { name: 'Charmander', level: 8 },
                { name: 'Meowth', level: 4 }
            ]
        })
    })
})