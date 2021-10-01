import { GraphNodeIdentifier, Profile } from '@moodlenet/common/lib/content-graph/types/node'
import { AuthId, SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { nodeIdentifierSlug2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { fillEmailTemplate } from '../../lib/emailSender/helpers'
import { EmailObj } from '../../lib/emailSender/types'
import { QMCommand, QMModule } from '../../lib/qmino'
import { ActiveUser, UserAuthConfig } from '../user-auth/types'

export type SendEmailToProfileAdapter = {
  getConfig(): Promise<UserAuthConfig>
  sendEmail(_: EmailObj): Promise<boolean>
  getProfile(_: GraphNodeIdentifier<'Profile'>): Promise<Maybe<Profile>>
  getActiveUserByAuth(_: { authId: AuthId }): Promise<Maybe<ActiveUser>>
  getProfileByAuth(_: { authId: AuthId }): Promise<Maybe<Profile>>
  getLocalDomain(): Promise<string>
}

export type SendEmailToProfile = {
  env: SessionEnv
  toProfileId: GraphNodeIdentifier<'Profile'>
  text: string
}
export const sendEmailToProfile = QMCommand(
  ({ env, toProfileId, text }: SendEmailToProfile) =>
    async ({
      getConfig,
      getProfile,
      sendEmail,
      getProfileByAuth,
      getActiveUserByAuth,
      getLocalDomain,
    }: SendEmailToProfileAdapter) => {
      const recipient = await getProfile(toProfileId)
      const sender = recipient ? await getProfileByAuth({ authId: env.user.authId }) : null
      const recipientUser = recipient && sender ? await getActiveUserByAuth({ authId: recipient._authId }) : null

      if (!(recipient && sender && recipientUser)) {
        return false
      }
      const domain = await getLocalDomain()
      const senderProfileUrl = `https://${domain}${nodeIdentifierSlug2UrlPath(sender)}` // FIXME: Hardcoded protocol for mvp
      const { messageToUserEmail } = await getConfig()
      const emailObj = fillEmailTemplate({
        template: messageToUserEmail,
        to: recipientUser.email,
        vars: {
          email: recipientUser.email,
          msgText: text,
          senderName: sender.name,
          senderProfileUrl: senderProfileUrl,
        },
      })

      return sendEmail(emailObj)
    },
)

QMModule(module)
