import { pretty } from '@moodle/lib-types'
import { sys_admin_info } from '..'
import { appDeployments } from './types/app-deployments'
export * from './deployment'
export * from './types'

export type env_primary = pretty<EnvPrimary>
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
