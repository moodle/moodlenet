import { generateUlid } from '@moodle/lib-id-gen'
import { __redact__, _any, date_time_string } from '@moodle/lib-types'
import { merge } from 'lodash'
import {
  backgroundContext,
  ctxTrack,
  domainAccess,
  domainLayer,
  domainMsg,
  eventContext,
  Logger,
  loggerProvider,
  binderDispatcher,
  modPrimary,
  moduleCore,
  moodleModuleName,
  moodlePrimary,
  moodleSecondary,
  primaryContext,
  primarySession,
  secondaryAdapter,
  secondaryContext,
  secondaryProvider,
  watchContext,
} from '../types'
import { createMoodleDomainProxy } from './domain-proxy'
import { domainFsDirectories } from '@moodle/lib-domain-fs'
export type configuration = {
  domain: string
  moduleCores: moduleCore<_any>[]
  secondaryProviders: secondaryProvider[]
  start_background_processes: boolean
  loggerProvider: loggerProvider
  domainFsDirectories: domainFsDirectories
}
export type domainAccessDispatcherProviderDeps = configuration & {
  feedbackDispatcher: binderDispatcher
}

export function mergeSecondaryAdapters(adapters: secondaryAdapter[]): moodleSecondary {
  return merge({}, ...adapters)
}
export function mergePrimaryImplementations(primaryImpls: modPrimary<_any>[]): moodlePrimary {
  return merge({}, ...primaryImpls)
}

