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

export type LoginItemDef = { Icon: ComponentType; Panel: ComponentType }
export type LoginItem = { def: LoginItemDef }
export type SignupItemDef = { Icon: ComponentType; Panel: ComponentType }
export type SignupItem = { def: SignupItemDef }
export type AuthCtxT = {
  loginItems: LoginItem[]
  signupItems: SignupItem[]
  registerLogin(loginItemDef: LoginItemDef): void
  registerSignup(signupItemDef: SignupItemDef): void
}

export const AuthCtx = createContext<AuthCtxT>(null as any)

export function useRegisterLogin({ Icon, Panel }: LoginItemDef) {
  const registerLogin = useContext(AuthCtx).registerLogin
  useEffect(() => {
    return registerLogin({ Icon, Panel })
  }, [registerLogin, Icon, Panel])
}

export function useRegisterSignup({ Icon, Panel }: SignupItemDef) {
  const registerSignup = useContext(AuthCtx).registerSignup
  useEffect(() => {
    return registerSignup({ Icon, Panel })
  }, [registerSignup, Icon, Panel])
}

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [loginItems, setLoginItems] = useState<AuthCtxT['loginItems']>([])
  const registerLogin = useCallback<AuthCtxT['registerLogin']>(loginItemDef => {
    const loginItem: LoginItem = {
      def: loginItemDef,
    }
    setLoginItems(items => [...items, loginItem])
    return remove
    function remove() {
      setLoginItems(items => items.filter(_ => _ !== loginItem))
    }
  }, [])

  const [signupItems, setSignupItems] = useState<AuthCtxT['signupItems']>([])
  const registerSignup = useCallback<AuthCtxT['registerSignup']>(signupItemDef => {
    const signupItem: SignupItem = {
      def: signupItemDef,
    }
    setSignupItems(items => [...items, signupItem])
    return remove
    function remove() {
      setSignupItems(items => items.filter(_ => _ !== signupItem))
    }
  }, [])

  const ctx = useMemo<AuthCtxT>(() => {
    return { registerLogin, loginItems, signupItems, registerSignup }
  }, [loginItems, signupItems])

  return <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider>
}
