/* eslint-disable @typescript-eslint/no-namespace */
import { orgInfoSchemaConfigs } from '../../model/org.model'
import { moodlenet } from './moodlenet.context'
import { organization } from './organization.context'
import { userBase } from './userBase.context'
declare global {
  namespace moo {
    interface Personas {
      admin: admin
    }
  }
}

export interface Persona {
  [moo.tags.configs]: adminPersonaConfigs
}

export type admin = moo.persona<moo<Persona>>

export const admin: moo.gate.provider.persona<admin> = {
  userBase,
  moodlenet,
  organization,
}

export type adminPersonaValidationConfigs = {
  [k in never]: never
}

type adminPersonaConfigs = {
  schemas: {
    orgInfo: orgInfoSchemaConfigs
  }
}