export function provideDomainAccessDispatcher({
  domain,
  moduleCores,
  secondaryProviders,
  loggerProvider,
  start_background_processes,
  feedbackDispatcher,
  domainFsDirectories,
}: domainAccessDispatcherProviderDeps): binderDispatcher {
  return async ({ domainAccess: current_domainAccess }) => {
    // console.dir(current_domainAccess.endpoint)
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
      domainFsDirectories,
      current_domainAccess,
    )
    const { log } = currentDomainAccessContext
    // mainLogger('debug', 'binderDispatcher:', {
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
          const backgroundContext = await generateAccessContext(
            'background',
            modName as moodleModuleName,
            domainFsDirectories,
          )
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
      const primaryResult = await dispatchDomainMsg(
        { primary: domainPrimary },
        current_domainAccess,
        currentDomainAccessContext.log,
      )
      triggerWatchers({ result: primaryResult })

      return primaryResult
    } else if (currentDomainAccessLayer === 'service') {
      const domainService = mergePrimaryImplementations(
        moduleCores.map(({ modName, service }) => {
          return modName === currentDomainAccessModuleName
            ? {
                [modName]: service(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const serviceResult = await dispatchDomainMsg(
        { service: domainService },
        current_domainAccess,
        currentDomainAccessContext.log,
      )
      triggerWatchers({ result: serviceResult })

      return serviceResult
    } else if (currentDomainAccessLayer === 'event') {
      Promise.allSettled(
        moduleCores.map(async ({ modName, event }) => {
          if (!event) {
            return
          }
          const eventAccessContext = await generateAccessContext(
            'event',
            modName as moodleModuleName,
            domainFsDirectories,
            current_domainAccess,
          )
          const eventListener = event(eventAccessContext)
          return dispatchDomainMsg({ event: eventListener }, current_domainAccess, eventAccessContext.log, {
            graceful: true,
          })
        }),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    } else if (currentDomainAccessLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        secondaryProviders.map(provideSecondary => provideSecondary(currentDomainAccessContext)),
      )

      const secondaryResult = await dispatchDomainMsg({ secondary }, current_domainAccess, currentDomainAccessContext.log)
      triggerWatchers({ result: secondaryResult })
      return secondaryResult
    } else {
      log('error', { current_domainAccess })
      throw TypeError(`cannot handle layer [${currentDomainAccessLayer}] here`)
    }

    async function dispatchDomainMsg(
      impl: _any, // primaryImpl | secondaryAdapter | eventImpl | watchImpl
      domainMsg: domainMsg,
      logMessage: Logger,
      opts?: { graceful?: boolean },
    ) {
      // mainLogger('debug', `dispatchMsg`, domainMsg.endpoint, domainMsg.payload)
      // const endpoint = domainMsg.endpoint.reduce((currProp, currPathSegment) => currProp?.[currPathSegment], impl)
      const endpoint = await (async (_domainMsg, _impl) => {
        const [layer, moduleName, channelName, endpointName] = _domainMsg.endpoint
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const channelProp = _impl[layer!]?.[moduleName!]?.[channelName!]
        if (!channelProp) {
          return
        }
        if (layer === 'primary') {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return (await channelProp())?.[endpointName!]
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return channelProp?.[endpointName!]
      })(domainMsg, impl)

      if (typeof endpoint !== 'function') {
        const err_msg = `
      NOT IMPLEMENTED: ${domainMsg.endpoint.join('/')}
      FOUND: ${endpoint}
      `
        if (opts?.graceful) {
          return
        }
        logMessage('warn', err_msg, endpoint)

        throw TypeError(err_msg)
      }
      const endpointResponse = await endpoint(domainMsg.payload).catch((error: unknown) => {
        logMessage('error', domainMsg.endpoint.join('/'), { error })
        throw error
      })
      //logMessage('debug', ':)', { payload: domainMsg.payload ?? null, response: endpointResponse })
      return endpointResponse
    }
    function triggerWatchers({ result }: { result: _any }) {
      return Promise.allSettled(
        moduleCores.map(async ({ modName, watch }) => {
          if (!watch) {
            return
          }
          const watchContext = await generateAccessContext('watch', modName, domainFsDirectories, current_domainAccess)
          const watcher = watch(watchContext)
          // mainLogger('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
          return dispatchDomainMsg(
            watcher,
            {
              ...current_domainAccess,
              payload: [result, current_domainAccess.payload],
            },
            watchContext.log,
            { graceful: true },
          )
        }),
      ).catch(error => log('critical', { domainAccess: current_domainAccess }, error))
    }
  }

  async function generateAccessContext<modName extends moodleModuleName, layer extends domainLayer>(
    contextLayer: layer,
    moduleName: modName,
    domainFsDirectories: domainFsDirectories,
    current_domainAccess?: domainAccess,
  ) {
    const id = generateUlid({ onDate: date_time_string('now') })

    const moodleDomainProxy = createMoodleDomainProxy({
      ctrl({ domainMsg: { endpoint, payload } }) {
        const ctx_track: ctxTrack = {
          ctxId: id,
          module: moduleName,
          layer: contextLayer,
        }
        return feedbackDispatcher({
          domainAccess: {
            endpoint,
            payload,
            callerContext: ctx_track,
            originEndpoint: current_domainAccess?.endpoint,
            primarySession: current_domainAccess?.primarySession,
          },
        })
      },
    })

    const callerContext = current_domainAccess?.callerContext
    const originEndpoint = current_domainAccess?.originEndpoint
    const endpoint = current_domainAccess?.endpoint
    const primarySessionId = current_domainAccess?.primarySession?.id
    const log: Logger = (level, ...args) =>
      loggerProvider({
        domain,
        id,
        moduleName,
        originEndpoint,
        callerContext,
        contextLayer,
        endpoint,
        primarySessionId,
      })(level, ...args.map(__redact__))
    const accessContext: backgroundContext<modName> &
      primaryContext<modName> &
      eventContext<modName> &
      watchContext<modName> &
      secondaryContext = {
      id,
      domain,
      moduleName,
      domainFsDirectories,
      now: date_time_string('now'),
      track: callerContext,
      from: originEndpoint,
      session: current_domainAccess?.primarySession as primarySession, // HACK : could be undefined - but this is a one-fit-all-context ;)
      emit: moodleDomainProxy.event,
      forward: moodleDomainProxy.primary,
      mod: moodleDomainProxy,
      write: moodleDomainProxy.secondary[moduleName].write,
      sync: moodleDomainProxy.secondary[moduleName].sync,
      log,
    }
    return accessContext
  }
}

