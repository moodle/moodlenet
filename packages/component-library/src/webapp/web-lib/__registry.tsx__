import { ExtId } from '@moodlenet/core'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PkgIds } from '../..'

export type RegistryEntry<ItemType> = {
  item: ItemType
  pkg: PkgIds
}

export type RegGuest<ItemType> = {
  register: RegisterFn<ItemType>
  useLocalRegister: UseLocalRegisterHook<ItemType>
}

export type UnRegisterFn = () => void
export type RegisterFn<ItemType> = (item: ItemType) => UnRegisterFn
export type UseLocalRegisterHook<ItemType> = (item: ItemType) => void

// export type CreateRegistryCfg<ItemType> = {}
export type Registry<ItemType> = {
  byPkg: Record<ExtId, RegistryEntry<ItemType>[]>
  entries: RegistryEntry<ItemType>[]
}

export type CreateRegistry = typeof createRegistry
export type UseRegistry<ItemType> = () => RegistryContextT<ItemType>

export const registriesProviders: { Provider: FC<PropsWithChildren> }[] = []

export type RegistryHandler<ItemType> = {
  //registry,
  host: ({ pkg }: { pkg: PkgIds }) => RegGuest<ItemType>
  useRegistry: UseRegistry<ItemType>
}

export type RegistryContextT<ItemType> = {
  registry: Registry<ItemType>
  register(item: ItemType, pkg: PkgIds): RegistryEntry<ItemType>
  unregister(entry: RegistryEntry<ItemType>): void
}

export function createRegistry<ItemType>(/* cfg?: CreateRegistryCfg<ItemType> */): RegistryHandler<ItemType> {
  let initialRegistry: Registry<ItemType> = { byPkg: {}, entries: [] }
  type ContextT = RegistryContextT<ItemType>
  const context = createContext<ContextT>(null as any)

  const Provider: FC<PropsWithChildren> = ({ children }) => {
    const [registry, setRegistry] = useState(initialRegistry)
    const registryRef = useRef(registry)
    registryRef.current = registry
    const register = useRef<ContextT['register']>((item, pkg) => {
      const { newRegistry, entry } = doRegister(registryRef.current, pkg, item)
      setRegistry(newRegistry)
      return entry
    })
    const unregister = useRef<ContextT['unregister']>(entry => {
      const { newRegistry } = doUnregister(registryRef.current, entry)
      setRegistry(newRegistry)
    })
    const ctxValue = useMemo(() => {
      const ctx: ContextT = {
        register: register.current,
        unregister: unregister.current,
        registry,
      }
      return ctx
    }, [registry])

    return <context.Provider value={ctxValue}>{children}</context.Provider>
  }
  registriesProviders.push({ Provider })

  return {
    //registry,
    host,
    useRegistry,
  }

  function useRegistry() {
    return useContext(context)
  }

  function host({ pkg }: { pkg: PkgIds }): RegGuest<ItemType> {
    return { register, useLocalRegister }

    function useLocalRegister(item: ItemType) {
      const ctx = useContext(context)
      useEffect(() => {
        // console.log('rnd +')
        const entry = ctx.register(item, pkg)
        return () => {
          // console.log('rnd -')
          ctx.unregister(entry)
        }
      }, [item, ctx.register, ctx.unregister])
    }

    function register(item: ItemType) {
      const { entry, newRegistry } = doRegister(initialRegistry, pkg, item)
      initialRegistry = newRegistry
      return () => {
        const { newRegistry } = doUnregister(initialRegistry, entry)
        initialRegistry = newRegistry
      }
    }
  }
}

function doRegister<ItemType>(initRegistry: Registry<ItemType>, pkg: PkgIds, item: ItemType) {
  const entry: RegistryEntry<ItemType> = { pkg, item }
  const registrationNewRegistry: Registry<ItemType> = {
    entries: [...initRegistry.entries, entry],
    byPkg: {
      ...initRegistry.byPkg,
      [pkg.id]: [...(initRegistry.byPkg[pkg.id] ?? []), entry],
    },
  }
  return { newRegistry: registrationNewRegistry, entry }
}

function doUnregister<ItemType>(laterRegistry: Registry<ItemType>, entry: RegistryEntry<ItemType>) {
  const unregistrationNewRegistry: Registry<ItemType> = {
    entries: laterRegistry.entries.filter(_entry => _entry !== entry),
    byPkg: {
      ...laterRegistry.byPkg,
      [entry.pkg.id]: laterRegistry.byPkg[entry.pkg.id]?.filter(_entry => _entry !== entry),
    },
  }
  return { newRegistry: unregistrationNewRegistry, entry }
}
