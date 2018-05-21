# Core Concepts

## Primitive Actions

Redux-deduce comes with a handful of primitive actions that work directly on particular data types. These are SET, INCREMENT/DECREMENT, TOGGLE, ADD, INSERT, REMOVE, and MERGE.

| **Action** | **Number** | **Boolean** | **String** | **Array** | **Object** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SET | ✔ | ✔ | ✔ |  |  |
| INCREMENT/DECREMENT | ✔ |  |  |  |  |
| TOGGLE |  | ✔ |  |  |  |
| ADD |  |  |  | ✔ |  |
| INSERT |  |  |  | ✔ |  |
| REMOVE |  |  |  | ✔ | ✔ |
| MERGE |  |  |  |  | ✔ |

## Using IN and ALL to reveal intention with Arrays and Objects

Image you have a collection full on Numbers such as`[0, 1, 2]` or `{a:1, b:2, c:3}`. You probably want to be able to perform updates in these collections, but you can call a SET or INCREMENT on a collection.

To solve this, deduce allows the IN keyword to specify that you want to make an update inside an Array or Object. You can then provide an index, key, or where prop to specify where to make the update.

```javascript
// Arrays
D.SET_IN({index: 0, value: 4})
D.SET_IN({where: (value) => value === 0, value: 4})

// Objects
D.SET_IN({key: 'a', value: 4})
D.SET_IN({where: (key, value) => key === 'a', value: 4})
```

We currently have limited support of making updates to collection of collections. Array of Objects work OK and you can use the path syntax below for working with Objects.

## Using object paths for organization

Dedux action types for objects employ a special **ITEM\_ACTION** and **PATH** syntax to allow you to reference keys within nested objects. This is primarily to capture the organizational use of objects in Redux.

An **ITEM\_ACTION** is an action type that can be run on an item inside your object. These might be action types such as 'SET' or 'TOGGLE'.

A **PATH** is a sequence of keys used in your objects that allow you to uniquely identify the location of a value in your store.  
**For example:**

`{a:1, b:2, c:3}`

The following paths are available: 'A', 'B', and 'C'. This allows you to use action types such as 'SET\_A' and 'SET\_B'. In general, this allows you to use objects to organize your state.

**A more complicated example:**

```javascript
{ 
  counters: {c1: 0, c2: 0, c3: 0}, 
  togglers: {'a': true, 'b': false}
}
```

The paths 'C1', 'C2', 'C3', 'A', and 'B' are available and allow you to use an action such as 'INCREMENT\_C1' or 'TOGGLE\_B'. You can also use the full path: 'INCREMENT\_COUNTERS\_C1'. This is useful when you have multiple keys with the same name.

It's tempting to use this syntax when you have an array or object of repeated objects with unique IDs, but you should use the 'UPDATE' or 'MERGE' 'action type with the where property instead.

In many cases you won't know the exact key until a user performs an action in your application. For these cases you can use the key property inside your action:

```javascript
{ 
  type: 'INCREMENT_IN_COUNTERS', 
  value: 1, 
  key: 'c1'
}
```



