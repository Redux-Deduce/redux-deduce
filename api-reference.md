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

D.SET({ "value": "Ash Ketchum"})

// STATE = "Ash Ketchum"
```

```javascript
// STATE = 0

D.SET({ "value": 4})

// STATE = 4
```

```javascript
// STATE = false

D.SET({ "value": true})

// STATE = true
```

### SET\_IN 

```javascript
// STATE = { }

D.SET_IN({"Trainer": "Ash Ketchum"})
D.SET_IN({"Badges": 4})
D.SET_IN({"isBattling": true})

/* 
STATE = {
     "Trainer": "Ash Ketchum",
     "Badges": 4,
     "isBattling": true
}
*/
```

Objects, Arrays

### INCREMENT

```java
// STATE = 1

D.INCREMENT({"value": 1})

// STATE = 2
```

### DECREMENT

```java
// STATE = 1

D.INCREMENT({"value": 1})

// STATE = 0
```

### SET\_ALL - Objects, Arrays

#### Arrays

```java
// STATE = ["0", "0", "0"]

D.SET_ALL({"value": "1"})

// STATE = ["1", "1", "1"]
```

```java
// STATE = [1, 2, 3]

D.SET_ALL({"value": 3})

// STATE = [3, 3, 3]
```

```java
// STATE = [false, false, false]

D.SET_ALL({"value": true})

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

D.SET_ALL({"value": "alive"})

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

D.SET_ALL({"value": 0})

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

D.SET_ALL({"value": true})

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

D.TOGGLE({"value": false})

// STATE = false
```

### ADD

```javascript
// STATE = { "Trainer": {} }

D.ADD_IN({ "path": "Trainer", "value": { "badges": 5 } })

// STATE
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

```javascript
// STATE = [ false, true ]

D.INSERT({ "value": true, "index": 2 })

// STATE = [ false, true, true ]
```

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





