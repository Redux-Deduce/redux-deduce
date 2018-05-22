const { entity } = require('../src/symbols')

describe('states with entity symbols', () => {
    let reducer;
    const initialState = {
        [entity]: 'Trainer',
        name: 'Bill',
        age: 27,
        pokemon: [{ [entity]: 'Pokemon', name: 'Pikachu' }]
    }
    before(() => {
        reducer = (state = initialState, action) => {
            switch (action.type) {
                default:
                    return state;
            }
        };
        reducer = deduce(reducer);
    })
    it('get converted to proxied objects', () => {
        reducer(initialState, {})
    })
})