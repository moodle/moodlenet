import type { deep_partial, ok_ko } from '@moodle/lib-types'
import { Configs, OrgInfo } from './types'

declare module '@moodle/lib-ddd' {
  export interface Domain {
    primary: {
      'v5.0': {
        moodle: {
          org: {
            system: {
              configs(): Promise<{
                configs: Configs
              }>
            }
            admin: {
              updatePartialOrgInfo(_: { partialInfo: deep_partial<OrgInfo> }): Promise<ok_ko<void>>
            }
          }
        }
      }
    }
    secondary: {
      'v5.0': {
        moodle: {
          org: {
            db: {
              getConfigs(): Promise<{
                configs: Configs
              }>
              updatePartialConfigs(_: {
                partialConfigs: deep_partial<Configs>
              }): Promise<ok_ko<void>>
            }
          }
        }
      }
    }
  }
}
