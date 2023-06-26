export type AddOnMap<T> = { [name in string]: T | null | undefined }
export type PluginHook<C, R> = (context: C) => R
export type Plugin<R = void, C = void> = {
  register: (hook: PluginHook<C, R>) => void
  usePluginHooks: (context: C) => {
    results: {
      ownerId: string
      result: R
    }[]
    getKeyedAddons: <F extends keyof R>(field: F) => KeydMappedAddon<R[F]>[]
  }
}
type KeydAddon<T> = T & { key: string }
type KeydMappedAddon<A> = A extends AddOnMap<infer T> ? KeydAddon<T> : KeydAddon<A>

export type PluginHookResult<P extends Plugin<any, any>> = P extends Plugin<infer R, any>
  ? R
  : never
export function pluginCreator(getPluginOwnerId: (hook: PluginHook<any, any>) => string) {
  return createPlugin

  function createPlugin<R = void, C = void>(): Plugin<R, C> {
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
