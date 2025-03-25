/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-namespace */
import { orgConfigs, orgSchemas } from './types'
const MODEL_NAME = 'org'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: org
    }
    namespace Models {
      namespace statics {
        interface Schemas {
          [MODEL_NAME]: orgSchemas
        }
        interface Configs {
          [MODEL_NAME]: orgConfigs
        }
      }
    }
  }
}

export type org = moo.def.model<OrgModel>

export type OrgModel = {}
