import { t } from '@lingui/macro'
import { isGqlIdLocalOrganization } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { TIME_BETWEEN_USER_APPROVAL_REQUESTS } from '../../constants'
import { createCtx } from '../../lib/context'
import { useLocalStorage } from '../../lib/keyvaluestore/useStorage'
import { useSendEmailToProfileMutation } from '../../ui/components/pages/Profile/Ctrl/ProfileCtrl.gen'
import { setToken } from './Apollo/client'
import { useLocalInstance } from './LocalInstance'
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

type LoginWarnMessage = string
type RecoverPasswordWarnMessage = string
// type ActivateWarnMessage = string
type SignupWarnMessage = string
type ChangePasswordWarnMessage = string

export type SessionContextType = {
  session: UserSessionFragment | null
  lastSessionJwt: string | null
  isAuthenticated: boolean
  loading: boolean
  isAdmin: boolean
  logout(): unknown
  refetch(): unknown
  firstLoginReset(): unknown
  hasJustBeenApprovedReset(): unknown
  // activateNewUser(_: { password: string; activationToken: string; name: string }): Promise<ActivateWarnMessage | null>
  signUp(_: {
    email: string
    password: string
    name: string
  }): Promise<SignupWarnMessage | null>
  login(_: {
    email: string
    password: string
    activationEmailToken: Maybe<string>
  }): Promise<LoginWarnMessage | null>
  recoverPassword(_: {
    email: string
  }): Promise<RecoverPasswordWarnMessage | null>
  changeRecoverPassword(_: {
    newPassword: string
    recoverPasswordToken: string
  }): Promise<ChangePasswordWarnMessage | null>
  firstLogin: boolean
  userMustAcceptPolicies: (() => unknown) | null
  lastUserApprovalRequest: number
  userRequestedApproval: () => void
  isWaitingApproval: boolean
  hasJustBeenApproved: boolean
  reportEntity(_: { comment: string; entityUrl: string }): Promise<void>
}

export const [useSession, ProvideSession] =
  createCtx<SessionContextType>('Session')

const WRONG_CREDS_MSG = t`wrong credentials`

