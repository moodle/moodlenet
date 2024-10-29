import { flags } from '@moodle/lib-types'
import { AllSchemaConfigs } from '../../../../types'
import { DeploymentInfo } from '../../../env'
import { currentMoodlenetSessionData, moodlenetSiteInfo, pointSystem } from '../../../moodlenet'

export type moodlenetReactAppSessionData = { is: flags<'admin' | 'contributor'> } & currentMoodlenetSessionData

export type webappGlobalCtx = {
  filestoreHttpDeployment: DeploymentInfo
  allSchemaConfigs: AllSchemaConfigs
  session: moodlenetReactAppSessionData
  pointSystem: pointSystem
  moodlenetSiteInfo: moodlenetSiteInfo
}
