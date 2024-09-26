import { mod } from './types'

declare const _: unique symbol
export interface MoodleDomain {
  version: '5.0'
  modules: Modules
}

export interface MoodleMods {
  [_]?: never
}

export interface Modules {
  moodle: MoodleMods
  env: {
    deployments: mod<{
      v1_0: {
        pri: never
        evt: never
        sec: {
          info: {
            read(): Promise<DomainDeployments>
          }
        }
      }
    }>
  }
}

export interface DomainDeployments {
  moodle: MoodleDeployments
}

export interface MoodleDeployments {
  [_]?: never
}
