/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { language, license } from './types'
const MODEL_NAME = 'content'
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: content
    }
  }
}
export type content = moo.def.model<contentModel>

type abilityFilter = {
  // defaults 'enabled'
  ability: 'enabled' | 'disabled' | 'all'
}

export type contentModel = {
  categories: {
    languages: Pick<moo.def.model.op.set<catRecord<language>, abilityFilter>, 'create' | 'find'>
    licenses: Pick<moo.def.model.op.set<catRecord<license>, abilityFilter>, 'create' | 'find'>
  }
}

export type catRecord<t> = {
  data: t
  meta: { enabled: boolean }
}
