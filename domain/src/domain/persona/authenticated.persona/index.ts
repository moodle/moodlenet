/* eslint-disable @typescript-eslint/no-namespace */
import { eduDraftsPublishSchemaOverrides } from '../../model/userAccount.model'
import { edu } from './edu.context'
import { messaging } from './messaging.context'
import { moodlenet } from './moodlenet.context'
import { myAccount } from './myAccount.context'
import { mySpace } from './mySpace.context'
declare global {
  namespace moo {
    interface Personas {
      authenticated: authenticated
    }
  }
}

export interface Persona {
  // [moo.persona.meta]: { userId: string }
  [moo.tags.configs]: {
    schemas: authenticatedPersonaValidationConfigs
  }
}
export type authenticated = moo.persona<moo<Persona>>
export const authenticated: moo.gate.provider.persona<authenticated> = {
  myAccount,
  mySpace,
  moodlenet,
  edu,
  messaging,
}

export type authenticatedPersonaValidationConfigs = {
  //FIXME: eduDraftsPublishOverrides should go in authenticated.moodlenet.contribute[moo.configs] scope
  eduDraftsPublishOverrides: eduDraftsPublishSchemaOverrides
}
