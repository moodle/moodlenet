import { ExtId } from '@moodlenet/core'

export type Registry<ItemType> = {
  items: RegisteredItem<ItemType>[]
}

export type RegisteredItem<ItemType> = {
  item: ItemType
  extId: ExtId
}
export type Registrar<ItemType> = {
  register(item: ItemType): void
}

// export type CreateRegistryCfg<ItemType> = {}
export function createRegistry<ItemType>(/* cfg?: CreateRegistryCfg<ItemType> */) {
  const byPkg: Record<ExtId, { item: ItemType }[]> = {}
  const items: RegisteredItem<ItemType>[] = []
  return {
    byPkg,
    items,
    host,
  }

  function host({ extId }: { extId: ExtId }): Registrar<ItemType> {
    return { register }
    function register(item: ItemType) {
      items.push({ item, extId })
      ;(byPkg[extId] = byPkg[extId] ?? []).push({ item })
    }
  }
}
