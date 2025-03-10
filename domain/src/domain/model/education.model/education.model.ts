/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { bloomCognitive, educationConfigs, iscedField, iscedLevel, resourceType } from './types'
declare global {
  namespace moo {
    interface Models {
      education: education
    }
  }
}
export type education = moo.model<educationModel>

type abilityFilter = {
  // defaults 'enabled'
  ability: 'enabled' | 'disabled' | 'all'
  id: string
}
export type educationModel = {
  [moo.tags.configs]: educationConfigs
  categories: {
    iscedFields: Pick<moo.model.op.set<catRecord<iscedField>, abilityFilter, never>, 'create' | 'find'>
    iscedLevels: Pick<moo.model.op.set<catRecord<iscedLevel>, abilityFilter, never>, 'create' | 'find'>
    resourceTypes: Pick<moo.model.op.set<catRecord<resourceType>, abilityFilter, never>, 'create' | 'find'>
    bloomCognitives: Pick<moo.model.op.set<catRecord<bloomCognitive>, abilityFilter, never>, 'create' | 'find'>
  }
}

export type catRecord<t> = {
  data: t
  meta: { enabled: boolean }
}
