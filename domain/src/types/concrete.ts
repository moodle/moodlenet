import { _any, deep_partial } from '@moodle/lib/types'
import { Modules } from '../domain'
import { layers } from './mod'
import { PrimarySession } from './primary-session'
import { merge } from 'lodash'

export interface CoreContext {
  forward: concrete<'pri'>
  worker: concrete<'sec'>
  primarySession: PrimarySession
}

export interface WorkerContext {
  primarySession: PrimarySession
  emit: Modules // concrete<'evt'>
}

// export type execution_context = {
//   forward: Modules
//   push: Modules
//   primarySession: PrimarySession
//   permissions: concrete
// }
export type layer_contexts = {
  pri: CoreContext
  evt: CoreContext
  sec: WorkerContext
}

export type concrete<_layer extends keyof layers> = {
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
}
export function composeImpl(...impls: impl<_any>[]): Modules {
  return merge({}, ...impls)
}

export type impl<_layer extends keyof layer_contexts> = deep_partial<concrete<_layer>>

export type factory<_layer extends keyof layer_contexts> = (
  ctx: layer_contexts[_layer],
) => impl<_layer>
