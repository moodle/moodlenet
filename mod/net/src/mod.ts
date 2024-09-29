import { DeploymentInfo } from '@moodle/lib-ddd'
import { _maybe, deep_partial, ok_ko } from '@moodle/lib-types'
import { Configs, MoodleNetInfo } from './types'

declare module '@moodle/lib-ddd' {
  export interface Domain {
    entity: {
      'v5.0': {
        moodle: {
          net: {
            moodlenetWebapp: _maybe<{
              deployment: DeploymentInfo
            }>
          }
        }
      }
    }
    primary: {
      'v5.0': {
        moodle: {
          net: {
            system: {
              configs(): Promise<{ configs: Configs }>
            }
            admin: {
              updatePartialMoodleNetInfo(_: {
                partialInfo: deep_partial<MoodleNetInfo>
              }): Promise<ok_ko<void>>
            }
          }
        }
      }
    }
    secondary: {
      'v5.0': {
        moodle: {
          net: {
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
