import assert from 'assert'
import { API_DEF_SYMBOL, flattenApiDefs } from './lib.mjs'
import { ensureRegisterPkg, getPkgRegEntryByPkgName } from '../registry/lib.mjs'
import {
  ApiDef,
  ApiDefPaths,
  ApiFn,
  ApiFnType,
  ArgsValidation,
  CallApiOpts,
  CtxApiFn,
  PkgConnectionDef,
  PkgModuleRef,
} from './types/pkg.mjs'
import { PkgIdentifier } from '../types.mjs'

export async function connectPkg<PkgConnDef extends PkgConnectionDef>(
  pkg_module_ref: PkgModuleRef,
  connDef: PkgConnDef,
): Promise<PkgIdentifier<PkgConnDef>> {
  const pkgEntry = await ensureRegisterPkg(pkg_module_ref)
  const flatApiDefs = flattenApiDefs(connDef.apis)
  pkgEntry.pkgConnectionDef = connDef
  pkgEntry.flatApiDefs = flatApiDefs
  console.log(`-- CONNECTED package ${pkgEntry.pkgId.name}@${pkgEntry.pkgId.version} --`)
  return pkgEntry.pkgId
}

export async function pkgConnection<PkgConnDef extends PkgConnectionDef>(
  caller_pkg_module_ref: PkgModuleRef,
  targetPkgId: PkgIdentifier<PkgConnDef>,
) {
  const callerPkgRegEntry = await ensureRegisterPkg(caller_pkg_module_ref)

  // const callerConnection = getConnectionByPkgId(callerPkgInfo.pkgId)
  // assert(
  //   callerConnection,
  //   `cannot use apis() for non connected packages ${callerPkgInfo.pkgId.name}, caller:${getPkgModuleFilename(
  //     caller_pkg_module_ref,
  //   )}`,
  // )
  const targetPkgEntry = getPkgRegEntryByPkgName(targetPkgId.name)
  assert(targetPkgEntry, `cannot call apis() on non connected target ${targetPkgId.name}`)

  const locateApi = <Path extends ApiDefPaths<PkgConnDef['apis']>>(
    path: Path,
    opts: CallApiOpts = {},
  ): ApiFnType<PkgConnDef['apis'], Path> => {
    const apiDef = targetPkgEntry.flatApiDefs[path]
    assert(apiDef, `no apiDef in ${targetPkgEntry.pkgId.name}::${path}`)

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

  return {
    api: locateApi,
  }
}

export function defApi<_ApiFn extends ApiFn>(
  api: CtxApiFn<_ApiFn>,
  argsValidation: ArgsValidation,
): ApiDef<_ApiFn> {
  return {
    api,
    argsValidation,
    ...{ [API_DEF_SYMBOL]: API_DEF_SYMBOL },
  }
}
