import { pointSystem } from './point-system'
import { moodlenetPrimaryMsgSchemaConfigs as moodlenetPrimaryMsgSchemaConfigs } from './primary-schemas'

export type configs = {
  info: moodlenetInfo
  moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs
  pointSystem: pointSystem
}

export type moodlenetInfo = {
  title: string
  subtitle: string
}
