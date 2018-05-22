describe('Array_Number', () => {
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

  it('INCREMENT_ALL', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INCREMENT_ALL', value: 4 }
    )).toEqual([5, 6, 7]);
  });
  it('INCREMENT_IN', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INCREMENT_IN', value: 4, index: 1 }
    )).toEqual([1, 6, 3]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INCREMENT_IN', value: 4, where: value => value === 2 }
    )).toEqual([1, 6, 3]);
  });
  it('DECREMENT_ALL', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'DECREMENT_ALL',value: 4 }
    )).toEqual([-3, -2, -1]);
  });
  it('DECREMENT_IN', () => {
    expect(reducer(
      deepFreeze([1, 6, 3]), 
      { type: 'DECREMENT_IN', value: 4, index: 1 }
    )).toEqual([1, 2, 3]);
    expect(reducer(
      deepFreeze([1, 6, 3]), 
      { type: 'DECREMENT_IN', value: 4, where: value => value === 6 }
    )).toEqual([1, 2, 3]);
  });
});