import { AuthId, isAuthId, SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { isString } from 'lodash'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/stub/Stub'
import { createProfile } from '../content-graph/node'
import {
  changePasswordByAuthIdAdapter,
  getActiveUserByEmailAdapter,
  getLatestConfigAdapter,
  jwtSignerAdapter,
  jwtVerifierAdapter,
  localDomainAdapter,
  passwordHasher,
  passwordVerifier,
  saveActiveUserAdapter,
  sendEmailAdapter,
} from './adapters'
import { ActiveUser, Email, isEmail } from './types'

export const changeRecoverPassword = plug(
  ns(__dirname, 'change-recover-password'),
  async ({ token, newPasswordClear }: { newPasswordClear: string; token: string }) => {
    const recoverPasswordJwt = await jwtVerifierAdapter(token)

    if (!isRecoverPasswordJwt(recoverPasswordJwt)) {
      return false
    }
    const newPasswordHashed = await passwordHasher(newPasswordClear)

    const activeUser = await changePasswordByAuthIdAdapter({
      authId: recoverPasswordJwt.authId,
      newPassword: newPasswordHashed,
    })
    if (!activeUser) {
      return null
    }
    const jwt = await authJWT(activeUser)
    return { jwt }
  },
)

export type RecoverPasswordJwt = {
  authId: AuthId
  email: Email
}
const isRecoverPasswordJwt = (_: any): _ is RecoverPasswordJwt => isAuthId(_?.authId) && isEmail(_?.email)

export const recoverPasswordEmail = plug(
  ns(__dirname, 'recover-password-email'),
  async ({ email }: { email: Email }) => {
    const activeUser = await getActiveUserByEmailAdapter({ email })
    if (!activeUser) {
      return null
    }
    const { recoverPasswordEmail, recoverPasswordEmailExpiresSecs } = await getLatestConfigAdapter()
    const recoverPasswordJwt = await jwtSignerAdapter(
      { authId: activeUser.authId, email },
      recoverPasswordEmailExpiresSecs,
    )
    const publicBaseUrl = await localDomainAdapter()
    const emailObj = fillEmailTemplate({
      template: recoverPasswordEmail,
      to: email,
      vars: {
        link: `https://${publicBaseUrl}${webappPath<Routes.NewPassword>('/new-password/:token', {
          token: recoverPasswordJwt,
        })}`,
      },
    })
    await sendEmailAdapter(emailObj)
    return { recoverPasswordJwt }
  },
)

export type ActivationEmailTokenObj = {
  email: Email
  hashedPassword: string
  displayName: string
  authId: AuthId
}

const isActivationEmailTokenObj = (_: any): _ is ActivationEmailTokenObj =>
  isEmail(_?.email) && isString(_?.hashedPassword) && isString(_?.displayName) && isString(_?.authId)
export const createSession = plug(
  ns(__dirname, 'create-session'),
  async ({
    password,
    email,
    activationEmailToken,
  }: {
    password: string
    email: string
    activationEmailToken: Maybe<string>
  }) => {
    const INVALID_CREDENTIALS = 'invalid credentials' as const
    const activeUser = await getActiveUserByEmailAdapter({ email }).then(async activeUser => {
      if (activeUser) {
        return activeUser
      } else if (activationEmailToken) {
        const activationEmailTokenObj = await jwtVerifierAdapter(activationEmailToken)
        if (!isActivationEmailTokenObj(activationEmailTokenObj) || activationEmailTokenObj.email !== email) {
          return INVALID_CREDENTIALS
        }
        const { displayName, hashedPassword, authId } = activationEmailTokenObj
        const mActiveUser = await saveActiveUserAdapter({ authId, email, password: hashedPassword, status: 'Active' })
        if ('string' == typeof mActiveUser) {
          return mActiveUser
        }
        await createProfile({ partProfile: { name: displayName, _authId: authId } })
        return mActiveUser
      }

      return INVALID_CREDENTIALS
    })
    if ('string' === typeof activeUser) {
      return activeUser
    }
    const passwordMatches =
      !!activeUser && (await passwordVerifier({ plainPwd: password, pwdHash: activeUser.password }))

    if (!(activeUser && passwordMatches)) {
      return INVALID_CREDENTIALS
    }
    const jwt = await authJWT(activeUser)
    return { jwt }
  },
)

const authJWT = async (activeUser: ActiveUser) => {
  // TODO : add `jwtExpireSecs` in Config
  // const {jwtExpireSecs}=await getLatestConfigAdapter()
  const jwtExpireSecs = 30 * 24 * 60 * 60 * 1000
  const sessionEnv: SessionEnv = {
    user: {
      authId: activeUser.authId,
    },
  }
  const jwt = jwtSignerAdapter(sessionEnv, jwtExpireSecs)
  return jwt
}
