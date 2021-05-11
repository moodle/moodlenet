import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { ActiveUser } from '../../adapters/user-auth/arangodb/types'
import { DefaultConfig } from '../../emailTemplates'
import { QMModule, QMMutation } from '../../lib/qmino'
import { EmailAddr, EmailObj, fillEmailTemplate } from '../../types'

export type SignupIssue = 'email not available'
export type SignUpAdapter = {
  storeNewSignupRequest(_: { email: string; token: string }): Promise<void | SignupIssue>
  generateToken(): Promise<string>
  sendEmail(_: EmailObj): Promise<unknown>
  publicBaseUrl: string
}
export const signUp = QMMutation(
  ({ email }: { email: EmailAddr }) =>
    async ({ storeNewSignupRequest, generateToken, sendEmail, publicBaseUrl }: SignUpAdapter) => {
      const token = await generateToken()
      const insertIssue = await storeNewSignupRequest({ email, token })
      if (insertIssue) {
        return insertIssue
      }
      const emailObj = fillEmailTemplate({
        template: DefaultConfig.newUserRequestEmail,
        to: email,
        vars: {
          email,
          link: `${publicBaseUrl}${webappPath<Routes.ActivateNewUser>('/activate-new-user/:token', {
            token,
          })}`,
        },
      })
      sendEmail(emailObj)
      return
    },
)

export type NewUserConfirmAdapter = {
  activateUser(_: {
    token: string
    password: string
    username: string
    profileId: Id
  }): Promise<ActiveUser | 'username not available' | 'not found'>
  hashPassword(pwd: string): Promise<string>
  generateProfileId(): Promise<Id>

  createNewProfile(_: { profileId: Id; username: string }): Promise<unknown>
}
export const confirmSignup = QMMutation(
  ({ token, password: plainPwd, username }: { token: string; password: string; username: string }) =>
    async ({ activateUser, hashPassword, generateProfileId, createNewProfile }: NewUserConfirmAdapter) => {
      const [profileId, pwdHash] = await Promise.all([generateProfileId(), hashPassword(plainPwd)])

      const activateResult = await activateUser({ password: pwdHash, token, username, profileId })
      if (typeof activateResult === 'string') {
        return activateResult // error
      }
      createNewProfile({ profileId, username })
      return activateResult
    },
)

QMModule(module)
