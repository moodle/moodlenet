import assert from 'assert'
import { getPkgInfo } from '../pkg-mng/lib/pkg.mjs'
import type { PkgIdentifier, PkgModuleRef, PkgName } from '../types.mjs'
import type { PkgEntry } from './types.mjs'

const _PKG_REG_ENTRIES: PkgEntry[] = []

export async function ensureRegisterPkg(pkg_module_ref: PkgModuleRef) {
  // FIXME: esnure we're in "init" stage
  const pkgInfo = await getPkgInfo(pkg_module_ref)
  const pkgId = Object.freeze<PkgIdentifier>({
    name: pkgInfo.packageJson.name,
    version: pkgInfo.packageJson.version,
  })

  const registeredEntry = pkgEntryByPkgIdValue(pkgId)
  if (registeredEntry) {
    return registeredEntry
  }

  const pkgEntry = Object.freeze<PkgEntry>({
    pkgId,
    pkgInfo,
  })

  registerPkg(pkgEntry)
  return pkgEntry
}

export function pkgEntryByPkgIdValue(pkgId: PkgIdentifier): PkgEntry | undefined {
  const pkgEntry = getPkgRegEntryByPkgName(pkgId.name)
  if (!pkgEntry) {
    return
  }
  //FIXME: add version check
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
  _PKG_REG_ENTRIES.push(pkgEntry)
}

function getPkgEntryByPkgRootDir(pkgRootDir: string) {
  return _PKG_REG_ENTRIES.find(_ => _.pkgInfo.pkgRootDir === pkgRootDir)
}

export function listEntries() {
  return _PKG_REG_ENTRIES.slice()
}

export function getPkgRegEntryByPkgName(pkgName: PkgName) {
  return _PKG_REG_ENTRIES.find(_ => _.pkgId.name === pkgName)
}
