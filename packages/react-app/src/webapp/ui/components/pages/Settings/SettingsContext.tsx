import { OrganizationExtDef } from '@moodlenet/organization'
import lib from 'moodlenet-react-app-lib'
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

export type OrganizationData = {
  instanceName: string
  landingTitle: string
  landingSubtitle: string
}

export type StyleType = BaseStyleType & CSSProperties

export const StyleContextDefault = {
  ...baseStyle(),
}

export type SettingItemDef = { Menu: ComponentType; Content: ComponentType }
export type SettingItem = { def: SettingItemDef }
export type SetCtxT = {
  settingsItems: SettingItem[]
  registerSettingsItem(settingsItemDef: SettingItemDef): void
  style: StyleType
  setStyle: React.Dispatch<React.SetStateAction<StyleType>>
  saveOrganization(data: OrganizationData): unknown
  organizationData: OrganizationData
}

export const SettingsCtx = createContext<SetCtxT>(null as any)

export function useRegisterSettingsItem({ Menu, Content }: SettingItemDef) {
  const registerSettingsItem = useContext(SettingsCtx).registerSettingsItem
  useEffect(() => {
    return registerSettingsItem({ Menu, Content })
  }, [registerSettingsItem, Menu, Content])
}

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const organizationSrv = lib.priHttp.fetch<OrganizationExtDef>('@moodlenet/organization', '0.1.0')

  // const nav = useNavigate()
  // dentro a use effect prendo il valore
  const [style, setStyle] = useState<SetCtxT['style']>(StyleContextDefault)
  const [organizationData, setDataOrg] = useState<OrganizationData>({
    instanceName: '',
    landingTitle: '',
    landingSubtitle: '',
  })

  const saveOrganization = useCallback(
    (data: OrganizationData) => {
      organizationSrv('set')({ payload: data })
      setDataOrg(data)
    },
    [setDataOrg],
  )

  useEffect(() => {
    organizationSrv('get')().then(({ data: orgData }) => setDataOrg(orgData))
  }, [])

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
      style,
      setStyle,
      registerSettingsItem: registerLogin,
      settingsItems,
      saveOrganization,
      organizationData,
    }
  }, [style, setStyle, registerLogin, settingsItems, organizationData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
