/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { contentConfigs, language, license } from './types'
declare global {
  namespace moo {
    interface Models {
      content: content
    }
  }
}
export type content = moo.model<contentModel>

type abilityFilter = {
  // defaults 'enabled'
  ability: 'enabled' | 'disabled' | 'all'
}

export type contentModel = {
  [moo.configs]: contentConfigs
  categories: {
    languages: moo.model.type.idSpaceMap<languageSpace, abilityFilter>
    licenses: moo.model.type.idSpaceMap<licenseSpace, abilityFilter>
  }
}

export type languageSpace = {
  data: moo.model.type.entityData<language>
  meta: moo.model.type.entityData<{ enabled: boolean }>
}
export type licenseSpace = {
  data: moo.model.type.entityData<license>
  meta: moo.model.type.entityData<{ enabled: boolean }>
}
