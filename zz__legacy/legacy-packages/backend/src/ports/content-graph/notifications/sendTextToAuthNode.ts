import { GraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { ns } from '../../../lib/ns/namespace'
import { plug } from '../../../lib/plug'

export const adapter = plug<
  (_: {
    sender: GraphNodeIdentifierAuth
    recipient: GraphNodeIdentifierAuth
    text: string
    fromLocalOrg: boolean
  }) => Promise<boolean>
>(ns(module, 'adapter'))

export type SendTextToAuthNode = {
  sessionEnv: SessionEnv
  recipientId: GraphNodeIdentifierAuth
  text: string
}
export const port = plug(ns(module, 'port'), async ({ sessionEnv, recipientId, text }: SendTextToAuthNode) => {
  if (!sessionEnv.authId) {
    return false
  }
  const fromLocalOrg = sessionEnv.authId._type === 'Organization'
  return adapter({ sender: sessionEnv.authId, recipient: recipientId, text, fromLocalOrg })
})
