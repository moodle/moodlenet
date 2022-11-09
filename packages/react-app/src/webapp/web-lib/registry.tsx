import { PkgIdentifier, PkgName } from '@moodlenet/core'
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type RegistryEntry<ItemType> = {
  item: ItemType
  pkgId: PkgIdentifier<any>
}

export type UnRegisterFn = () => void
export type RegisterFn<ItemType> = (pkgId: PkgIdentifier<any>, item: ItemType) => UnRegisterFn
export type UseRegisterHook<ItemType> = (pkgId: PkgIdentifier<any>, item: ItemType) => void

// export type CreateRegistryCfg<ItemType> = {}
export type Registry<ItemType> = {
  byPkg: Record<PkgName, RegistryEntry<ItemType>[]>
  entries: RegistryEntry<ItemType>[]
}

export type CreateRegistry = typeof createRegistry
export type UseRegistryHook<ItemType> = () => RegistryContextT<ItemType>

export type RegistryHandler<ItemType> = {
  useRegister: UseRegisterHook<ItemType>
  useRegistry: UseRegistryHook<ItemType>
  Provider: FC<PropsWithChildren>
}

export type RegistryContextT<ItemType> = {
  registry: Registry<ItemType>
  register: RegisterFn<ItemType>
}

export function createRegistry<
  ItemType,
>(/* cfg?: CreateRegistryCfg<ItemType> */): RegistryHandler<ItemType> {
  const initialRegistry: Registry<ItemType> = { byPkg: {}, entries: [] }
  type CurrentContextT = RegistryContextT<ItemType>
  const context = createContext<CurrentContextT>(null as any)

  const Provider: FC<PropsWithChildren> = ({ children }) => {
    const [registry, setRegistry] = useState(initialRegistry)

    const unregister = useCallback((entry: RegistryEntry<ItemType>) => {
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
    }, [])

    const register = useCallback<CurrentContextT['register']>(
      (pkgId, item) => {
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
      },
      [unregister],
    )

    const ctxValue = useMemo(() => {
      const ctx: CurrentContextT = {
        register,
        registry,
      }
      return ctx
    }, [register, registry])

    return <context.Provider value={ctxValue}>{children}</context.Provider>
  }

  return {
    useRegistry,
    useRegister,
    Provider,
  }

  function useRegistry() {
    return useContext(context)
  }

  function useRegister(pkgId: PkgIdentifier<any>, item: ItemType) {
    const { register } = useContext(context)
    useEffect(() => {
      return register(pkgId, item)
    }, [item, register, pkgId])
  }
}
