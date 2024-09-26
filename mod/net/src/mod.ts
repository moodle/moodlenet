import { DeploymentInfo, mod } from '@moodle/lib-ddd'
import { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import * as v1_0 from './v1_0/types'

declare module '@moodle/lib-ddd' {
  export interface MoodleMods {
    net: moodle_net_mod
  }

  export interface MoodleDeployments {
    net: {
      MoodleNetWebappDeploymentInfo?: DeploymentInfo | null
    }
  }
}

interface MoodleNetMod {
  v1_0: {
    pri: {
      system: {
        configs(): Promise<{
          configs: v1_0.Configs
        }>
      }
      admin: {
        updatePartialMoodleNetInfo(_: {
          partialInfo: deep_partial<v1_0.MoodleNetInfo>
        }): Promise<ok_ko<void>>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{
          configs: v1_0.Configs
        }>
        updatePartialConfigs(_: {
          partialConfigs: deep_partial<v1_0.Configs>
        }): Promise<ok_ko<void>>
      }
    }
    evt: never
  }
}
export type moodle_net_mod = mod<pretty<MoodleNetMod>>
