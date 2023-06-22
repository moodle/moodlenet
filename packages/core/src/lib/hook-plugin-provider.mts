export type AddOnMap<T> = { [name in string]: T | null | undefined }
export type PluginHook<C, R> = (context: C) => R

type KeydAddon<T> = T & { key: string }
type KeydMappedAddon<A> = A extends AddOnMap<infer T> ? KeydAddon<T> : KeydAddon<A>

export function pluginCreator(getPluginOwnerId: (hook: PluginHook<any, any>) => string) {
  return createPlugin

  function createPlugin<R = void, C = void>() {
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
