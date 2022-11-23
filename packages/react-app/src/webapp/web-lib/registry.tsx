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
  pkgId: PkgIdentifier
}

export type UnRegisterFn = () => void
export type RegisterFn<ItemType> = (pkgId: PkgIdentifier, item: ItemType) => UnRegisterFn

export type UseRegisterHookOpt = {
  condition: boolean
}
export type UseRegisterHook<ItemType> = (
  pkgId: PkgIdentifier,
  item: ItemType,
  opts?: Partial<UseRegisterHookOpt>,
) => void

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

  const useRegistry: UseRegistryHook<ItemType> = () => {
    return useContext(context)
  }

  const useRegister: UseRegisterHook<ItemType> = (pkgId, item, _opts) => {
    const { register } = useContext(context)

    useEffect(() => {
      if (_opts?.condition === false) {
        return
      }
      return register(pkgId, item)
    }, [item, register, pkgId, _opts?.condition])
  }

  return {
    useRegistry,
    useRegister,
    Provider,
  }
}
