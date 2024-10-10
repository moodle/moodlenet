import { deep_partial } from '@moodle/lib-types'
import { merge } from 'lodash'
import { ddd } from '../domain'
import { access_session } from './access-session'
import { any_endpoint, domain_endpoint, secondary_endpoint } from './mod'

export interface CoreProcessContext<domain extends ddd> {
  sys_call: domain
}

export type core_process<domain extends ddd> = (
  ctx: CoreProcessContext<domain>,
) => stop_core_process
export type stop_core_process = void | (() => unknown)

export type sys_call<domain extends ddd> = Pick<domain, 'primary' | 'secondary'>
export type forward<domain extends ddd> = Pick<domain, 'primary'>
export type emit<domain extends ddd> = Pick<domain, 'event'>

// interface Logger {
//   (_: _any): void
//   log(_: _any): void
// }

export interface CoreContext<domain extends ddd> {
  sys_call: sys_call<domain>
  forward: forward<domain>
  access_session: access_session
  // log: Logger
}

export type EvtContext<domain extends ddd> = {
  sys_call: sys_call<domain>
  forward: forward<domain>
  access_session: access_session
  // log: Logger
}

export interface SecondaryContext<domain extends ddd> {
  invoked_by: domain_endpoint
  sys_call: sys_call<domain>
  emit: emit<domain>
  access_session: access_session
  // log: Logger
}

export function composeDomains<domain extends ddd>(
  impls: deep_partial<domain>[],
): deep_partial<domain> {
  return merge({}, ...impls)
}
//NOTE: strict Pick<> brakes deep_partial in composeDomains. don't knwo why.
export type core_impl<domain extends ddd> = Pick<
  deep_partial<domain>,
  'primary' | 'event' | 'watch'
>
export type secondary_adapter<domain extends ddd> = Pick<deep_partial<domain>, 'secondary'>
// export type core_impl<domain extends ddd> = deep_partial<Pick<domain,'primary' | 'event'>>
// export type secondary_adapter<domain extends ddd> = deep_partial<Pick<domain,'secondary'>>

export type core_factory<domain extends ddd> = (ctx: CoreContext<domain>) => core_impl<domain>


export type secondary_factory<domain extends ddd> = (
  ctx: SecondaryContext<domain>,
) => secondary_adapter<domain>

// export type payload_of<_ extends any_endpoint> = Parameters<_>[0]
// export type reply_of<_ extends any_endpoint> = Awaited<ReturnType<_>>
