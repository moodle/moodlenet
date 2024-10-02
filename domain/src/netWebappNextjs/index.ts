import { pretty } from '@moodle/lib-types'
import type * as iam from '../iam'
import type * as net from '../net'
import type * as org from '../org'
import type { Configs, Layouts } from './types'
export * from './types'

export type net_webapp_nextjs_primary = pretty<NetWebappNextjsPrimary>
export type net_webapp_nextjs_secondary = pretty<NetWebappNextjsSecondary>

export interface NetWebappNextjsPrimary {
  schemaConfigs: {
    iam(): Promise<{ iamSchemaConfigs: iam.IamPrimaryMsgSchemaConfigs }>
    moodleNet(): Promise<{ moodleNetSchemaConfigs: net.MoodleNetPrimaryMsgSchemaConfigs }>
    org(): Promise<{ orgSchemaConfigs: org.OrgPrimaryMsgSchemaConfigs }>
  }
  webapp: {
    layouts(): Promise<Layouts>
  }
  moodlenet: {
    info(): Promise<{ moodlenet: net.MoodleNetInfo; org: org.OrgInfo }>
  }
  system: {
    configs(): Promise<{ configs: Configs }>
  }
}
export interface NetWebappNextjsSecondary {
  db: {
    getConfigs(): Promise<{ configs: Configs }>
  }
}
