describe('Array_Boolean', () => {
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
  it('TOGGLE_ALL', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'TOGGLE_ALL' }
    )).toEqual([false, true]);
  });
  it('TOGGLE_IN', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'TOGGLE_IN', index: 0 }
    )).toEqual([false, false]);
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'TOGGLE_IN', where: (el) => el === false }
    )).toEqual([true, true]);
  });
});