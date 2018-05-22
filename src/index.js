const actionTypeParser = require('./functions/actionTypeParser');
const updateAtPath = require('./functions/updateAtPath');
const findPath = require('./functions/findPath');
const processState = require('./proxy')
const checkForEntities = require('./functions/checkForEntities')
const { replace } = require('./symbols')

/**
 * Helper functions
 */
const getPath = (path, state) => {
  const paths = findPath(path, state);
  if (paths.length === 0) throw new Error('Path not found.');
  if (paths.length > 1) throw new Error('Path not unique, try a longer path specification.');
  return paths[0].split('_');
}

function insert(state, values, action) {
  if (values === undefined) return state;
  if (Array.isArray(state)) {
    if (action.index) {
      return [
        ...state.slice(0, action.index),
        ...values,
        ...state.slice(action.index)
      ];
    }
    return [...state, ...values];
  }
  if (typeof state === "object") {
    return Object.assign({ ...state }, values)
  }
}

function update(state, callback, predicate) {
  if (Array.isArray(state)) {
    return state.map((elem, idx) => {
      if (predicate === undefined || predicate(elem, idx)) return callback(elem);
      return elem;
    });
  }
  if (typeof state === 'object' && state !== null) {
    const newObj = {};
    Object.entries(state).map(([key, value]) => {
      if (predicate === undefined || predicate(key, value)) newObj[key] = callback(key, value);
      else newObj[key] = value;
    });
    return newObj;
  }
}

function del(state, predicate) {
  if (Array.isArray(state)) {
    if (predicate === undefined) return [];
    return state.filter((elem, index) => !predicate(elem, index));
  }
  if (typeof state === 'object' && state !== null) {
    if (predicate === undefined) return {};
    const newObj = {};
    Object.entries(state).map(([key, value]) => {
      if (!predicate(key, value)) newObj[key] = value;
    });
    return newObj;
  }
}

/**
 * Sub reducers that are selected depending on the type of the root state
 */

function switch_number(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.value;
    case 'DECREMENT':
      return state - action.value;
    case 'SET':
      return action.value;
    default:
      return state;
  }
}

function switch_boolean(state, action) {
  switch (action.type) {
    case 'SET':
      return action.value;
    case 'TOGGLE':
      return !state;
    default:
      return state;
  }
}

function switch_string(state, action) {
  switch (action.type) {
    case 'SET':
      return action.value;
    default:
      return state;
  }
}

function switch_array(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.value];
    case 'CONCAT':
      return [...state, ...action.value];
    case 'REMOVE_ALL':
      return del(state);
    case 'REMOVE_IN':
      if (action.where !== undefined) {
        return del(state, action.where)
      }
      if (action.index === undefined) action.index = state.length - 1;
      if (action.index !== undefined) {
        return del(state, (e, i) => i === action.index);
      }
    case 'SET_IN':
      if (action.index !== undefined) {
        return update(state, () => action.value, (e, i) => i === action.index);
      }
      if (action.where !== undefined) {
        return update(state, () => action.value, action.where);
      }
    case 'SET_ALL':
      return update(state, () => action.value);
    case 'TOGGLE_IN':
      if (action.index !== undefined) {
        return update(state, el => !el, (e, i) => i === action.index);
      }
      if (action.where !== undefined) {
        return update(state, el => !el, action.where);
      }
    case 'TOGGLE_ALL':
      return update(state, el => !el);
    case 'INCREMENT_IN':
      if (action.index !== undefined) {
        return update(state, el => el + action.value, (e, i) => i === action.index);
      }
      if (action.where !== undefined) {
        return update(state, el => el + action.value, action.where);
      }
    case 'DECREMENT_IN':
      if (action.index !== undefined) {
        return update(state, el => el - action.value, (e, i) => i === action.index);
      }
      if (action.where !== undefined) {
        return update(state, el => el - action.value, action.where);
      }
    case 'UPDATE_IN':
      return update(state, action.set, action.where);
    case 'INSERT':
      // return insert(state, action.values, action)
    return [
      ...state.slice(0, action.index),
      action.value,
      ...state.slice(action.index)
    ];
    case 'INCREMENT_ALL':
      return update(state, el => el + action.value);
    case 'DECREMENT_ALL':
      return update(state, el => el - action.value);
    case 'MERGE_ALL':
      return update(
        state,
        obj => Object.assign({ ...obj }, action.value)
      );
    case 'MERGE_IN':
      if (action.index !== undefined) {
        return update(
          state,
          el => Object.assign({ ...el }, action.value),
          (e, i) => i === action.index
        );
      }
      if (action.where !== undefined) {
        return update(
          state,
          el => Object.assign({ ...el }, action.value),
          action.where
        );
      }
    default:
      return state;
  }
}

