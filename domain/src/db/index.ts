import type { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { ModConfigs } from './types'
export * from './types'

// export type db_primary = pretty<DbPrimary>
export type db_secondary = pretty<DbSecondary>

// export interface DbPrimary {}
export interface DbSecondary {
  modConfigs: {
    get<mod extends keyof ModConfigs>(_: {
      mod: mod
    }): Promise<{
      configs: ModConfigs[mod]
    }>
    updatePartial<mod extends keyof ModConfigs>(_: {
      mod: mod
      partialConfigs: deep_partial<ModConfigs[mod]>
    }): Promise<ok_ko<void>>
  }
}
