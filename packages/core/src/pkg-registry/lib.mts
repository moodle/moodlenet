import assert from 'assert'
import { PkgModuleRef } from '../init.mjs'
import { getPkgModuleInfo } from '../pkg-mng/lib/pkg.mjs'
import { PackageInfo } from '../pkg-mng/types.mjs'
import { PkgIdentifier, PkgName } from '../types.mjs'
import { PkgEntry } from './types.mjs'
// import { PkgConnectionDef, PkgEntry, PkgIdentifier, PkgModuleRef, PkgName } from '../types/pkg.mjs'

/*
 * PkgRegistry
 */
const PKG_REG_ENTRIES: PkgEntry[] = []

export function listEntries() {
  return PKG_REG_ENTRIES.slice()
}

export function getPkgEntryByPkgRootDir(pkgRootDir: string) {
  return PKG_REG_ENTRIES.find(_ => _.pkgInfo.pkgRootDir === pkgRootDir)
}
export function getPkgRegEntryByPkgName(pkgName: PkgName) {
  return PKG_REG_ENTRIES.find(_ => _.pkgId.name === pkgName)
}
// export function getPkgApiDefsByPkgName(pkgName: PkgName): Pick<PkgEntry, 'apiDefs' | 'flatApiDefs'> | undefined {
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
  const pkgEntry: PkgEntry = {
    pkgId,
    pkgInfo: pkgModInfo.pkgInfo,
    pkgConnectionDef: { apis: {} },
    flatApiDefs: {},
  }
  return registerPkg(pkgEntry)
}

export function pkgIdByInfo(pkgInfo: PackageInfo): PkgIdentifier {
  const pkgId: PkgIdentifier = {
    name: pkgInfo.packageJson.name,
    version: pkgInfo.packageJson.version,
  }
  return pkgId
}

export function pkgEntryByPkgId(pkgId: PkgIdentifier): PkgEntry | undefined {
  const pkgEntry = getPkgRegEntryByPkgName(pkgId.name)
  if (!pkgEntry) {
    return undefined
  }
  //TODO:FIXME: add version check
  return pkgEntry
}
function registerPkg(pkgEntry: PkgEntry) {
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
