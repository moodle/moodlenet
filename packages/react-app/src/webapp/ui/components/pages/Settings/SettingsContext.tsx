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
  useState
} from 'react'
import { AppearanceData, ReactAppExt } from '../../../../..'
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
  organizationData: OrganizationData,
  saveApparence(data: AppearanceData):unknown,
  appearanceData:AppearanceData
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
  const reactAppSrv = lib.priHttp.fetch<ReactAppExt>('@moodlenet/react-app', '0.1.0')


  // const nav = useNavigate()
  // dentro a use effect prendo il valore
  const [style, setStyle] = useState<SetCtxT['style']>(StyleContextDefault)
  const [appearanceData, setAppareanceData] = useState<AppearanceData>({color:''})
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


  const saveApparence = useCallback(
    (data: AppearanceData) => {
      reactAppSrv('setApparence')({ payload: data })
      setAppareanceData(data)
    },
    [setDataOrg],
  )

  useEffect(() => {
    organizationSrv('get')().then(({ data: orgData }) => setDataOrg(orgData))
    reactAppSrv('getApparence')().then(resp => setAppareanceData(resp.data))
  }, [])

  const [settingsItems, setSettingsItems] = useState<SetCtxT['settingsItems']>([])
  const registerSettingsItem = useCallback<SetCtxT['registerSettingsItem']>(settingItemDef => {
    const settingItem: SettingItem = {
      def: settingItemDef,
    }
    setSettingsItems(items => [...items, settingItem])
    return remove
    function remove() {
      setSettingsItems(items => items.filter(_ => _ !== settingItem))
    }
  }, [])

  const ctx = useMemo<SetCtxT>(() => {
    return {
      style,
      setStyle,
      registerSettingsItem,
      settingsItems,
      saveOrganization,
      organizationData,
      saveApparence,
      appearanceData
    }
  }, [style, setStyle, registerSettingsItem, settingsItems, organizationData, appearanceData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
