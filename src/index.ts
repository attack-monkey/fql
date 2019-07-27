import { isFql } from './fns/is-fql'
import { fqlify } from './fns/fqlify'
import { chain as chainMethod } from './fns/aux/chain'

export const fql = (fns, query) => {
  try {
    return isFql(query)
      ? fqlify(fns, query)
      : query
  } catch(e) {
    console.log('Error in fql mapping')
    console.error(e)
  }
}

export const chain = chainMethod;