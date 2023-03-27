import { getCurrentWebUserProfile } from '@moodlenet/react-app/server'
import { WebappInteractionDetails } from '../common/webapp/types.mjs'
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
      }): Promise<undefined | WebappInteractionDetails> {
        // const currentHttp = getCurrentHttpCtx()
        // if (!currentHttp) {
        //   return
        // }
        const currentWebUserProfile = await getCurrentWebUserProfile()
        if (!currentWebUserProfile) {
          return
        }

        const found = await openIdProvider.Interaction.find(interactionId)
        console.log({ found })
        if (!found) {
          return
        }

        // if (found.prompt.name === 'login') {
        //   // try {
        //   //   const interactionResult = await openIdProvider.interactionResult(
        //   //     currentHttp.request,
        //   //     currentHttp.response,
        //   //     {
        //   //       login: {
        //   //         accountId: currentWebUserProfile._key,
        //   //       },
        //   //     },
        //   //     {
        //   //       mergeWithLastSubmission: false,
        //   //     },
        //   //   )
        //   //   console.log({ interactionResult })
        //   // } catch (err) {
        //   //   throw new Error('-/interaction/:uid/login LOGIN ERR', { cause: err })
        //   // }
        //   await openIdProvider.Interaction.adapter.upsert(interactionId, {
        //     ...found,
        //   },)
        // }

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
          needsLogin: found.prompt.name === 'login',
        }
      },
    },
  },
})
