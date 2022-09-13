import { ExtId } from '@moodlenet/core'
import { PkgIds } from '../..'

export type RegisteredItem<ItemType> = {
  item: ItemType
  pkg: PkgIds
}

export type Registrar<ItemType> = {
  register: RegisterFn<ItemType>
}

export type RegisterFn<ItemType> = (item: ItemType) => void

// export type CreateRegistryCfg<ItemType> = {}
export type Registry<ItemType> = {
  byPkg: Record<ExtId, RegisteredItem<ItemType>[]>
  entries: RegisteredItem<ItemType>[]
  host: (_: { pkg: PkgIds }) => Registrar<ItemType>
}
export function createRegistry<ItemType>(/* cfg?: CreateRegistryCfg<ItemType> */): Registry<ItemType> {
  const byPkg: Registry<ItemType>['byPkg'] = {}
  const entries: Registry<ItemType>['entries'] = []
  return {
    byPkg,
    entries,
    host,
  }

  function host({ pkg }: { pkg: PkgIds }): Registrar<ItemType> {
    return { register }
    function register(item: ItemType) {
      const regEntry: RegisteredItem<ItemType> = { pkg, item }
      entries.push(regEntry)
      ;(byPkg[pkg.id] = byPkg[pkg.id] ?? []).push(regEntry)
    }
  }
}
