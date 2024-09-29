import { _any, deep_partial, deep_required } from '@moodle/lib-types'
import { merge } from 'lodash'
import { any_endpoint, domain_msg, layers, mod_id } from './mod'
import { access_session } from './access-session'

export interface CoreProcessContext {
  sys_call: concrete<'pri' | 'sec' | 'evt'>
}

export type core_process = (ctx: CoreProcessContext) => stop_core_process
export type stop_core_process = void | (() => unknown)

export interface CoreContext {
  sys_call: concrete<'pri' | 'sec'>
  forward: concrete<'pri'>
  access_session: access_session
  pri_domain_msg: domain_msg
}

export type EvtContext = {
  sys_call: concrete<'pri' | 'sec'>
  forward: concrete<'pri'>
  access_session: access_session
  evt_domain_msg: domain_msg
  // sec_domain_msg: domain_msg
  // pri_domain_msg: domain_msg
}

export interface SecondaryContext {
  invoked_by: mod_id
  emit: concrete<'evt'>
  sys_call: concrete<'sec'>
  access_session: access_session
  sec_domain_msg: domain_msg
  // pri_domain_msg: domain_msg
}

export type layer_contexts = {
  pri: CoreContext
  evt: EvtContext
  sec: SecondaryContext
}

export function composeDomains(...impls: impl<_any>[]): impl<_any> {
  return merge({}, ...impls)
}

type impl<_layer extends keyof layer_contexts> = deep_partial<concrete<_layer>>

export type core_factory = factory<'pri' | 'evt'>
export type core_impl = impl<'pri' | 'evt'>
export type sec_factory = factory<'sec'>
export type sec_impl = impl<'sec'>
type factory<_layer extends keyof layer_contexts> = (
  ctx: layer_contexts[_layer],
) => impl<_layer> | Promise<impl<_layer>>

export declare const domain: deep_required<impl<keyof layer_contexts>>
export type payload_of<_ extends any_endpoint> = Parameters<_>[0]
export type reply_of<_ extends any_endpoint> = Awaited<ReturnType<_>>
