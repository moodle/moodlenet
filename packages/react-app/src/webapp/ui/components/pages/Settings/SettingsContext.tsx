import {
  ComponentType,
  createContext,
  CSSProperties,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { baseStyle, BaseStyleType } from '../../../styles/config'

export type StyleType = BaseStyleType & CSSProperties

export const StyleContextDefault = {
  ...baseStyle(),
}

export type SettingItemDef = { Menu: ComponentType; Content: ComponentType }
export type SettingItem = { def: SettingItemDef }
export type SetCtxT = {
  instanceName: string
  setInstanceName: React.Dispatch<React.SetStateAction<string>>
  landingTitle: string
  setLandingTitle: React.Dispatch<React.SetStateAction<string>>
  landingSubtitle: string
  setLandingSubtitle: React.Dispatch<React.SetStateAction<string>>
  settingsItems: SettingItem[]
  registerSettingsItem(settingsItemDef: SettingItemDef): void
  style: StyleType
  setStyle: React.Dispatch<React.SetStateAction<StyleType>>
}

export const SettingsCtx = createContext<SetCtxT>(null as any)

export function useRegisterSettingsItem({ Menu, Content }: SettingItemDef) {
  const registerSettingsItem = useContext(SettingsCtx).registerSettingsItem
  useEffect(() => {
    return registerSettingsItem({ Menu, Content })
  }, [registerSettingsItem, Menu, Content])
}

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // const nav = useNavigate()

  const [style, setStyle] = useState<SetCtxT['style']>(StyleContextDefault)
  const [instanceName, setInstanceName] = useState<SetCtxT['instanceName']>('MoodleNet')
  const [landingTitle, setLandingTitle] = useState<SetCtxT['instanceName']>(
    'Find, share and curate open educational resources',
  )
  const [landingSubtitle, setLandingSubtitle] = useState<SetCtxT['instanceName']>(
    'Search for resources, subjects, collections or people',
  )

  const [settingsItems, setLoginItems] = useState<SetCtxT['settingsItems']>([])
  const registerLogin = useCallback<SetCtxT['registerSettingsItem']>(loginItemDef => {
    const loginItem: SettingItem = {
      def: loginItemDef,
    }
    setLoginItems(items => [...items, loginItem])
    return remove
    function remove() {
      setLoginItems(items => items.filter(_ => _ !== loginItem))
    }
  }, [])

  const ctx = useMemo<SetCtxT>(() => {
    return {
      instanceName,
      setInstanceName,
      landingTitle,
      setLandingTitle,
      landingSubtitle,
      setLandingSubtitle,
      style,
      setStyle,
      registerSettingsItem: registerLogin,
      settingsItems,
    }
  }, [
    instanceName,
    setInstanceName,
    landingTitle,
    setLandingTitle,
    landingSubtitle,
    setLandingSubtitle,
    style,
    setStyle,
    registerLogin,
    settingsItems,
  ])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
