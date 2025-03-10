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
  [moo.tags.configs]: contentConfigs
  categories: {
    languages: moo.model.ops.collection<languageSpace, abilityFilter>
    licenses: moo.model.ops.collection<licenseSpace, abilityFilter>
  }
}

export type languageSpace = {
  data: moo.model.ops.atom<'ephem', language>
  meta: moo.model.ops.atom<'ephem', { enabled: boolean }>
}
export type licenseSpace = {
  data: moo.model.ops.atom<'ephem', license>
  meta: moo.model.ops.atom<'ephem', { enabled: boolean }>
}
