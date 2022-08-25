import { OrganizationExtDef } from '@moodlenet/organization';
import lib from 'moodlenet-react-app-lib';
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
} from 'react';
import { baseStyle, BaseStyleType } from '../../../styles/config';

export type OrganizationData = {
  instanceName:string;
  landingTitle:string;
  landingSubtitle:string;
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
  saveOrganization: typeof _saveOrganization
  organizationData:OrganizationData
}

export const SettingsCtx = createContext<SetCtxT>(null as any)

export function useRegisterSettingsItem({ Menu, Content }: SettingItemDef) {
  const registerSettingsItem = useContext(SettingsCtx).registerSettingsItem
  useEffect(() => {
    return registerSettingsItem({ Menu, Content })
  }, [registerSettingsItem, Menu, Content])
}

const organizationSrv = lib.priHttp.fetch<OrganizationExtDef>('@moodlenet/organization', '0.1.0')
const _saveOrganization = (data: OrganizationData) => {
  organizationSrv('set')({paylodad:data} as any)
}
const getOrganization = () => organizationSrv('get')({})


export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // const nav = useNavigate()
  // dentro a use effect prendo il valore
  const [style, setStyle] = useState<SetCtxT['style']>(StyleContextDefault)
  const [dataOrg, setDataOrg] = useState<OrganizationData>({ instanceName: '', landingTitle: '', landingSubtitle: '' })

  const dataSetter = async () => {
    const orgDataValue = await getOrganization()
    orgDataValue.valid && setDataOrg(orgDataValue.data)
  }
  const saveOrganization = (data:OrganizationData)=>{
    _saveOrganization(data)
    setDataOrg(data)
  }

  useEffect(() => {
    dataSetter()
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
      organizationData:dataOrg
    }
  }, [
    style,
    setStyle,
    registerLogin,
    settingsItems
  ])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
