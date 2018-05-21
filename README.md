# Introduction

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
npm install redux-deduce
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

