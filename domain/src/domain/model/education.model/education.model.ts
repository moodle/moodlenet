/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { bloomCognitive, eduSchemaConfigs, iscedField, iscedLevel, resourceType } from './types'
const MODEL_NAME = 'education'
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: education
    }
    namespace Models {
      namespace statics {
        interface Schemas {
          [MODEL_NAME]: eduSchemaConfigs
        }
      }
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
  categories: {
    iscedFields: Pick<moo.model.op.set<catRecord<iscedField>, abilityFilter>, 'create' | 'find'>
    iscedLevels: Pick<moo.model.op.set<catRecord<iscedLevel>, abilityFilter>, 'create' | 'find'>
    resourceTypes: Pick<moo.model.op.set<catRecord<resourceType>, abilityFilter>, 'create' | 'find'>
    bloomCognitives: Pick<moo.model.op.set<catRecord<bloomCognitive>, abilityFilter>, 'create' | 'find'>
  }
}

export type catRecord<t> = {
  data: t
  meta: { enabled: boolean }
}
