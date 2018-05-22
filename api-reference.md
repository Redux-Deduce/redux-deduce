# API Reference

## Top-level Exports

* `deduce(rootReducer)`
* `D.[ACTION METHOD]({ configuration })`

### deduce



## D.\[ACTION METHOD\]\_\[ \| IN \| ALL\]

## Primitive Actions

### SET 

Replace the root value in the state-tree.

Works on: Strings, Numbers, Booleans,

```javascript
// STATE = ""

D.SET({ "value": "Ash Ketchum" })

// STATE = "Ash Ketchum"
```

```javascript
// STATE = 0

D.SET({ "value": 4 })

// STATE = 4
```

```javascript
// STATE = false

D.SET({ "value": true })

// STATE = true
```

Objects, Arrays

### INCREMENT

```javascript
// STATE = 1

D.INCREMENT({ "value": 1 })

// STATE = 2
```

### DECREMENT

```javascript
// STATE = 1

D.INCREMENT({ "value": 1 })

// STATE = 0
```

### SET\_ALL - Objects, Arrays

#### Arrays

```java
// STATE = ["0", "0", "0"]

D.SET_ALL({ "value": "1" })

// STATE = ["1", "1", "1"]
```

```java
// STATE = [1, 2, 3]

D.SET_ALL({ "value": 3 })

// STATE = [3, 3, 3]
```

```java
// STATE = [false, false, false]

D.SET_ALL({ "value": true })

// STATE = [true, true, true]
```

#### Objects

```java
/* 
STATE = {
  "Pokemon1": "dead",
  "Pokemon2": "dead",
  "Pokemon3": "dead",
}
*/

D.SET_ALL({ "value": "alive" })

/* 
STATE = {
  "Pokemon1": "alive",
  "Pokemon2": "alive",
  "Pokemon3": "alive",
}
*/
```

```java
/* 
STATE = {
  "Score1": 300,
  "Score2": 400,
  "Score3": 200,
}
*/

D.SET_ALL({ "value": 0 })

/* 
STATE = {
  "Pokemon1": 0,
  "Pokemon2": 0,
  "Pokemon3": 0,
}
*/
```

```java
/* 
STATE = {
  "Pokemon1": false,
  "Pokemon2": false,
  "Pokemon3": false,
}
*/

D.SET_ALL({ "value": true })

/* 
STATE = {
  "Pokemon1": "alive",
  "Pokemon2": "alive",
  "Pokemon3": "alive",
}
*/
```

### TOGGLE

```java
// STATE = true

D.TOGGLE({ "value": false })

// STATE = false
```

### INSERT

```javascript
// STATE = ["Pickachu", "Bulbasaur"]

D.INSERT({ "value": "Squirtle", "index": 2 })

// STATE = ["Pickachu", "Bulbasaur", "Squirtle"]
```

```javascript
// STATE = [ 100, 500 ]

D.INSERT({ "value": 400, "index": 2 })

// STATE = [ 100, 500, 400 ]
```

```javascript
// STATE = [ false, true ]

D.INSERT({ "value": true, "index": 2 })

// STATE = [ false, true, true ]
```

### REMOVE

```text
// TO BE IMPLEMENTED
```

### MERGE

```javascript
/*
STATE = {
    "Ash": "Online"
}
*/

D.MERGE({ "value": { "Mindy": "Online" } })

/*
STATE = {
    "Ash": "Online",
    "Mindy": "Online"
}
*/
```

### CONCAT

```javascript
/*
STATE = [ "Ash" ]
*/

D.CONCAT({ "value": [ "Mindy" ] })

/*
STATE = [ "Ash", "Mindy" ]
*/
```

## Using IN and ALL

### SET\_IN

```javascript
// STATE = { }

D.SET_IN({ "trainer": "Ash Ketchum" })
D.SET_IN({ "badges": 4 })
D.SET_IN({ "isBattling": true })

/* 
STATE = {
     "trainer": "Ash Ketchum",
     "badges": 4,
     "isBattling": true
}
*/
```

### INCREMENT\_IN

```javascript
// STATE = { "pokemon": 3 }

D.INCREMENT_IN({ "path": "POKEMON", "value": 1})

// STATE = { "pokemon": 4 }
```

### INCREMENT\_ALL

```javascript
// STATE = [ 200, 400 ]

D.INCREMENT_ALL({ "value": 100 })

// STATE = [ 300, 500 ]
```

### DECREMENT\_IN

```javascript
// STATE = { "pokemon": 4 }

D.INCREMENT_IN({ "path": "POKEMON", "value": 1})

// STATE = { "pokemon": 3 }
```

### DECREMENT\_ALL

```javascript
// STATE = [ 200, 400 ]

D.INCREMENT_ALL({ "value": 100 })

// STATE = [ 300, 500 ]
```

### TOGGLE\_IN

```javascript
// STATE = { "caught": false }

D.TOGGLE_IN({ "path": "CAUGHT" })

// STATE = { "caught": true }
```

### TOGGLE\_ALL

```javascript
// STATE = [ false, false, false ]

D.TOGGLE_IN({})

// STATE = [ true, true, true ]
```

### ADD\_IN

```javascript
// STATE = { "trainer": {} }

D.ADD_IN({ "path": "TRAINER", "value": { "badges": 5 } })

// STATE
```

### ADD

```javascript
// STATE = [ "Mew", "Geodude", ]

D.ADD({ "value": "Pickachu" })

// STATE = [ "Mew", "Geodude", "Pickachu" ]
```

### INSERT\_IN

```javascript
// STATE = { "pokemon": ["Pickachu", "Bulbasaur"] }

D.INSERT_IN({ "value": "Squirtle", "index": 2, "path": "POKEMON" })

// STATE = { "pokemon": ["Pickachu", "Bulbasaur", "Squirtle"] }
```

```javascript
// STATE = { "scores": [ 100, 500 ] }

D.INSERT_IN({ "value": 400, "index": 2, "path": "" })

// STATE = [ 100, 500, 400 ]
```

```javascript
// STATE = [ false, true ]

D.INSERT_IN({ "value": true, "index": 2, "path": "POKEMON" })

// STATE = [ false, true, true ]
```

### UPDATE\_IN

// TO BE IMPLEMENT

### REMOVE\_IN

```javascript
// STATE = [ "Wombat", "Golbat", "Geodude" ]

D.REMOVE_IN({ 
  "where": (v) => v == "Golbat"
})

// STATE = [ "Wombat", "Geodude" ]
```

### REMOVE\_ALL

```javascript
// STATE = [ "Wombat", "Golbat", "Geodude" ]

D.REMOVE_ALL({ })

// STATE = [ ]
```

### MERGE\_IN

```javascript
/*
STATE = {
  "Ash": {
    "pokemon": []
    },
  "Mindy": {
    "pokemon": [],
    }
}
*/

D.MERGE_IN({ "key": "Ash", "value": { "playing": true } })

/*
STATE = {
  "Ash": {
    "pokemon": [],
    "playing": true
    },
  "Mindy": {
    "pokemon": [],
    }
}
*/
```

### MERGE\_ALL

```javascript
/*
STATE = {
  "Ash": {
    "pokemon": []
  },
  "Mindy": {
    "pokemon": []
  }
}
*/

D.MERGE_ALL({ "value": { "playing": true } })

/*
STATE = {
  "Ash": {
    "pokemon": [],
    "playing": true
  },
  "Mindy": {
    "pokemon": [],
    "playing": true
  }
}
*/
```





