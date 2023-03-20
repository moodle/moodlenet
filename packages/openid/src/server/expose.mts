import { RpcInteractionDetails } from '../common/webapp/types.mjs'
import { openIdProvider } from './oidc/provider.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    'webapp/getInteractionDetails': {
      guard: () => void 0,
      async fn({
        interactionId,
      }: {
        interactionId: string
      }): Promise<undefined | RpcInteractionDetails> {
        const found = await openIdProvider.Interaction.find(interactionId, { XXXXX: true })
        console.log({ found })
        if (!found) {
          return
        }
        const params = found.params as {
          client_id: string
          redirect_uri: string
          response_type?: string
          scope?: string
          state?: string
        }
        return {
          reasons: found.prompt.reasons,
          promptType: found.prompt.name,
          clientId: params.client_id,
          scopes: (params.scope ?? '').split(' '),
        }
      },
    },
  },
})
