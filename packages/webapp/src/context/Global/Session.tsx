import { t } from '@lingui/macro'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { createCtx } from '../../lib/context'
import { setToken } from './Apollo/client'
import {
  useActivateNewUserMutation,

  // useGetCurrentProfileLazyQuery,
  useGetCurrentSessionLazyQuery,
  useLoginMutation,
  UserSessionFragment,
  useSignUpMutation,
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
type ActivateWarnMessage = string
type SignupWarnMessage = string

type LastSession = {
  jwt: string | null
  email: string | null
}

export type SessionContextType = {
  session: UserSessionFragment | null
  lastSessionEmail: string | null
  lastSessionJwt: string | null
  isAuthenticated: boolean
  loading: boolean
  isAdmin: boolean
  logout(): unknown
  refetch(): unknown
  activateNewUser(_: { password: string; activationToken: string; name: string }): Promise<ActivateWarnMessage | null>
  signUp(_: { email: string }): Promise<SignupWarnMessage | null>
  login(_: { email: string; password: string }): Promise<LoginWarnMessage | null>
}

export const [useSession, ProvideSession] = createCtx<SessionContextType>('Session')

const WRONG_CREDS_MSG = t`wrong credentials`

export const SessionProvider: FC = ({ children }) => {
  const [activateUserMut /* , activateResult */] = useActivateNewUserMutation()
  const [signUpMut /* , activateResult */] = useSignUpMutation()
  const [lastSession, setLastSession] = useState<Partial<LastSession>>(getLastSession())
  const [getSessionLazyQ, sessionQResult] = useGetCurrentSessionLazyQuery({ fetchPolicy: 'network-only' })
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

  const activateNewUser = useCallback<SessionContextType['activateNewUser']>(
    ({ password, activationToken, name }) => {
      return activateUserMut({ variables: { password, activationToken, name } }).then(res => {
        const jwt = res.data?.activateUser.jwt ?? null

        setLastSession({ jwt })
        return res.data?.activateUser.message ?? null
      })
    },
    [activateUserMut],
  )

  const signUp = useCallback<SessionContextType['signUp']>(
    ({ email }) => signUpMut({ variables: { email } }).then(res => res.data?.signUp.message ?? null),
    [signUpMut],
  )

  const logout = useCallback<SessionContextType['logout']>(() => {
    setLastSession({ ...lastSession, jwt: null })
  }, [lastSession])

  const session = sessionQResult.data?.getSession ?? null
  const loading = sessionQResult.loading

  useEffect(() => {
    setToken(lastSession.jwt ?? null)
    storeLastSession(lastSession)
    getSessionLazyQ()
  }, [getSessionLazyQ, lastSession])
  const ctx = useMemo<SessionContextType>(
    () => ({
      refetch: () => getSessionLazyQ(),
      logout,
      login,
      activateNewUser,
      signUp,
      session,
      loading,
      isAdmin: session?.profile.id === 'Profile/__root__', // FIXME HACK for mvp
      isAuthenticated: !!session,
      lastSessionEmail: lastSession.email ?? null,
      lastSessionJwt: lastSession.jwt ?? null,
    }),
    [logout, login, activateNewUser, signUp, session, loading, lastSession.email, lastSession.jwt, getSessionLazyQ],
  )
  return <ProvideSession value={ctx}>{!sessionQResult.called ? null : children}</ProvideSession>
}
