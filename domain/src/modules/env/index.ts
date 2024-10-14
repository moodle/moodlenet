import type { deep_partial, ok_ko } from '@moodle/lib-types'
import { ModConfigs, sys_admin_info } from '../../types/mod-configs'
import { appDeployments } from './types/app-deployments'
export * from '../../lib/deployment'
export * from './types'

export default interface EnvDomain {
  event: { env: unknown }
  primary: {
    env: {
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
      queue: unknown
      write: unknown
      sync: unknown
      query: {
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
          partialConfigs: deep_partial<ModConfigs[mod]>
        }): Promise<ok_ko<void>>
      }
    }
  }
}
