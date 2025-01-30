/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type * as moo from '../../moodle-domain'
import { orgInfo } from './types'

declare module '../../moodle-domain' {
  interface Model {
    org: OrgModel
  }
}

export type OrgModel = moo.DefModel<{
  orgInfo: moo.StaticData<'w', orgInfo>
}>
