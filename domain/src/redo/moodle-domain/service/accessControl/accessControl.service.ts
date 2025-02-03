import { typ } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type accessControl = moo.DefService<{
  model: moo.DefModel<AccessControlModel>
  tokens: never
}>

export interface AccessControlModel {
  configs: moo.IdSpaceMap<ConfigsSpace>
}

interface ConfigsSpace {
  personaAccess: moo.EntityData<'w', typ<moo.PersonaAccess<true>>>
}
