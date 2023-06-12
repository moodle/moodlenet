import { wrapFetch } from '@moodlenet/react-app/webapp'
import cookies from 'js-cookie'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Profile } from '../../../common/exports.mjs'
import { WEB_USER_SESSION_TOKEN_COOKIE_NAME } from '../../../common/exports.mjs'
import defaultAvatarUrl from '../../ui/assets/img/default-avatar.svg'
import rootAvatarUrl from '../../ui/assets/img/root-avatar.png'
import { shell } from '../shell.mjs'

export type UserDisplay = { name: string; avatarUrl: string }
export type ClientSessionData = {
  userDisplay: UserDisplay
} & (
  | {
      isAdmin: true
      isRoot: true
      myProfile?: undefined
    }
  | {
      isAdmin: boolean
      isRoot: false
      myProfile: Profile
    }
)
export type AuthCtxT = {
  logout(): void
  readSessionTokenCookie(): string | undefined
} & (
  | {
      isAuthenticated: true
      clientSessionData: ClientSessionData
    }
  | {
      isAuthenticated: false
      clientSessionData?: undefined
    }
)

export const AuthCtxProvider: FC<PropsWithChildren> = ({ children }) => {
  const authCtx = useAuthCtxValue()
  return authCtx && <AuthCtx.Provider value={authCtx}>{children}</AuthCtx.Provider>
}

export const AuthCtx = createContext<AuthCtxT>(null as never)

export function useAuthCtxValue() {
  const nav = useNavigate()
  const loc = useLocation()

  const [clientSessionData, setClientSessionData] = useState<ClientSessionData | null | undefined>(
    null,
  )

  const logout = useCallback<AuthCtxT['logout']>(() => {
    lastSessionTokenCookie = undefined
    setClientSessionData(undefined)
    deleteSessionTokenCookie()
    nav('/')
  }, [setClientSessionData, nav])

  const fetchClientSessionDataRpc = useCallback(async () => {
    return fetch().then(_ => {
      setClientSessionData(_)
    })
    async function fetch(): Promise<ClientSessionData | undefined> {
      if (!readSessionTokenCookie()) {
        return
      }

      const sessionDataRpc = await shell.rpc.me.getCurrentClientSessionDataRpc()

      if (!sessionDataRpc) {
        return
      }

      if (sessionDataRpc.isRoot) {
        const rootClientSessionData: ClientSessionData = {
          isAdmin: true,
          isRoot: true,
          userDisplay: { name: 'ROOT-USER', avatarUrl: rootAvatarUrl },
        }
        return rootClientSessionData
      }

      const webUserClientSessionData: ClientSessionData = {
        isAdmin: sessionDataRpc.isAdmin,
        isRoot: false,
        userDisplay: {
          name: sessionDataRpc.myProfile.displayName,
          avatarUrl: sessionDataRpc.myProfile.avatarUrl ?? defaultAvatarUrl,
        }, //sessionDataRpc.myProfile.avatarUrl},
        myProfile: sessionDataRpc.myProfile,
      }
      return webUserClientSessionData
    }
  }, [])

  useEffect(() => {
    sessionTokenCookieChanged = () => {
      fetchClientSessionDataRpc().finally(() => {
        const redirectTo = new URLSearchParams(loc.search).get(REDIRECT_Q_NAME)
        nav(redirectTo || '/')
      })
    }
  }, [fetchClientSessionDataRpc, loc.search, loc.state, nav])

  const ctx = useMemo<AuthCtxT | null>(() => {
    if (clientSessionData === null) {
      return null
    }

    const authCtxT: AuthCtxT = {
      readSessionTokenCookie,
      logout,

      ...(clientSessionData
        ? {
            clientSessionData,
            isAuthenticated: true,
          }
        : {
            clientSessionData,
            isAuthenticated: false,
          }),
    }
    return authCtxT
  }, [clientSessionData, logout])

  if (!ctx) {
    fetchClientSessionDataRpc()
  }

  return ctx
}

function readSessionTokenCookie() {
  return cookies.get(WEB_USER_SESSION_TOKEN_COOKIE_NAME)
}

function deleteSessionTokenCookie() {
  cookies.remove(WEB_USER_SESSION_TOKEN_COOKIE_NAME)
}

let sessionTokenCookieChanged: () => void = () => void 0
let lastSessionTokenCookie = readSessionTokenCookie()
wrapFetch((url, reqInit, next) => {
  return next(url, reqInit).finally(() => {
    const currentSessionTokenCookie = readSessionTokenCookie()
    if (lastSessionTokenCookie === currentSessionTokenCookie) {
      return
    }
    lastSessionTokenCookie = currentSessionTokenCookie
    sessionTokenCookieChanged()
  })
})

const REDIRECT_Q_NAME = 'redirectTo'
export function useNeedsWebUserLogin(): {
  isAdmin: boolean
  myProfile: Profile
} | null {
  const nav = useNavigate()
  const loc = useLocation()
  const authCtx = useContext(AuthCtx)
  useEffect(() => {
    if (authCtx.isAuthenticated && authCtx.clientSessionData.myProfile) {
      return
    }
    const usp = new URLSearchParams()
    usp.append(REDIRECT_Q_NAME, `${loc.pathname}${loc.search}${loc.hash}`)
    nav(`/login?${usp.toString()}`)
  }, [authCtx.clientSessionData?.myProfile, authCtx.isAuthenticated, loc, nav])
  return authCtx.clientSessionData?.myProfile
    ? {
        isAdmin: authCtx.clientSessionData.isAdmin,
        myProfile: authCtx.clientSessionData.myProfile,
      }
    : null
}