export const SessionProvider: FC = ({ children }) => {
  const [signUpMut /* , signUpMutResult */] = useSignUpMutation()
  const [lastSessionJwt, setLastSession] = useLocalStorage<string | null>(
    `LAST_SESSION`
  )
  const [getSessionLazyQ, sessionQResult] = useGetCurrentSessionLazyQuery({
    fetchPolicy: 'network-only',
  })
  const [recoverPasswordMut, recoverPasswordMutResp] =
    useRecoverPasswordMutation()
  const [changeRecoverPasswordMut, changeRecoverPasswordMutResp] =
    useChangeRecoverPasswordMutation()
  const [loginMut /* , loginResult */] = useLoginMutation()
  const [firstLogin, setFirstLogin] = useState(false)
  const login = useCallback<SessionContextType['login']>(
    ({ email, password, activationEmailToken }) => {
      return loginMut({
        variables: { password, email, activationEmailToken },
      }).then((res) => {
        const jwt = res.data?.createSession.jwt ?? null
        setLastSession(jwt)
        if (jwt && activationEmailToken) {
          setFirstLogin(true)
          // setTimeout(() => setFirstLogin(false), 15000)
        }
        return (
          res.data?.createSession.message ?? ((!jwt && WRONG_CREDS_MSG) || null)
        )
      })
    },
    [loginMut, setLastSession]
  )

  const signUp = useCallback<SessionContextType['signUp']>(
    ({ email, name, password }) =>
      signUpMut({ variables: { email, name, password } }).then(
        (res) => res.data?.signUp.message ?? null
      ),
    [signUpMut]
  )

  const logout = useCallback<SessionContextType['logout']>(() => {
    setLastSession(null)
  }, [setLastSession])

  const session = sessionQResult.data?.getSession ?? null
  const isAuthenticated = !!session
  const loading = sessionQResult.loading

  const [lastUserApprovalRequest, setLastUserApprovalRequest] =
    useLocalStorage<number>(`LAST_USER_APPROVAL_REQUEST_${session?.profile.id}`)

  const userRequestedApproval = useCallback(
    () => setLastUserApprovalRequest(Number(new Date())),
    [setLastUserApprovalRequest]
  )

  const isWaitingApproval =
    Number(new Date()) - (lastUserApprovalRequest ?? 0) <
    (TIME_BETWEEN_USER_APPROVAL_REQUESTS ?? 0)

  const recoverPassword = useCallback<SessionContextType['recoverPassword']>(
    async ({ email }) => {
      if (recoverPasswordMutResp.loading) {
        return 'executinging ...'
      }
      const { data, errors } = await recoverPasswordMut({
        variables: { email },
      })
      return data?.recoverPassword.success
        ? null
        : data?.recoverPassword.message ??
            errors?.join(';') ??
            'Unexpected error'
    },
    [recoverPasswordMut, recoverPasswordMutResp.loading]
  )
  const changeRecoverPassword = useCallback<
    SessionContextType['changeRecoverPassword']
  >(
    async ({ newPassword, recoverPasswordToken }) => {
      if (changeRecoverPasswordMutResp.loading) {
        return 'executinging ...'
      }
      const { data, errors } = await changeRecoverPasswordMut({
        variables: { newPassword, token: recoverPasswordToken },
      })
      const jwt = data?.changeRecoverPassword?.jwt
      setLastSession(jwt ?? null)
      return (
        data?.changeRecoverPassword?.message ??
        errors?.join(';') ??
        'Unexpected error'
      )
    },
    [
      changeRecoverPasswordMut,
      changeRecoverPasswordMutResp.loading,
      setLastSession,
    ]
  )

  const [userAcceptedPolicies, setUserAcceptedPolicies] = useLocalStorage(
    `USER_ACCEPTED_POLICIES`
  )

  useEffect(() => {
    setToken(lastSessionJwt)
    getSessionLazyQ()
  }, [lastSessionJwt, getSessionLazyQ])

  const [hasJustBeenApproved, setHasJustBeenApproved] = useState(false)
  useEffect(() => {
    setHasJustBeenApproved(
      !!(lastUserApprovalRequest && session?.profile._published)
    )
  }, [lastUserApprovalRequest, session?.profile._published])

  const firstLoginReset = useCallback(() => setFirstLogin(false), [])
  const hasJustBeenApprovedReset = useCallback(
    () => setLastUserApprovalRequest(null),
    [setLastUserApprovalRequest]
  )

  const { org: localOrg } = useLocalInstance()

  const [sendEmailMut /* , sendEmailMutRes */] = useSendEmailToProfileMutation()

  const reportEntity = useCallback(
    async ({ comment, entityUrl }) => {
      const { data } = await sendEmailMut({
        variables: {
          text: `report abuse for content: #REPORT_ENTITY#${entityUrl}#REPORT_ENTITY/#
          #REPORT_TEXT#${comment}#REPORT_TEXT/#`,
          toProfileId: localOrg.id,
        },
      })
      if (!data || !data.sendEmailToProfile) {
        return
      }
    },
    [localOrg.id, sendEmailMut]
  )

  const ctx = useMemo<SessionContextType>(
    () => ({
      reportEntity,
      refetch: () => getSessionLazyQ(),
      logout,
      login,
      firstLogin,
      firstLoginReset,
      hasJustBeenApprovedReset,
      // activateNewUser,
      signUp,
      session,
      loading,
      isAdmin: !!(session && isGqlIdLocalOrganization(session.profile.id)), //!FIXME: before federation !! ;)
      isAuthenticated,
      lastSessionJwt,
      recoverPassword,
      changeRecoverPassword,
      userMustAcceptPolicies:
        isAuthenticated || userAcceptedPolicies
          ? null
          : () => setUserAcceptedPolicies(true),
      lastUserApprovalRequest: lastUserApprovalRequest ?? 0,
      userRequestedApproval,
      isWaitingApproval,
      hasJustBeenApproved,
    }),
    [
      logout,
      login,
      firstLogin,
      firstLoginReset,
      hasJustBeenApprovedReset,
      signUp,
      session,
      loading,
      isAuthenticated,
      lastSessionJwt,
      recoverPassword,
      changeRecoverPassword,
      reportEntity,
      userAcceptedPolicies,
      lastUserApprovalRequest,
      userRequestedApproval,
      isWaitingApproval,
      hasJustBeenApproved,
      getSessionLazyQ,
      setUserAcceptedPolicies,
    ]
  )
  // console.log({ ctx })
  return (
    <ProvideSession value={ctx}>
      {!sessionQResult.called ? null : children}
    </ProvideSession>
  )
}
