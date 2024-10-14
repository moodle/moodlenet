import { generateUlid } from '@moodle/lib-id-gen'
import { _any } from '@moodle/lib-types'
import { merge } from 'lodash'
import { inspect } from 'util'
import { moodleModuleName } from '../moodle-domain'
import {
  coreContext,
  coreProvider,
  ctx_track,
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

    const accessContext: coreContext<typeof moduleName> &
      primaryContext &
      eventContext &
      watchContext<typeof moduleName> &
      secondaryContext = {
      id: currentContextId,
      session: current_domainAccess.primarySession as primarySession,
      track: current_domainAccess.ctx_track,
      from: current_domainAccess.from,
      emit: moodleDomainProxy.event,
      forward: moodleDomainProxy.primary,
      mod: moodleDomainProxy.secondary,
      write: moodleDomainProxy.secondary[moduleName].write,
      queue: moodleDomainProxy.secondary[moduleName].queue,
      sync: moodleDomainProxy.secondary[moduleName].sync,
    }

    if (start_background_processes) {
      await Promise.all(
        coreProviders.map(provideCore => {
          return Promise.all(
            Object.values(provideCore(accessContext)).map(moduleCore => {
              return moduleCore.startBackgroundProcess?.()
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
      return dispatchMsg(primary, current_domainAccess)
    } else if (currentLayer === 'event') {
      Promise.allSettled(
        coreProviders
          .map(provideCore => {
            return Object.entries(provideCore(accessContext)).reduce(
              (acc, [modName, moduleCore]) => {
                acc[modName] = moduleCore.event?.(accessContext)
                return acc
              },
              {} as _any,
            )
          })
          .map(
            maybe_eventImpl =>
              maybe_eventImpl &&
              dispatchMsg(maybe_eventImpl, current_domainAccess, { graceful: true }),
          ),
      ).catch(log('critical', { domainAccess: current_domainAccess }))
    } else if (currentLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        secondaryProviders.map(provideSecondary => provideSecondary(accessContext)),
      )

      const secondaryResult = await dispatchMsg(secondary, current_domainAccess)
      Promise.allSettled(
        coreProviders
          .map(provideCore => {
            return Object.entries(provideCore(accessContext)).reduce(
              (acc, [modName, moduleCore]) => {
                acc[modName] = moduleCore.watch?.(accessContext)
                return acc
              },
              {} as _any,
            )
          })
          .map(
            maybe_watchImpl =>
              maybe_watchImpl &&
              dispatchMsg(
                maybe_watchImpl,
                {
                  ...current_domainAccess,
                  payload: [secondaryResult, current_domainAccess.payload],
                },
                { graceful: true },
              ),
          ),
      ).catch(log('critical', { domainAccess: current_domainAccess }))

      return secondaryResult
    } else {
      log('error')({ current_domainAccess })
      throw TypeError(`cannot handle layer [${currentLayer}] here`)
    }

    async function dispatchMsg(
      impl: _any, // primaryImpl | secondaryAdapter | eventImpl | watchImpl
      domainMsg: domainMsg,
      opts?: { graceful?: boolean },
    ) {
      domainMsg
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
  }
}
