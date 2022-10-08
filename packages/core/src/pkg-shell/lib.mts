import assert from 'assert'
import { dirname } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import { fileURLToPath } from 'url'
import { getPackageInfoIn } from '../pkg-mng/lib.mjs'
import { ApiDef, ApiDefs, FlatApiDefs, PkgModuleRef } from './types/pkg.mjs'

export const API_DEF_SYMBOL: unique symbol = Symbol('CONNECTION_SYMBOL')

function isNodeModule(pkg_module_ref: PkgModuleRef): pkg_module_ref is NodeModule {
  return 'exports' in pkg_module_ref
}

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

function isApiDef(ctxApiEntry: ApiDefs | ApiDef<any> | undefined): ctxApiEntry is ApiDef<any> {
  return (
    !!ctxApiEntry && (ctxApiEntry as any)[API_DEF_SYMBOL] === API_DEF_SYMBOL
    // 'api' in ctxApiEntry &&
    // 'function' === typeof ctxApiEntry.api &&
    // 'argsValidation' in ctxApiEntry &&
    // 'function' === typeof ctxApiEntry.argsValidation &&
  )
}

export function getPkgModuleFilename(pkg_module_ref: PkgModuleRef) {
  return isNodeModule(pkg_module_ref) ? pkg_module_ref.id : fileURLToPath(pkg_module_ref.url)
}

export function getPkgModulePaths(pkg_module_ref: PkgModuleRef) {
  const moduleFilename = getPkgModuleFilename(pkg_module_ref)
  const moduleDir = dirname(moduleFilename)
  return { moduleDir, moduleFilename }
}

export async function getPkgModuleInfo(pkg_module_ref: PkgModuleRef) {
  const { moduleDir, moduleFilename } = getPkgModulePaths(pkg_module_ref)
  const pkgRootDir = packageDirectorySync({ cwd: moduleDir })
  assert(pkgRootDir, `no pkgRootDir found for ${moduleDir}`)
  const pkgInfo = await getPackageInfoIn({ pkgRootDir })

  return { moduleFilename, moduleDir, pkgInfo }
}
