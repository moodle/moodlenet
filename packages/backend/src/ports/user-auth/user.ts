import { GraphNodeIdentifierAuth, isGraphNodeIdentifierAuth } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { createAuthNode } from '../content-graph/node'
import {
  changePasswordByAuthIdAdapter,
  getActiveUserByEmailAdapter,
  getLatestConfigAdapter,
  jwtSignerAdapter,
  jwtVerifierAdapter,
  passwordHasher,
  passwordVerifier,
  publicUrlAdapter,
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
  authId: GraphNodeIdentifierAuth
  email: Email
}
const isRecoverPasswordJwt = (_: any): _ is RecoverPasswordJwt =>
  !!_ && isGraphNodeIdentifierAuth(_.authId) && isEmail(_.email)

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
    const publicBaseUrl = await publicUrlAdapter()
    const emailObj = fillEmailTemplate({
      template: recoverPasswordEmail,
      to: email,
      vars: {
        link: `${publicBaseUrl}${webappPath<Routes.NewPassword>('/new-password/:token', {
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
  authId: GraphNodeIdentifierAuth
}

const isActivationEmailTokenObj = (_: any): _ is ActivationEmailTokenObj =>
  !!_ &&
  isEmail(_.email) &&
  'string' === typeof _.hashedPassword &&
  'string' === typeof _.displayName &&
  isGraphNodeIdentifierAuth(_.authId)
export const createSession = plug(
  ns(__dirname, 'create-session'),
  async ({
    password,
    email,
    activationEmailToken,
    env,
  }: {
    env: SessionEnv
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
        const authNode = await createAuthNode({
          env,
          authId,
          authNode: {
            name: displayName,
            _published: true,
            description: '',
            avatar: null,
            bio: null,
            firstName: null,
            image: null,
            lastName: null,
            location: null,
            siteUrl: null,
            _creator: null,
          },
        })
        console.log('---', authNode)
        return mActiveUser
      }

      return INVALID_CREDENTIALS
    })
    if ('string' === typeof activeUser) {
      return activeUser
    }
    const passwordMatches = await passwordVerifier({ plainPwd: password, pwdHash: activeUser.password })

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
  const jwt = jwtSignerAdapter(activeUser.authId, jwtExpireSecs)
  return jwt
}
