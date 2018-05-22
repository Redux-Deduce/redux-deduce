describe('Number', () => {
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
  it('SET', () => {
    expect(reducer(
      0, 
      { type: 'SET', value: 6 }
    )).toEqual(6);
  });
  it('INCREMENT', () => {
    expect(reducer(
      0, 
      { type: 'INCREMENT', value: 1 }
    )).toEqual(1);
    expect(reducer(
      1, 
      { type: 'INCREMENT', value: 1 }
    )).toEqual(2);
    expect(reducer(
      1, 
      { type: 'INCREMENT', value: 2 }
    )).toEqual(3);
  });
  it('DECREMENT', () => {
    expect(reducer(
      0, 
      { type: 'DECREMENT', value: 1 }
    )).toEqual(-1);
    expect(reducer(
      2, 
      { type: 'DECREMENT', value: 1 }
    )).toEqual(1);
    expect(reducer(
      2, 
      { type: 'DECREMENT', value: 2 }
    )).toEqual(0);
  });
  it('INCREMENT_PATH', () => {
    expect(reducer(
      {a:1, b:2}, 
      { type: 'INCREMENT_A', value: 1 }
    )).toEqual({a:2, b:2});
  });
  it('DECREMENT_PATH', () => {
    expect(reducer(
      {a:1, b:2}, 
      { type: 'DECREMENT_B', value: 1 }
    )).toEqual({a:1, b:1});
  });
});