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
    languages: Pick<moo.model.op.set<catRecord<language>, abilityFilter, never>, 'create' | 'find'>
    licenses: Pick<moo.model.op.set<catRecord<license>, abilityFilter, never>, 'create' | 'find'>
  }
}

export type catRecord<t> = {
  data: t
  meta: { enabled: boolean }
}
