import { generateUlid } from '@moodle/lib-id-gen'
import { _any } from '@moodle/lib-types'
import { merge } from 'lodash'
import { inspect } from 'util'
import { moodleModuleName } from '../moodle-domain'
import {
  coreContext,
  coreProvider,
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
  coreProviders: coreProvider<_any>[]
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
  coreProviders,
  feedbackDispatcher,
  log,
  start_background_processes,
}: messageDispatcherProviderDeps): messageDispatcher {
  return async ({ domainAccess: current_domainAccess }) => {
    const [currentLayer, moduleName] = current_domainAccess.endpoint as [
      domainLayer | undefined,
      moodleModuleName | undefined,
    ]
    if (!(currentLayer && moduleName)) {
      throw TypeError(`endpoint layer and module is required`)
    }
    if (currentLayer === 'primary' && !current_domainAccess.primarySession) {
      throw TypeError(`primary layer requires primarySession`)
    }

    const accessContext = await generateAccessContext(
      currentLayer,
      moduleName,
      current_domainAccess,
    )

    log('debug', 'messageDispatcher', {
      domainAccess: {
        endpoint: current_domainAccess.endpoint,
        ctx_track: current_domainAccess.ctx_track,
        from: current_domainAccess.from,
        priSessId: current_domainAccess.primarySession?.id,
      },
      accessContext: {
        currentLayer,
        moduleName,
        id: accessContext.id,
      },
    })

    if (start_background_processes) {
      await Promise.all(
        coreProviders.map(provideCore => {
          return Promise.all(
            // HACK: Object.keys(provideCore(accessContext)) is called only to  modulename from coreProvider ! ^^'
            Object.keys(provideCore(accessContext)).map(async moduleName => {
              const moduleCore = provideCore(
                await generateAccessContext('background', moduleName as moodleModuleName),
              )[moduleName]
              return moduleCore?.startBackgroundProcess?.()
            }),
          )
        }),
      )
    }

    if (currentLayer === 'primary') {
      const primary = mergePrimaryImplementations(
        coreProviders.map(provideCore => {
          return Object.entries(provideCore(accessContext)).reduce((acc, [modName, moduleCore]) => {
            acc[modName] = moduleCore.primary(accessContext)
            return acc
          }, {} as _any)
        }),
      )
      const primaryResult = dispatchMsg({ primary }, current_domainAccess)
      triggerWatchers({ result: primaryResult })

      return primaryResult
    } else if (currentLayer === 'event') {
      Promise.allSettled(
        coreProviders
          .map(provideCore =>
            Object.values(provideCore(accessContext)).map(moduleCore =>
              moduleCore.event?.(accessContext),
            ),
          )
          .map(
            maybe_eventImpl =>
              maybe_eventImpl &&
              dispatchMsg({ event: maybe_eventImpl }, current_domainAccess, { graceful: true }),
          ),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    } else if (currentLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        secondaryProviders.map(provideSecondary => provideSecondary(accessContext)),
      )

      const secondaryResult = await dispatchMsg({ secondary }, current_domainAccess)
      triggerWatchers({ result: secondaryResult })
      return secondaryResult
    } else {
      log('error', { current_domainAccess })
      throw TypeError(`cannot handle layer [${currentLayer}] here`)
    }

    async function dispatchMsg(
      impl: _any, // primaryImpl | secondaryAdapter | eventImpl | watchImpl
      domainMsg: domainMsg,
      opts?: { graceful?: boolean },
    ) {
      log('debug', `dispatchMsg`, domainMsg.endpoint, domainMsg.payload)

      const endpoint = domainMsg.endpoint.reduce(
        (currProp, currPathSegment) => currProp?.[currPathSegment],
        impl,
      )

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
        coreProviders.map(provideCore =>
          Promise.allSettled(
            Object.values(provideCore(accessContext))
              .map(moduleCore => moduleCore.watch?.(accessContext))
              .map(maybe_watchImpl => {
                log('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
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
          ),
        ),
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
        return feedbackDispatcher({ domainAccess: { endpoint, payload, ctx_track } })
      },
    })

    const accessContext: coreContext<modName> &
      primaryContext &
      eventContext &
      watchContext<modName> &
      secondaryContext = {
      id: currentContextId,
      session: current_domainAccess?.primarySession as primarySession, // HACK : could be undefined -
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
