const actionTypeParser = require('../src/functions/actionTypeParser');
const updateAtPath = require('../src/functions/updateAtPath');
const findPath = require('../src/functions/findPath');
const deepFreeze = require('deep-freeze');
const checkForEntities = require('../src/functions/checkForEntities')
const { entity } = require('../src/symbols')


describe('actionTypeParser', () => {
  it('Should parse shallow paths', () => {
    let { verb, path } = actionTypeParser('SET_A');
    expect(verb).toEqual('SET');
    expect(path).toEqual('A');
  });
  it('Should parse deep paths', () => {
    let { verb, path } = actionTypeParser('SET_ROOT_OBJ_A');
    expect(verb).toEqual('SET');
    expect(path).toEqual('ROOT_OBJ_A');
  });
  it('Should parse actions with compound verbs', () => {
    let { verb, path } = actionTypeParser('ADD_TO_A');
    expect(verb).toEqual('ADD_TO');
    expect(path).toEqual('A');
  });
  it('Should error for non-existent action', () => {
    let { verb, path } = actionTypeParser('REMOVE_TO');
  });
});

describe('updateAtPath', () => {
  it('Should set at shallow paths in simple objects', () => {
    let state = deepFreeze({ a: 1 });
    state = updateAtPath(['A'], state, (obj) => { return 2 });
    expect(state).toEqual({ a: 2 })
  });
  it('Should set at shallow paths in nested objects', () => {
    let state = deepFreeze({ root: { a: 1 } });
    state = updateAtPath(['ROOT'], state, (obj) => { return { ...obj, a: 2 } });
    expect(state).toEqual({ root: { a: 2 } })
  });
  it('Should set at nested paths', () => {
    let state = deepFreeze({ root: { a: 1 } });
    state = updateAtPath(['ROOT', 'A'], state, (obj) => { return 2 });
    expect(state).toEqual({ root: { a: 2 } })
  });
});
describe('findPath', () => {
  it('Should find shallow paths in simple objects', () => {
    const state = { root: '1' };
    expect(findPath('ROOT', state)).toEqual(['ROOT']);
  });
  it('Should find shallow paths in simple objects', () => {
    const state = { a: '1', b: '2' };
    expect(findPath('B', state)).toEqual(['B']);
  });
  it('Should find shallow paths in nested objects', () => {
    const state = { root: { a: 1, b: 2 } };
    expect(findPath('ROOT', state)).toEqual(['ROOT']);
  });
  it('Should find deep paths in nested objects', () => {
    const state = { root: { a: 1, b: 2 } };
    expect(findPath('B', state)).toEqual(['ROOT_B']);
  });
  it('Should find deep paths in nested objects', () => {
    const state = { root: { secondA: { a: 1, b: 2 }, secondB: { a: 1, b: 2 } } };
    expect(findPath('SECONDA', state)).toEqual(['ROOT_SECONDA']);
    expect(findPath('A', state)).toEqual(['ROOT_SECONDA_A', 'ROOT_SECONDB_A']);
  });
  it('Should find paths at multiple nesting levels', () => {
    const state = { root: { a: 1, secondA: { a: 1, b: 2 }, secondB: { a: 1, c: 2 } } };
    expect(findPath('SECONDA', state)).toEqual(['ROOT_SECONDA']);
    expect(findPath('A', state)).toEqual(['ROOT_A', 'ROOT_SECONDA_A', 'ROOT_SECONDB_A']);
    expect(findPath('C', state)).toEqual(['ROOT_SECONDB_C']);
  });
  it('Should not break on incorrent path', () => {
    const state = { root: { a: 1, secondA: { a: 1, b: 2 }, secondB: { a: 1, b: 2 } } };
    expect(findPath('SECONDA', state)).toEqual(['ROOT_SECONDA']);
    expect(findPath('C', state)).toEqual([]);
  });
  it('Long hand paths should work', () => {
    const state = { root: { a: 1, secondA: { a: 1, b: 2 }, secondB: { a: 1, b: 2 } } };
    expect(findPath('SECONDA', state)).toEqual(['ROOT_SECONDA']);
    expect(findPath('ROOT_SECONDA', state)).toEqual(['ROOT_SECONDA']);
  });
  it('Should not traverse arrays', () => {
    const state = {
      "example": [{ "test": true }],
      "test": true
    };
    expect(findPath("TEST", state)).toEqual(['TEST'])
  })
})

describe('checkForEntities', () => {
  it('returns true when there is an entity tag in the state', () => {
    const state = {
      foo: [1, 2, 3],
      bar: { [entity]: 'Test', it: 'other' }
    }
    expect(checkForEntities(state)).toEqual(true)
  })
  it('returns false when there is no entity tag in the state', () => {
    const state = {
      foo: [1, 2, 3],
      bar: { it: 'other' }
    }
    expect(checkForEntities(state)).toEqual(false)
  })
})