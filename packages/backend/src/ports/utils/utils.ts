import { AuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { GraphNodeIdentifier, Profile } from '@moodlenet/common/lib/content-graph/types/node'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { nodeIdentifierSlug2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { SessionEnv } from '../../lib/auth/types'
import { EmailObj } from '../../lib/emailSender/types'
import { QMCommand, QMModule } from '../../lib/qmino'
import { ActiveUser } from '../user-auth/types'

export type SendEmailToProfileAdapter = {
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
      return sendEmail({
        from: `noreply@${domain}`,
        to: recipientUser.email,
        subject: `Hey ${recipient.name}, ${sender.name}@${domain} sent you a message!`,
        html: `<h2>Moodlenet user ${sender.name} @ ${domain} sent you this message:</h2>
        <p>${text}</p>
        <br/>
        <p>
        Checkout sender's profile @ ${domain}
        <br/>
        <a href="${senderProfileUrl}">
            ${senderProfileUrl}
          </a>
        </p>
        `,
      })
    },
)

// export const save = QMCommand(
//   () =>
//     async ({ saveConfig }: Adapter) => {
//       await saveConfig(cfg)
//       return true
//     },
// )

QMModule(module)
