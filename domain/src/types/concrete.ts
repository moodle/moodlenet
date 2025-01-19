import { domainFsDirectories } from '@moodle/lib-domain-fs'
import { any_function, date_time_string, deep_partial, path } from '@moodle/lib-types'
import { MoodleDomain } from '../moodle-domain'
import { primarySession } from './access-session'
import { Logger } from './log'

export type moodleModuleName = keyof moodlePrimary & keyof moodleSecondary & keyof moodleEvent & keyof moodleService
export type moodlePrimary = MoodleDomain['primary']
export type moodleService = MoodleDomain['service']
export type moodleSecondary = MoodleDomain['secondary']
export type moodleEvent = MoodleDomain['event']

type ctxId = string
export type domainLayer = 'primary' | 'service' | 'secondary' | 'background' | 'watch' | 'event'

// type p_track<ctx_type extends context_types> = {
//   track: { [req in ctx_type]?: ctx_id }
// }
// type track<ctx_type extends context_types> = {
//   track: { [req in ctx_type]: ctx_id }
// }

//CHECK: probably, any inter-module access should be only by primary
export type contextModuleAccess = {
  secondary: {
    [modName in keyof moodleSecondary]: Pick<moodleSecondary[modName], 'query' | 'service'> //CHECK: remove service if service below enough (must move `(crypto|userAccount).secondary.services` to '(crypto|userAccount).services`)
  }
  service: moodleService
}

export type ctxTrack = {
  layer: domainLayer
  moduleName: moodleModuleName
  ctxId: ctxId
}

export type contextInfo = {
  id: ctxId
  domain: string
  now: date_time_string
  track?: ctxTrack // CHECK: track and from may be unified ?
  from?: path //      CHECK: track and from may be unified ?
}

export type baseContext = contextInfo & {
  // TODO: to keep serializable context separate
  // info: contextInfo
  // TODO: though `primaryContext.primarySession` should be serilaized too 🤔
  log: Logger
  mod: contextModuleAccess //CHECK: should access to other-modules secondary be available in primaryContext ?
}

export type modSecondary<moduleName extends moodleModuleName = never> = Pick<moodleSecondary, moduleName>[moduleName]
export type modEmitter<moduleName extends moodleModuleName = never> = Pick<moodleEvent, moduleName>[moduleName]

type coreContext<moduleName extends moodleModuleName = never> = baseContext & {
  //write: modSecondary<moduleName>['write']
  write: {
    [endpoint in keyof modSecondary<moduleName>['write']]: modSecondary<moduleName>['write'][endpoint] extends infer write_endpoint_fn
      ? write_endpoint_fn extends any_function
        ? Parameters<write_endpoint_fn>[0] extends infer payload
          ? (payload: undefined extends payload ? void : payload /* , enqueueOpts */) => Promise<void>
          : never
        : never
      : never
  }
  emit: modEmitter<moduleName>
  enqueue: enqueueMessage
}
export type backgroundContext<moduleName extends moodleModuleName = never> = coreContext<moduleName>

export type primaryContext<moduleName extends moodleModuleName = never> = coreContext<moduleName> & {
  forward: moodlePrimary
  primarySession: primarySession
  moduleName: moodleModuleName
} // & p_track<'primary'>

export type serviceContext<moduleName extends moodleModuleName = never> = coreContext<moduleName>

export type eventContext<moduleName extends moodleModuleName = never> = coreContext<moduleName> // & track<'primary'> | track<'background'>

export type watchContext<moduleName extends moodleModuleName = never> = coreContext<moduleName> & {
  sync: modSecondary<moduleName>['sync']
} // & track<'primary'> | track<'secondary'>

export type secondaryContext = baseContext & {
  domainFsDirectories: domainFsDirectories
  // emit: modEmitter<moodleModuleName>?
}
// & { query: all secondary reads }?
//   | track<'primary'>
//   | track<'secondary'>
//   | track<'event'>
//   | track<'watch'>

export type secondaryProvider = (secondaryContext: secondaryContext) => secondaryAdapter
export type secondaryAdapter = deep_partial<moodleSecondary>

export type moduleCore<moduleName extends moodleModuleName = never> = {
  moduleName: moduleName
  primary(primaryContext: primaryContext<moduleName>): {
    [channel in keyof modPrimary<moduleName>[moduleName]]: () => Promise<modPrimary<moduleName>[moduleName][channel]>
  }
  service: (serviceContext: serviceContext<moduleName>) => modService<moduleName>[moduleName]
  event?: (eventContext: eventContext<moduleName>) => eventListener
  watch?: (watchContext: watchContext<moduleName>) => watcher
  startBackgroundProcess?: (bgContext: backgroundContext<moduleName>) => void | Promise<void>
}

export type modPrimary<moduleName extends moodleModuleName = never> = {
  [_ in moduleName]: moodlePrimary[moduleName]
}

export type modService<moduleName extends moodleModuleName = never> = {
  [_ in moduleName]: moodleService[moduleName]
}

export type eventListener = deep_partial<moodleEvent>
export type watcher = deep_partial<{
  result: {
    secondary: layerWatchResult<'secondary'>
    primary: layerWatchResult<'primary'>
  }
  enqueue: {
    secondary: layerWatchEnqueue<'secondary'>
    primary: layerWatchEnqueue<'primary'>
  }
}>

//REVIEW: try to free it from rigid layer/channel/endpoint structure (?)
export type layerWatchResult<layer extends 'secondary' | 'primary'> = {
  [layer_mod in keyof MoodleDomain[layer]]: {
    [channel in keyof MoodleDomain[layer][layer_mod]]: {
      [endpoint in keyof MoodleDomain[layer][layer_mod][channel]]: MoodleDomain[layer][layer_mod][channel][endpoint] extends infer endpoint_fn
        ? endpoint_fn extends any_function
          ? ([outcome, payload]: [Awaited<ReturnType<endpoint_fn>>, Parameters<endpoint_fn>[0]]) => Promise<void>
          : never
        : never
    }
  }
}
export type layerWatchEnqueue<layer extends 'secondary' | 'primary'> = {
  [layer_mod in keyof MoodleDomain[layer]]: {
    [channel in keyof MoodleDomain[layer][layer_mod]]: {
      [endpoint in keyof MoodleDomain[layer][layer_mod][channel]]: MoodleDomain[layer][layer_mod][channel][endpoint] extends infer endpoint_fn
        ? endpoint_fn extends any_function
          ? (payload: Parameters<endpoint_fn>[0]) => Promise<void>
          : never
        : never
    }
  }
}

export type enqueueMessage = <endpoint_fn extends any_function>(
  endpoint_fn: endpoint_fn,
  payload: Parameters<endpoint_fn>[0],
  // enqueueOpts
) => Promise<void>
