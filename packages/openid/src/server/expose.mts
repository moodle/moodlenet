import { getCurrentProfileIds } from '@moodlenet/web-user/server'
import type { OpenIdExposeType } from '../common/expose-def.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<OpenIdExposeType>({
  rpc: {
    'webapp/getInteractionDetails': {
      guard: () => void 0,
      async fn(body) {
        if (!(body?.interactionId && typeof body.interactionId === 'string')) {
          return
        }
        const { openIdProvider } = await import('./oidc/provider.mjs')
        const currentWebUserProfile = await getCurrentProfileIds()
        if (!currentWebUserProfile) {
          return
        }
        const interactionId = String(body?.interactionId)
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
