export const singleFql = (call, fnInput, fnKey, fns) => {
  const fnInputStep2 = call === 'call' ? fnInput : (fnInput as any).args
  const fnInputWithFns = call === 'call'
    ? Object.assign({}, fnInputStep2, { fns })
    : [...fnInputStep2, fns]
    
    if (!fns) { throw new Error('No \'fns\' argument has been provided') }
    if (!fns[fnKey] && fnKey === 'ac') { throw new Error(
      `There is a function in your query that has not been passed to the fql interpreter`
    ) }
    if (!fns[fnKey] && fnKey !== 'ac') { throw new Error(
      `The '${fnKey}' function exists in your query, but has not been passed to the fql interpreter`
    ) }
    return fns[fnKey][call](null, fnInputWithFns)
}