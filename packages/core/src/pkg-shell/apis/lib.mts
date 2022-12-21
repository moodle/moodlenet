import { PkgEntry } from '../../init.mjs'
import {
  ApiDef,
  ApiDefPaths,
  ApiDefs,
  ApiFn,
  ApiFnType,
  CallApiOpts,
  FlatApiDefs,
} from './types.mjs'
import { PkgConnectionDef, PkgModuleRef } from '../types.mjs'

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

export function callApi<
  PkgConnDef extends PkgConnectionDef,
  Path extends ApiDefPaths<PkgConnDef['apis']>,
>(
  apiDef: ApiDef<ApiFn>,
  opts: CallApiOpts,
  callerPkgRegEntry: PkgEntry<PkgConnectionDef>,
  caller_pkg_module_ref: PkgModuleRef,
): ApiFnType<PkgConnDef['apis'], Path> {
  return async function callApi(...args: unknown[]) {
    const _argValidity = await apiDef.argsValidation(...args)
    const argValidity =
      'boolean' === typeof _argValidity ? { valid: _argValidity, msg: undefined } : _argValidity
    if (!argValidity.valid) {
      throw new TypeError(`invalid api params, msg: ${argValidity.msg ?? 'no details'}`)
    }
    return apiDef.api({
      ...opts.ctx,
      caller: { pkgId: callerPkgRegEntry.pkgId, moduleRef: caller_pkg_module_ref },
    })(...args)
  } as ApiFnType<PkgConnDef['apis'], Path>
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
