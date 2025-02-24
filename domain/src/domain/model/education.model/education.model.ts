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
  [moo.configs]: educationConfigs
  categories: {
    iscedFields: moo.model.type.idSpaceMap<iscedFieldSpace, abilityFilter>
    iscedLevels: moo.model.type.idSpaceMap<iscedLevelSpace, abilityFilter>
    resourceTypes: moo.model.type.idSpaceMap<resourceTypeSpace, abilityFilter>
    bloomCognitives: moo.model.type.idSpaceMap<bloomCognitiveSpace, abilityFilter>
  }
}

export type iscedFieldSpace = {
  data: moo.model.type.entityData<iscedField>
  meta: moo.model.type.entityData<{ enabled: boolean }>
}
export type iscedLevelSpace = {
  data: moo.model.type.entityData<iscedLevel>
  meta: moo.model.type.entityData<{ enabled: boolean }>
}
export type resourceTypeSpace = {
  data: moo.model.type.entityData<resourceType>
  meta: moo.model.type.entityData<{ enabled: boolean }>
}
export type bloomCognitiveSpace = {
  data: moo.model.type.entityData<bloomCognitive>
  meta: moo.model.type.entityData<{ enabled: boolean }>
}
