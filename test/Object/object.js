describe('Object_Object', () => {
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
      deepFreeze({
        0: { text: 'Make todo list', completed: false },
        1: { text: 'Check todo list', completed: false }
      }),
      { type: 'MERGE_ALL', value: { completed: true } }
    )).toEqual({
      0: { text: 'Make todo list', completed: true },
      1: { text: 'Check todo list', completed: true }
    });
  });
  it('MERGE_IN', () => {
    expect(reducer(
      deepFreeze({
        0: { text: 'Make todo list', completed: false },
        1: { text: 'Check todo list', completed: false }
      }),
      { type: 'MERGE_IN', value: { completed: true } }
    )).toEqual({
      0: { text: 'Make todo list', completed: true },
      1: { text: 'Check todo list', completed: true }
    });
    expect(reducer(
      deepFreeze({ a: { x: 0 }, b: { y: 0 }, c: { z: 0 } }),
      { type: 'MERGE_IN', value: { d: 4 }, key: 'a' }
    )).toEqual({ a: { x: 0, d: 4 }, b: { y: 0 }, c: { z: 0 } });
    expect(reducer(
      deepFreeze({ a: { x: 0 }, b: { y: 0 }, c: { z: 0 } }),
      { type: 'MERGE_IN', value: { d: 4 }, where: (k, v) => k === 'a' }
    )).toEqual({ a: { x: 0, d: 4 }, b: { y: 0 }, c: { z: 0 } });
    // expect(reducer(
    //   deepFreeze({ 
    //     0 : {text: 'Make todo list', completed: false }, 
    //     1 : {text: 'Check todo list', completed: false }
    //   }),
    //   {type: 'MERGE_IN', value: { completed: true }, where: (key, value) => key === 0 && value.completed === false } 
    // )).toEqual({ 
    //   0 : {text: 'Make todo list', completed: true }, 
    //   1 : {text: 'Check todo list', completed: true }
    // });
  });
  it('MERGE_ALL_PATH', () => {
    expect(reducer(
      deepFreeze({
        root: {
          todos: {
            0: { text: 'Make todo list', completed: false },
            1: { text: 'Check todo list', completed: false }
          }
        }
      }),
      { type: 'MERGE_ALL_ROOT_TODOS', value: { completed: true } }
    )).toEqual(
      {
        root: {
          todos: {
            0: { text: 'Make todo list', completed: true },
            1: { text: 'Check todo list', completed: true }
          }
        }
      });
  });
  it('MERGE_IN_PATH', () => {
    expect(reducer(
      deepFreeze({
        root: { todos: { 1: { text: 'Make todo list', completed: false } } }
      }),
      { type: 'MERGE_IN_ROOT_TODOS', value: { completed: true }, key: 1 }
    )).toEqual({ root: { todos: { 1: { text: 'Make todo list', completed: true } } } });
  });
  it('SET_IN_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: {m1: 1, m2: 3} }),
      { type: 'SET_IN_COUNTS', value: 0, key: 'm1' }
    )).toEqual({ counts: {m1: 0, m2: 3} });
    expect(reducer(
      deepFreeze({ counts: {m1: 1, m2: 3} }),
      { type: 'SET_IN_COUNTS', value: 0, where: (k, v) => v === 3 }
    )).toEqual({ counts: {m1: 1, m2: 0} });
  });
});