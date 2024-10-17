import { generateUlid } from '@moodle/lib-id-gen'
import { _any } from '@moodle/lib-types'
import { merge } from 'lodash'
import { inspect } from 'util'
import { moodleModuleName } from '../moodle-domain'
import {
  coreContext,
  coreProviderObject,
  ctx_track,
  domainAccess,
  domainLayer,
  domainLogger,
  domainMsg,
  eventContext,
  messageDispatcher,
  primaryContext,
  primaryImpl,
  primarySession,
  secondaryAdapter,
  secondaryContext,
  secondaryProvider,
  watchContext,
} from '../types'
import { createMoodleDomainProxy } from './domain-proxy'

export type messageDispatcherProviderDeps = {
  secondaryProviders: secondaryProvider[]
  coreProviderObjects: coreProviderObject<_any>[]
  feedbackDispatcher: messageDispatcher
  log: domainLogger
  start_background_processes: boolean
}

export function mergeSecondaryAdapters(adapters: secondaryAdapter[]): secondaryAdapter {
  return merge({}, ...adapters)
}
export function mergePrimaryImplementations(primaryImpls: primaryImpl<_any>[]): primaryImpl<_any> {
  return merge({}, ...primaryImpls)
}

export function provideMessageDispatcher({
  secondaryProviders,
  coreProviderObjects,
  feedbackDispatcher,
  log,
  start_background_processes,
}: messageDispatcherProviderDeps): messageDispatcher {
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

    // log('debug', 'messageDispatcher:', {
    //   endpoint: current_domainAccess.endpoint,
    //   ctx_track: current_domainAccess.ctx_track,
    //   from: current_domainAccess.from,
    //   primarySessionId: current_domainAccess.primarySession?.id,
    //   accessContextId: currentDomainAccessContext.id,
    // })

    if (start_background_processes) {
      await Promise.all(
        coreProviderObjects.map(async ({ modName, provider }) => {
          const moduleCore = provider(await generateAccessContext('background', modName as moodleModuleName))
          return moduleCore?.startBackgroundProcess?.()
        }),
      )
    }

    if (currentDomainAccessLayer === 'primary') {
      const primary = mergePrimaryImplementations(
        coreProviderObjects.map(({ modName, provider }) => {
          return modName === currentDomainAccessModuleName
            ? {
                [modName]: provider(currentDomainAccessContext).primary(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const primaryResult = await dispatchMsg({ primary }, current_domainAccess)
      triggerWatchers({ result: primaryResult })

      return primaryResult
    } else if (currentDomainAccessLayer === 'event') {
      Promise.allSettled(
        coreProviderObjects.map(async ({ modName, provider }) => {
          const eventAccessContext = await generateAccessContext('event', modName as moodleModuleName, current_domainAccess)
          const maybe_eventImpl = provider(eventAccessContext).event?.(eventAccessContext)
          return maybe_eventImpl && dispatchMsg({ event: maybe_eventImpl }, current_domainAccess, { graceful: true })
        }),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    } else if (currentDomainAccessLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        secondaryProviders.map(provideSecondary => provideSecondary(currentDomainAccessContext)),
      )

      const secondaryResult = await dispatchMsg({ secondary }, current_domainAccess)
      triggerWatchers({ result: secondaryResult })
      return secondaryResult
    } else {
      log('error', { current_domainAccess })
      throw TypeError(`cannot handle layer [${currentDomainAccessLayer}] here`)
    }

    async function dispatchMsg(
      impl: _any, // primaryImpl | secondaryAdapter | eventImpl | watchImpl
      domainMsg: domainMsg,
      opts?: { graceful?: boolean },
    ) {
      // log('debug', `dispatchMsg`, domainMsg.endpoint, domainMsg.payload)

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
        coreProviderObjects.map(async ({ modName, provider }) => {
          const watchContext = await generateAccessContext('watch', modName, current_domainAccess)
          const maybe_watchImpl = provider(watchContext).watch?.(watchContext)
          // log('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
          return (
            maybe_watchImpl &&
            dispatchMsg(
              maybe_watchImpl,
              {
                ...current_domainAccess,
                payload: [result, current_domainAccess.payload],
              },
              { graceful: true },
            )
          )
        }),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    }
  }

  async function generateAccessContext<modName extends moodleModuleName, layer extends domainLayer>(
    currentLayer: layer,
    moduleName: modName,
    current_domainAccess?: domainAccess,
  ) {
    const currentContextId = await generateUlid()

    const moodleDomainProxy = createMoodleDomainProxy({
      ctrl({ domainMsg: { endpoint, payload } }) {
        const ctx_track: ctx_track = {
          id: currentContextId,
          type: currentLayer,
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

    const accessContext: coreContext<modName> & primaryContext & eventContext & watchContext<modName> & secondaryContext = {
      id: currentContextId,
      session: current_domainAccess?.primarySession as primarySession, // HACK : could be undefined - but this is a one-fit-all-context ;)
      track: current_domainAccess?.ctx_track,
      from: current_domainAccess?.from,
      emit: moodleDomainProxy.event,
      forward: moodleDomainProxy.primary,
      mod: moodleDomainProxy.secondary,
      write: moodleDomainProxy.secondary[moduleName].write,
      queue: moodleDomainProxy.secondary[moduleName].queue,
      sync: moodleDomainProxy.secondary[moduleName].sync,
    }
    return accessContext
  }
}
