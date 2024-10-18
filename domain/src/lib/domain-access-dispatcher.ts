import { generateUlid } from '@moodle/lib-id-gen'
import { _any } from '@moodle/lib-types'
import { merge } from 'lodash'
import { inspect } from 'util'
import { moodleModuleName } from '../moodle-domain'
import {
  backgroundContext,
  moduleCore,
  ctx_track,
  domainAccess,
  domainLayer,
  domainMsg,
  eventContext,
  loggerProvider,
  messageDispatcher,
  primary,
  primaryContext,
  primarySession,
  secondaryAdapter,
  secondaryContext,
  secondaryProvider,
  watchContext,
} from '../types'
import { createMoodleDomainProxy } from './domain-proxy'
export type configuration = {
  domain: string
  moduleCores: moduleCore<_any>[]
  secondaryProviders: secondaryProvider[]
  start_background_processes: boolean
  loggerProvider: loggerProvider
}
export type domainAccessDispatcherProviderDeps = configuration & {
  feedbackDispatcher: messageDispatcher
}

export function mergeSecondaryAdapters(adapters: secondaryAdapter[]): secondaryAdapter {
  return merge({}, ...adapters)
}
export function mergePrimaryImplementations(primaryImpls: primary<_any>[]): primary<_any> {
  return merge({}, ...primaryImpls)
}

export function provideDomainAccessDispatcher({
  domain,
  moduleCores,
  secondaryProviders,
  loggerProvider,
  start_background_processes,
  feedbackDispatcher,
}: domainAccessDispatcherProviderDeps): messageDispatcher {
  return async ({ domainAccess: current_domainAccess }) => {
    const [currentDomainAccessLayer, currentDomainAccessModuleName] = current_domainAccess.endpoint as [
      domainLayer | undefined,
      moodleModuleName | undefined,
    ]
    if (!(currentDomainAccessLayer && currentDomainAccessModuleName)) {
      throw TypeError(`endpoint layer and module is required`)
    }
    if (currentDomainAccessLayer === 'primary' && !current_domainAccess.primarySession) {
      throw TypeError(`primary layer requires primarySession`)
    }

    const currentDomainAccessContext = await generateAccessContext(
      currentDomainAccessLayer,
      currentDomainAccessModuleName,
      current_domainAccess,
    )
    const { log } = currentDomainAccessContext
    // mainLogger('debug', 'messageDispatcher:', {
    //   endpoint: current_domainAccess.endpoint,
    //   ctx_track: current_domainAccess.ctx_track,
    //   from: current_domainAccess.from,
    //   primarySessionId: current_domainAccess.primarySession?.id,
    //   accessContextId: currentDomainAccessContext.id,
    // })
    if (start_background_processes) {
      await Promise.all(
        moduleCores.map(async ({ modName, startBackgroundProcess }) => {
          if (!startBackgroundProcess) {
            return
          }
          const backgroundContext = await generateAccessContext('background', modName as moodleModuleName)
          return startBackgroundProcess(backgroundContext)
        }),
      )
    }

    if (currentDomainAccessLayer === 'primary') {
      const domainPrimary = mergePrimaryImplementations(
        moduleCores.map(({ modName, primary }) => {
          return modName === currentDomainAccessModuleName
            ? {
                [modName]: primary(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const primaryResult = await dispatchDomainMsg({ primary: domainPrimary }, current_domainAccess)
      triggerWatchers({ result: primaryResult })

      return primaryResult
    } else if (currentDomainAccessLayer === 'event') {
      Promise.allSettled(
        moduleCores.map(async ({ modName, event }) => {
          if (!event) {
            return
          }
          const eventAccessContext = await generateAccessContext('event', modName as moodleModuleName, current_domainAccess)
          const eventListener = event(eventAccessContext)
          return dispatchDomainMsg({ event: eventListener }, current_domainAccess, { graceful: true })
        }),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    } else if (currentDomainAccessLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        secondaryProviders.map(provideSecondary => provideSecondary(currentDomainAccessContext)),
      )

      const secondaryResult = await dispatchDomainMsg({ secondary }, current_domainAccess)
      triggerWatchers({ result: secondaryResult })
      return secondaryResult
    } else {
      log('error', { current_domainAccess })
      throw TypeError(`cannot handle layer [${currentDomainAccessLayer}] here`)
    }

    async function dispatchDomainMsg(
      impl: _any, // primaryImpl | secondaryAdapter | eventImpl | watchImpl
      domainMsg: domainMsg,
      opts?: { graceful?: boolean },
    ) {
      // mainLogger('debug', `dispatchMsg`, domainMsg.endpoint, domainMsg.payload)

      const endpoint = domainMsg.endpoint.reduce((currProp, currPathSegment) => currProp?.[currPathSegment], impl)

      if (typeof endpoint !== 'function') {
        if (opts?.graceful) {
          return
        }
        const err_msg = `
      NOT IMPLEMENTED: ${domainMsg.endpoint.join('/')}
      FOUND: ${inspect(endpoint, { colors: true, showHidden: true, depth: 10 })}
      `
        throw TypeError(err_msg)
      }
      return endpoint(domainMsg.payload)
    }
    function triggerWatchers({ result }: { result: _any }) {
      return Promise.allSettled(
        moduleCores.map(async ({ modName, watch }) => {
          if (!watch) {
            return
          }
          const watchContext = await generateAccessContext('watch', modName, current_domainAccess)
          const watcher = watch(watchContext)
          // mainLogger('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
          return dispatchDomainMsg(
            watcher,
            {
              ...current_domainAccess,
              payload: [result, current_domainAccess.payload],
            },
            { graceful: true },
          )
        }),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    }
  }

  async function generateAccessContext<modName extends moodleModuleName, layer extends domainLayer>(
    contextLayer: layer,
    moduleName: modName,
    current_domainAccess?: domainAccess,
  ) {
    const id = await generateUlid()

    const moodleDomainProxy = createMoodleDomainProxy({
      ctrl({ domainMsg: { endpoint, payload } }) {
        const ctx_track: ctx_track = {
          ctxId: id,
          layer: contextLayer,
        }
        return feedbackDispatcher({
          domainAccess: {
            endpoint,
            payload,
            ctx_track,
            from: current_domainAccess?.endpoint,
            primarySession: current_domainAccess?.primarySession,
          },
        })
      },
    })

    const track = current_domainAccess?.ctx_track
    const from = current_domainAccess?.from
    const endpoint = current_domainAccess?.endpoint
    const primarySessionId = current_domainAccess?.primarySession?.id
    const log = loggerProvider({ domain, id, from, ctx_track: track, contextLayer, endpoint, primarySessionId })
    const accessContext: backgroundContext<modName> &
      primaryContext<modName> &
      eventContext<modName> &
      watchContext<modName> &
      secondaryContext = {
      domain,
      id,
      track,
      from,
      session: current_domainAccess?.primarySession as primarySession, // HACK : could be undefined - but this is a one-fit-all-context ;)
      emit: moodleDomainProxy.event,
      forward: moodleDomainProxy.primary,
      mod: moodleDomainProxy.secondary,
      write: moodleDomainProxy.secondary[moduleName].write,
      queue: moodleDomainProxy.secondary[moduleName].queue,
      sync: moodleDomainProxy.secondary[moduleName].sync,
      log,
    }
    return accessContext
  }
}
