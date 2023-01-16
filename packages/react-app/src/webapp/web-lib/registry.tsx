import { PkgIdentifier, PkgName } from '@moodlenet/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePkgContext } from '../context/PkgContext.mjs'

export type RegistryEntry<ItemType> = {
  item: ItemType
  pkgId: PkgIdentifier
}

export type UnregisterMeFn = () => void
export type RegisterFn<ItemType> = (
  pkgId: PkgIdentifier,
  item: ItemType,
  opts?: Partial<UseRegisterHookOpt>,
) => UnregisterMeFn
export type UnregisterFn<ItemType> = (entry: RegistryEntry<ItemType>) => void

export type UseRegisterHookOpt = {
  condition: boolean
}
export type UseRegisterHook<ItemType> = (item: ItemType, opts?: Partial<UseRegisterHookOpt>) => void

// export type CreateRegistryCfg<ItemType> = {}
export type Registry<ItemType> = {
  byPkg: Record<PkgName, RegistryEntry<ItemType>[]>
  entries: RegistryEntry<ItemType>[]
}

export type UseRegistryHook<ItemType> = () => RegistryHandle<ItemType>

export type RegistryHandle<ItemType> = {
  useRegister: UseRegisterHook<ItemType>
  registry: Registry<ItemType>
  register: RegisterFn<ItemType>
  unregister: UnregisterFn<ItemType>
}

export function useCreateRegistry<
  ItemType,
>(/* cfg?: CreateRegistryCfg<ItemType> */): RegistryHandle<ItemType> {
  type CurrentRegistryHandleT = RegistryHandle<ItemType>

  const [registry, setRegistry] = useState<Registry<ItemType>>({ byPkg: {}, entries: [] })

  const unregister = useRef((entry: RegistryEntry<ItemType>) => {
    // console.log('unregister', entry)

    setRegistry(currentReg => {
      const unregistrationNewRegistry: Registry<ItemType> = {
        entries: currentReg.entries.filter(_entry => _entry !== entry),
        byPkg: {
          ...currentReg.byPkg,
          [entry.pkgId.name]: (currentReg.byPkg[entry.pkgId.name] ?? []).filter(
            _entry => _entry !== entry,
          ),
        },
      }
      return unregistrationNewRegistry
    })
  }).current

  const register = useRef<CurrentRegistryHandleT['register']>((pkgId, item) => {
    const entry: RegistryEntry<ItemType> = { pkgId, item }
    // console.log('register', entry)
    setRegistry(currentReg => {
      const registrationNewRegistry: Registry<ItemType> = {
        entries: [...currentReg.entries, entry],
        byPkg: {
          ...currentReg.byPkg,
          [pkgId.name]: [...(currentReg.byPkg[pkgId.name] ?? []), entry],
        },
      }
      return registrationNewRegistry
    })
    return () => unregister(entry)
  }).current

  const useRegister = useRef<UseRegisterHook<ItemType>>(function useRegister(item, _opts) {
    const { myId } = usePkgContext()
    useEffect(() => {
      if (_opts?.condition === false) {
        return
      }
      return register(myId, item)
    }, [item, myId, _opts?.condition])
  }).current

  const currentRegistryHandle = useMemo<CurrentRegistryHandleT>(
    () => ({
      register,
      registry,
      unregister,
      useRegister,
    }),
    [register, registry, unregister, useRegister],
  )
  return currentRegistryHandle
}

export type GuestRegistry<ItemType> = {
  useRegister: UseRegisterHook<ItemType>
}

export function useGuestRegistry<ItemType>(
  handle: RegistryHandle<ItemType>,
): GuestRegistry<ItemType> {
  const guest = useMemo<GuestRegistry<ItemType>>(() => guestRegistry(handle), [handle])
  return guest
}

export type GuestRegistryMap<Map extends RegistryMap> = {
  [key in keyof Map]: Map[key] extends RegistryHandle<infer ItemType>
    ? GuestRegistry<ItemType>
    : never
}

export type RegistryMap = {
  [key in string]: RegistryHandle<any>
}

export function useGuestRegistryMap<Map extends RegistryMap>(map: Map): GuestRegistryMap<Map> {
  const guestMap = useMemo(() => guestRegistryMap(map), [map])
  return guestMap
}

export function guestRegistry<ItemType>(handle: RegistryHandle<ItemType>): GuestRegistry<ItemType> {
  const guest = {
    useRegister: handle.useRegister,
  }
  return guest
}
export function guestRegistryMap<Map extends RegistryMap>(map: Map): GuestRegistryMap<Map> {
  return Object.entries(map).reduce<GuestRegistryMap<Map>>(
    (guestMap, [key, handle]) => ({
      ...guestMap,
      [key]: guestRegistry(handle),
    }),
    {} as GuestRegistryMap<Map>,
  )
}
