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
}
export type educationModel = {
  [moo.tags.configs]: educationConfigs
  categories: {
    iscedFields: moo.model.ops.collection<iscedFieldSpace, abilityFilter>
    iscedLevels: moo.model.ops.collection<iscedLevelSpace, abilityFilter>
    resourceTypes: moo.model.ops.collection<resourceTypeSpace, abilityFilter>
    bloomCognitives: moo.model.ops.collection<bloomCognitiveSpace, abilityFilter>
  }
}

export type iscedFieldSpace = {
  data: moo.model.ops.atom<'ephem', iscedField>
  meta: moo.model.ops.atom<'ephem', { enabled: boolean }>
}
export type iscedLevelSpace = {
  data: moo.model.ops.atom<'ephem', iscedLevel>
  meta: moo.model.ops.atom<'ephem', { enabled: boolean }>
}
export type resourceTypeSpace = {
  data: moo.model.ops.atom<'ephem', resourceType>
  meta: moo.model.ops.atom<'ephem', { enabled: boolean }>
}
export type bloomCognitiveSpace = {
  data: moo.model.ops.atom<'ephem', bloomCognitive>
  meta: moo.model.ops.atom<'ephem', { enabled: boolean }>
}
