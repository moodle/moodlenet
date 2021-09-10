import { AuthId, isAuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
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

export type ChangePasswordAdapter = {
  changePasswordByAuthId(_: { authId: AuthId; newPassword: string }): Promise<boolean>
  hasher(str: string): Promise<string>
  jwtVerifier(recoverPasswordJwtString: string): Promise<unknown>
}
export const changePassword = QMCommand(
  ({ token, newPasswordClear }: { newPasswordClear: string; token: string }) =>
    async ({ jwtVerifier, hasher, changePasswordByAuthId }: ChangePasswordAdapter) => {
      const recoverPasswordJwt = await jwtVerifier(token)

      if (!isRecoverPasswordJwt(recoverPasswordJwt)) {
        return false
      }
      const newPasswordHashed = await hasher(newPasswordClear)
      const done = await changePasswordByAuthId({
        authId: recoverPasswordJwt.authId,
        newPassword: newPasswordHashed,
      })
      return done
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

QMModule(module)
