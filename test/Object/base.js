describe('Object', () => {
  let reducer;
  before(() => {
    reducer = (state = {}, action) => {
      switch (action.type) {
        default:
          return state;
      }
    };
    reducer = deduce(reducer);
  });
  it('SET_PATH', () => {
    expect(reducer(
      deepFreeze({
        items:[],
        author:'',
        text: ''
      }), { type: 'SET_IN_AUTHOR', value: 'Daniel'})).toEqual({
        items:[],
        author:'Daniel',
        text: ''
      })
  });
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET_ALL', value: true }
    )).toEqual({ a: true, b: true });
  });
  it('SET_IN', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET_IN', key: 'c', value: false }
    )).toEqual({ a: true, b: false, c: false });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET_IN', key: 'b', value: true }
    )).toEqual({ a: true, b: true });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET_IN', where: (key, val) => { return (key === 'b') && (val === false) }, value: true }
    )).toEqual({ a: true, b: true });
  });
  it('MERGE', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'MERGE', value: { b: true, a: false } }
    )).toEqual({ a: false, b: true });
  });
  it('REMOVE_ALL', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'REMOVE_ALL' }
    )).toEqual({});
  });
  it('REMOVE_IN', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'REMOVE_IN', key: 'a' }
    )).toEqual({ b: false });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'REMOVE_IN', where: (key, value) => key === 'a' && value === true }
    )).toEqual({ b: false });
  });
});