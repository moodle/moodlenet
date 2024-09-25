import type * as iam_v1_0 from '@moodle/mod-iam/v1_0/types'
import type * as net_v1_0 from '@moodle/mod-net/v1_0/types'
import type * as org_v1_0 from '@moodle/mod-org/v1_0/types'
import type * as v1_0 from './v1_0/types'

import { mod } from '@moodle/lib-ddd'

declare module '@moodle/lib-ddd' {
  export interface MoodleMods {
    netWebappNextjs: moodle_net_webapp_nextjs_mod
  }
}

export type moodle_net_webapp_nextjs_mod = mod<{
  v1_0: {
    pri: {
      schemaConfigs: {
        iam(): Promise<{ iamSchemaConfigs: iam_v1_0.IamPrimaryMsgSchemaConfigs }>
        moodleNet(): Promise<{ moodleNetSchemaConfigs: net_v1_0.MoodleNetPrimaryMsgSchemaConfigs }>
        org(): Promise<{ orgSchemaConfigs: org_v1_0.OrgPrimaryMsgSchemaConfigs }>
      }
      webapp: {
        layouts(): Promise<v1_0.Layouts>
        deployment(): Promise<v1_0.Deployment>
      }
      moodlenet: {
        info(): Promise<{ moodlenet: net_v1_0.MoodleNetInfo; org: org_v1_0.OrgInfo }>
      }
      system: {
        configs(): Promise<{ configs: v1_0.Configs }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{ configs: v1_0.Configs }>
      }
    }
    evt: never
  }
}>
