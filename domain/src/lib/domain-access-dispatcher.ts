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
export type domainAccessDispatcherProviderDeps = {
  configuration: configuration
  loopbackDispatcher: binderDispatcher
}

export function mergeSecondaryAdapters(adapters: secondaryAdapter[]): moodleSecondary {
  return merge({}, ...adapters)
}
export function mergeCoreImplementations(primaryImpls: modPrimary<_any>[]): moodlePrimary {
  return merge({}, ...primaryImpls)
}

export function provideDomainAccessDispatcher({
  configuration,
  loopbackDispatcher,
}: domainAccessDispatcherProviderDeps): binderDispatcher {
  return async function thisDispatcher({ domainAccess: currentDomainAccess }) {
    // console.dir(current_domainAccess.endpoint)
    const [currentDomainAccessLayer, currentDomainAccessModuleName] = currentDomainAccess.endpoint as [
      domainLayer | undefined,
      moodleModuleName | undefined,
    ]
    if (!(currentDomainAccessLayer && currentDomainAccessModuleName)) {
      throw TypeError(`endpoint layer and module is required`)
    }
    if (currentDomainAccessLayer === 'primary' && !currentDomainAccess.primarySession) {
      throw TypeError(`primary layer requires primarySession`)
    }

    const currentDomainAccessContext = await generateAccessContext(
      currentDomainAccessLayer,
      currentDomainAccessModuleName,
      configuration.domainFsDirectories,
      currentDomainAccess,
    )
    const { log } = currentDomainAccessContext
    // mainLogger('debug', 'binderDispatcher:', {
    //   endpoint: current_domainAccess.endpoint,
    //   ctx_track: current_domainAccess.ctx_track,
    //   from: current_domainAccess.from,
    //   primarySessionId: current_domainAccess.primarySession?.id,
    //   accessContextId: currentDomainAccessContext.id,
    // })
    if (configuration.start_background_processes) {
      await Promise.all(
        configuration.moduleCores.map(async ({ modName, startBackgroundProcess }) => {
          if (!startBackgroundProcess) {
            return
          }
          const backgroundContext = await generateAccessContext(
            'background',
            modName as moodleModuleName,
            configuration.domainFsDirectories,
          )
          return startBackgroundProcess(backgroundContext)
        }),
      )
    }

    if (currentDomainAccessLayer === 'primary') {
      const domainPrimary = mergeCoreImplementations(
        configuration.moduleCores.map(({ modName, primary }) => {
          return modName === currentDomainAccessModuleName
            ? {
                [modName]: primary(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const primaryResult = await dispatchDomainMsg(
        { primary: domainPrimary },
        currentDomainAccess,
        currentDomainAccessContext.log,
      )
      triggerWatchers({ result: primaryResult })

      return primaryResult
    } else if (currentDomainAccessLayer === 'service') {
      const domainService = mergeCoreImplementations(
        configuration.moduleCores.map(({ modName, service }) => {
          return modName === currentDomainAccessModuleName
            ? {
                [modName]: service(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const serviceResult = await dispatchDomainMsg(
        { service: domainService },
        currentDomainAccess,
        currentDomainAccessContext.log,
      )
      triggerWatchers({ result: serviceResult })

      return serviceResult
    } else if (currentDomainAccessLayer === 'event') {
      Promise.allSettled(
        configuration.moduleCores.map(async ({ modName, event }) => {
          if (!event) {
            return
          }
          const eventAccessContext = await generateAccessContext(
            'event',
            modName as moodleModuleName,
            configuration.domainFsDirectories,
            currentDomainAccess,
          )
          const eventListener = event(eventAccessContext)
          return dispatchDomainMsg({ event: eventListener }, currentDomainAccess, eventAccessContext.log, {
            graceful: true,
          })
        }),
      ).catch(error => log('critical', { domainAccess: currentDomainAccess }, error))
    } else if (currentDomainAccessLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        configuration.secondaryProviders.map(provideSecondary => provideSecondary(currentDomainAccessContext)),
      )

      const secondaryResult = await dispatchDomainMsg({ secondary }, currentDomainAccess, currentDomainAccessContext.log)
      triggerWatchers({ result: secondaryResult })
      return secondaryResult
    } else {
      log('error', { current_domainAccess: currentDomainAccess })
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
        configuration.moduleCores.map(async ({ modName, watch }) => {
          if (!watch) {
            return
          }
          const watchContext = await generateAccessContext(
            'watch',
            modName,
            configuration.domainFsDirectories,
            currentDomainAccess,
          )
          const watcher = watch(watchContext)
          // mainLogger('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
          return dispatchDomainMsg(
            watcher,
            {
              ...currentDomainAccess,
              payload: [result, currentDomainAccess.payload],
            },
            watchContext.log,
            { graceful: true },
          ).catch(error => watchContext.log('critical', { error, stack: error.stack }))
        }),
      ) //.catch(error => log('critical', { domainAccess: currentDomainAccess }, error))
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
          const loopbackDomainAccess: domainAccess = {
            endpoint,
            payload,
            callerContext: ctx_track,
            originEndpoint: current_domainAccess?.endpoint,
            primarySession: current_domainAccess?.primarySession,
          }
          const [loopbackDomainAccessLayer] = endpoint as [domainLayer | undefined]
          const dispatcher =
            loopbackDomainAccessLayer === 'event' ||
            loopbackDomainAccessLayer === 'watch' ||
            loopbackDomainAccessLayer === 'primary' ||
            loopbackDomainAccessLayer === 'service'
              ? thisDispatcher
              : loopbackDispatcher
          return dispatcher({ domainAccess: loopbackDomainAccess })
        },
      })

      const callerContext = current_domainAccess?.callerContext
      const originEndpoint = current_domainAccess?.originEndpoint
      const endpoint = current_domainAccess?.endpoint
      const primarySessionId = current_domainAccess?.primarySession?.id
      const log: Logger = (level, ...args) =>
        configuration.loggerProvider({
          domain: configuration.domain,
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
        domain: configuration.domain,
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
}

