import type { AuthenticationManagerExt, ClientSession, SessionToken } from '@moodlenet/authentication-manager'
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
import { useNavigate } from 'react-router-dom'
import priHttp from './pri-http'

export type LoginItemDef = { Icon: ComponentType; Panel: ComponentType }
export type LoginItem = { def: LoginItemDef }
export type SignupItemDef = { Icon: ComponentType; Panel: ComponentType }
export type SignupItem = { def: SignupItemDef }
export type AuthCtxT = {
  loginItems: LoginItem[]
  signupItems: SignupItem[]
  registerLogin(loginItemDef: LoginItemDef): () => void
  registerSignup(signupItemDef: SignupItemDef): () => void
  setSessionToken(
    sessionToken: SessionToken,
  ): Promise<{ success: true; clientSession: ClientSession } | { success: false; msg: string }>
  clientSession: ClientSession | null
  logout(): void
}

const srvFetch = priHttp.fetch<AuthenticationManagerExt>('@moodlenet/authentication-manager', '0.1.0')

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
  const nav = useNavigate()
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
  const [clientSession, setClientSession] = useState<ClientSession | null>(null)

  const fetchClientSession = useCallback(
    async (token: SessionToken) => {
      const res = await srvFetch('getClientSession')({ token })
      if (!res.success) {
        writeSessionToken(null)
        return { success: false, msg: 'invalid token' } as const
      }
      writeSessionToken(token)

      setClientSession(res.clientSession)
      return {
        success: true,
        clientSession: res.clientSession,
      } as const
    },
    [setClientSession],
  )

  const logout = useCallback<AuthCtxT['logout']>(() => {
    setClientSession(null)
    writeSessionToken(null)
  }, [setClientSession])
  const setSessionToken = useCallback<AuthCtxT['setSessionToken']>(
    async token => {
      const res = await fetchClientSession(token)
      if (res.success) {
        nav('/')
      }
      return res
    },
    [setClientSession],
  )

  useEffect(() => {
    const storedSessionToken = readSessionToken()
    if (!storedSessionToken) {
      return
    }
    fetchClientSession(storedSessionToken)
  }, [fetchClientSession])

  const ctx = useMemo<AuthCtxT>(() => {
    return { registerLogin, loginItems, signupItems, registerSignup, clientSession, setSessionToken, logout }
  }, [registerLogin, loginItems, signupItems, registerSignup, clientSession, setSessionToken, logout])

  return <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider>
}

function readSessionToken(): SessionToken | null {
  return localStorage.getItem('SESSION_TOKEN')
}
function writeSessionToken(token: SessionToken | null) {
  token ? localStorage.setItem('SESSION_TOKEN', token) : localStorage.removeItem('SESSION_TOKEN')
}
