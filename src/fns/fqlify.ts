import { singleFql } from './single-fql';

export const fqlify = (fns, query) => {
  const fnKey = Object.keys(query)[0].replace('__', '')
  const fnInput = Object.values(query)[0]
  // use call or apply
  const call = typeof fnInput === 'object' 
    && Object.keys(fnInput)[0] === 'args'
      ? 'apply'
      : 'call'
  
  const curry = typeof fnInput === 'object' 
    && Object.keys(fnInput)[0] === 'curry'

  return curry
    ? ((fnInput as any).curry as any[]).reduce((ac, cv) => {
      const res = fqlify({ac}, {['__ac']: cv})
      return res
    }, fns[fnKey])
    : singleFql(call, fnInput, fnKey, fns)
}