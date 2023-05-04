import type { PkgExposeDef } from '@moodlenet/core'

export type OpenIdExposeType = PkgExposeDef<{
  rpc: {
    'webapp/getInteractionDetails'(body: {
      interactionId: string
    }): Promise<undefined | WebappInteractionDetails>
  }
}>

export type WebappInteractionDetails = {
  promptType: string
  reasons: string[]
  clientId: string
  scopes: string[]
  needsLogin: boolean
}
