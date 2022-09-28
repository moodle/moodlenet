import assert from 'assert'
import { dirname } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import { fileURLToPath } from 'url'
import { getPackageInfo } from '../../pkg-mng/lib.mjs'
import { PkgName } from '../../pkg-mng/types.mjs'
import { PackageInfo } from '../../types.mjs'
import { ApiDef, ApiDefs, FlatApiDefs, PkgConnection, PkgModuleRef } from '../types.mjs'

export const API_DEF_SYMBOL: unique symbol = Symbol('CONNECTION_SYMBOL')

function isNodeModule(pkg_module_ref: PkgModuleRef): pkg_module_ref is NodeModule {
  return 'exports' in pkg_module_ref
}
export function flattenApiDefs<_ApiDefs extends ApiDefs>(apiDefs: _ApiDefs, subPath = ''): FlatApiDefs {
  return Object.entries(apiDefs).reduce((_, [key, val]) => {
    return isApiDef(val) ? { ..._, [`${subPath}${key}`]: val } : { ..._, ...flattenApiDefs(val, `${key}/`) }
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
function getPkgModulePaths(pkg_module_ref: PkgModuleRef) {
  const moduleFilename = getPkgModuleFilename(pkg_module_ref)
  const moduleDir = dirname(moduleFilename)
  return { moduleDir, moduleFilename }
}
function getPkgModuleInfo(pkg_module_ref: PkgModuleRef) {
  const { moduleDir, moduleFilename } = getPkgModulePaths(pkg_module_ref)
  const pkgRootDir = packageDirectorySync({ cwd: moduleDir })
  assert(pkgRootDir, `no pkgRootDir found for ${moduleDir}`)
  const pkgInfo = getPackageInfo({ pkgRootDir })

  return { moduleFilename, moduleDir, pkgRootDir, pkgInfo }
}

/*
 * PkgRegistry
 */
export type PkgEntry = {
  pkgInfo: PackageInfo
  apiDefs: ApiDefs
  flatApiDefs: FlatApiDefs
  pkgSym: symbol
}

const PKG_ENTRIES: PkgEntry[] = []

export function getPkgEntryByPkgRootDir(pkgRootDir: string) {
  return PKG_ENTRIES.find(_ => _.pkgInfo.pkgRootDir === pkgRootDir)
}
export function getPkgEntryByPkgName(pkgName: PkgName) {
  return PKG_ENTRIES.find(_ => _.pkgInfo.pkgId.name === pkgName)
}
export function getPkgEntryByPkgSym(pkgSym: symbol) {
  return PKG_ENTRIES.find(_ => _.pkgSym === pkgSym)
}
export function getPkgApisRefByPkgName(pkgName: PkgName): PkgConnection<any> | undefined {
  const pkgEntry = getPkgEntryByPkgName(pkgName)
  return pkgEntry && { pkgSym: pkgEntry.pkgSym, pkgId: pkgEntry.pkgInfo.pkgId }
}
// export function getPkgSymbolPkgModuleRef(pkg_module_ref: PkgModuleRef) {
//   const {
//     pkgInfo: { pkgId },
//   } = getPkgModuleInfo(pkg_module_ref)
//   return getPkgEntry(pkgId)
// }

export function ensureRegisterPkg(pkg_module_ref: PkgModuleRef) {
  const pkgModInfo = getPkgModuleInfo(pkg_module_ref)
  const registered = getPkgEntryByPkgName(pkgModInfo.pkgInfo.pkgId.name)
  if (registered) {
    return registered
  }
  const sym = Symbol(`PkgEntry[${pkgModInfo.pkgInfo.pkgId.name}]`)
  const pkgEntry: PkgEntry = { pkgSym: sym, pkgInfo: pkgModInfo.pkgInfo, apiDefs: {}, flatApiDefs: {} }
  return registerPkg(pkgEntry)
}
function registerPkg(pkgEntry: PkgEntry) {
  const pkgName = pkgEntry.pkgInfo.pkgId.name
  assert(!getPkgEntryByPkgName(pkgName), `can't register ${pkgName} twice`)
  const pkgRootDir = pkgEntry.pkgInfo.pkgRootDir
  assert(!getPkgEntryByPkgRootDir(pkgRootDir), `can't register ${pkgRootDir} twice, with a different pkgName`)
  PKG_ENTRIES.push(pkgEntry)
  return pkgEntry
}
export function registerPkgApis<_ApiDefs extends ApiDefs>(pkg_module_ref: PkgModuleRef, apiDefs: _ApiDefs) {
  const pkgEntry = ensureRegisterPkg(pkg_module_ref)
  const flatApiDefs = flattenApiDefs<_ApiDefs>(apiDefs)
  pkgEntry.apiDefs = apiDefs
  pkgEntry.flatApiDefs = flatApiDefs
  return pkgEntry
}
