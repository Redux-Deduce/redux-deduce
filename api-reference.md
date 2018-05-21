# API Reference

## Top-level Exports

* `deduce(rootReducer)`
* `D.[ACTION METHOD]({ configuration })`

### deduce



## D.\[ACTION METHOD\]\_\[ \| IN \| ALL\]

## Primitive Actions

### SET 

Replace the root value in the state-tree.

Works on: Numbers, Booleans, Strings

```javascript
//STATE = {}

D.SET({"Trainer": "Ash Ketchum"})
D.SET({"Badges": 4})
D.SET({"isBattling": true})

/*STATE = {
    "Trainer": "Ash Ketchum",
    "Badges": 4,
    "isBattling": true
}
*/
```

### SET\_IN 

```javascript
D.SET_IN({value: 5, key}); // Sets root state to 5
```

Objects, Arrays

### INCREMENT

### DECREMENT

### SET\_ALL - Objects, Arrays

### TOGGLE

### ADD

### INSERT

### REMOVE

### MERGE

## Using IN and ALL

### INCREMENT\_IN

### INCREMENT\_ALL

### DECREMENT\_IN

### DECREMENT\_ALL

### TOGGLE\_IN

### TOGGLE\_ALL

### ADD\_IN

### ADD\_ALL

### INSERT\_IN

### UPDATE\_IN

### REMOVE\_IN

### REMOVE\_ALL

### MERGE\_IN

### MERGE\_ALL





