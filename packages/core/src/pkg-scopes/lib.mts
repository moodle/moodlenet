import { assertCallInitiator } from '../async-context/lib.mjs'
import { PkgName } from '../types.mjs'

export type ScopeDefs = Record<string, { description: string }>

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

export async function registerScopes(scopeDefs: ScopeDefs) {
  const { pkgId } = assertCallInitiator()
  registeredPkgScopeDefs[pkgId.name] = scopeDefs
}
