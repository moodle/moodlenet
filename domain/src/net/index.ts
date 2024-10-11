import { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { Configs, MoodleNetInfo, MoodleNetPrimaryMsgSchemaConfigs } from './types'
export * from './types'

export type net_primary = pretty<NetPrimary>
// export type net_secondary = pretty<NetSecondary>

export interface NetPrimary {
  session: {
    moduleInfo(): Promise<{ info: MoodleNetInfo; schemaConfigs: MoodleNetPrimaryMsgSchemaConfigs }>
  }
  admin: {
    updatePartialMoodleNetInfo(_: {
      partialInfo: deep_partial<MoodleNetInfo>
    }): Promise<ok_ko<void>>
  }
}
// export interface NetSecondary {}
