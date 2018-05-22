describe('Object_Boolean', () => {
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
      deepFreeze({ a: true, b: false }),
      { type: 'SET_IN_A', value: false }
    )).toEqual({ a: false, b: false });
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'SET_IN_TEST', value: false, key: 'a' }
    )).toEqual({ test: { a: false, b: false } });
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'SET_IN_TEST', value: true, where: (key, value) => key === 'b' && value === false }
    )).toEqual({ test: { a: true, b: true } });
  });
  it('TOGGLE_PATH', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'TOGGLE_A' }
    )).toEqual({ a: false, b: false });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'TOGGLE_B' }
    )).toEqual({ a: true, b: true });
  });
  it('TOGGLE_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'TOGGLE_IN_TEST', value: false, key: 'a' }
    )).toEqual({ test: { a: false, b: false } });
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'TOGGLE_IN_TEST', value: false, where: (key, value) => key === 'a' && value === true }
    )).toEqual({ test: { a: false, b: false } });
  });
  it('TOGGLE_IN', () => {
    expect(reducer(
      {a:true, b:false}, 
      { type: 'TOGGLE_IN', key: 'a' }
    )).toEqual({a:false, b:false});
    expect(reducer(
      {a:true, b:false}, 
      { type: 'TOGGLE_IN', where: (k, v) => v === false}
    )).toEqual({a:true, b:true});
  });
  it('TOGGLE_ALL', () => {
    expect(reducer(
      {a:true, b:false}, 
      { type: 'TOGGLE_ALL' }
    )).toEqual({a:false, b:true});
  });
});