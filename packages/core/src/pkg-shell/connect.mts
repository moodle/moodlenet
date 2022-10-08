import assert from 'assert'
import { API_DEF_SYMBOL } from './lib.mjs'
import { ensureRegisterPkg, getPkgRegEntryByPkgName, registerPkgApis } from './registry.mjs'
import {
  ApiDef,
  ApiDefPaths,
  ApiDefs,
  ApiFn,
  ApiFnType,
  ArgsValidation,
  CallApiOpts,
  CtxApiFn,
  PkgIdentifier,
  PkgModuleRef,
} from './types/pkg.mjs'

export async function connectPkg<_ApiDefs extends ApiDefs = Record<string, never>>(
  pkg_module_ref: PkgModuleRef,
  apiDefs: _ApiDefs,
): Promise<PkgIdentifier<_ApiDefs>> {
  const { pkgId } = await registerPkgApis(pkg_module_ref, apiDefs)
  return pkgId
}

export async function useApis<_ApiDefs extends ApiDefs>(
  caller_pkg_module_ref: PkgModuleRef,
  targetPkgId: PkgIdentifier<_ApiDefs>,
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

  return function locateApi<Path extends ApiDefPaths<_ApiDefs>>(
    path: Path,
    opts: CallApiOpts = {},
  ): ApiFnType<_ApiDefs, Path> {
    const apiDef = targetPkgEntry.flatApiDefs[path]
    assert(apiDef, `no apiDef in ${targetPkgEntry.pkgId.name}::${path}`)

    return async function callApi(...args: any[]) {
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
    } as ApiFnType<_ApiDefs, Path>
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
