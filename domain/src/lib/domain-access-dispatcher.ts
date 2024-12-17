import { generateUlid } from '@moodle/lib-id-gen'
import { __redact__, _any, date_time_string, unreachable_never } from '@moodle/lib-types'
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
  loggerProvider: loggerProvider
  domainFsDirectories: domainFsDirectories
}

export function mergeSecondaryAdapters(adapters: secondaryAdapter[]): moodleSecondary {
  return merge({}, ...adapters)
}
export function mergeCoreImplementations(primaryImpls: modPrimary<_any>[]): moodlePrimary {
  return merge({}, ...primaryImpls)
}
export async function startBackgroundProcesses({
  configuration,
  loopbackDispatcher,
}: {
  loopbackDispatcher: binderDispatcher
  configuration: configuration
}) {
  const { domain, domainFsDirectories, loggerProvider } = configuration
  const results = await Promise.all(
    configuration.moduleCores.map(async ({ moduleName, startBackgroundProcess }) => {
      if (!startBackgroundProcess) {
        return
      }
      const backgroundContext = await generateAccessContext({
        contextLayer: 'background',
        domain,
        loggerProvider,
        loopbackDispatcher,
        moduleName,
        domainFsDirectories,
      })
      backgroundContext.log('info', `starting [${moduleName}] background process`)
      const result = await Promise.resolve(startBackgroundProcess(backgroundContext)).catch(error => {
        backgroundContext.log('critical', { error, stack: error.stack })
        throw error
      })
      return result
    }),
  )
  return results
}
export function provideDomainAccessDispatcher({
  configuration,
  loopbackDispatcher,
}: {
  configuration: configuration
  loopbackDispatcher: binderDispatcher
}): binderDispatcher {
  const { domainFsDirectories, loggerProvider, domain } = configuration
  return async ({ domainAccess }) => {
    // console.dir(current_domainAccess.endpoint)
    const domainLayer = domainAccess.endpoint[0] as domainLayer | undefined
    if (domainLayer === 'background') {
      throw TypeError(`cannot handle layer [${domainLayer}] here`)
    }
    const moduleName = domainAccess.endpoint[domainLayer === 'watch' ? 2 : 1] as moodleModuleName | undefined
    if (!(domainLayer && moduleName)) {
      throw TypeError(`endpoint layer and module is required`)
    }
    if (domainLayer === 'primary' && !domainAccess.primarySession) {
      throw TypeError(`primary layer requires primarySession`)
    }

    const currentDomainAccessContext = await generateAccessContext({
      contextLayer: domainLayer,
      moduleName: moduleName,
      domainFsDirectories,
      domainAccess,
      domain,
      loggerProvider,
      loopbackDispatcher,
    })
    const { log } = currentDomainAccessContext
    // mainLogger('debug', 'binderDispatcher:', {
    //   endpoint: current_domainAccess.endpoint,
    //   ctx_track: current_domainAccess.ctx_track,
    //   from: current_domainAccess.from,
    //   primarySessionId: current_domainAccess.primarySession?.id,
    //   accessContextId: currentDomainAccessContext.id,
    // })

    if (domainLayer === 'primary') {
      const domainPrimary = mergeCoreImplementations(
        configuration.moduleCores.map(({ moduleName: currModName, primary }) => {
          return currModName === moduleName
            ? {
                [moduleName]: primary(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const primaryResult = await dispatchDomainMsg({ primary: domainPrimary }, domainAccess, currentDomainAccessContext.log)
      loopbackWatch({ result: primaryResult })

      return primaryResult
    } else if (domainLayer === 'service') {
      const domainService = mergeCoreImplementations(
        configuration.moduleCores.map(({ moduleName: currModName, service }) => {
          return currModName === moduleName
            ? {
                [moduleName]: service(currentDomainAccessContext),
              }
            : {}
        }),
      )
      const serviceResult = await dispatchDomainMsg({ service: domainService }, domainAccess, currentDomainAccessContext.log)
      loopbackWatch({ result: serviceResult })

      return serviceResult
    } else if (domainLayer === 'secondary') {
      const secondary = mergeSecondaryAdapters(
        configuration.secondaryProviders.map(provideSecondary => provideSecondary(currentDomainAccessContext)),
      )

      const secondaryResult = await dispatchDomainMsg({ secondary }, domainAccess, currentDomainAccessContext.log)
      loopbackWatch({ result: secondaryResult })
      return secondaryResult
    } else if (domainLayer === 'event') {
      Promise.allSettled(
        configuration.moduleCores.map(async ({ moduleName, event }) => {
          if (!event) {
            return
          }
          const eventAccessContext = await generateAccessContext({
            contextLayer: 'event',
            moduleName,
            domainFsDirectories,
            domainAccess,
            domain,
            loggerProvider,
            loopbackDispatcher,
          })
          const eventListener = event(eventAccessContext)
          const [_, ...restEndpoint] = domainAccess.endpoint
          return dispatchDomainMsg(eventListener, { ...domainAccess, endpoint: restEndpoint }, eventAccessContext.log, {
            graceful: true,
          })
        }),
      ).catch(error => log('critical', { domainAccess }, error))
    } else if (domainLayer === 'watch') {
      return Promise.allSettled(
        configuration.moduleCores.map(async ({ moduleName, watch }) => {
          if (!watch) {
            return
          }
          const watchAccessContext = await generateAccessContext({
            contextLayer: 'watch',
            moduleName,
            domainFsDirectories,
            domainAccess,
            domain,
            loggerProvider,
            loopbackDispatcher,
          })
          const watcher = watch(watchAccessContext)
          // mainLogger('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
          const [_, ...restEndpoint] = domainAccess.endpoint
          return dispatchDomainMsg(watcher, { ...domainAccess, endpoint: restEndpoint }, watchAccessContext.log, {
            graceful: true,
          }).catch(error => watchAccessContext.log('critical', { error, stack: error.stack }))
        }),
      ) //.catch(error => log('critical', { domainAccess: currentDomainAccess }, error))
    } else {
      unreachable_never(domainLayer, `unknown handle layer [${domainLayer}]`)
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
      // logMessage('debug', '===========================> payload', domainMsg.payload ?? 'NONE')
      const endpointResponse = await endpoint(domainMsg.payload).catch((error: unknown) => {
        logMessage('error', domainMsg.endpoint.join('/'), { error })
        throw error
      })
      //logMessage('debug', '===========================> response', endpointResponse ?? 'NONE')
      return endpointResponse
    }

    function loopbackWatch({ result }: { result: _any }) {
      // REVIEW: shall watchers be able to watch really everything? it gets very chatty !
      // REVIEW:   maybe watch only `secondary.write|queue|service.*`, `primary.*.*`
      // REVIEW:   avoiding at least `query` & `sync` (`sync` definitely not needed)

      const watchDomainAccess: domainAccess = {
        ...domainAccess,
        endpoint: ['watch', ...domainAccess.endpoint],
        payload: [result, domainAccess.payload],
      }

      loopbackDispatcher({ domainAccess: watchDomainAccess })
    }
  }
}

async function generateAccessContext<moduleName extends moodleModuleName, layer extends domainLayer>({
  contextLayer,
  domain,
  domainFsDirectories,
  loggerProvider,
 moduleName,
  domainAccess,
  loopbackDispatcher,
}: {
  contextLayer: layer
  moduleName: moduleName
  domainFsDirectories: domainFsDirectories
  domainAccess?: domainAccess
  loggerProvider: loggerProvider
  domain: string
  loopbackDispatcher: binderDispatcher
}) {
  const id = generateUlid({ onDate: date_time_string('now') })

  const moodleDomainProxy = createMoodleDomainProxy({
    ctrl({ domainMsg: { endpoint, payload } }) {
      const ctx_track: ctxTrack = {
        ctxId: id,
        moduleName: moduleName,
        layer: contextLayer,
      }
      const loopbackDomainAccess: domainAccess = {
        domain,
        endpoint,
        payload,
        callerContext: ctx_track,
        originEndpoint: domainAccess?.endpoint,
        primarySession: domainAccess?.primarySession,
      }
      return loopbackDispatcher({ domainAccess: loopbackDomainAccess })
    },
  })

  const callerContext = domainAccess?.callerContext
  const originEndpoint = domainAccess?.originEndpoint
  const endpoint = domainAccess?.endpoint
  const primarySessionId = domainAccess?.primarySession?.id
  const log: Logger = (level, ...args) =>
    loggerProvider({
      domain,
      id,
      moduleName: moduleName,
      originEndpoint,
      callerContext,
      contextLayer,
      endpoint,
      primarySessionId,
    })(level, ...args.map(__redact__))
  const accessContext: backgroundContext<moduleName> &
    primaryContext<moduleName> &
    eventContext<moduleName> &
    watchContext<moduleName> &
    secondaryContext = {
    id,
    domain,
    moduleName: moduleName,
    domainFsDirectories,
    now: date_time_string('now'),
    track: callerContext,
    from: originEndpoint,
    session: domainAccess?.primarySession as primarySession, // HACK : could be undefined - but this is a one-fit-all-context ;)
    emit: moodleDomainProxy.event,
    forward: moodleDomainProxy.primary,
    mod: moodleDomainProxy,
    write: moodleDomainProxy.secondary[moduleName].write,
    sync: moodleDomainProxy.secondary[moduleName].sync,
    log,
  }
  return accessContext
}
