/* eslint-disable @typescript-eslint/no-namespace */
import { map } from '@moodle/lib-types'
import { configs } from './types'
declare global {
  namespace moo {
    interface Models {
      org: org
    }
  }
}

export type org = moo.model<OrgModel>

export type OrgModel = {
  configs: configs
}
