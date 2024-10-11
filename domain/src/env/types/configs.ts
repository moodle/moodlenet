import { email_address } from '@moodle/lib-types'
import { MoodleNetPrimaryMsgSchemaConfigs } from './primary-schemas'
export type sys_admin_info = { email: email_address }

export interface Configs {
  info: MoodleNetInfo
  moodleNetPrimaryMsgSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
}
export interface MoodleNetInfo {
  title: string
  subtitle: string
}
