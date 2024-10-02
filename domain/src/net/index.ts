import { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { Configs, MoodleNetInfo } from './types'
export * from './types'

export type net_primary = pretty<NetPrimary>
export type net_secondary = pretty<NetSecondary>

export interface NetPrimary {
  system: {
    configs(): Promise<{ configs: Configs }>
  }
  admin: {
    updatePartialMoodleNetInfo(_: {
      partialInfo: deep_partial<MoodleNetInfo>
    }): Promise<ok_ko<void>>
  }
}
export interface NetSecondary {
  db: {
    getConfigs(): Promise<{
      configs: Configs
    }>
    updatePartialConfigs(_: { partialConfigs: deep_partial<Configs> }): Promise<ok_ko<void>>
  }
}
