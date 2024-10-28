import { flags } from '@moodle/lib-types'
import { AllSchemaConfigs } from '../../../../types'
import { appDeployments } from '../../../env'
import { currentMoodlenetSessionData } from '../../../moodlenet'

export type globalCtxCurrentMoodlenetSessionData = { is: flags<'admin' | 'contributor'> } & currentMoodlenetSessionData

export type webappGlobalCtx = {
  deployments: appDeployments
  allSchemaConfigs: AllSchemaConfigs
  session: globalCtxCurrentMoodlenetSessionData
}
