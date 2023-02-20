import type {
  ClientSession,
  SessionToken,
  UserData,
} from '@moodlenet/authentication-manager/server'

import { SESSION_TOKEN_COOKIE_NAME } from '@moodlenet/http-server/common'
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
import { WebUserProfile } from '../../server/types.mjs'
import rootAvatarUrl from '../static/img/ROOT.png'
import { LoginItem } from '../ui/components/pages/Access/Login/Login.js'
import { SignupItem } from '../ui/components/pages/Access/Signup/Signup.js'
import { wrapFetch } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'
import { MainContext } from './MainContext.mjs'

export type ClientSessionData = {
  isAdmin: boolean
  userDisplay: { name: string; avatarUrl: string }
  user?: UserData
  myProfile?: WebUserProfile
}
export type LoginEntryItem = Omit<LoginItem, 'key'>
export type SignupEntryItem = Omit<SignupItem, 'key'>
export type AuthCtxT = {
  logout(): void
  readSessionTokenCookie(): SessionToken | undefined
  clientSessionData: ClientSessionData | null | undefined
}

export const AuthCtx = createContext<AuthCtxT>(null as never)

let _firstAuthFetchDone = false
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const nav = useNavigate()

  const { use } = useContext(MainContext)
  const [clientSessionData, setClientSessionData] = useState<ClientSessionData | null>(null)

  const getClientSessionData = useCallback(
    async (clientSession: ClientSession): Promise<ClientSessionData | null> => {
      if (clientSession.isRoot) {
        return {
          isAdmin: true,
          userDisplay: { name: 'ROOT', avatarUrl: rootAvatarUrl },
        }
      }

      const myUserProfile = await use.me.rpc['webapp/getMyProfile']()
      if (!myUserProfile) {
        return null
      }
      const { profile } = myUserProfile
      const { displayName: title /* ,icon, description*/ } = profile
      const avatarUrl = /* icon ?? */ 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'
      return {
        isAdmin: myUserProfile.isAdmin,
        userDisplay: { name: title, avatarUrl },
        user: clientSession.user,
        myProfile: profile,
      }
    },
    [use.me],
  )

  const logout = useCallback<AuthCtxT['logout']>(() => {
    // await rpc.invalildateMyToken()
    setClientSessionData(null)
    deleteSessionTokenCookie()
    nav('/')
  }, [setClientSessionData, nav])

  const fetchClientSession = useCallback(async () => {
    if (!readSessionTokenCookie()) {
      _firstAuthFetchDone = true
      logout()
      return
    }
    const maybeClientSession = await use.auth.rpc.getCurrentClientSession()
    if (!maybeClientSession) {
      _firstAuthFetchDone = true
      return { success: false, msg: 'invalid token' } as const
    }
    const clientSession = maybeClientSession
    const newClientSessionData = await getClientSessionData(clientSession)
    _firstAuthFetchDone = true
    setClientSessionData(newClientSessionData)
    if (!newClientSessionData) {
      return {
        success: false,
        msg: 'no session data',
      } as const
    }
    return {
      success: true,
      clientSession,
    } as const
  }, [getClientSessionData, logout, use.auth.rpc])

  useEffect(() => {
    sessionTokenCookieChanged = () => fetchClientSession().finally(() => nav('/'))
  }, [fetchClientSession, nav])

  const ctx = useMemo<AuthCtxT>(() => {
    const authCtxT: AuthCtxT = {
      // setSessionToken,
      readSessionTokenCookie,
      logout,
      clientSessionData,
    }
    return authCtxT
  }, [clientSessionData, logout])

  if (!_firstAuthFetchDone) {
    fetchClientSession()
  }

  return _firstAuthFetchDone ? <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider> : null
}

function readSessionTokenCookie(): SessionToken | undefined {
  return cookies.get(SESSION_TOKEN_COOKIE_NAME)
}

function deleteSessionTokenCookie() {
  cookies.remove(SESSION_TOKEN_COOKIE_NAME)
}

let sessionTokenCookieChanged: () => void = () => void 0
let lastSessionTokenCookie = readSessionTokenCookie()
wrapFetch((url, reqInit, next) => {
  return next(url, reqInit).finally(() => {
    const currentSessionTokenCookie = readSessionTokenCookie()
    // console.log({ lastSessionTokenCookie, currentSessionTokenCookie })
    if (lastSessionTokenCookie === currentSessionTokenCookie) {
      return
    }
    lastSessionTokenCookie = currentSessionTokenCookie
    sessionTokenCookieChanged()
  })
})
