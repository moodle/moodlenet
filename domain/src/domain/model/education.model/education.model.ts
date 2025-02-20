/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { bloomCognitive, configs, iscedField, iscedLevel, resourceType } from './types'
declare global {
  namespace moo {
    interface Models {
      education: education
    }
  }
}
export type education = moo.model<educationModel>

export type educationModel = {
  [moo.configs]: configs
  categories: {
    iscedFields: moo.model.type.idSpaceMap<{ data: iscedField }>
    iscedLevels: moo.model.type.idSpaceMap<{ data: iscedLevel }>
    resourceTypes: moo.model.type.idSpaceMap<{ data: resourceType }>
    bloomCognitives: moo.model.type.idSpaceMap<{ data: bloomCognitive }>
  }
}
