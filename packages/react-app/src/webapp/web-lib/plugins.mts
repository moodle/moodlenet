import type { PkgIdentifier } from '@moodlenet/core'
import { useRef } from 'react'
import { getCurrentInitPkg } from '../plugin-initializer.mjs'
import type { PkgAddOn, PkgAddOnsHandle, UseRegisterAddOn } from './add-ons.js'
import { usePkgAddOns as pkgAddOnsHook } from './add-ons.js'

type PkgAddOnsTypesMapT = { [name in `use${Capitalize<string>}`]: any } //`^^
type PkgAddOnsHandles<PkgAddOnsTypesMap extends PkgAddOnsTypesMapT> = {
  [addonName in keyof PkgAddOnsTypesMap]: PkgAddOnsHandle<PkgAddOnsTypesMap[addonName]>
}
type PkgAddOnsRegHooks<PkgAddOnsTypesMap extends PkgAddOnsTypesMapT> = {
  [addonName in WithUse<string & keyof PkgAddOnsTypesMap>]: UseRegisterAddOn<
    PkgAddOnsTypesMap[addonName]
  >
}

type PkgAddOnsMap<PkgAddOnsTypesMap extends PkgAddOnsTypesMapT> = {
  [addonName in keyof PkgAddOnsTypesMap]: PkgAddOn<PkgAddOnsTypesMap[addonName]>[]
}
type MappedPkgAddOnsMap<PkgAddOnsTypesMap extends PkgAddOnsTypesMapT> = {
  [addonName in keyof PkgAddOnsTypesMap]: ({ key: string } & PkgAddOn<
    PkgAddOnsTypesMap[addonName]
  >['addOn'])[]
}

// type RemoveUse<S extends string> = S extends `use${infer T}` ? Uncapitalize<T> : never

type WithUse<S extends string> = `use${Capitalize<S>}`

type AddonOpts = null
export function createHookPlugin<
  PkgAddOnsTypesMap extends PkgAddOnsTypesMapT,
  HookArgExt = undefined | void,
  HookRet = undefined | void,
>(optsMap: { [n in keyof PkgAddOnsTypesMap]: AddonOpts }) {
  type Hook = (hookArg: HookArgExt & PkgAddOnsRegHooks<PkgAddOnsTypesMap>) => HookRet
  type RegEntry = {
    hook: Hook
    pkgId: PkgIdentifier
  }
  const registeredEntries: RegEntry[] = []
  // addonFactories.xx?.('23')
  // const x = Object.values(addonFactories)[0]
  return { useHookPlugin, register, registeredEntries } as const
  function useHookPlugin(moreArg: HookArgExt) {
    const { current: addonsHandles } = useRef({} as PkgAddOnsHandles<PkgAddOnsTypesMap>)
    Object.entries(optsMap).forEach(
      ([addonName /* , opts */]) =>
        (addonsHandles[addonName as keyof PkgAddOnsTypesMap] = pkgAddOnsHook(
          addonName.substring(3),
        )),
    )

    const { current: addonsRegHooks } = useRef({} as PkgAddOnsRegHooks<PkgAddOnsTypesMap>)
    registeredEntries.forEach(({ pkgId }) => {
      Object.entries(addonsHandles).forEach(([addonName, [, getRegHook]]) => {
        const regHookName = (`use` +
          addonName.substring(0, 1).toUpperCase() +
          addonName.substring(1)) as keyof PkgAddOnsRegHooks<PkgAddOnsTypesMap>
        addonsRegHooks[regHookName] = getRegHook(pkgId)
      })
    })

    const results = registeredEntries.map(({ pkgId, hook }) => {
      const res = hook({ ...addonsRegHooks, ...moreArg })
      return { res, pkgId }
    })

    const { current: rawPkgAddons } = useRef({} as PkgAddOnsMap<PkgAddOnsTypesMap>)
    Object.entries(addonsHandles).forEach(
      ([addonName, [pkgAddon]]) => (rawPkgAddons[addonName as keyof PkgAddOnsTypesMap] = pkgAddon),
    )

    const { current: mappedAddons } = useRef({} as MappedPkgAddOnsMap<PkgAddOnsTypesMap>)
    Object.entries(rawPkgAddons).forEach(
      ([addonName, rawPkgAddons]) =>
        (mappedAddons[addonName as keyof PkgAddOnsTypesMap] = rawPkgAddons.map((pkgAddOn: any) => ({
          ...pkgAddOn.addOn,
          key: pkgAddOn.key,
        }))),
    )
    console.log({ rawPkgAddons, mappedAddons })
    return [mappedAddons, rawPkgAddons, results, addonsHandles] as const
  }
  function register(hook: Hook) {
    const pkgId = getCurrentInitPkg()
    registeredEntries.push({ hook, pkgId })
  }
}
