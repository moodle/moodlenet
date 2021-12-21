import { pick } from '@moodlenet/common/dist/utils/object'
import { nodeIdentifierSlug2HomeUrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { SockOf } from '../../lib/plug'
import { baseOperators } from '../content-graph/graph-lang/base'
import { graphOperators } from '../content-graph/graph-lang/graph'
import { adapter } from '../content-graph/notifications/sendTextToAuthNode'
import * as sys from '../system'
import { getActiveUserByAuthAdapter, getLatestConfigAdapter } from './adapters'

// export type SendEmailToProfile = {
//   sessionEnv: SessionEnv
//   toProfileId: GraphNodeIdentifier<'Profile'>
//   text: string
// }

export const sendTextAdapter: SockOf<typeof adapter> = async ({ recipient, sender, text, fromLocalOrg }) => {
  if (!recipient._authKey) {
    return false
  }
  const recipientUser = await getActiveUserByAuthAdapter({
    authId: pick(recipient, ['_authKey', '_type', '_permId']),
  })

  if (!recipientUser) {
    return false
  }
  const { graphNode } = await graphOperators()
  const { getBV } = await baseOperators()
  const senderNode = await getBV(graphNode(sender), {})
  if (!senderNode) {
    return false
  }
  const { publicUrl } = await sys.localOrg.info.adapter()
  const senderProfileUrl = `${publicUrl}${nodeIdentifierSlug2HomeUrlPath(senderNode)}`
  const { messageToUserEmail } = await getLatestConfigAdapter()
  const emailObj = fillEmailTemplate({
    template: messageToUserEmail,
    to: recipientUser.email,
    vars: {
      email: recipientUser.email,
      msgText: text,
      senderName: senderNode.name,
      senderProfileUrl: senderProfileUrl,
      fromLocalOrg,
    },
  })
  const { success } = await sys.sendEmail.adapter(emailObj)
  return success
}
