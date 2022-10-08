import assert from 'assert'
import { PackageInfo } from '../pkg-mng/types.mjs'
import { ApiDefs, PkgEntry, PkgIdentifier, PkgModuleRef, PkgName } from './types/pkg.mjs'
import { getPkgModuleInfo, flattenApiDefs } from './lib.mjs'

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

export async function ensureRegisterPkg(pkg_module_ref: PkgModuleRef) {
  const pkgModInfo = await getPkgModuleInfo(pkg_module_ref)
  const registered = getPkgRegEntryByPkgName(pkgModInfo.pkgInfo.packageJson.name)
  if (registered) {
    return registered
  }
  const pkgId = pkgIdByInfo(pkgModInfo.pkgInfo)
  Object.freeze(pkgId)
  const pkgEntry: PkgEntry<any> = {
    pkgId,
    pkgInfo: pkgModInfo.pkgInfo,
    apiDefs: {},
    flatApiDefs: {},
  }
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
  assert(
    !getPkgEntryByPkgRootDir(pkgRootDir),
    `can't register ${pkgRootDir} twice, with a different pkgName`,
  )
  PKG_REG_ENTRIES.push(pkgEntry)
  return pkgEntry
}
export async function registerPkgApis<_ApiDefs extends ApiDefs>(
  pkg_module_ref: PkgModuleRef,
  apiDefs: _ApiDefs,
) {
  const pkgEntry = await ensureRegisterPkg(pkg_module_ref)
  const flatApiDefs = flattenApiDefs<_ApiDefs>(apiDefs)
  pkgEntry.apiDefs = apiDefs
  pkgEntry.flatApiDefs = flatApiDefs
  return pkgEntry
}
