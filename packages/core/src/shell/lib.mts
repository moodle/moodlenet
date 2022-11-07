import { ApiDef, ApiDefs, FlatApiDefs } from './types/pkg.mjs'

export const API_DEF_SYMBOL: unique symbol = Symbol('CONNECTION_SYMBOL')

export function flattenApiDefs<_ApiDefs extends ApiDefs>(
  apiDefs: _ApiDefs,
  subPath = '',
): FlatApiDefs {
  return Object.entries(apiDefs).reduce((_, [key, val]) => {
    return isApiDef(val)
      ? { ..._, [`${subPath}${key}`]: val }
      : { ..._, ...flattenApiDefs(val, `${key}/`) }
  }, {})
}

function isApiDef(ctxApiEntry: ApiDefs | ApiDef | undefined): ctxApiEntry is ApiDef {
  return (
    !!ctxApiEntry && (ctxApiEntry as never)[API_DEF_SYMBOL] === API_DEF_SYMBOL
    // 'api' in ctxApiEntry &&
    // 'function' === typeof ctxApiEntry.api &&
    // 'argsValidation' in ctxApiEntry &&
    // 'function' === typeof ctxApiEntry.argsValidation &&
  )
}
