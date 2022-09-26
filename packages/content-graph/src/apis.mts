import { getApiCtxClientSession } from '@moodlenet/authentication-manager'
import { defApi } from '@moodlenet/core'
import { getAuthenticatedNode, readNode } from './lib.mjs'
import { GlyphDescriptor, GlyphIdentifier } from './types.mjs'

export default {
  getMyUserNode: defApi(
    ctx => async () => {
      const clientSession = getApiCtxClientSession({ ctx })
      // console.log('APAP', { clientSession })
      if (!clientSession?.user) {
        return
      }
      const result = await getAuthenticatedNode({ userId: clientSession.user.id })
      if (!result) {
        return
      }
      return { node: result.node }
    },
    () => true,
  ),
  read: {
    node: defApi(
      _ctx =>
        async <GlyphDesc extends GlyphDescriptor<'node'>>({ identifier }: { identifier: GlyphIdentifier<'node'> }) => {
          const result = await readNode<GlyphDesc>({ identifier })
          return result && { node: result.node }
        },
      () => true,
    ),
  },
}
