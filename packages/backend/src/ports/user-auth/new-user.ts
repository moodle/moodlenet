import { AuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { newAuthId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { fillEmailTemplate } from '../../lib/emailSender/helpers'
import { EmailAddr, EmailObj } from '../../lib/emailSender/types'
import { QMCommand, QMModule } from '../../lib/qmino'
import { ActiveUser, UserAuthConfig, WaitingFirstActivationUser } from './types'

export type SignupIssue = 'email not available'
export type SignUpAdapter = {
  storeNewSignupRequest(
    _: Pick<WaitingFirstActivationUser, 'firstActivationToken' | 'email'>,
  ): Promise<void | SignupIssue>
  generateToken(): Promise<string>
  getConfig(): Promise<UserAuthConfig>
  sendEmail(_: EmailObj): Promise<unknown>
  publicBaseUrl: string
}
export const signUp = QMCommand(
  ({ email }: { email: EmailAddr }) =>
    async ({ storeNewSignupRequest, generateToken, sendEmail, publicBaseUrl, getConfig }: SignUpAdapter) => {
      const firstActivationToken = await generateToken()
      const mInsertIssue = await storeNewSignupRequest({ email, firstActivationToken })
      if (mInsertIssue) {
        return mInsertIssue
      }
      const { newUserRequestEmail } = await getConfig()

      const emailObj = fillEmailTemplate({
        template: newUserRequestEmail,
        to: email,
        vars: {
          email,
          link: `${publicBaseUrl}${webappPath<Routes.Activation>('/activate-new-user/:token', {
            token: firstActivationToken,
          })}`,
        },
      })
      sendEmail(emailObj)
      return { token: firstActivationToken }
    },
)

export type NewUserConfirmAdapter = {
  activateUser(_: { token: string; hashedPassword: string; authId: AuthId }): Promise<ActiveUser | 'not found'>
  createNewProfile(_: { name: string; authId: AuthId }): Promise<unknown>
}
type ConfirmSignup = { token: string; hashedPassword: string; profileName: string }
export const confirmSignup = QMCommand(
  ({ token, hashedPassword, profileName }: ConfirmSignup) =>
    async ({ activateUser, createNewProfile }: NewUserConfirmAdapter) => {
      const authId = newAuthId()
      const mActiveUser = await activateUser({ hashedPassword, token, authId })

      if (typeof mActiveUser === 'string') {
        return mActiveUser // error
      }

      await createNewProfile({ name: profileName, authId: mActiveUser.authId })

      return mActiveUser
    },
)

// export type CreateNewUserAdapter = {
//   createUser(_: {
//     email: EmailAddr
//     password: string
//     username: string
//   }): Promise<ActiveUser | null | 'username not available' | 'email not available'>
//   hashPassword(pwd: string): Promise<string>

//   createNewProfile(_: { username: string; role: Role }): Promise<unknown>
// }
// type CreateNewUser = { email: EmailAddr; password: string; username: string; role: Role }
// export const createNewUser = QMCommand(
//   ({ email, password: plainPwd, username, role }: CreateNewUser) =>
//     async ({ createUser, hashPassword, createNewProfile }: CreateNewUserAdapter) => {
//       const pwdHash = await hashPassword(plainPwd)

//       const createResult = await createUser({ password: pwdHash, email, username, role })

//       if (typeof createResult === 'string') {
//         return createResult // error
//       }

//       await createNewProfile({ username, role })

//       return createResult
//     },
// )

QMModule(module)
