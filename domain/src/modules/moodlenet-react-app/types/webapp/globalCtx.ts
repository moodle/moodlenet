import { AllSchemaConfigs } from '../../../../types'
import { contentLanguageRecord, contentLicenseRecord } from '../../../content'
import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '../../../edu'
import { DeploymentInfo } from '../../../env'
import { pointSystem } from '../../../moodlenet'

export type webappGlobals = {
  filestoreHttpDeployment: DeploymentInfo
  allSchemaConfigs: AllSchemaConfigs
  pointSystem: pointSystem
  moodlenetCategories: moodlenetCategories
  serverTimeMs: number
}

export type moodlenetCategories = {
  eduBloomCognitives: eduBloomCognitiveRecord[]
  eduIscedFields: eduIscedFieldRecord[]
  eduIscedLevels: eduIscedLevelRecord[]
  eduResourceTypes: eduResourceTypeRecord[]
  contentLanguages: contentLanguageRecord[]
  contentLicenses: contentLicenseRecord[]
}
