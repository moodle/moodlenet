import { pretty } from '@moodle/lib-types'
import type { Configs, Layouts } from './types'
export * from './types'

export type net_webapp_nextjs_primary = pretty<NetWebappNextjsPrimary>
export type net_webapp_nextjs_secondary = pretty<NetWebappNextjsSecondary>

export interface NetWebappNextjsPrimary {
  webapp: {
    layouts(): Promise<Layouts>
  }
  system: {
    configs(): Promise<{ configs: Configs }>
  }
}
export interface NetWebappNextjsSecondary {
  db: {
    getConfigs(): Promise<{ configs: Configs }>
  }
}
