import { ExtId } from '@moodlenet/core'
import { PkgIds } from '../..'

export type RegistryEntry<ItemType> = {
  item: ItemType
  pkg: PkgIds
}

export type RegGuest<ItemType> = {
  register: RegisterFn<ItemType>
}

export type RegisterFn<ItemType> = (item: ItemType) => void

// export type CreateRegistryCfg<ItemType> = {}
export type Registry<ItemType> = {
  byPkg: Record<ExtId, RegistryEntry<ItemType>[]>
  entries: RegistryEntry<ItemType>[]
  host: (_: { pkg: PkgIds }) => RegGuest<ItemType>
}
export function createRegistry<ItemType>(/* cfg?: CreateRegistryCfg<ItemType> */): Registry<ItemType> {
  const byPkg: Registry<ItemType>['byPkg'] = {}
  const entries: Registry<ItemType>['entries'] = []
  return {
    byPkg,
    entries,
    host,
  }

  function host({ pkg }: { pkg: PkgIds }): RegGuest<ItemType> {
    return { register }
    function register(item: ItemType) {
      const regEntry: RegistryEntry<ItemType> = { pkg, item }
      entries.push(regEntry)
      ;(byPkg[pkg.id] = byPkg[pkg.id] ?? []).push(regEntry)
    }
  }
}
