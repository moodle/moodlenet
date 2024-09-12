import { _any, deep_partial } from '@moodle/lib-types'
import { merge } from 'lodash'
import { Modules } from '../domain'
import { layers, mod_id } from './mod'
import { primary_session } from './primary-session'

export interface CoreProcessContext {
  worker: concrete<'sec'>
}

export type core_process = (ctx: CoreProcessContext) => stop_core_process
export type stop_core_process = void | (() => unknown)

export interface CoreContext {
  // sysCall: concrete<'pri'>
  forward: concrete<'pri'>
  worker: concrete<'sec'>
  primarySession: primary_session
}

export type EvtContext = CoreContext

export interface WorkerContext {
  primarySession: primary_session
  core_mod_id: mod_id
  emit: concrete<'evt'>
}

// export type execution_context = {
//   forward: Modules
//   push: Modules
//   primarySession: primary_session
//   permissions: concrete
// }

export type layer_contexts = {
  pri: CoreContext
  evt: EvtContext
  sec: WorkerContext
}

export type concrete<_layer extends keyof layers> = {
  [ns in keyof Modules]: {
    [mod_name in keyof Modules[ns]]: {
      [version in keyof Modules[ns][mod_name]]: {
        [_this_layer in _layer]: Modules[ns][mod_name][version] extends infer _layers
          ? _layers extends layers
            ? _layers[_this_layer]
            : never
          : never
      }
    }
  }
}
export function composeImpl(...impls: impl<_any>[]): impl<_any> {
  return merge({}, ...impls)
}

type impl<_layer extends keyof layer_contexts> = deep_partial<concrete<_layer>>

export type core_factory = factory<'pri' | 'evt'>
export type core_impl = impl<'pri' | 'evt'>
export type sec_factory = factory<'sec'>
export type sec_impl = impl<'sec'>
type factory<_layer extends keyof layer_contexts> = (ctx: layer_contexts[_layer]) => impl<_layer>