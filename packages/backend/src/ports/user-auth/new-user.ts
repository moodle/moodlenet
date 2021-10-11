import { newAuthId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import {
  getLatestConfigAdapter,
  jwtSignerAdapter,
  localDomainAdapter,
  passwordHasher,
  sendEmailAdapter,
} from './adapters'
import { Email } from './types'

export type SignupIssue = 'email not available'

export const signUp = plug(
  ns(__dirname, 'sign-up'),
  async ({ email, displayName, password }: { email: Email; password: string; displayName: string }) => {
    const { newUserRequestEmail, newUserVerificationWaitSecs } = await getLatestConfigAdapter()
    const authId = newAuthId()
    const hashedPassword = await passwordHasher(password)

    const activationEmailToken = await jwtSignerAdapter(
      {
        displayName,
        email,
        hashedPassword,
        authId,
      },
      newUserVerificationWaitSecs,
    )
    const publicBaseUrl = await localDomainAdapter()
    const emailObj = fillEmailTemplate({
      template: newUserRequestEmail,
      to: email,
      vars: {
        email,
        link: `https://${publicBaseUrl}${webappPath<Routes.Login>('/login/:activationEmailToken?', {
          activationEmailToken,
        })}`,
      },
    })
    await sendEmailAdapter(emailObj)
    return { token: activationEmailToken }
  },
)
