import { t } from '@lingui/macro'
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setToken } from './Apollo/client'
import {
  useActivateNewAccountMutation,
  useGetCurrentSessionLazyQuery,
  useLoginMutation,
  UserSessionSimpleFragment,
} from './Session/session.gen'

const LAST_SESSION_USERNAME_STORAGE_KEY = 'LAST_SESSION_USERNAME'
const LAST_SESSION_TOKEN_STORAGE_KEY = 'LAST_SESSION_TOKEN'
const getLastSession = (): LastSession => {
  const jwt = localStorage.getItem(LAST_SESSION_TOKEN_STORAGE_KEY)
  const username = localStorage.getItem(LAST_SESSION_USERNAME_STORAGE_KEY)
  return { jwt, username }
}
const storeLastSession = ({ jwt, username }: Partial<LastSession>) => {
  jwt !== undefined &&
    (jwt
      ? localStorage.setItem(LAST_SESSION_TOKEN_STORAGE_KEY, jwt)
      : localStorage.removeItem(LAST_SESSION_TOKEN_STORAGE_KEY))
  username !== undefined &&
    (username
      ? localStorage.setItem(LAST_SESSION_USERNAME_STORAGE_KEY, username)
      : localStorage.removeItem(LAST_SESSION_USERNAME_STORAGE_KEY))
}

type LoginWarnMessage = string
type ActivateWarnMessage = string

type LastSession = {
  jwt: string | null
  username: string | null
}

export type SessionContextType = {
  session: UserSessionSimpleFragment | null
  lastSessionUsername: string | null
  logout(): unknown
  activateNewAccount(_: { password: string; token: string; username: string }): Promise<ActivateWarnMessage | null>
  login(_: { username: string; password: string }): Promise<LoginWarnMessage | null>
}

const SessionContext = createContext<SessionContextType>(null as any)
export const useSession = () => useContext(SessionContext)

const WRONG_CREDS_MSG = t`wrong credentials`

export const SessionProvider: FC = ({ children }) => {
  const [activateAccountMut /* , activateResult */] = useActivateNewAccountMutation()
  const [lastSession, setLastSession] = useState<Partial<LastSession>>(getLastSession())
  const [getSessionQ, sessionQResult] = useGetCurrentSessionLazyQuery({ fetchPolicy: 'network-only' })
  const [loginMut /* , loginResult */] = useLoginMutation()

  const login = useCallback<SessionContextType['login']>(
    ({ username, password }) => {
      return loginMut({ variables: { password, username } }).then(res => {
        const jwt = res.data?.createSession.jwt ?? null
        setLastSession({ jwt, username })
        return res.data?.createSession.message ?? ((!jwt && WRONG_CREDS_MSG) || null)
      })
    },
    [loginMut],
  )

  const activateNewAccount = useCallback<SessionContextType['activateNewAccount']>(
    ({ password, token, username }) => {
      return activateAccountMut({ variables: { password, token, username } }).then(res => {
        return res.data?.activateAccount.message ?? null
      })
    },
    [activateAccountMut],
  )

  const logout = useCallback<SessionContextType['logout']>(() => {
    setLastSession({ ...lastSession, jwt: null })
  }, [lastSession])

  const session = sessionQResult.data?.getSession ?? null

  useEffect(() => {
    setToken(lastSession.jwt ?? null)
    storeLastSession(lastSession)
    getSessionQ()
  }, [getSessionQ, lastSession])

  const ctx = useMemo<SessionContextType>(
    () => ({
      logout,
      login,
      activateNewAccount,
      session,
      lastSessionUsername: lastSession.username ?? null,
    }),
    [activateNewAccount, lastSession, login, logout, session],
  )
  return <SessionContext.Provider value={ctx}>{!sessionQResult.called ? null : children}</SessionContext.Provider>
}
