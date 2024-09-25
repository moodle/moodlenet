import { MoodleNetPrimaryMsgSchemaConfigs } from './primary-schemas'

export * from '../../mod'
export interface Configs {
  info: MoodleNetInfo
  moodleNetPrimaryMsgSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
}
export interface MoodleNetInfo {
  title: string
  subtitle: string
}
