import { t } from '@lingui/macro'
import { createContext, FC, useCallback, useContext, useEffect, useMemo } from 'react'
import { setToken } from './Apollo/client'
import {
  SessionFragment,
  useActivateNewAccountMutation,
  useGetCurrentSessionLazyQuery,
  useLoginMutation,
} from './Session/session.gen'

type LoginWarnMessage = string
type ActivateWarnMessage = string
export type SessionContextType = {
  session: SessionFragment | null
  logout(): unknown
  activateNewAccount(_: { password: string; token: string; username: string }): Promise<ActivateWarnMessage | null>
  login(_: { username: string; password: string }): Promise<LoginWarnMessage | null>
}

const SessionContext = createContext<SessionContextType>(null as any)
export const useSession = () => useContext(SessionContext)
const WRONG_CREDS_MGG = t`wrong credentials`
export const SessionProvider: FC = ({ children }) => {
  const [activateAccountMut /* , activateResult */] = useActivateNewAccountMutation()

  const [getSessionQ, sessionResult] = useGetCurrentSessionLazyQuery({ fetchPolicy: 'network-only' })
  const [loginMut /* , loginResult */] = useLoginMutation()

  const setSession = useCallback(
    (jwt: string | null) => {
      setToken(jwt)
      getSessionQ()
    },
    [getSessionQ],
  )
  const login = useCallback<SessionContextType['login']>(
    ({ username, password }) => {
      return loginMut({ variables: { password, username } }).then(res => {
        const jwt = res.data?.createSession.jwt ?? null
        setSession(jwt)
        return res.data?.createSession.message ?? ((!jwt && WRONG_CREDS_MGG) || null)
      })
    },
    [loginMut, setSession],
  )

  const activateNewAccount = useCallback<SessionContextType['activateNewAccount']>(
    ({ password, token, username }) => {
      return activateAccountMut({ variables: { password, token, username } }).then(res => {
        const jwt = res.data?.activateAccount.jwt ?? null
        jwt && setSession(jwt)
        return res.data?.activateAccount.message ?? null
      })
    },
    [activateAccountMut, setSession],
  )

  useEffect(() => setSession(null), [setSession])

  const logout = useCallback<SessionContextType['logout']>(() => setSession(null), [setSession])
  const session = sessionResult.data?.getSession ?? null

  const ctx = useMemo<SessionContextType>(
    () => ({
      logout,
      login,
      activateNewAccount,
      session,
    }),
    [activateNewAccount, login, logout, session],
  )
  return <SessionContext.Provider value={ctx}>{children}</SessionContext.Provider>
}
