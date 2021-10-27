import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { nodeIdentifierSlug2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { SockOf } from '../../lib/plug'
import { sendTextToProfileAdapter } from '../content-graph/profile'
import { getActiveUserByAuthAdapter, getLatestConfigAdapter, publicUrlAdapter, sendEmailAdapter } from './adapters'

export type SendEmailToProfile = {
  env: SessionEnv
  toProfileId: GraphNodeIdentifier<'Profile'>
  text: string
}
export const sendTextAdapter: SockOf<typeof sendTextToProfileAdapter> = async ({ recipient, sender, text }) => {
  if (!recipient._authKey) {
    return false
  }
  const recipientUser = await getActiveUserByAuthAdapter({
    authId: { key: recipient._authKey, profileType: recipient._type },
  })

  if (!recipientUser) {
    return false
  }
  const domain = await publicUrlAdapter()
  const senderProfileUrl = `${domain}${nodeIdentifierSlug2UrlPath(sender)}`
  const { messageToUserEmail } = await getLatestConfigAdapter()
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
  const { success } = await sendEmailAdapter(emailObj)
  return success
}
