import { fql } from '../../index';

export const chain = ({ chain, fns }) => {
  const b = chain.slice(1)
  return b.reduce(
    (ac, cv) => {
      const complexOrSimple = typeof cv === 'object' ? 'complex' : 'simple'
      const methodOrPropName = complexOrSimple === 'complex'
        ? Object.keys(cv)[0]
        : cv
      const methodOrProp = complexOrSimple === 'complex'
        ? 'method'
        :  complexOrSimple === 'simple'
            && typeof ac[cv] === 'function'
              ? 'method' 
              : 'prop'
      const applyOrCall = complexOrSimple === 'complex'
        && methodOrProp === 'method'
        && cv[methodOrPropName].args
          ? 'apply'
          : complexOrSimple === 'complex'
            && methodOrProp === 'method'
            ? 'call'
            : undefined
      const args = applyOrCall === 'apply'
        ? cv[methodOrPropName].args
        : applyOrCall === 'call'
          ? cv[methodOrPropName]
          : undefined
      return complexOrSimple === 'simple' && methodOrProp === 'prop'
        ? ac[cv]
        : complexOrSimple === 'simple' && methodOrProp ==='method'
          ? ac[cv]()
          : complexOrSimple === 'complex' && applyOrCall === 'apply'
            ? ac[methodOrPropName](...args)
            : complexOrSimple === 'complex' && applyOrCall === 'call'
              ? ac[methodOrPropName](args)
              : undefined

    }
    , fql(fns, chain[0])
  )
}
