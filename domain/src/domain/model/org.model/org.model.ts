/* eslint-disable @typescript-eslint/no-namespace */
import { map } from '@moodle/lib-types'
import { orgConfigs } from './types'
declare global {
  namespace moo {
    interface Models {
      org: org
    }
  }
}

export type org = moo.model<OrgModel>

export type OrgModel = {
  [moo.tags.configs]: orgConfigs
}
