export function pkgMeta<T>(pkgName: string, getContainer: () => Record<string, unknown>) {
  return getSet<T>(pkgName, getContainer)
}

export type GetSet<T> = ReturnType<typeof getSet<T>>
export function getSet<T>(attrName: string, getContainer: () => any) {
  type MaybeT = T | undefined
  return { get, set, unset }

  function unset() {
    set(() => undefined)
  }
  function set(setter: (current: MaybeT) => MaybeT): MaybeT {
    const currentStore = getContainer()
    const currentVal = currentStore?.[attrName] as MaybeT
    return (currentStore[attrName] = setter(currentVal))
  }
  function get(): MaybeT {
    const currentStore = getContainer()
    return currentStore?.[attrName] as MaybeT
  }
}
