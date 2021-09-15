import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { fillEmailTemplate } from '../../lib/emailSender/helpers'
import { EmailObj } from '../../lib/emailSender/types'
import { QMCommand, QMModule } from '../../lib/qmino'
import { Email, UserAuthConfig } from './types'
import { ActivationEmailTokenObj } from './user'

export type SignupIssue = 'email not available'
export type SignUpAdapter = {
  jwtSigner(activationEmailTokenObj: ActivationEmailTokenObj, expiresSecs: number): Promise<string>
  getConfig(): Promise<UserAuthConfig>
  sendEmail(_: EmailObj): Promise<unknown>
  publicBaseUrl: string
}
export const signUp = QMCommand(
  ({ email, displayName, hashedPassword }: { email: Email; hashedPassword: string; displayName: string }) =>
    async ({ jwtSigner, sendEmail, publicBaseUrl, getConfig }: SignUpAdapter) => {
      const { newUserRequestEmail, newUserVerificationWaitSecs } = await getConfig()
      const activationEmailToken = await jwtSigner(
        {
          displayName,
          email,
          hashedPassword,
        },
        newUserVerificationWaitSecs,
      )

      const emailObj = fillEmailTemplate({
        template: newUserRequestEmail,
        to: email,
        vars: {
          email,
          link: `${publicBaseUrl}${webappPath<Routes.Login>('/login/:activationToken?', {
            activationToken: activationEmailToken,
          })}`,
        },
      })
      sendEmail(emailObj)
      return { token: activationEmailToken }
    },
)

// export type NewUserConfirmAdapter = {
//   activateUser(_: { token: string; hashedPassword: string; authId: AuthId }): Promise<ActiveUser | 'not found'>
//   createNewProfile(_: { name: string; authId: AuthId }): Promise<unknown>
// }
// type ConfirmSignup = { token: string; hashedPassword: string; profileName: string }
// export const confirmSignup = QMCommand(
//   ({ token, hashedPassword, profileName }: ConfirmSignup) =>
//     async ({ activateUser, createNewProfile }: NewUserConfirmAdapter) => {
//       const authId = newAuthId()
//       const mActiveUser = await activateUser({ hashedPassword, token, authId })

//       if (typeof mActiveUser === 'string') {
//         return mActiveUser // error
//       }

//       await createNewProfile({ name: profileName, authId: mActiveUser.authId })

//       return mActiveUser
//     },
// )

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
