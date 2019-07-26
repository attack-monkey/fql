fql |> function query language
==============================

fql uses JSON to transport function calls.

> note that we represent the JSON throughout this doc as javascript objects...

eg.

```javascript
{
  __sum: {
    a: 6,
    b: 4
  }
}
```

converts to `sum({ a: 6, b: 4 })`

which expects to map to a function that looks like...

```javascript
const sum = ({ a, b }) => a + b.
```

The double underscore notation makes it easy to search for all function calls in a blob of json.

> Just ctrl+f __

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

fql's function mappper is a tiny import that makes it easy to call functions using fql...

```javascript
import { fql } from 'fql';

const fqlFunctions = {
    sum: ({ a, b }) => a + b
}

const query = {
    __sum: {
        a: 1,
        b: 10
    }
}

fql(fqlFunctions, query) // 11
```

Functions can be called within functions...

```javascript
__sum: {
    numbers: [
        10, 40, 50, {
            __multiply: {
                numbers: [50, 2]
            }
        }
    ]
}
```

Since the above has a function within the function - we need to make our functions "fql-aware".
In our case above, the sum function needs to be fql aware, so that when it gets a multiply function instead of a number - it can resolve it.

eg.

```javascript
  const sum = ({ numbers, fns }) =>
    numbers.reduce((accumulatedValue, number) =>
      accumulatedValue + (typeof number === 'number' ? number : fql(fns, number)), 0)
  
  const multiply = ({ numbers, fns })  =>
  	numbers.reduce((accumulatedValue, number) => accumulatedValue * number, 1)
  
  const fqlFunctions = { sum, multiply };
  
  const query = {
  	__sum: {
      numbers: [
      	10, 40, 50, {
          __multiply: {
            numbers: [50, 2]
          }
        }
      ]
    }
  }

  fql(fqlFunctions, query) // 200
```

Use cases for fql
-----------------

- fql provides a very expressive syntax for apis.
- The fql function mapper has a tiny, tiny footprint.
- fql is just json, so it's easy to parse and pass around.

fql vs graphQl

Where graphQl at it's core is about asking for specific fields on objects, fql is about making expressive function calls across server and language boundaries.
