import { MoodleNetPrimaryMsgSchemaConfigs } from './primary-schemas'
import { pointSystem } from './point-system'

export interface Configs {
  info: MoodleNetInfo
  moodleNetPrimaryMsgSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
  pointSystem: pointSystem
}
export interface MoodleNetInfo {
  title: string
  subtitle: string
}
