import { _any, deep_partial } from '@moodle/lib/types'
import { Modules } from '../domain'
import { layers } from './mod'
import { PrimarySession } from './primary-session'

export interface CoreContext {
  mod: Modules
  primarySession: PrimarySession
}

export interface WorkerContext {
  core: CoreContext
  env: _any
}

export interface EventContext {
  worker: WorkerContext
}
// export type execution_context = {
//   forward: Modules
//   push: Modules
//   primarySession: PrimarySession
//   permissions: concrete
// }
export type layer_contexts = {
  pri: CoreContext
  sec: WorkerContext
  evt: EventContext
}

export type concrete<_layer extends keyof layer_contexts> = deep_partial<{
  [ns in keyof Modules]: {
    [mod_name in keyof Modules[ns]]: {
      [version in keyof Modules[ns][mod_name]]: {
        [l in _layer]: Modules[ns][mod_name][version] extends infer _layers
          ? _layers extends layers
            ? _layers[_layer]
            : never
          : never
      }
    }
  }
}>

export type factory<_layer extends keyof layer_contexts> = (
  ctx: layer_contexts[_layer],
) => concrete<_layer>
