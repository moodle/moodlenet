import { DeploymentInfo } from '@moodle/lib-ddd'
import { map, pretty } from '@moodle/lib-types'
import { sys_admin_info } from '..'
export * from './types'

export type env_primary = pretty<EnvPrimary>
export type appDeployments = map<DeploymentInfo, 'moodlenetWebapp' | 'filestoreHttp'>

// export type env_secondary = pretty<EnvSecondary>

export interface EnvPrimary {
  domain: {
    info(): Promise<{ name: string }>
  }
  application: {
    deployments(): Promise<appDeployments>
  }
  maintainance: {
    getSysAdminInfo(): Promise<sys_admin_info>
  }
}