function switch_object(state, action) {
  let { verb, path } = actionTypeParser(action.type);
  let newObj = {}

  if (path) {
    if (verb === 'SET_IN') {
      if (action.key !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          obj => { return { ...obj, [action.key]: action.value } }
        );
      }
      if (action.index !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (obj) => update(obj, () => action.value, (e, i) => i === action.index)
        );
      }
      if (action.where !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (obj) => update(obj, () => action.value, action.where)
        );
      }
      return updateAtPath(getPath(path, state), state, () => action.value)
    }
    if (verb === 'INCREMENT_ALL') {
      return updateAtPath(
        getPath(path, state),
        state,
        arr => update(arr, el => el + action.value)
      );
    }
    if (verb === 'INCREMENT_IN') {
      if (action.index !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          arr => update(arr, el => el + action.value, (e, i) => i === action.index)
        );
      }
      if (action.where !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (arr) => update(arr, el => el + action.value, action.where)
        );
      }
    }
    if (verb === 'DECREMENT_ALL') {
      return updateAtPath(
        getPath(path, state),
        state,
        arr => update(arr, el => el - action.value)
      );
    }
    if (verb === 'DECREMENT_IN') {
      if (action.index !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (arr) => update(arr, el => el - action.value, (e, i) => i === action.index)
        );
      }
      if (action.where !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (arr) => update(arr, el => el - action.value, action.where)
        );
      }
    }
    if (verb === 'INCREMENT') {
      return updateAtPath(
        getPath(path, state),
        state,
        number => number + action.value
      );
    }
    if (verb === 'DECREMENT') {
      return updateAtPath(
        getPath(path, state),
        state,
        number => number - action.value
      );
    }
    if (verb === 'TOGGLE') {
      return updateAtPath(getPath(path, state), state, (bool) => !bool);
    }
    if (verb === 'TOGGLE_IN') {
      if (action.index !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          arr => update(arr, el => !el, (e, i) => i === action.index)
        );
      }
      if (action.key !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          obj => update(obj, el => !el, (k, v) => k === action.key)
        );
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (obj) => {
          return update(obj, el => !el, action.where);
        });
      }
    }

    if (verb === 'MERGE') {
      return updateAtPath(
        getPath(path, state),
        state,
        obj => { return Object.assign({ ...obj }, action.value) }
      );
    }

    if (verb === 'MERGE_IN') {
      return updateAtPath(getPath(path, state), state, (obj) => {
        if (Array.isArray(obj)) {
          if (action.index) {
            let newState = [...obj];
            newState[action.index] = Object.assign({ ...newState[action.index] }, action.value);
            return newState;
          }

          if (action.where) {
            return obj.map(value => {
              if (action.where(value)) {
                // Special case to merge object props instead of setting the value.
                if (typeof value === 'object') return Object.assign({ ...value }, action.value);
                return action.value;
              }
              return value;
            });
          }
        }
        if (typeof obj === 'object') {
          if (action.key !== undefined && typeof action.value === 'object') return { ...obj, [action.key]: Object.assign({ ...obj[action.key] }, action.value) };
          if (action.key !== undefined) return { ...obj, [action.key]: action.value };
          if (action.where !== undefined) {
            Object.entries(obj).forEach(([key, subObj]) => {
              if (action.where(key, subObj)) {
                newObj[key] = Object.assign({ ...subObj }, action.value);
              }
              else newObj[key] = { ...subObj }
            })
            return newObj;
          }
        }
      });
    }
    if (verb === 'MERGE_ALL') {
      return updateAtPath(getPath(path, state), state, (obj) => {
        Object.entries(obj).forEach(([key, subObj]) => {
          if (Array.isArray(subObj)) newObj[key] = [...subObj]
          else newObj[key] = Object.assign({ ...subObj }, action.value);
        })
        return newObj;
      });
    }
    if (verb === 'ADD_TO') {
      return updateAtPath(getPath(path, state), state, (arr) => [...arr, action.value]);
    }
    if (verb === 'INSERT_IN') {
      return updateAtPath(getPath(path, state), state, (arr) => [...arr.slice(0, action.index), action.value, ...arr.slice(action.index)]);
    }
    if (verb === 'REMOVE_ALL') {
      return updateAtPath(getPath(path, state), state, (arr) => del(arr));
    }
    if (verb === 'REMOVE_FROM') {
      if (action.index !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (arr) => del(arr, (e, i) => i === action.index)
        );
      }
      if (action.where !== undefined) {
        return updateAtPath(
          getPath(path, state),
          state,
          (arr) => del(arr, action.where)
        );
      }
    }
    if (verb === 'SET_ALL') {
      return updateAtPath(
        getPath(path, state),
        state,
        arr => update(arr, el => action.value)
      );
    }
    // if (verb === 'SET_IN') {
    //   if (action.index !== undefined) {
    //     return updateAtPath(
    //       getPath(path, state),
    //       state,
    //       arr => update(arr, () => action.value, (e, i) => i === action.index)
    //     );
    //   }
    //   if (action.where !== undefined) {
    //     return updateAtPath(
    //       getPath(path, state),
    //       state,
    //       arr => update(arr, () => action.value, action.where)
    //     );
    //   }
    // }
    if (verb === 'TOGGLE_ALL') {
      return updateAtPath(
        getPath(path, state),
        state,
        arr => update(arr, bool => !bool)
      );
    }
  }
  switch (action.type) {
    case 'SET_ALL':
      return update(state, () => action.value)
    case 'SET_IN':
      if (action.key !== undefined) {
        return insert(state, { [action.key]: action.value });
      }
      if (action.where !== undefined) {
        return update(state, () => action.value, action.where);
      }
    case 'MERGE_IN':
      if (action.key !== undefined) {
        return update(
          state,
          (key, subObj) => Object.assign({ ...subObj }, action.value),
          (k, v) => k === action.key
        );
      }
      if (action.where !== undefined) {
        return update(
          state,
          (key, subObj) => Object.assign({ ...subObj }, action.value),
          action.where
        );
      }
    case 'MERGE_ALL':
      return update(
        state,
        (key, subObj) => Object.assign({ ...subObj }, action.value)
      );
    case 'MERGE':
      return insert(state, action.value)
    case 'REMOVE_ALL':
      return del(state);
    case 'REMOVE_IN':
      if (action.key !== undefined) {
        return del(state, (k, v) => k === action.key);
      }
      if (action.where !== undefined) {
        return del(state, action.where);
      }
    case 'INCREMENT_IN':
      if (action.key !== undefined) {
        return update(state, (k, v) => v + action.value, (key) => key === action.key);
      }
      if (action.where !== undefined) {
        return update(state, (k, v) => v + action.value, action.where);
      }
    case 'DECREMENT_IN':
      if (action.key !== undefined) {
        return update(state, (k, v) => v - action.value, (key) => key === action.key);
      }
      if (action.where !== undefined) {
        return update(state, (k, v) => v - action.value, action.where);
      }
    case 'TOGGLE_IN':
      if (action.key !== undefined) {
        return update(state, (k, bool) => !bool, (key) => key === action.key);
      }
      if (action.where !== undefined) {
        return update(state, (k, bool) => !bool, action.where);
      }
    case 'TOGGLE_ALL':
      return update(
        state,
        (k, bool) => !bool
      );
    default:
      return state;
  }
}

