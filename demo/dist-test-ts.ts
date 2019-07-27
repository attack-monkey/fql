import { fql, chain } from '..'

const sum = (a, b) => {
  return (c) => {
    return a + b + c
  }
}

const simple = (a, b) => {
  return a + b
}

const query1 = {
  __simple: {
    args: [1, 2]
  }
}

const query2 = {
  __sum: {
    curry: [
      { args: [1, 2] },
      { args: [3] }
    ]
  }
}

const query3 = {
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
      'toUpperCase',
      'length'
    ]
  }
}

console.log(
  fql({ simple, sum, chain }, query3)
)