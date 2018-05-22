function actionTypeParser(actionType) {
  const validActions = [
    'SET_ALL',
    'SET_IN',
    'SET',
    'INCREMENT_ALL',
    'INCREMENT_IN',
    'INCREMENT',
    'DECREMENT_ALL',
    'DECREMENT_IN',
    'DECREMENT',
    'TOGGLE_ALL',
    'TOGGLE_IN',
    'TOGGLE',
    'ADD_TO',
    'ADD',
    'INSERT_IN',
    'INSERT',
    'REMOVE_ALL',
    'REMOVE_FROM',
    'REMOVE',
    'MERGE_ALL',
    'MERGE_IN',
    'MERGE',
  ];
  let verb;
  let path;
  for (let action of validActions) {
    if (actionType.startsWith(action)) {
      verb = action;
      path = actionType.replace(verb, '').replace('_', '');
      return {verb, path}
    }
  }
  return {verb, path} // Undefined if no match
}

module.exports = actionTypeParser;