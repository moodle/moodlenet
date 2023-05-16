import type { PkgIdentifier } from '@moodlenet/core'
import { useCallback, useMemo } from 'react'
import { getCurrentInitPkg } from '../plugin-initializer.mjs'
import type { PkgAddOnsHandle, UseRegisterAddOn } from './add-ons.js'
import { usePkgAddOns as pkgAddOnsHook } from './add-ons.js'

type PkgAddOnsTypesMapT = { [name in `use${Capitalize<string>}`]: any } //`^^
type PkgAddOnsHandles<PkgAddOnsTypesMap extends PkgAddOnsTypesMapT> = {
  [addonName in keyof PkgAddOnsTypesMap]: PkgAddOnsHandle<PkgAddOnsTypesMap[addonName]>
}
type PkgAddOnsRegHooks<PkgAddOnsTypesMap extends PkgAddOnsTypesMapT> = {
  [addonName in keyof PkgAddOnsTypesMap]: UseRegisterAddOn<PkgAddOnsTypesMap[addonName]>
}

type Opts = null
export function createHookPlugin<
  PkgAddOnsTypesMap extends PkgAddOnsTypesMapT,
  HookT extends (...args: any[]) => any = () => void,
>(optsMap: { [n in keyof PkgAddOnsTypesMap]: Opts }) {
  type Hook = (
    addons: PkgAddOnsRegHooks<PkgAddOnsTypesMap>,
    ...rest: Parameters<HookT>
  ) => ReturnType<HookT>
  type RegEntry = {
    hook: Hook
    pkgId: PkgIdentifier
  }
  const registeredEntries: RegEntry[] = []
  // addonFactories.xx?.('23')
  // const x = Object.values(addonFactories)[0]
  return { useHookPlugin, register, registeredEntries } as const
  function useHookPlugin() {
    const addonsHandles = useMemo(
      () =>
        Object.entries(optsMap).reduce(
          (_acc, [addonName /* , opts */]) => ({
            ..._acc,
            [addonName]: pkgAddOnsHook(addonName.substring(3)),
          }),
          {} as PkgAddOnsHandles<PkgAddOnsTypesMap>,
        ),
      [],
    )

    const mapHooks = useCallback(
      <R>(
        mapper: (
          addons: PkgAddOnsRegHooks<PkgAddOnsTypesMap>,
          hook: HookT,
          regEntry: RegEntry,
        ) => R,
      ) =>
        registeredEntries.map<R>(regEntry => {
          const addons = Object.entries(addonsHandles).reduce(
            (_acc, [addonName, [_, getRegHook]]) => ({
              ..._acc,
              [addonName]: getRegHook(regEntry.pkgId),
            }),
            {} as PkgAddOnsRegHooks<PkgAddOnsTypesMap>,
          )
          const hook = regEntry.hook.bind(null, addons) as any
          return mapper(addons, hook, regEntry)
        }),
      [addonsHandles],
    )

    return {
      mapHooks,
      addonsHandles,
    }
  }
  function register(hook: Hook) {
    const pkgId = getCurrentInitPkg()
    registeredEntries.push({ hook, pkgId })
  }
}
