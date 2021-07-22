import { t } from '@lingui/macro'
import { getProfileIdByUsername } from '@moodlenet/common/lib/utils/auth/helpers'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { createCtx } from '../../lib/context'
import { setToken } from './Apollo/client'
import {
  CurrentProfileInfoFragment,
  useActivateNewUserMutation,
  useGetCurrentProfileLazyQuery,
  useGetCurrentSessionLazyQuery,
  useLoginMutation,
  UserSessionFragFragment,
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
  session: UserSessionFragFragment | null
  currentProfile: CurrentProfileInfoFragment | null
  lastSessionUsername: string | null
  lastSessionJwt: string | null
  isAuthenticated: boolean
  logout(): unknown
  activateNewUser(_: { password: string; token: string; username: string }): Promise<ActivateWarnMessage | null>
  login(_: { username: string; password: string }): Promise<LoginWarnMessage | null>
}

export const [useSession, ProvideSession] = createCtx<SessionContextType>('Session')

const WRONG_CREDS_MSG = t`wrong credentials`

export const SessionProvider: FC = ({ children }) => {
  const [activateUserMut /* , activateResult */] = useActivateNewUserMutation()
  const [lastSession, setLastSession] = useState<Partial<LastSession>>(getLastSession())
  const [getSessionQ, sessionQResult] = useGetCurrentSessionLazyQuery({ fetchPolicy: 'network-only' })
  const [loginMut /* , loginResult */] = useLoginMutation()

  const [getCurrentProfileQ, currentProfileResult] = useGetCurrentProfileLazyQuery()

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

  const activateNewUser = useCallback<SessionContextType['activateNewUser']>(
    ({ password, token, username }) => {
      return activateUserMut({ variables: { password, token, username } }).then(res => {
        const jwt = res.data?.activateUser.jwt ?? null
        setLastSession({ username, jwt })
        return res.data?.activateUser.message ?? null
      })
    },
    [activateUserMut],
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

  useEffect(() => {
    if (session) {
      const profileId = getProfileIdByUsername(session.username)
      getCurrentProfileQ({ variables: { id: profileId } })
    }
  }, [getCurrentProfileQ, session])
  const currentProfile =
    currentProfileResult.data?.node?.__typename === 'Profile' ? currentProfileResult.data.node : null
  const ctx = useMemo<SessionContextType>(
    () => ({
      currentProfile,
      logout,
      login,
      activateNewUser,
      session,
      isAuthenticated: !!session,
      lastSessionUsername: lastSession.username ?? null,
      lastSessionJwt: lastSession.jwt ?? null,
    }),
    [activateNewUser, currentProfile, lastSession.jwt, lastSession.username, login, logout, session],
  )
  return <ProvideSession value={ctx}>{!sessionQResult.called ? null : children}</ProvideSession>
}
