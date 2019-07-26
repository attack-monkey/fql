export const fql = (fns, query) => {
  try {
    const isFql = (input) => (typeof input === 'object' && Object.keys(input)[0].slice(0, 2) === '__')
    const fqlify = (fns, query) => {
      const fnKey = Object.keys(query)[0].replace('__', '')
      const fnInput = Object.values(query)[0]
      const fnInputWithFns = Object.assign({}, fnInput, { fns })
      return fns[fnKey].call(null, fnInputWithFns)
    }
    return isFql(query)
      ? fqlify(fns, query)
      : query
  } catch(e) {
    console.log('Error in fql mapping')
    console.error(e)
  }
}