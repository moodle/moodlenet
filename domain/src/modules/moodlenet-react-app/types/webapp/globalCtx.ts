import { AllSchemaConfigs } from '../../../../types'
import { contentLanguageRecord, contentLicenseRecord } from '../../../content'
import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '../../../edu'
import { DeploymentInfo } from '../../../env'
import { pointSystem } from '../../../moodlenet'

export type webappGlobals = {
  filestoreHttpDeployment: DeploymentInfo
  allSchemaConfigs: AllSchemaConfigs
  pointSystem: pointSystem
  enabledCategories: {
    bloomCognitives: eduBloomCognitiveRecord[]
    iscedFields: eduIscedFieldRecord[]
    iscedLevels: eduIscedLevelRecord[]
    resourceTypes: eduResourceTypeRecord[]
    languages: contentLanguageRecord[]
    licenses: contentLicenseRecord[]
  }
}
