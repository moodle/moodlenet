import type { ClientSession, SessionToken, UserData } from '@moodlenet/authentication-manager'
import type graphPkgRef from '@moodlenet/content-graph'
import type { NodeGlyph } from '@moodlenet/content-graph'
import { SESSION_TOKEN_COOKIE_NAME } from '@moodlenet/http-server/lib/ext-ports-app/pub-lib.mjs'
import cookies from 'js-cookie'
import {
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
import { MainContext } from './MainContext.js'
import rootAvatarUrl from '../static/img/ROOT.png'
import { UsePkgHandle } from '../web-lib.mjs'
import { LoginItem } from '../ui/components/pages/Access/Login/Login.js'
import { SignupItem } from '../ui/components/pages/Access/Signup/Signup.js'

// import rootAvatarUrl from '../webapp/static/img/ROOT.png'
// displayName: 'ROOT',
//             avatarUrl: rootAvatarUrl,
export type ClientSessionData = {
  isRoot: boolean
  userDisplay: { name: string; avatarUrl: string }
  user: UserData
  myUserNode: NodeGlyph
}
export type LoginEntryItem = Omit<LoginItem, 'key'>
export type SignupEntryItem = Omit<SignupItem, 'key'>
export type AuthCtxT = {
  setSessionToken(
    sessionToken: SessionToken,
  ): Promise<{ success: true; clientSession: ClientSession } | { success: false; msg: string }>
  logout(): void
  clientSessionData: ClientSessionData | null
}

export const AuthCtx = createContext<AuthCtxT>(null as any)

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const nav = useNavigate()
  const {
    pkgs: [, , authApis, graphApis],
  } = useContext(MainContext)

  const [firstCallDone, setFirstCallDone] = useState(false)
  const [clientSessionData, setClientSessionData] = useState<ClientSessionData | null>(null)

  const fetchClientSession = useCallback(
    async (token: SessionToken) => {
      const res = await authApis.call('getClientSession')({ token })
      if (!res.success) {
        writeSessionToken()
        return { success: false, msg: 'invalid token' } as const
      }
      writeSessionToken(token)
      const clientSessionData = await getClientSessionData(res.clientSession, graphApis)
      setClientSessionData(clientSessionData)
      return {
        success: true,
        clientSession: res.clientSession,
      } as const
    },
    [authApis, graphApis],
  )

  const logout = useCallback<AuthCtxT['logout']>(() => {
    setClientSessionData(null)
    writeSessionToken()
  }, [setClientSessionData])
  const setSessionToken = useCallback<AuthCtxT['setSessionToken']>(
    async token => {
      const res = await fetchClientSession(token)
      if (res.success) {
        nav('/')
      }
      return res
    },
    [fetchClientSession, nav],
  )

  useEffect(() => {
    const storedSessionToken = readSessionToken()
    if (!storedSessionToken) {
      setFirstCallDone(true)
      return
    }
    fetchClientSession(storedSessionToken).then(() => setFirstCallDone(true))
  }, [fetchClientSession])

  const ctx = useMemo<AuthCtxT>(() => {
    return {
      setSessionToken,
      logout,
      clientSessionData,
      // ...(clientSession?.root ? { isRoot: true, clientSession } : { isRoot: false, clientSession }),
    }
  }, [clientSessionData, setSessionToken, logout])

  if (!firstCallDone) {
    return null
  }
  return <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider>
}

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

async function getClientSessionData(
  clientSession: ClientSession,
  graphApis: UsePkgHandle<typeof graphPkgRef>,
): Promise<ClientSessionData> {
  if (clientSession.root) {
    return {
      isRoot: true as const,
      userDisplay: { name: 'ROOT', avatarUrl: rootAvatarUrl },
      myUserNode: {} as any,
      user: {} as any,
    }
  }

  const myUserNodeRes = await graphApis.call('getMyUserNode')()
  if (!myUserNodeRes) {
    throw new Error(
      `shouldn't happen : can't fetch getMyUserNode for userId : ${clientSession.user.id}`,
    )
  }
  const { node: myUserNode } = myUserNodeRes
  const { title /* ,icon, description*/ } = myUserNode
  const avatarUrl = /* icon ?? */ 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'
  return {
    isRoot: false,
    user: clientSession.user,
    myUserNode,
    userDisplay: { name: title, avatarUrl },
  }
}
