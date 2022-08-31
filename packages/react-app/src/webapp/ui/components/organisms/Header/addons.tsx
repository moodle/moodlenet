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
export type AvatarMenuItem = { def: AvatarMenuItemDef }
export type AvatarMenuItemDef = {
  Text: string
  Icon: ComponentType
  Path?: string
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
export type AddonCtxT = {
  addRightComponent(_: RightComponentAddonDef): () => void
  rightComponents: RightComponentAddon[]
  avatarMenuItems: AvatarMenuItem[]
  registerAvatarMenuItem(avatarMenuItem: AvatarMenuItemDef): void
}
export const AddonCtx = createContext<AddonCtxT>(null as any)

export function useRegisterAvatarMenuItem({ Text, Icon, Path, ClassName, Position, OnClick }: AvatarMenuItemDef) {
  const registerAvatarMenuItem = useContext(AddonCtx).registerAvatarMenuItem

  useEffect(() => {
    return registerAvatarMenuItem({ Text, Icon, Path, ClassName, Position, OnClick })
  }, [registerAvatarMenuItem, Text, Icon, Path, ClassName, Position, OnClick])
}

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [rightComponents, setRightComponents] = useState<AddonCtxT['rightComponents']>([])
  const addRightComponent: AddonCtxT['addRightComponent'] = useCallback(addon => {
    const rightComponentAddon: RightComponentAddon = { addon }
    setRightComponents(addons => addons.concat(rightComponentAddon))
    return () => {
      setRightComponents(addons => addons.filter(_ => _ !== rightComponentAddon))
    }
  }, [])
  const [avatarMenuItems, setAvatarMenuItems] = useState<AddonCtxT['avatarMenuItems']>([])
  const registerAvatarMenuItem = useCallback<AddonCtxT['registerAvatarMenuItem']>(avatarMenuItemDef => {
    const avatarMenuItem: AvatarMenuItem = {
      def: avatarMenuItemDef,
    }
    setAvatarMenuItems(items => [...items, avatarMenuItem])
    return remove
    function remove() {
      setAvatarMenuItems(items => items.filter(_ => _ !== avatarMenuItem))
    }
  }, [])

  const ctx = useMemo(() => {
    const ctx: AddonCtxT = {
      addRightComponent,
      rightComponents,
      avatarMenuItems,
      registerAvatarMenuItem,
    }
    return ctx
  }, [addRightComponent, rightComponents, avatarMenuItems, registerAvatarMenuItem])

  return <AddonCtx.Provider value={ctx}>{children}</AddonCtx.Provider>
}

export const useRightComponent = (rightCompDef: RightComponentAddonDef) => {
  const { addRightComponent } = useContext(AddonCtx)
  useEffect(() => {
    return addRightComponent(rightCompDef)
  }, [])
}
