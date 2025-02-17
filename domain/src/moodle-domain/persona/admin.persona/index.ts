/* eslint-disable @typescript-eslint/no-namespace */
import { valid } from '@moodle/lib-types'
import { userBase } from './userBase.context'
import { moodlenet } from './moodlenet.context'
import { organization } from './organization.context'
declare global {
  namespace moo {
    interface Personas {
      admin: admin
    }
  }
}

export interface Persona {
  [moo.configs]: adminPersonaConfigs
}

export type admin = moo.persona<moo<Persona>>

export const admin: moo.gate.provider.persona<admin> = {
  userBase,
  moodlenet,
  organization,
}

export type adminPersonaValidationConfigs = {
  xxxxxxxx: valid.iMinMax
}

type adminPersonaConfigs = {
  validation: adminPersonaValidationConfigs
}
