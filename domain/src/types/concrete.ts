import { any_function, deep_partial, path } from '@moodle/lib-types'
import {
  MoodleDomain,
  moodleEvent,
  moodleModuleName,
  moodlePrimary,
  moodleSecondary,
} from '../moodle-domain'
import { primarySession } from './access-session'
import { Logger } from './log'

type ctxId = string
export type domainLayer = 'primary' | 'secondary' | 'background' | 'watch' | 'event'

// type p_track<ctx_type extends context_types> = {
//   track: { [req in ctx_type]?: ctx_id }
// }
// type track<ctx_type extends context_types> = {
//   track: { [req in ctx_type]: ctx_id }
// }

export type contextModuleAccess = {
  [modName in keyof moodleSecondary]: Pick<moodleSecondary[modName], 'query' | 'service'>
}

export type ctxTrack = {
  layer: domainLayer
  ctxId: ctxId
}
export type baseContext = {
  id: ctxId
  domain: string
  log: Logger
  mod: contextModuleAccess
  track?: ctxTrack
  from?: path
}

export type modSecondary<mod extends moodleModuleName = never> = Pick<moodleSecondary, mod>[mod]
export type modEmitter<mod extends moodleModuleName = never> = Pick<moodleEvent, mod>[mod]
type coreContext<mod extends moodleModuleName = never> = baseContext & {
  write: modSecondary<mod>['write']
  queue: modSecondary<mod>['queue'] // NOTE: maybe remove it ? e.g.: for enqueuing notification send in "userNotification" I had to use "service" because it should be reachable by any module
  emit: modEmitter<mod>
}
export type backgroundContext<mod extends moodleModuleName = never> = coreContext<mod>

export type primaryContext<mod extends moodleModuleName = never> = coreContext<mod> & {
  forward: moodlePrimary
  session: primarySession
} // & p_track<'primary'>

export type eventContext<mod extends moodleModuleName = never> = coreContext<mod> // & track<'primary'> | track<'background'>

export type watchContext<mod extends moodleModuleName = never> = coreContext<mod> & {
  sync: modSecondary<mod>['sync']
} // & track<'primary'> | track<'secondary'>

export type secondaryContext = baseContext //& {
//   emit: modEmitter<mod>
// }
// & { query: all secondary reads }?
//   | track<'primary'>
//   | track<'secondary'>
//   | track<'event'>
//   | track<'watch'>

export type secondaryProvider = (secondaryContext: secondaryContext) => secondaryAdapter
export type secondaryAdapter = deep_partial<moodleSecondary>

export type moduleCore<mod extends moodleModuleName = never> = {
  modName: mod
  primary: (primaryContext: primaryContext<mod>) => primary<mod>[mod]
  event?: (eventContext: eventContext<mod>) => eventListener
  watch?: (watchContext: watchContext<mod>) => watcher
  startBackgroundProcess?: (bgContext: backgroundContext<mod>) => void | Promise<void>
}

export type primary<mod extends moodleModuleName = never> = {
  [_ in mod]: moodlePrimary[mod]
}
export type eventListener = deep_partial<moodleEvent>
export type watcher = deep_partial<{
  secondary: layerWatcher<'secondary'>
  primary: layerWatcher<'primary'>
}>

//REVIEW: try to free it from rigid layer/channel/endpoint structure (?)
export type layerWatcher<layer extends 'secondary' | 'primary'> = {
  [layer_mod in keyof MoodleDomain[layer]]: {
    [channel in keyof MoodleDomain[layer][layer_mod]]: {
      [endpoint in keyof MoodleDomain[layer][layer_mod][channel]]: MoodleDomain[layer][layer_mod][channel][endpoint] extends infer endpoint_fn
        ? endpoint_fn extends any_function
          ? ([response, payload]: [Awaited<ReturnType<endpoint_fn>>, Parameters<endpoint_fn>[0]]) => Promise<void>
          : never
        : never
    }
  }
}
