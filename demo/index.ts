import { fql } from '../dist'

const sum = ({ numbers, fns }) =>
  numbers.reduce((accumulatedValue, number) =>
    accumulatedValue + fql(fns, number), 0)

const multiply = ({ numbers, fns }) =>
  numbers.reduce((accumulatedValue, number) =>
    accumulatedValue * fql(fns, number), 1)

const fqlFunctions = { sum, multiply };

const query = {
  __sum: {
    numbers: [
      10, { __multiply: { numbers: [{ __sum: { numbers: [5, 5] } }, 10] } }
    ]
  }
}

console.log(
  fql(fqlFunctions, query)
)