/***
* Overall organization and exported classes
**/

function checkPath(path, state) {
  if (path) {
    let paths = findPath(path, state);
    if (paths.length === 0) throw new Error(`Path: ${path} could not be found.`);
    if (paths.length > 1) throw new Error(`Multiple valid paths found. Use a longer path to ensure a unique selection.`)
  }
}
function validatePayload(action, payload, required) {
  if (!payload) return;
  if (required.includes('value') && !('value' in payload)) {
    throw new Error(`${action} should include a value property in the payload.`)
  }
  if (required.includes('in')
    && payload.index === undefined
    && payload.key === undefined
    && payload.where === undefined) {
    throw new Error(`${action} should include either a key, index, or where property in the payload.`)
  }
  // if (required.includes('index') && payload.index === undefined) {
  //   throw new Error(`${action} should include either a key or index property in the payload.`)
  // }
}
function handleAction(action, config, required, state) {
  if (!config) throw new Error('All actions need to have a configuration object.');
  checkPath(config.path, state);
  validatePayload(action, config, required);
  // Final configuration for action
  let path = config.path;
  delete config['path'];
  if (path) return Object.assign({ type: `${action}_${path}` }, config);
  return Object.assign({ type: action }, config);
}

class Actions {
  constructor(closedState) {
    this.closedState = closedState;
  }
  SET_ALL(config) {
    return handleAction('SET_ALL', config, ['value'], this.closedState.state);
  }
  SET_IN(config) {
    return handleAction('SET_IN', config, ['value', 'in'], this.closedState.state);
  }
  SET(config) {
    return handleAction('SET', config, ['value'], this.closedState.state);
  }
  INCREMENT_ALL(config) {
    return handleAction('INCREMENT_ALL', config, ['value'], this.closedState.state);
  }
  INCREMENT_IN(config) {
    return handleAction('INCREMENT_IN', config, ['value', 'in'], this.closedState.state);
  }
  INCREMENT(config) {
    return handleAction('INCREMENT', config, ['value'], this.closedState.state);
  }
  DECREMENT_ALL(config) {
    return handleAction('DECREMENT_ALL', config, ['value'], this.closedState.state);
  }
  DECREMENT_IN(config) {
    return handleAction('DECREMENT_IN', config, ['value', 'in'], this.closedState.state);
  }
  DECREMENT(config) {
    return handleAction('DECREMENT', config, ['value'], this.closedState.state);
  }
  TOGGLE_ALL(config) {
    return handleAction('TOGGLE_ALL', config, [], this.closedState.state);
  }
  TOGGLE_IN(config) {
    return handleAction('TOGGLE_IN', config, ['in'], this.closedState.state);
  }
  TOGGLE(config) {
    return handleAction('TOGGLE', config, [], this.closedState.state);
  }
  ADD_TO(config) {
    return handleAction('ADD_TO', config, ['value'], this.closedState.state);
  }
  ADD(config) {
    return handleAction('ADD', config, ['value'], this.closedState.state);
  }
  INSERT_IN(config) {
    return handleAction('INSERT_IN', config, ['value', 'in'], this.closedState.state);
  }
  INSERT(config) {
    return handleAction('INSERT', config, ['value'], this.closedState.state);
  }
  UPDATE_IN(config) {
    return handleAction('UPDATE_IN', config, ['in'], this.closedState.state);
  }
  REMOVE_ALL(config) {
    return handleAction('REMOVE_ALL', config, [], this.closedState.state);
  }
  REMOVE_IN(config) {
    return handleAction('REMOVE_IN', config, ['in'], this.closedState.state);
  }
  REMOVE(config) {
    return handleAction('REMOVE', config, [], this.closedState.state);
  }
  MERGE_ALL(config) {
    return handleAction('MERGE_ALL', config, ['value'], this.closedState.state);
  }
  MERGE_IN(config) {
    return handleAction('MERGE_IN', config, ['value', 'in'], this.closedState.state);
  }
  MERGE(config) {
    return handleAction('MERGE', config, ['value'], this.closedState.state);
  }
}

class Container {
  constructor() {
    this.closedState = {};
    this.deduce = (reducer) => {
      const initialState = reducer(undefined, {})
      const shouldNormalize = checkForEntities(initialState)
      let proxied = shouldNormalize && processState(initialState)
      return (state, action) => {
        let update = reducer(state, action);
        proxied = shouldNormalize ? proxied[replace](update) : update
        this.closedState.state = proxied;
        if (proxied !== state) return proxied;
        if (typeof state === 'number') {
          this.closedState.state = switch_number(state, action)
          return this.closedState.state;
        }
        if (typeof state === 'boolean') {
          this.closedState.state = switch_boolean(state, action);
          return this.closedState.state;
        }
        if (typeof state === 'string') {
          this.closedState.state = switch_string(state, action);
          return this.closedState.state;
        }
        if (Array.isArray(state)) {
          this.closedState.state = switch_array(state, action);
          return this.closedState.state;
        }
        if (typeof state === 'object' && state !== null) {
          this.closedState.state = switch_object(state, action);
          return this.closedState.state;
        }
      }
    };
    this.actions = new Actions(this.closedState);
  }
}

const container = new Container();
module.exports = {
  deduce: container.deduce,
  D: container.actions
};