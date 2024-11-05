import { AllSchemaConfigs } from '../../../../types'
import { DeploymentInfo } from '../../../env'
import { pointSystem } from '../../../moodlenet'

export type webappGlobals = {
  filestoreHttpDeployment: DeploymentInfo
  allSchemaConfigs: AllSchemaConfigs
  pointSystem: pointSystem
}
