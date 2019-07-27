fql |> function query language
==============================

fql uses JSON to transport function calls.

eg.

```json
{
  "__sum": {
    "a": 6,
    "b": 4
  }
}
```

converts to `sum({ a: 6, b: 4 })`

which expects to map to a function that looks something like...

```javascript
const sum = ({ a, b }) => a + b.
```

The double underscore notation makes it easy to search for all function calls in a blob of json.

> Just ctrl+f __

Why fql?
---------------------------------

Unlike functions themselves, fql can be sent across server boundaries and from one language to another.

```javascript
fetch(
    'https://my-api/calculator', {
    method: 'POST'
    body: JSON.stringify({
        __sum: {
            numbers: [1, 2, 3]
        }
    })
)
```

Functions can very expressive and can even include functions within functions...

```javascript

__sum: {
  a: {
    __product: {
      a: 5, 
      b: 5
    }
  },
  b: 3
}
    
```

fql is just a simple notation, that conveys meaning.
Custom interpreters are easy to write, or you can use this one...

fql's js interpreter makes it easy to call functions using fql...

```javascript
import { fql } from 'fql';

const sum = ({ a, b }) => a + b

fql({ sum }, {
  __sum: {
    a: 6,
    b: 3
  }
}) 
// 9
```

The first argument take a map of functions.
The name assigned to the function should match the that in the query.

The second argument is the fql query.

### The fql interpreter and functions within functions

Let's take the following...

```javascript

__sum: {
  a: {
    __product: {
      a: 5, 
      b: 5
    }
  },
  b: 3
}
    
```

Since the above has a function within the function - we need to make our functions "fql-aware".

The sum function needs to be fql aware, so that when it gets a product function instead of a number - it can resolve it. 

To do this we need to wrap `a` and `b` in an `fql` function. 
The fql interpreter will check if the input is an object with double underscore notation.
If it meets the check, it will process it as fql, otherwise it will just return the input.

> Note how sum and product also get passed a `fns` param in addition to `a` and `b`.
> This is automatically passed in by the fql interpreter and allows you to utilise the original functions that were provided to the interpreter.

eg.

```javascript
const sum = ({ a, b, fns }) => 
  fql(fns, a) + fql(fns, b)
  
const product = ({ a, b, fns }) => 
  fql(fns, a) * fql(fns, b)
  
fql({sum, product}, {
  __sum: {
    a: {
      __product: {
        a: 5, 
        b: 5
      }
    },
    b: 3
  }
})
  
```

Interpreter Advanced
--------------------

The interpreter can also interpret function calls with anonymous arguments, using the `args` keyword.

```javascript

{
  __sum: {
    args: [1, 2]
  }
}

```

maps to `sum(1, 2)`

And can perform curry functions using the `curry` key word.

```javascript

{
  __sum: {
    curry: [
      { args: [1, 2] },
      { args: [3] }
    ]
  }
}

```

maps to `sum(1, 2)(3)`

And using the chain utility provided, can even method-chain...

```javascript

import { fql, chain } from '../src'

const query = {
  __chain: {
    chain: [
      {
        __sum: {
          curry: [
            { args: [5, 5 ] },
            { args: [3]}
          ]
        }
      },
      'toString',
      { 
        'concat': {
          args: [' y\'all!!!']
        }
      },
      'toUpperCase'
    ]
  }
}

fql({ chain, sum}, query) // 13 Y'ALL

```

Which maps to `sum(5,5)(3).toString().concat(' y'all').toUpperCase()`

Use cases for fql
-----------------

fql provides a very expressive syntax for apis, and since
fql is just json, it's easy to parse and pass around.
By providing an fql endpoint in an api, you can then simply POST fql to it.

fql vs graphQl

Where graphQl at it's core is about asking for specific fields on objects, fql is about making expressive function calls across server and language boundaries.

Install
-----------------

not yet on npm ... but npm i fql

```
import { fql } from 'fql'
```

```
const fql = require('fql').fql;
```