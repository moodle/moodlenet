import assert from 'assert'
import { getPkgConfig } from '../ignite.mjs'
import { ensureRegisterPkg, getPkgRegEntryByPkgName } from '../pkg-registry/lib.mjs'
import { PkgIdentifier } from '../types.mjs'
import { callApi, flattenApiDefs } from './apis/lib.mjs'

import { ApiDefPaths, ApiFnType, CallApiOpts } from './apis/types.mjs'
import { PkgConnectionDef, PkgModuleRef } from './types.mjs'

export * from './types.mjs'
export * from './apis/shell.mjs'

export async function connectPkg<PkgConnDef extends PkgConnectionDef>(
  pkg_module_ref: PkgModuleRef,
  connDef: PkgConnDef,
): Promise<PkgIdentifier<PkgConnDef>> {
  const pkgEntry = await ensureRegisterPkg(pkg_module_ref)
  const flatApiDefs = flattenApiDefs(connDef.apis)
  pkgEntry.pkgConnectionDef = connDef
  pkgEntry.flatApiDefs = flatApiDefs
  console.log(`-- CONNECTED package ${pkgEntry.pkgId.name}@${pkgEntry.pkgId.version} --`)
  //TODO: try to set generics on ensureRegisterPkg to get a typed pkgEntry instead of casting here below
  return pkgEntry.pkgId as PkgIdentifier<PkgConnDef>
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

    return callApi<PkgConnDef, Path>(apiDef, opts, callerPkgRegEntry, caller_pkg_module_ref)
  }

  return {
    api: locateApi,
  }
}
// function callApi<PkgConnDef extends PkgConnectionDef, Path extends ApiDefPaths<PkgConnDef['apis']>>(
//   apiDef: ApiDef<ApiFn>,
//   opts: CallApiOpts,
//   callerPkgRegEntry: PkgEntry<PkgConnectionDef>,
//   caller_pkg_module_ref: PkgModuleRef,
// ): ApiFnType<PkgConnDef['apis'], Path> {
//   return async function callApi(...args: unknown[]) {
//     const _argValidity = await apiDef.argsValidation(...args)
//     const argValidity =
//       'boolean' === typeof _argValidity ? { valid: _argValidity, msg: undefined } : _argValidity
//     if (!argValidity.valid) {
//       throw new TypeError(`invalid api params, msg: ${argValidity.msg ?? 'no details'}`)
//     }
//     return apiDef.api({
//       ...opts.ctx,
//       caller: { pkgId: callerPkgRegEntry.pkgId, moduleRef: caller_pkg_module_ref },
//     })(...args)
//   } as ApiFnType<PkgConnDef['apis'], Path>
// }

export async function getConfig(caller_pkg_module_ref: PkgModuleRef) {
  const callerPkgRegEntry = await ensureRegisterPkg(caller_pkg_module_ref)
  const pkgConfig = getPkgConfig(callerPkgRegEntry.pkgId.name)
  return pkgConfig
}
