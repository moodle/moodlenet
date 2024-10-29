import { pointSystem } from './point-system'
import { moodlenetPrimaryMsgSchemaConfigs as moodlenetPrimaryMsgSchemaConfigs } from './primary-schemas'

export type configs = {
  siteInfo: moodlenetSiteInfo
  moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs
  pointSystem: pointSystem
}

export type moodlenetSiteInfo = {
  title: string
  subtitle: string
}
