import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { nodeIdentifierSlug2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { SockOf } from '../../lib/stub/Stub'
import { sendTextToProfileAdapter } from '../content-graph/profile'
import { getActiveUserByAuthAdapter, getLatestConfigAdapter, localDomainAdapter, sendEmailAdapter } from './adapters'

export type SendEmailToProfile = {
  env: SessionEnv
  toProfileId: GraphNodeIdentifier<'Profile'>
  text: string
}
export const sendTextAdapter: SockOf<typeof sendTextToProfileAdapter> = async ({ recipient, sender, text }) => {
  const recipientUser = await getActiveUserByAuthAdapter({ authId: recipient._authId })

  if (!recipientUser) {
    return false
  }
  const domain = await localDomainAdapter()
  const senderProfileUrl = `https://${domain}${nodeIdentifierSlug2UrlPath(sender)}` // FIXME: Hardcoded protocol for mvp
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
