describe('Boolean', () => {
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
      false, 
      { type: 'SET', value: true }
    )).toEqual(true);
  });
  it('TOGGLE', () => {
    expect(reducer(
      false, 
      { type: 'TOGGLE' }
    )).toEqual(true);
  });
  it('TOGGLE_PATH', () => {
    expect(reducer(
      {a:true, b:false}, 
      { type: 'TOGGLE_A' }
    )).toEqual({a:false, b:false});
  });
});