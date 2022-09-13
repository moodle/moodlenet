import type { AuthenticationManagerExt, ClientSession, SessionToken, UserData } from '@moodlenet/authentication-manager'
import { ContentGraphExtDef, NodeGlyph } from '@moodlenet/content-graph'
import { SessionTokenCookieName } from '@moodlenet/http-server'
import cookies from 'js-cookie'
import { ComponentType, createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import rootAvatarUrl from '../static/img/ROOT.png'
import priHttp from './pri-http'

// import rootAvatarUrl from '../webapp/static/img/ROOT.png'
// displayName: 'ROOT',
//             avatarUrl: rootAvatarUrl,
export type ClientSessionData = {
  isRoot: boolean
  userDisplay: { name: string; avatarUrl: string }
  user: UserData
  myUserNode: NodeGlyph
}
export type LoginItem = { Icon: ComponentType; Panel: ComponentType }
export type SignupItem = { Icon: ComponentType; Panel: ComponentType }
export type AuthCtxT = {
  setSessionToken(
    sessionToken: SessionToken,
  ): Promise<{ success: true; clientSession: ClientSession } | { success: false; msg: string }>
  logout(): void
  clientSessionData: ClientSessionData | null
}

const authSrvFetch = priHttp.fetch<AuthenticationManagerExt>('@moodlenet/authentication-manager@0.1.0')
const contentGraphSrvFetch = priHttp.fetch<ContentGraphExtDef>('@moodlenet/content-graph@0.1.0')

export const AuthCtx = createContext<AuthCtxT>(null as any)

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const nav = useNavigate()
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
      setSessionToken,
      logout,
      clientSessionData,
      // ...(clientSession?.root ? { isRoot: true, clientSession } : { isRoot: false, clientSession }),
    }
  }, [clientSessionData, setSessionToken, logout])

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
      myUserNode: {} as any,
      user: {} as any,
    }
  }

  const myUserNodeRes = await contentGraphSrvFetch('getMyUserNode')()
  if (!myUserNodeRes) {
    throw new Error(`shouldn't happen : can't fetch getMyUserNode for userId : ${clientSession.user.id}`)
  }
  const { node: myUserNode } = myUserNodeRes
  const { title /* ,icon, description*/ } = myUserNode
  const avatarUrl = /* icon ?? */ 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'
  return { isRoot: false, user: clientSession.user, myUserNode, userDisplay: { name: title, avatarUrl } }
}
