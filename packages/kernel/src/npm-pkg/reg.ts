import { areSameExtName, isVerBWC, splitExtId } from '../k/pointer'
import type { ExtDef, ExtId, PackageExt, PkgRegistry } from '../types'

export function findExt<Def extends ExtDef>(pkgRegistry: PkgRegistry, findExtId: ExtId<Def>) {
  return pkgRegistry
    .map(pkgReg => {
      const matchingExts = pkgReg.exts.filter(currExt => {
        if (!areSameExtName(currExt.id, findExtId)) {
          return false
        }
        const findExtIdSplit = splitExtId(findExtId)
        const currExtIdSplit = splitExtId(currExt.id)
        const verMatch = isVerBWC(currExtIdSplit.version, findExtIdSplit.version)
        if (!verMatch) {
          return false
        }
        return currExt
      })
      if (!matchingExts.length) {
        return null
      }
      const match: PackageExt = {
        ...pkgReg,
        exts: matchingExts,
      }
      return match
    })
    .filter((_): _ is PackageExt => !!_)
}

export function assertFindExt<Def extends ExtDef>(pkgRegistry: PkgRegistry, findExtId: ExtId<Def>) {
  const matches = findExt<Def>(pkgRegistry, findExtId)

  if (!matches.length) {
    throw new Error(`no extension matching [${findExtId}] found in pkgRegistry`)
  }

  return matches
}
