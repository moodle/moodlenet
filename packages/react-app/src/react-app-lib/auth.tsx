import type { AuthenticationManagerExt, ClientSession, SessionToken, UserData } from '@moodlenet/authentication-manager'
import { ContentGraphExtDef } from '@moodlenet/content-graph'
import { SessionTokenCookieName } from '@moodlenet/http-server'
import cookies from 'js-cookie'
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
import rootAvatarUrl from '../webapp/static/img/ROOT.png'
import priHttp from './pri-http'

// import rootAvatarUrl from '../webapp/static/img/ROOT.png'
// displayName: 'ROOT',
//             avatarUrl: rootAvatarUrl,
export type ClientSessionData<IsRoot extends boolean = boolean> = {
  isRoot: IsRoot
  userDisplay: { name: string; avatarUrl: string }
} & (IsRoot extends false ? { user: UserData } : {})
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
  logout(): void
  clientSessionData: ClientSessionData | null
}

const authSrvFetch = priHttp.fetch<AuthenticationManagerExt>('@moodlenet/authentication-manager', '0.1.0')
const contentGraphSrvFetch = priHttp.fetch<ContentGraphExtDef>('@moodlenet/content-graph', '0.1.0')

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
  const [clientSessionData, setClientSessionData] = useState<ClientSessionData | null>(null)

  const fetchClientSession = useCallback(async (token: SessionToken) => {
    const res = await authSrvFetch('getClientSession')({ token })
    if (!res.success) {
      writeSessionToken()
      return { success: false, msg: 'invalid token' } as const
    }
    writeSessionToken(token)
    const clientSessionData = await getClientSessionData(res.clientSession)
    setClientSessionData(clientSessionData)
    return {
      success: true,
      clientSession: res.clientSession,
    } as const
  }, [])

  const logout = useCallback<AuthCtxT['logout']>(() => {
    setClientSessionData(null)
    writeSessionToken()
  }, [setClientSessionData])
  const setSessionToken = useCallback<AuthCtxT['setSessionToken']>(async token => {
    const res = await fetchClientSession(token)
    if (res.success) {
      nav('/')
    }
    return res
  }, [])

  useEffect(() => {
    const storedSessionToken = readSessionToken()
    if (!storedSessionToken) {
      return
    }
    fetchClientSession(storedSessionToken)
  }, [fetchClientSession])

  const ctx = useMemo<AuthCtxT>(() => {
    return {
      registerLogin,
      loginItems,
      signupItems,
      registerSignup,
      setSessionToken,
      logout,
      clientSessionData,
      // ...(clientSession?.root ? { isRoot: true, clientSession } : { isRoot: false, clientSession }),
    }
  }, [registerLogin, loginItems, signupItems, registerSignup, clientSessionData, setSessionToken, logout])

  return <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider>
}

const SESSION_TOKEN_COOKIE_NAME: SessionTokenCookieName = 'mn-session'
function readSessionToken(): SessionToken | undefined {
  return cookies.get(SESSION_TOKEN_COOKIE_NAME)
}
function writeSessionToken(token?: SessionToken | undefined) {
  token ? cookies.set(SESSION_TOKEN_COOKIE_NAME, token) : cookies.remove(SESSION_TOKEN_COOKIE_NAME)
}

// function readSessionToken(): SessionToken | null {
//   return localStorage.getItem('SESSION_TOKEN')
// }
// function writeSessionToken(token: SessionToken | null) {
//   token ? localStorage.setItem('SESSION_TOKEN', token) : localStorage.removeItem('SESSION_TOKEN')
// }

async function getClientSessionData(clientSession: ClientSession): Promise<ClientSessionData> {
  if (clientSession.root) {
    return {
      isRoot: true as true,
      userDisplay: { name: 'ROOT', avatarUrl: rootAvatarUrl },
    }
  }

  const myUserNode = await contentGraphSrvFetch('getMyUserNode')()
  if (!myUserNode) {
    throw new Error(`shouldn't happen : can't fetch getMyUserNode for userId : ${clientSession.user.id}`)
  }

  const { title /* ,icon, description*/ } = myUserNode.node
  const avatarUrl = /* icon ?? */ 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'
  return { isRoot: false, user: clientSession.user, userDisplay: { name: title, avatarUrl } }
}
