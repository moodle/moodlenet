/* eslint-disable @typescript-eslint/no-namespace */
import { valid } from '@moodle/lib-types'
import { myAccount } from './myAccount.context'
import { mySpace } from './mySpace.context'
import { moodlenet } from './moodlenet.context'
declare global {
  namespace moo {
    interface Personas {
      authenticated: authenticated
    }
  }
}

export type authenticatedPersonaValidationConfigs = {
  entity: {
    title: valid.iMinMax
    description: valid.iMinMax
  }
}

export interface Persona {
  [moo.persona.meta]: { userId: string }
  [moo.configs]: {
    validation: authenticatedPersonaValidationConfigs
  }
}

export type authenticated = moo.persona<moo<Persona>>
export const authenticated: moo.gate.persona<authenticated> = {
  myAccount: myAccount,
  mySpace: mySpace,
  moodlenet: moodlenet,
}
