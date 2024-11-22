import { contentLanguageRecord, contentLicenseRecord } from '../../content'
import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '../../edu'
import { pointSystem } from './point-system'
import { moodlenetPrimaryMsgSchemaConfigs } from './primary-schemas'

export type configs = {
  siteInfo: moodlenetSiteInfo
  moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs
  pointSystem: pointSystem
}

export type moodlenetSiteInfo = {
  title: string
  subtitle: string
}

export type moodlenetCategories = {
  bloomCognitives: eduBloomCognitiveRecord[]
  iscedFields: eduIscedFieldRecord[]
  iscedLevels: eduIscedLevelRecord[]
  resourceTypes: eduResourceTypeRecord[]
  languages: contentLanguageRecord[]
  licenses: contentLicenseRecord[]
}
