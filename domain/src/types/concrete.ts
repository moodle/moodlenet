import { any_function, deep_partial, path } from '@moodle/lib-types'
import {
  MoodleDomain,
  moodleEvent,
  moodleModuleName,
  moodlePrimary,
  moodleSecondary,
} from '../moodle-domain'
import { primarySession } from './access-session'
import { domainLogger } from './log'

type ctx_id = string
export type domainLayer = 'primary' | 'secondary' | 'background' | 'watch' | 'event'


// type p_track<ctx_type extends context_types> = {
//   track: { [req in ctx_type]?: ctx_id }
// }
// type track<ctx_type extends context_types> = {
//   track: { [req in ctx_type]: ctx_id }
// }

export type bootstrapContext = {
  domain: string
  log: domainLogger
}

export type contextModuleAccess = {
  [modName in keyof moodleSecondary]: Pick<moodleSecondary[modName], 'query' | 'service'>
}

export type ctx_track = {
  type: domainLayer
  id: ctx_id
}
export type baseContext = {
  id: ctx_id
  track?: ctx_track
  from?: path
  mod: contextModuleAccess
}

export type modSecondary<mod extends moodleModuleName> = Pick<moodleSecondary, mod>[mod]
export type modEmitter<mod extends moodleModuleName> = Pick<moodleEvent, mod>[mod]
export type coreContext<mod extends moodleModuleName> = baseContext & {
  write: modSecondary<mod>['write']
  queue: modSecondary<mod>['queue']
  emit: modEmitter<mod>
}

export type primaryContext = {
  forward: moodlePrimary
  session: primarySession
} // & p_track<'primary'>

export type eventContext = baseContext // & track<'primary'> | track<'background'>

export type watchContext<mod extends moodleModuleName> = baseContext & {
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

export type secondaryBootstrap = (bootstrapContext: bootstrapContext) => secondaryProvider
export type secondaryProvider = (secondaryContext: secondaryContext) => secondaryAdapter
export type secondaryAdapter = deep_partial<moodleSecondary>

export type coreProviderObject<mod extends moodleModuleName> = {
  modName: mod
  provider: coreProvider<mod>
}

export type coreBootstrap<mod extends moodleModuleName> = (
  bootstrapContext: bootstrapContext,
) => coreProviderObject<mod>
export type coreProvider<mod extends moodleModuleName> = (
  coreContext: coreContext<mod>,
) => domainCore<mod>
export type domainCore<mod extends moodleModuleName> = {
  primary: (primaryContext: primaryContext) => primaryImpl<mod>[mod]
  event?: (eventContext: eventContext) => eventListenerImpl
  watch?: (watchContext: watchContext<mod>) => watchImpl
  startBackgroundProcess?: () => void | Promise<void>
}

export type primaryImpl<mod extends moodleModuleName> = {
  [_ in mod]: moodlePrimary[mod]
}
export type eventListenerImpl = deep_partial<moodleEvent>
export type watchImpl = deep_partial<watcher>

export type watcher = {
  secondary: layerWatcher<'secondary'>
  primary: layerWatcher<'primary'>
}

//TODO: try to free it from rigid layer/channel/endpoint structure
export type layerWatcher<layer extends 'secondary' | 'primary'> = {
  [layer_mod in keyof MoodleDomain[layer]]: {
    [channel in keyof MoodleDomain[layer][layer_mod]]: {
      [endpoint in keyof MoodleDomain[layer][layer_mod][channel]]: MoodleDomain[layer][layer_mod][channel][endpoint] extends infer endpoint_fn
        ? endpoint_fn extends any_function
          ? ([response, payload]: [
              Awaited<ReturnType<endpoint_fn>>,
              Parameters<endpoint_fn>[0],
            ]) => Promise<unknown>
          : never
        : never
    }
  }
}
