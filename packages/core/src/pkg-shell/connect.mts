import assert from 'assert'
import { API_DEF_SYMBOL, ensureRegisterPkg, getPkgEntryByPkgSym, registerPkgApis } from './connect/lib.mjs'
import {
  ApiDef,
  ApiDefPaths,
  ApiDefs,
  ApiFn,
  ApiFnType,
  ArgsValidation,
  CallApiOpts,
  CtxApiFn,
  PkgConnection,
  PkgModuleRef,
} from './types.mjs'

export function connectPkg<_ApiDefs extends ApiDefs = {}>(
  pkg_module_ref: PkgModuleRef,
  apiDefs: _ApiDefs,
): PkgConnection<_ApiDefs> {
  const {
    pkgSym,
    pkgInfo: { pkgId },
  } = registerPkgApis(pkg_module_ref, apiDefs)
  return {
    pkgSym,
    pkgId,
  }
}

export function useApis<_ApiDefs extends ApiDefs>(
  caller_pkg_module_ref: PkgModuleRef,
  targetPkgApisRef: PkgConnection<_ApiDefs>,
) {
  const { pkgInfo: callerPkgInfo } = ensureRegisterPkg(caller_pkg_module_ref)

  // const callerConnection = getConnectionByPkgId(callerPkgInfo.pkgId)
  // assert(
  //   callerConnection,
  //   `cannot use apis() for non connected packages ${callerPkgInfo.pkgId.name}, caller:${getPkgModuleFilename(
  //     caller_pkg_module_ref,
  //   )}`,
  // )
  const targetPkgEntry = getPkgEntryByPkgSym(targetPkgApisRef.pkgSym)
  assert(targetPkgEntry, `cannot call apis() on non connected target ${targetPkgApisRef}`)

  return function locateApi<Path extends ApiDefPaths<_ApiDefs>>(
    path: Path,
    opts: CallApiOpts = {},
  ): ApiFnType<_ApiDefs, Path> {
    const apiDef = targetPkgEntry.flatApiDefs[path]
    assert(apiDef, `no apiDef in ${targetPkgEntry.pkgInfo.pkgId.name}::${path}`)

    return async function callApi(...args: any[]) {
      const _argValidity = await apiDef.argsValidation(...args)
      const argValidity = 'boolean' === typeof _argValidity ? { valid: _argValidity, msg: undefined } : _argValidity
      if (!argValidity.valid) {
        throw new TypeError(`invalid api params, msg: ${argValidity.msg ?? 'no details'}`)
      }
      return apiDef.api({ ...opts.ctx, caller: { pkgInfo: callerPkgInfo, moduleRef: caller_pkg_module_ref } })(...args)
    } as ApiFnType<_ApiDefs, Path>
  }
}

export function defApi<_ApiFn extends ApiFn>(api: CtxApiFn<_ApiFn>, argsValidation: ArgsValidation): ApiDef<_ApiFn> {
  return {
    api,
    argsValidation,
    ...{ [API_DEF_SYMBOL]: API_DEF_SYMBOL },
  }
}
