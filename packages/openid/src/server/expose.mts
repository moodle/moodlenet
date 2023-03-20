import { openIdProvider } from './oidc/provider.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    'webapp/getInteractionDetails': {
      guard: () => void 0,
      async fn({ interactionId }: { interactionId: string }) {
        const found = await openIdProvider.Interaction.find(interactionId, { XXXXX: true })
        console.log({ found })
        return found
      },
    },
  },
})
