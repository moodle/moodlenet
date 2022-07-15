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

export type SettingItemDef = { Menu: ComponentType; Content: ComponentType }
export type SettingItem = { def: SettingItemDef }
export type SignupItemDef = { Icon: ComponentType; Panel: ComponentType }
export type SignupItem = { def: SignupItemDef }
export type SetCtxT = {
  instanceName: string
  setInstanceName: React.Dispatch<React.SetStateAction<string>>
  landingTitle: string
  setLandingTitle: React.Dispatch<React.SetStateAction<string>>
  landingSubtitle: string
  setLandingSubtitle: React.Dispatch<React.SetStateAction<string>>
  settingsItems: SettingItem[]
  signupItems: SignupItem[]
  registerLogin(loginItemDef: SettingItemDef): void
  registerSignup(signupItemDef: SignupItemDef): void
}

export const SetCtx = createContext<SetCtxT>(null as any)

export function useRegisterLogin({ Menu, Content }: SettingItemDef) {
  const registerLogin = useContext(SetCtx).registerLogin
  useEffect(() => {
    return registerLogin({ Menu, Content })
  }, [registerLogin, Menu, Content])
}

export function useRegisterSignup({ Icon, Panel }: SignupItemDef) {
  const registerSignup = useContext(SetCtx).registerSignup
  useEffect(() => {
    return registerSignup({ Icon, Panel })
  }, [registerSignup, Icon, Panel])
}

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // const nav = useNavigate()
  const [instanceName, setInstanceName] = useState<SetCtxT['instanceName']>('MoodleNet')
  const [landingTitle, setLandingTitle] = useState<SetCtxT['instanceName']>(
    'Find, share and curate open educational resources',
  )
  const [landingSubtitle, setLandingSubtitle] = useState<SetCtxT['instanceName']>(
    'Search for resources, subjects, collections or people',
  )

  const [settingsItems, setLoginItems] = useState<SetCtxT['settingsItems']>([])
  const registerLogin = useCallback<SetCtxT['registerLogin']>(loginItemDef => {
    const loginItem: SettingItem = {
      def: loginItemDef,
    }
    setLoginItems(items => [...items, loginItem])
    return remove
    function remove() {
      setLoginItems(items => items.filter(_ => _ !== loginItem))
    }
  }, [])

  const [signupItems, setSignupItems] = useState<SetCtxT['signupItems']>([])
  const registerSignup = useCallback<SetCtxT['registerSignup']>(signupItemDef => {
    const signupItem: SignupItem = {
      def: signupItemDef,
    }
    setSignupItems(items => [...items, signupItem])
    return remove
    function remove() {
      setSignupItems(items => items.filter(_ => _ !== signupItem))
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
      registerLogin,
      settingsItems,
      signupItems,
      registerSignup,
    }
  }, [
    instanceName,
    setInstanceName,
    landingTitle,
    setLandingTitle,
    landingSubtitle,
    setLandingSubtitle,
    registerLogin,
    settingsItems,
    signupItems,
    registerSignup,
  ])

  return <SetCtx.Provider value={ctx}>{children}</SetCtx.Provider>
}
