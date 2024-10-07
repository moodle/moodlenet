import { MoodleNetPrimaryMsgSchemaConfigs } from './primary-schemas'

export interface Configs {
  info: MoodleNetInfo
  moodleNetPrimaryMsgSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
}
export interface MoodleNetInfo {
  title: string
  subtitle: string
}
