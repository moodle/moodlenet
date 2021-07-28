import { t } from '@lingui/macro'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { createCtx } from '../../lib/context'
import { setToken } from './Apollo/client'
import {
  // useActivateNewUserMutation,
  // useGetCurrentProfileLazyQuery,
  useGetCurrentSessionLazyQuery,
  useLoginMutation,
  UserSessionFragment,
} from './Session/session.gen'

const LAST_SESSION_EMAIL_STORAGE_KEY = 'LAST_SESSION_EMAIL'
const LAST_SESSION_TOKEN_STORAGE_KEY = 'LAST_SESSION_TOKEN'
const getLastSession = (): LastSession => {
  const jwt = localStorage.getItem(LAST_SESSION_TOKEN_STORAGE_KEY)
  const email = localStorage.getItem(LAST_SESSION_EMAIL_STORAGE_KEY)
  return { jwt, email }
}
const storeLastSession = ({ jwt, email }: Partial<LastSession>) => {
  jwt !== undefined &&
    (jwt
      ? localStorage.setItem(LAST_SESSION_TOKEN_STORAGE_KEY, jwt)
      : localStorage.removeItem(LAST_SESSION_TOKEN_STORAGE_KEY))
  email !== undefined &&
    (email
      ? localStorage.setItem(LAST_SESSION_EMAIL_STORAGE_KEY, email)
      : localStorage.removeItem(LAST_SESSION_EMAIL_STORAGE_KEY))
}

type LoginWarnMessage = string
// type ActivateWarnMessage = string

type LastSession = {
  jwt: string | null
  email: string | null
}

export type SessionContextType = {
  session: UserSessionFragment | null
  lastSessionEmail: string | null
  lastSessionJwt: string | null
  isAuthenticated: boolean
  logout(): unknown
  // activateNewUser(_: { password: string; token: string; email: string }): Promise<ActivateWarnMessage | null>
  login(_: { email: string; password: string }): Promise<LoginWarnMessage | null>
}

export const [useSession, ProvideSession] = createCtx<SessionContextType>('Session')

const WRONG_CREDS_MSG = t`wrong credentials`

export const SessionProvider: FC = ({ children }) => {
  // const [activateUserMut /* , activateResult */] = useActivateNewUserMutation()
  const [lastSession, setLastSession] = useState<Partial<LastSession>>(getLastSession())
  const [getSessionQ, sessionQResult] = useGetCurrentSessionLazyQuery({ fetchPolicy: 'network-only' })
  const [loginMut /* , loginResult */] = useLoginMutation()

  const login = useCallback<SessionContextType['login']>(
    ({ email, password }) => {
      return loginMut({ variables: { password, email } }).then(res => {
        const jwt = res.data?.createSession.jwt ?? null
        setLastSession({ jwt, email })
        return res.data?.createSession.message ?? ((!jwt && WRONG_CREDS_MSG) || null)
      })
    },
    [loginMut],
  )

  // const activateNewUser = useCallback<SessionContextType['activateNewUser']>(
  //   ({ password, token, email }) => {
  //     return activateUserMut({ variables: { password, token, email } }).then(res => {
  //       const jwt = res.data?.activateUser.jwt ?? null
  //       setLastSession({ email, jwt })
  //       return res.data?.activateUser.message ?? null
  //     })
  //   },
  //   [activateUserMut],
  // )

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
      // activateNewUser,
      session,
      isAuthenticated: !!session,
      lastSessionEmail: lastSession.email ?? null,
      lastSessionJwt: lastSession.jwt ?? null,
    }),
    [lastSession.jwt, lastSession.email, login, logout, session],
  )
  return <ProvideSession value={ctx}>{!sessionQResult.called ? null : children}</ProvideSession>
}
