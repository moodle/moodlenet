import { getCurrentWebUserProfile } from '@moodlenet/react-app/server'
import { OpenIdExposeType } from '../common/expose-def.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<OpenIdExposeType>({
  rpc: {
    'webapp/getInteractionDetails': {
      guard: () => void 0,
      async fn({ interactionId }) {
        const { openIdProvider } = await import('./oidc/provider.mjs')
        const currentWebUserProfile = await getCurrentWebUserProfile()
        if (!currentWebUserProfile) {
          return
        }

        const found = await openIdProvider.Interaction.find(interactionId)
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
        const details = {
          reasons: found.prompt.reasons,
          promptType: found.prompt.name,
          clientId: params.client_id,
          scopes: (params.scope ?? '').split(' '),
          needsLogin: found.prompt.name === 'login',
        }
        return details
      },
    },
  },
})
