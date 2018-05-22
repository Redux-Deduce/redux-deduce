deduce = require('../src/index.js')['deduce'];
expect = require('expect');
deepFreeze = require('deep-freeze');

require('./functions');
require('./number');
require('./boolean');
require('./string');
require('./action_creator');
require('./Array/base');
require('./Object/base');
require('./Array/number');
require('./Array/bool');
require('./Array/string');
require('./Array/object');
require('./Object/number');
require('./Object/bool');
require('./Object/string');
require('./Object/array');
require('./Object/object');
require('./Object/path');

describe('Custom Reducers', () => {
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
  it('No change for non-existent action type.', () => {
    expect(reducer(
      0, 
      { type: 'NOT_AN_ACTION' }
    )).toEqual(0);
  });
});