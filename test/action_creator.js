const { D, dedux } = require('../src/index.js');

describe('Action creators', () => {
  describe('On Objects', () => {
    let reducer;
    before(() => {
      let initialState = {
        a: 1,
        b: 2
      }
      reducer = (state = initialState, action) => {
        switch (action.type) {
          default:
            return state;
        }
      };
      reducer = deduce(reducer);
      reducer(undefined, { type: '@@INIT' })
    });
    it('SET', () => {
      expect(D.SET({ path: 'A', value: 3 })).toEqual({ type: 'SET_A', value: 3 });
    });
  });
  describe('On shallow types', () => {
    before(() => {
      let initialState = 5;
      reducer = (state = initialState, action) => {
        switch (action.type) {
          default:
            return state;
        }
      };
      reducer = deduce(reducer);
      reducer(undefined, { type: '@@INIT' })
    });
    it('SET', () => {
      expect(D.SET({ value: 3 })).toEqual({ type: 'SET', value: 3 });
    });
  });
  describe('Objects on arrays', () => {
    before(() => {
      let initialState = {
        array: [ {"player": "dan", "score": 3}, {"player": "alex", "score": 5} ]
      };
      reducer = (state = initialState, action) => {
        switch (action.type) {
          default:
            return state;
        }
      };
      reducer = deduce(reducer);
      reducer(undefined, { type: '@@INIT' })
    });
    it('SET', () => {
      let state = reducer(undefined, { type: '@@INIT' })
      expect(D.MERGE_IN({ path: "ARRAY", value: {"score": 5}, index: 0})).toEqual({"index": 0, "type": "MERGE_IN_ARRAY", "value": {"score": 5}});
    });
  })
});