describe('Object_Array', () => {
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
  it('ADD_TO_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 2] }),
      { type: 'ADD_TO_COUNTS', value: 3 }
    )).toEqual({ counts: [1, 2, 3] });
  });
  it('INSERT_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'INSERT_IN_COUNTS', value: 2, index: 1 }
    )).toEqual({ counts: [1, 2, 3] });
  });
  it('REMOVE_ALL_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'REMOVE_ALL_COUNTS', value: 2, index: 1 }
    )).toEqual({ counts: [] });
  });
  it('REMOVE_FROM_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'REMOVE_FROM_COUNTS', index: 0 }
    )).toEqual({ counts: [3] });
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'REMOVE_FROM_COUNTS', where: (value) => value === 3 }
    )).toEqual({ counts: [1] });
  });
  it('SET_ALL_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'SET_ALL_COUNTS', value: 0 }
    )).toEqual({ counts: [0, 0] });
  });
  it('SET_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'SET_IN_COUNTS', value: 0, index: 0 }
    )).toEqual({ counts: [0, 3] });
    expect(reducer(
      deepFreeze({ counts: [1, 3] }),
      { type: 'SET_IN_COUNTS', value: 0, where: value => value === 3 }
    )).toEqual({ counts: [1, 0] });
  });
  it('TOGGLE_ALL_PATH', () => {
    expect(reducer(
      deepFreeze({ bools: [false, true] }),
      { type: 'TOGGLE_ALL_BOOLS' }
    )).toEqual({ bools: [true, false] });
  });
  it('TOGGLE_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ bools: [false, true] }),
      { type: 'TOGGLE_IN_BOOLS', index: 0 }
    )).toEqual({ bools: [true, true] });
    expect(reducer(
      deepFreeze({ bools: [false, true] }),
      { type: 'TOGGLE_IN_BOOLS', where: value => value === false }
    )).toEqual({ bools: [true, true] });
  });
  it('INCREMENT_ALL_PATH', () => {
    expect(reducer(
      deepFreeze({ numbers: [0, 1, 2] }),
      { type: 'INCREMENT_ALL_NUMBERS', value: 1 }
    )).toEqual({ numbers: [1, 2, 3] });
  });
  it('INCREMENT_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ numbers: [0, 1, 2] }),
      { type: 'INCREMENT_IN_NUMBERS', index: 1, value: 1 }
    )).toEqual({ numbers: [0, 2, 2] });
    expect(reducer(
      deepFreeze({ numbers: [0, 1, 2] }),
      { type: 'INCREMENT_IN_NUMBERS', where: value => value === 2, value: 1 }
    )).toEqual({ numbers: [0, 1, 3] });
  });
  it('DECREMENT_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ numbers: [0, 1, 2] }),
      { type: 'DECREMENT_IN_NUMBERS', index: 1, value: 1 }
    )).toEqual({ numbers: [0, 0, 2] });
    expect(reducer(
      deepFreeze({ numbers: [0, 1, 2] }),
      { type: 'DECREMENT_IN_NUMBERS', where: value => value === 2, value: 1 }
    )).toEqual({ numbers: [0, 1, 1] });
  });
});