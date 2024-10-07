import { DeploymentInfo } from '@moodle/lib-ddd'
import { _maybe, pretty } from '@moodle/lib-types'
import { sys_admin_info } from '..'
export * from './types'

export type env_primary = pretty<EnvPrimary>
// export type env_secondary = pretty<EnvSecondary>

export interface EnvPrimary {
  application: {
    deployment(_: { app: 'moodlenet-webapp' | 'filestore-http' }): Promise<_maybe<DeploymentInfo>>
    fsHomeDir(): Promise<{ path: string }>
  }
  maintainance: {
    getSysAdminInfo(): Promise<sys_admin_info>
  }
}
