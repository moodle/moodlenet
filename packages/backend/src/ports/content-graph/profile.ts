import { GraphNodeIdentifier, Profile } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { getBaseOperatorsAdapter, getGraphOperatorsAdapter } from './common'

export const sendTextToProfileAdapter = plug<
  (_: { sender: Profile; recipient: Profile; text: string }) => Promise<boolean>
>(ns(__dirname, 'send-text-to-profile-adapter'))

export type SendTextToProfile = {
  env: SessionEnv
  toProfileId: GraphNodeIdentifier<'Profile'>
  text: string
}
export const sendTextToProfile = plug(
  ns(__dirname, 'send-text-to-profile'),
  async ({ env, toProfileId, text }: SendTextToProfile) => {
    const { getBV } = await getBaseOperatorsAdapter()
    const { graphNode } = await getGraphOperatorsAdapter()

    const recipient = await getBV(graphNode(toProfileId))
    const sender = await getBV(graphNode({ _authId: env.user.authId, _type: 'Profile' }))

    if (!(recipient && sender)) {
      return false
    }

    return sendTextToProfileAdapter({ sender, recipient, text })
  },
)
