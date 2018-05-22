describe('Array_Object', () => {
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

  it('MERGE_ALL', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'MERGE_ALL', value: { d: 4 } }
    )).toEqual([{ a: 1, d: 4 }, { b: 2, d: 4 }, { c: 3, d: 4 }]);
  });
  it('MERGE_IN', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'MERGE_IN', value: { d: 4 }, index: 0 }
    )).toEqual([{ a: 1, d: 4 }, { b: 2 }, { c: 3 }]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'MERGE_IN', value: { d: 4 }, where: (val) => val.c === 3 }
    )).toEqual([{ a: 1 }, { b: 2 }, { c: 3, d: 4 }]);
  });
});