export type AddOnMap<T> = { [name in string]: T | null | undefined }
export type PluginHook<C, R> = (context: C) => R

type KeydAddon<T> = T & { key: string }
type KeydMappedAddon<A> = A extends AddOnMap<infer T> ? KeydAddon<T> : KeydAddon<A>

export function hookPluginCreator(getPluginOwnerId: (hook: PluginHook<any, any>) => string) {
  return createHookPlugin

  function createHookPlugin<R = void, C = void>() {
    const plugins: { hook: PluginHook<C, R>; ownerId: string }[] = []

    return {
      register,
      usePluginHooks,
    }

    function register(hook: PluginHook<C, R>) {
      plugins.push({
        hook,
        ownerId: getPluginOwnerId(hook),
      })
    }

    function usePluginHooks(context: C) {
      const results = plugins.map(({ hook, ownerId }) => ({ ownerId, result: hook(context) }))
      return {
        results,
        getKeyedAddons,
      }
      function getKeyedAddons<F extends keyof R>(field: F): KeydMappedAddon<R[F]>[] {
        return results
          .map<KeydMappedAddon<R[F]>[]>(({ ownerId, result }) => {
            const addonsMap = result[field]
            if (typeof addonsMap !== 'object' || !addonsMap) return []
            return Object.entries(addonsMap).reduce((acc, [addonName, addon]) => {
              addon && acc.push({ ...addon, key: `${ownerId}::${addonName}` })
              return acc
            }, [] as KeydMappedAddon<R[F]>[])
          })
          .flat()
      }
    }
  }
}

// const cp = ProvideHookPlugin()
// const p = cp<
//   {
//     a: number

//     b?: AddOnMap<{ c: string }>
//     c: AddOnMap<{ b: boolean }>
//   },
//   { a: string }
// >()

// p.register(({ a }) => {
//   return {
//     a: 1,
//     // b: { c: a },
//     b: { b1: { c: a }, b2: { c: 'c' } },
//     c: { c1: { b: true }, c2: { b: true } },
//   }
// })

// const { getKeyedAddons, results } = p.usePluginHooks({ a: '' })

// const bk = getKeyedAddons('c')
// bk.forEach(({ key, b }) => {
//   b.valueOf
// })
