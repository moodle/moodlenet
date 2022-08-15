import {
  ComponentType,
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type RightComponentAddonDef = { StdHeaderItems?: ComponentType[]; MinHeaderItems?: ComponentType[] }
export type RightComponentAddon = { addon: RightComponentAddonDef }
export type AddonCtxT = {
  addRightComponent(_: RightComponentAddonDef): () => void
  rightComponents: RightComponentAddon[]
}
export const AddonCtx = createContext<AddonCtxT>(null as any)
export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [rightComponents, setRightComponents] = useState<AddonCtxT['rightComponents']>([])
  const addRightComponent: AddonCtxT['addRightComponent'] = useCallback(addon => {
    const rightComponentAddon: RightComponentAddon = { addon }
    setRightComponents(addons => addons.concat(rightComponentAddon))
    return () => {
      setRightComponents(addons => addons.filter(_ => _ !== rightComponentAddon))
    }
  }, [])
  const ctx = useMemo(() => {
    const ctx: AddonCtxT = {
      addRightComponent,
      rightComponents,
    }
    return ctx
  }, [addRightComponent, rightComponents])

  return <AddonCtx.Provider value={ctx}>{children}</AddonCtx.Provider>
}

export const useRightComponent = (rightCompDef: RightComponentAddonDef) => {
  const { addRightComponent } = useContext(AddonCtx)
  useEffect(() => {
    return addRightComponent(rightCompDef)
  }, [])
}
