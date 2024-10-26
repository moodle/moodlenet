import type { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { ModConfigs, sys_admin_info } from '../../types/mod-configs'
import { appDeployments } from './types/app-deployments'
export * from './types'

export default interface EnvDomain {
  event: { env: unknown }
  primary: {
    env: {
      service?: unknown
      domain: {
        info(): Promise<{ name: string }>
      }
      application: {
        deployments(): Promise<appDeployments>
      }
    }
  }
  secondary: {
    env: {
      write?: unknown
      sync?: unknown
      query: {
        deployments(): Promise<appDeployments>
        getSysAdminInfo(): Promise<sys_admin_info>
        modConfigs<mod extends keyof ModConfigs>(_: {
          mod: mod
        }): Promise<{
          configs: ModConfigs[mod]
        }>
      }
      service: {
        updatePartialConfigs<mod extends keyof ModConfigs>(_: {
          mod: mod
          partialConfigs: deep_partial_props<ModConfigs[mod]>
        }): Promise<ok_ko<void>>
      }
    }
  }
}
