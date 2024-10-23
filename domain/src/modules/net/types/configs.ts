import { contentLanguageId, contentLicenseId } from '../../content'
import { eduIscedFieldId, eduIscedLevelId, eduResourceTypeId } from '../../edu'
import { pointSystem } from './point-system'
import { MoodleNetPrimaryMsgSchemaConfigs as moodlenetPrimaryMsgSchemaConfigs } from './primary-schemas'

export type configs = {
  info: moodlenetInfo
  moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs
  pointSystem: pointSystem
  disabledCategories: publishedCategories
}

export type publishedCategories = {
  eduIscedFields: { id: eduIscedFieldId[] }
  eduIscedLevels: { id: eduIscedLevelId[] }
  eduResourceTypes: { id: eduResourceTypeId[] }
  contentLanguages: { id: contentLanguageId[] }
  contentLicenses: { id: contentLicenseId[] }
}

export type moodlenetInfo = {
  title: string
  subtitle: string
}
