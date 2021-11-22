import { t } from '@lingui/macro'
import { isGqlIdLocalOrganization } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { createCtx } from '../../lib/context'
import { setToken } from './Apollo/client'
import {
  // useActivateNewUserMutation,
  useChangeRecoverPasswordMutation,

  // useGetCurrentProfileLazyQuery,
  useGetCurrentSessionLazyQuery,
  useLoginMutation,
  useRecoverPasswordMutation,
  UserSessionFragment,
  useSignUpMutation,
} from './Session/session.gen'

const USER_ACCEPTED_POLICIES_STORAGE_KEY = 'USER_ACCEPTED_POLICIES'
const USER_ACCEPTED_POLICIES_STORAGE_VAL = 'true'

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
type RecoverPasswordWarnMessage = string
// type ActivateWarnMessage = string
type SignupWarnMessage = string
type ChangePasswordWarnMessage = string

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
  // activateNewUser(_: { password: string; activationToken: string; name: string }): Promise<ActivateWarnMessage | null>
  signUp(_: { email: string; password: string; name: string }): Promise<SignupWarnMessage | null>
  login(_: { email: string; password: string; activationEmailToken: Maybe<string> }): Promise<LoginWarnMessage | null>
  recoverPassword(_: { email: string }): Promise<RecoverPasswordWarnMessage | null>
  changeRecoverPassword(_: {
    newPassword: string
    recoverPasswordToken: string
  }): Promise<ChangePasswordWarnMessage | null>
  firstLogin: boolean
  userMustAcceptPolicies: (() => unknown) | null
}

export const [useSession, ProvideSession] = createCtx<SessionContextType>('Session')

const WRONG_CREDS_MSG = t`wrong credentials`

export const SessionProvider: FC = ({ children }) => {
  // const [activateUserMut /* , activateResult */] = useActivateNewUserMutation()
  const [signUpMut /* , activateResult */] = useSignUpMutation()
  const [lastSession, setLastSession] = useState<Partial<LastSession>>(getLastSession())
  const [getSessionLazyQ, sessionQResult] = useGetCurrentSessionLazyQuery({ fetchPolicy: 'network-only' })
  const [recoverPasswordMut, recoverPasswordMutResp] = useRecoverPasswordMutation()
  const [changeRecoverPasswordMut, changeRecoverPasswordMutResp] = useChangeRecoverPasswordMutation()
  const [loginMut /* , loginResult */] = useLoginMutation()
  const [firstLogin, setFirstLogin] = useState(false)
  useEffect(() => {
    if (firstLogin) {
      setTimeout(() => setFirstLogin(false), 15000)
    }
  }, [firstLogin])
  const login = useCallback<SessionContextType['login']>(
    ({ email, password, activationEmailToken }) => {
      return loginMut({ variables: { password, email, activationEmailToken } }).then(res => {
        const jwt = res.data?.createSession.jwt ?? null
        setLastSession({ jwt, email })
        if (jwt && activationEmailToken) {
          setFirstLogin(true)
        }
        return res.data?.createSession.message ?? ((!jwt && WRONG_CREDS_MSG) || null)
      })
    },
    [loginMut, setFirstLogin],
  )
  // const activateNewUser = useCallback<SessionContextType['activateNewUser']>(
  //   ({ password, activationToken, name }) => {
  //     return activateUserMut({ variables: { password, activationToken, name } }).then(res => {
  //       const jwt = res.data?.activateUser.jwt ?? null

  //       setLastSession({ jwt })
  //       return res.data?.activateUser.message ?? null
  //     })
  //   },
  //   [activateUserMut],
  // )

  const signUp = useCallback<SessionContextType['signUp']>(
    ({ email, name, password }) =>
      signUpMut({ variables: { email, name, password } }).then(res => res.data?.signUp.message ?? null),
    [signUpMut],
  )

  const logout = useCallback<SessionContextType['logout']>(() => {
    setLastSession({ ...lastSession, jwt: null })
  }, [lastSession])

  const session = sessionQResult.data?.getSession ?? null
  const isAuthenticated = !!session
  const loading = sessionQResult.loading
  const recoverPassword = useCallback<SessionContextType['recoverPassword']>(
    async ({ email }) => {
      if (recoverPasswordMutResp.loading) {
        return 'executinging ...'
      }
      const { data, errors } = await recoverPasswordMut({ variables: { email } })
      return data?.recoverPassword.success
        ? null
        : data?.recoverPassword.message ?? errors?.join(';') ?? 'Unexpected error'
    },
    [recoverPasswordMut, recoverPasswordMutResp.loading],
  )
  const changeRecoverPassword = useCallback<SessionContextType['changeRecoverPassword']>(
    async ({ newPassword, recoverPasswordToken }) => {
      if (changeRecoverPasswordMutResp.loading) {
        return 'executinging ...'
      }
      const { data, errors } = await changeRecoverPasswordMut({
        variables: { newPassword, token: recoverPasswordToken },
      })
      const jwt = data?.changeRecoverPassword?.jwt
      if (jwt) {
        setLastSession({ jwt })
        return null
      }
      return data?.changeRecoverPassword?.message ?? errors?.join(';') ?? 'Unexpected error'
    },
    [changeRecoverPasswordMut, changeRecoverPasswordMutResp.loading],
  )

  const [userAcceptedPolicies, setUserAcceptedPolicies] = useState(
    localStorage.getItem(USER_ACCEPTED_POLICIES_STORAGE_KEY) === USER_ACCEPTED_POLICIES_STORAGE_VAL,
  )
  useEffect(() => {
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('storage', handler)
    }
    function handler(_: StorageEvent) {
      if (_.key === USER_ACCEPTED_POLICIES_STORAGE_KEY) {
        setUserAcceptedPolicies(_.newValue === USER_ACCEPTED_POLICIES_STORAGE_VAL)
      }
    }
  }, [])

  const userAcceptPoliciesCb = useCallback(() => {
    localStorage.setItem(USER_ACCEPTED_POLICIES_STORAGE_KEY, USER_ACCEPTED_POLICIES_STORAGE_VAL)
    setUserAcceptedPolicies(true)
  }, [])

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
      firstLogin,
      // activateNewUser,
      signUp,
      session,
      loading,
      isAdmin: !!(session && isGqlIdLocalOrganization(session.profile.id)), //!FIXME: before federation !! ;)
      isAuthenticated,
      lastSessionEmail: lastSession.email ?? null,
      lastSessionJwt: lastSession.jwt ?? null,
      recoverPassword,
      changeRecoverPassword,
      userMustAcceptPolicies: isAuthenticated || userAcceptedPolicies ? null : userAcceptPoliciesCb,
    }),
    [
      isAuthenticated,
      logout,
      login,
      firstLogin,
      signUp,
      session,
      loading,
      lastSession.email,
      lastSession.jwt,
      recoverPassword,
      changeRecoverPassword,
      userAcceptedPolicies,
      userAcceptPoliciesCb,
      getSessionLazyQ,
    ],
  )
  // console.log({ __: ctx.userMustAcceptPolicies })
  return <ProvideSession value={ctx}>{!sessionQResult.called ? null : children}</ProvideSession>
}
