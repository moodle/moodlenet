import { GraphNodeIdentifierAuth, isGraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { Routes, webappPath } from '@moodlenet/common/dist/webapp/sitemap'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { port } from '../content-graph/node/add'
import * as crypto from '../system/crypto'
import * as localOrg from '../system/localOrg'
import * as sendEmail from '../system/sendEmail'
import {
  changePasswordByAuthIdAdapter,
  getActiveUserByEmailAdapter,
  getLatestConfigAdapter,
  saveActiveUserAdapter,
} from './adapters'
import { ActiveUser, Email, isEmail } from './types'

export const changeRecoverPassword = plug(
  ns(module, 'change-recover-password'),
  async ({ token, newPasswordClear }: { newPasswordClear: string; token: string }) => {
    const recoverPasswordJwt = await crypto.jwtVerifier.adapter(token)

    if (!isRecoverPasswordJwt(recoverPasswordJwt)) {
      return false
    }
    const newPasswordHashed = await crypto.passwordHasher.adapter(newPasswordClear)

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

export const recoverPasswordEmail = plug(ns(module, 'recover-password-email'), async ({ email }: { email: Email }) => {
  const activeUser = await getActiveUserByEmailAdapter({ email })
  if (!activeUser) {
    return null
  }
  const { recoverPasswordEmail, recoverPasswordEmailExpiresSecs } = await getLatestConfigAdapter()
  const recoverPasswordJwt = await crypto.jwtSigner.adapter(
    { authId: activeUser.authId, email },
    recoverPasswordEmailExpiresSecs,
  )
  const { publicUrl } = await localOrg.info.adapter()
  const emailObj = fillEmailTemplate({
    template: recoverPasswordEmail,
    to: email,
    vars: {
      link: `${publicUrl}${webappPath<Routes.NewPassword>('/new-password/:token', {
        token: recoverPasswordJwt,
      })}`,
    },
  })
  await sendEmail.adapter(emailObj)
  return { recoverPasswordJwt }
})

export type ActivationEmailTokenObj = {
  email: Email
  hashedPassword: string
  displayName: string
  authId: GraphNodeIdentifierAuth<'Profile'>
}

const isActivationEmailTokenObj = (_: any): _ is ActivationEmailTokenObj =>
  !!_ &&
  isEmail(_.email) &&
  'string' === typeof _.hashedPassword &&
  'string' === typeof _.displayName &&
  isGraphNodeIdentifierAuth(_.authId)
export const createSession = plug(
  ns(module, 'create-session'),
  async ({
    password,
    email,
    activationEmailToken,
    sessionEnv,
  }: {
    sessionEnv: SessionEnv
    password: string
    email: string
    activationEmailToken: Maybe<string>
  }) => {
    const INVALID_CREDENTIALS = 'invalid credentials' as const
    const activeUser = await getActiveUserByEmailAdapter({ email }).then(async activeUser => {
      if (activeUser) {
        return activeUser
      } else if (activationEmailToken) {
        const activationEmailTokenObj = await crypto.jwtVerifier.adapter(activationEmailToken)
        if (!isActivationEmailTokenObj(activationEmailTokenObj) || activationEmailTokenObj.email !== email) {
          return INVALID_CREDENTIALS
        }
        const { displayName, hashedPassword, authId } = activationEmailTokenObj
        const mActiveUser = await saveActiveUserAdapter({ authId, email, password: hashedPassword, status: 'Active' })
        if ('string' == typeof mActiveUser) {
          return mActiveUser
        }
        const { authId: orgAuthId } = await localOrg.info.adapter()
        await port({
          sessionEnv: { authId: orgAuthId, timestamp: sessionEnv.timestamp },
          data: {
            ...authId,
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
            _local: true,
          },
        })
        return mActiveUser
      }

      return INVALID_CREDENTIALS
    })
    if ('string' === typeof activeUser) {
      return activeUser
    }
    const passwordMatches = await crypto.passwordVerifier.adapter({ plainPwd: password, pwdHash: activeUser.password })

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
  const jwt = crypto.jwtSigner.adapter(activeUser.authId, jwtExpireSecs)
  return jwt
}
