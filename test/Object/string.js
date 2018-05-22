describe('Object_String', () => {
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
  it('SET_IN', () => {
    expect(reducer(
      deepFreeze({ a: 'a', b: 'b' }), 
      { type: 'SET_IN', value: 'c', key: 'b' }
    )).toEqual({ a: 'a', b: 'c' });
  });
});