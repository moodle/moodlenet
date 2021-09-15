import { AuthId, isAuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { newAuthId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit, Maybe } from '@moodlenet/common/lib/utils/types'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { SignOptions } from 'jsonwebtoken'
import { isString } from 'lodash'
import { JwtPrivateKey, signJwtActiveUser } from '../../lib/auth/jwt'
import { PasswordVerifier } from '../../lib/auth/types'
import { fillEmailTemplate } from '../../lib/emailSender/helpers'
import { EmailObj } from '../../lib/emailSender/types'
import { QMModule, QMQuery } from '../../lib/qmino'
import { QMCommand } from '../../lib/qmino/lib'
import { ActiveUser, Email, isEmail, UserAuthConfig } from './types'

export type GetActiveByEmailAdapter = {
  getActiveUserByEmail(_: { email: string }): Promise<ActiveUser | null>
}

export const getActiveByEmail = QMQuery(
  ({ email }: { email: string }) =>
    async ({ getActiveUserByEmail }: GetActiveByEmailAdapter) => {
      const activeUser = await getActiveUserByEmail({ email })
      if (!activeUser) {
        return null
      }
      return activeUser
    },
)

export type ChangeRecoverPasswordAdapter = {
  changePasswordByAuthId(_: { authId: AuthId; newPassword: string }): Promise<Maybe<ActiveUser>>
  hasher(str: string): Promise<string>
  jwtVerifier(recoverPasswordJwtString: string): Promise<unknown>
}
export const changeRecoverPassword = QMCommand(
  ({ token, newPasswordClear }: { newPasswordClear: string; token: string }) =>
    async ({ jwtVerifier, hasher, changePasswordByAuthId }: ChangeRecoverPasswordAdapter) => {
      const recoverPasswordJwt = await jwtVerifier(token)

      if (!isRecoverPasswordJwt(recoverPasswordJwt)) {
        return false
      }
      const newPasswordHashed = await hasher(newPasswordClear)

      const resp = await changePasswordByAuthId({
        authId: recoverPasswordJwt.authId,
        newPassword: newPasswordHashed,
      })
      return resp
    },
)

export type RecoverPasswordEmailAdapter = {
  getActiveUserByEmail(_: { email: string }): Promise<ActiveUser | null>
  jwtSigner(recoverPasswordJwt: RecoverPasswordJwt, expiresSecs: number): Promise<string>
  getConfig(): Promise<UserAuthConfig>
  sendEmail(_: EmailObj): Promise<unknown>
  publicBaseUrl: string
}
export type RecoverPasswordJwt = {
  authId: AuthId
  email: Email
}
const isRecoverPasswordJwt = (_: any): _ is RecoverPasswordJwt => isAuthId(_?.authId) && isEmail(_?.email)

export const recoverPasswordEmail = QMCommand(
  ({ email }: { email: Email }) =>
    async ({ sendEmail, publicBaseUrl, getConfig, getActiveUserByEmail, jwtSigner }: RecoverPasswordEmailAdapter) => {
      const activeUser = await getActiveUserByEmail({ email })
      if (!activeUser) {
        return null
      }
      const { recoverPasswordEmail, recoverPasswordEmailExpiresSecs } = await getConfig()
      const recoverPasswordJwt = await jwtSigner({ authId: activeUser.authId, email }, recoverPasswordEmailExpiresSecs)

      const emailObj = fillEmailTemplate({
        template: recoverPasswordEmail,
        to: email,
        vars: {
          link: `${publicBaseUrl}${webappPath<Routes.NewPassword>('/new-password/:token', {
            token: recoverPasswordJwt,
          })}`,
        },
      })
      sendEmail(emailObj)
      return { recoverPasswordJwt }
    },
)

export type ActivationEmailTokenObj = {
  email: Email
  hashedPassword: string
  displayName: string
}
const isActivationEmailTokenObj = (_: any): _ is ActivationEmailTokenObj =>
  isEmail(_?.email) && isString(_?.hashedPassword) && isString(_?.displayName)
export const createSession = QMCommand(
  ({
      password,
      email,
      activationEmailToken,
    }: {
      password: string
      email: string
      activationEmailToken: Maybe<string>
    }) =>
    async ({
      getActiveUserByEmail,
      jwtVerifier,
      saveActiveUser,
      createNewProfile,
      passwordVerifier,
      jwtPrivateKey,
      jwtSignOptions,
    }: {
      saveActiveUser(_: DistOmit<ActiveUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<unknown>
      getActiveUserByEmail(_: { email: string }): Promise<ActiveUser | null>
      jwtVerifier(activationEmailToken: string): Promise<unknown>
      createNewProfile(_: { name: string; authId: AuthId }): Promise<unknown>
      passwordVerifier: PasswordVerifier
      jwtSignOptions: SignOptions
      jwtPrivateKey: JwtPrivateKey
    }) => {
      if (activationEmailToken) {
        const activationEmailTokenObj = await jwtVerifier(activationEmailToken)
        if (!isActivationEmailTokenObj(activationEmailTokenObj) || activationEmailTokenObj.email !== email) {
          return 'invalid credentials' as const
        }
        const { displayName, hashedPassword } = activationEmailTokenObj
        const authId = newAuthId()
        await saveActiveUser({ authId, email, password: hashedPassword, status: 'Active' })
        await createNewProfile({ name: displayName, authId })
      }
      const activeUser = await getActiveUserByEmail({ email })
      const passwordMatches =
        !!activeUser && (await passwordVerifier({ plainPwd: password, pwdHash: activeUser.password }))

      if (!(activeUser && passwordMatches)) {
        return {
          __typename: 'CreateSession',
          message: 'invalid credentials',
        }
      }
      const jwt = signJwtActiveUser({ jwtPrivateKey, jwtSignOptions, user: activeUser })
      return {
        __typename: 'CreateSession',
        jwt,
      }
    },
)
QMModule(module)
