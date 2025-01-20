import { deep_partial_props } from '@moodle/lib-types'
import { eduPrimaryMsgSchemaConfigs } from '../../edu'
import { pointSystem } from './point-system'
import { moodlenetPrimaryMsgSchemaConfigs } from './primary-schemas'

export type moodlenetEduPublishPrimaryMsgSchemaConfigOverrides = deep_partial_props<eduPrimaryMsgSchemaConfigs>

export type configs = {
  siteInfo: moodlenetSiteInfo
  moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs
  pointSystem: pointSystem
  eduPublishPrimaryMsgSchemaConfigOverrides: moodlenetEduPublishPrimaryMsgSchemaConfigOverrides
}

export type moodlenetSiteInfo = {
  title: string
  subtitle: string
}
