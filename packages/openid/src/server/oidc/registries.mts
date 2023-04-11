import { PkgName } from '@moodlenet/core'
import { ScopeDefs } from '../types/servicesTypes.mjs'

export const registeredPkgScopeDefs: Record<PkgName, ScopeDefs> = {}

export function getPkgScopes() {
  const pkgScopes = Object.entries(registeredPkgScopeDefs)
    .map(([pkgName, defs]) => {
      return Object.entries(defs).map(([pkgScope, def]) => {
        return {
          ...def,
          scope: `${pkgName}:${pkgScope}`,
        }
      })
    })
    .flat()
  return pkgScopes
}
