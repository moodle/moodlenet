import assert from 'assert'
import { dirname } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import { fileURLToPath } from 'url'
import { getPackageInfo } from '../../pkg-mng/lib.mjs'
import { PackageInfo } from '../../pkg-mng/types.mjs'
import { ApiDef, ApiDefs, FlatApiDefs, PkgEntry, PkgIdentifier, PkgModuleRef, PkgName } from '../types/pkg.mjs'

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

  return { moduleFilename, moduleDir, pkgInfo }
}

/*
 * PkgRegistry
 */

const PKG_REG_ENTRIES: PkgEntry<any>[] = []

export function listEntries() {
  return PKG_REG_ENTRIES.slice()
}

export function getPkgEntryByPkgRootDir(pkgRootDir: string) {
  return PKG_REG_ENTRIES.find(_ => _.pkgInfo.pkgRootDir === pkgRootDir)
}
export function getPkgRegEntryByPkgName(pkgName: PkgName) {
  return PKG_REG_ENTRIES.find(_ => _.pkgId.name === pkgName)
}

// export function getPkgApiDefsByPkgName(pkgName: PkgName): Pick<PkgEntry<any>, 'apiDefs' | 'flatApiDefs'> | undefined {
//   const pkgEntry = getPkgEntryByPkgName(pkgName)
//   return pkgEntry && { apiDefs: pkgEntry.apiDefs, flatApiDefs: pkgEntry.flatApiDefs }
// }
// export function getPkgSymbolPkgModuleRef(pkg_module_ref: PkgModuleRef) {
//   const {
//     pkgInfo: { pkgId },
//   } = getPkgModuleInfo(pkg_module_ref)
//   return getPkgEntry(pkgId)
// }

export function ensureRegisterPkg(pkg_module_ref: PkgModuleRef) {
  const pkgModInfo = getPkgModuleInfo(pkg_module_ref)
  const registered = getPkgRegEntryByPkgName(pkgModInfo.pkgInfo.packageJson.name)
  if (registered) {
    return registered
  }
  const pkgId = pkgIdByInfo(pkgModInfo.pkgInfo)
  Object.freeze(pkgId)
  const pkgEntry: PkgEntry<any> = { pkgId, pkgInfo: pkgModInfo.pkgInfo, apiDefs: {}, flatApiDefs: {} }
  return registerPkg(pkgEntry)
}

export function pkgIdByInfo(pkgInfo: PackageInfo): PkgIdentifier<any> {
  const pkgId: PkgIdentifier<any> = {
    name: pkgInfo.packageJson.name,
    version: pkgInfo.packageJson.version,
  }
  return pkgId
}

export function pkgEntryByPkgId(pkgId: PkgIdentifier<any>): PkgEntry<any> | undefined {
  const pkgEntry = getPkgRegEntryByPkgName(pkgId.name)
  if (!pkgEntry) {
    return undefined
  }
  //TODO:FIXME: add version check
  return pkgEntry
}

function registerPkg(pkgEntry: PkgEntry<any>) {
  const pkgName = pkgEntry.pkgId.name
  assert(!getPkgRegEntryByPkgName(pkgName), `can't register ${pkgName} twice`)
  const pkgRootDir = pkgEntry.pkgInfo.pkgRootDir
  assert(!getPkgEntryByPkgRootDir(pkgRootDir), `can't register ${pkgRootDir} twice, with a different pkgName`)
  PKG_REG_ENTRIES.push(pkgEntry)
  return pkgEntry
}
export function registerPkgApis<_ApiDefs extends ApiDefs>(pkg_module_ref: PkgModuleRef, apiDefs: _ApiDefs) {
  const pkgEntry = ensureRegisterPkg(pkg_module_ref)
  const flatApiDefs = flattenApiDefs<_ApiDefs>(apiDefs)
  pkgEntry.apiDefs = apiDefs
  pkgEntry.flatApiDefs = flatApiDefs
  return pkgEntry
}
