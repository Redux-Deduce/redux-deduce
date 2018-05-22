# Introduction

Official docs at [https://redux-deduce.gitbook.io/redux-deduce/](https://redux-deduce.gitbook.io/redux-deduce/)

## Features

Reduce your reducer boilerplate with Redux-deduce. 

* Perform common updates with our easy to use action creators without needing to write reducers.
  * Our deducer engine enhances your reducers, doing many simple tasks automatically. 
* Easy to add and remove from your project.
  * Just pass your root reducer through our decorating function then create your store. 
* All Redux and Redux devtools features remain intact
  * Time travel debugging with Redux.
  * Immutable updates.
  * Middleware integrations.

## Installation

```text
npm install Redux-Deduce/redux-deduce
```

## Basic Usage

To enable redux-deduce you need to wrap your rootReducer with the 'deduce' reducer enhancer. 

```javascript
import {createStore} from 'redux';
import { deduce } from 'redux-deduce';

rootReducer = (state = {}, action) => { 
 switch (action.type) { 
  default: 
   return state; 
  } 
 };
 
store = createStore(deduce(rootReducer));
```

At this point, redux-deduce will now interpret any acceptable actions that are dispatched by Redux. Any custom actions or reducers that exist in your project take precedence and will run as normal.

**For example:**

Given the following state:

```javascript
const state = {
    appState: {
        count: 0,
        isSelected: false
    }
};
```

We can update the app state using an action with the action type 'SET\_IN\_COUNT'. Redux-deduce will search the state-tree to find to find the correct update location and make an immutable update.

```javascript
store.dispatch({
    type: 'SET_COUNT',
    value: 5
});
```

Writing actions by hand is verbose and error-prone, so we introduce several action creators to help you validate and create actions that redux-deduce understands.

```javascript
import { D } from 'redux-deduce';

store.dispatch(D.SET({
    path: 'COUNT',
    value: 5
}));
```

By using the action creators you get auto-complete in your IDE, better error message, and the error messages will indicate the line number that the action will be dispatched on instead of deep in the redux-deduce code.

