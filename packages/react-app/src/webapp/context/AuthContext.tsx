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
import { useLocation, useNavigate } from 'react-router-dom'
import { WEB_USER_SESSION_TOKEN_COOKIE_NAME } from '../../common/exports.mjs'
import { WebUserProfile } from '../../server/types.mjs'
import defaultAvatarUrl from '../ui/assets/img/default-avatar.svg'
import rootAvatarUrl from '../ui/assets/img/root-avatar.png'
import { LoginItem } from '../ui/components/pages/Access/Login/Login.js'
import { SignupItem } from '../ui/components/pages/Access/Signup/Signup.js'
import { wrapFetch } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'
import { MainContext } from './MainContext.mjs'

export type UserDisplay = { name: string; avatarUrl: string }
export type ClientSessionData = {
  isAdmin: boolean
  userDisplay: UserDisplay
  myProfile?: WebUserProfile
}

export type LoginEntryItem = Omit<LoginItem, 'key'>
export type SignupEntryItem = Omit<SignupItem, 'key'>
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

export const AuthCtx = createContext<AuthCtxT>(null as never)

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const nav = useNavigate()
  const loc = useLocation()

  const { use } = useContext(MainContext)
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

      const sessionDataRpc = await use.me.rpc.getCurrentClientSessionDataRpc()

      if (!sessionDataRpc) {
        return
      }

      if (sessionDataRpc.isRoot) {
        const rootClientSessionData: ClientSessionData = {
          isAdmin: true,
          userDisplay: { name: 'ROOT-USER', avatarUrl: rootAvatarUrl },
        }
        return rootClientSessionData
      }

      const webUserClientSessionData: ClientSessionData = {
        isAdmin: sessionDataRpc.isAdmin,
        userDisplay: { name: sessionDataRpc.myProfile.displayName, avatarUrl: defaultAvatarUrl }, //sessionDataRpc.myProfile.avatarUrl},
        myProfile: sessionDataRpc.myProfile,
      }
      return webUserClientSessionData
    }
  }, [use.me])

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

  return ctx && <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider>
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
  myProfile: WebUserProfile
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

// const STATE_SYM = Symbol('NeedsWebUserLogin state')
// type State = {
//   _: typeof STATE_SYM
//   redirectToAfterLogin: string
// }
