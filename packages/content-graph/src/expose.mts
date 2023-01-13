import { getApiCtxClientSession } from '@moodlenet/authentication-manager/init'
import { getAuthenticatedNode } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    getMyUserNode: {
      guard: () => void 0,
      async fn() {
        const clientSession = await getApiCtxClientSession()
        // console.log('APAP', inspect({ clientSession, ctx }, false, 10, true))
        if (!clientSession?.user) {
          return
        }
        const result = await getAuthenticatedNode({ userId: clientSession.user.id })
        if (!result) {
          return
        }
        return { node: result.node }
      },
    },
  },
})
