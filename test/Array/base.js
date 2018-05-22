describe('Array', () => {
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

  it('ADD', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'ADD', value: true }
    )).toEqual([true, false, true]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'ADD', value: 4 }
    )).toEqual([1, 2, 3, 4]);
    expect(reducer(
      deepFreeze([{ a: 1 }]),
      { type: 'ADD', value: { b: 2 } }
    )).toEqual([{ a: 1 }, { b: 2 }]);
    expect(reducer(
      deepFreeze(['1', '2']), 
      { type: 'ADD', value: '3' }
    )).toEqual(['1', '2', '3']);
  });
  it('CONCAT', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'CONCAT', value: [true, false] }
    )).toEqual([true, false, true, false]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'CONCAT', value: [4, 5] }
    )).toEqual([1, 2, 3, 4, 5]);
    expect(reducer(
      deepFreeze([{ a: 1 }]),
      { type: 'CONCAT', value: [{ b: 2 }, { c: 3 }] }
    )).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'CONCAT', value: ['4', '5'] }
    )).toEqual(['1', '2', '3', '4', '5']);
  });
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze([false, true, false]),
      { type: 'SET_ALL', value: true }
    )).toEqual([true, true, true]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'SET_ALL', value: 2 }
    )).toEqual([2, 2, 2]);
    expect(reducer(
      deepFreeze([{ b: 2 }, { c: 3 }]),
      { type: 'SET_ALL', value: { d: 4 } }
    )).toEqual([{ d: 4 }, { d: 4 }]);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'SET_ALL', value: '2' }
    )).toEqual(['2', '2', '2']);
  });
  it('SET_IN', () => {
    expect(reducer(
      deepFreeze([false, false, true]),
      { type: 'SET_IN', index: 2, value: false }
    )).toEqual([false, false, false]);
    expect(reducer(
      deepFreeze([false, true]),
      { type: 'SET_IN', value: true, where: (val) => val === false }
    )).toEqual([true, true]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'SET_IN', index: 0, value: 3 }
    )).toEqual([3, 2, 3]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'SET_IN', where: (val) => val === 2, value: 3 }
    )).toEqual([1, 3, 3]);
    expect(reducer(
      deepFreeze([{ b: 2 }, { c: 3 }]),
      { type: 'SET_IN', index: 0, value: { d: 4 } }
    )).toEqual([{ d: 4 }, { c: 3 }]);
    expect(reducer(
      deepFreeze([{ b: 2 }, { c: 3 }]),
      { type: 'SET_IN', where: (val) => val.hasOwnProperty('c'), value: { d: 4 } }
    )).toEqual([{ b: 2 }, { d: 4 }]);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'SET_IN', index: 0, value: '3' }
    )).toEqual(['3', '2', '3']);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'SET_IN', where: (val) => val === '2', value: '3' }
    )).toEqual(['1', '3', '3']);
  });
  it('INSERT', () => {
    expect(reducer(
      deepFreeze([false, true]),
      { type: 'INSERT', value: true, index: 1 }
    )).toEqual([false, true, true]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INSERT', value: 4, index: 1 }
    )).toEqual([1, 4, 2, 3]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { c: 3 }]),
      { type: 'INSERT', value: { b: 2 }, index: 1 }
    )).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'INSERT', value: '4', index: 1 }
    )).toEqual(['1', '4', '2', '3']);
  });
  it('REMOVE_ALL', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
  });
  it('REMOVE_IN', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE_IN', index: 0 }
    )).toEqual([false]);
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE_IN', where: value => value === false }
    )).toEqual([true]);
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE_IN' }
    )).toEqual([true]);

    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE_IN' }
    )).toEqual([1, 2]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE_IN', index: 0 }
    )).toEqual([2, 3]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE_IN', where: (val) => val === 2 }
    )).toEqual([1, 3]);  

    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE_IN' }
    )).toEqual([{ a: 1 }, { b: 2 }]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE_IN', index: 0 }
    )).toEqual([{ b: 2 }, { c: 3 }]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE_IN', where: (val) => Object.values(val).includes(2) }
    )).toEqual([{ a: 1 }, { c: 3 }]);

    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'REMOVE_IN' }
    )).toEqual(['1', '2']);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'REMOVE_IN', index: 0 }
    )).toEqual(['2', '3']);
    expect(reducer(
      deepFreeze(['1', '2', '3']), 
      { type: 'REMOVE_IN', where: (val) => val === '2' }
    )).toEqual(['1', '3']); 
  });
});