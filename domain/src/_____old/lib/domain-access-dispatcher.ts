import { domainFsDirectories } from '@moodle/lib-domain-fs'
import { generateUlid } from '@moodle/lib-id-gen'
import { redact__, any_, d_u, unreachable_never } from '@moodle/lib-types'
import assert from 'assert'
import { merge } from 'lodash'
import {
  backgroundContext,
  binderDispatcher,
  ctxTrack,
  domainAccess,
  domainLayer,
  eventContext,
  Logger,
  loggerProvider,
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
import { createMoodleDomainProxy, getProxyFnPath } from './domain-proxy'
export type configuration = {
  domain: string
  moduleCores: moduleCore<any_>[]
  secondaryProviders: secondaryProvider[]
  loggerProvider: loggerProvider
  domainFsDirectories: domainFsDirectories
}

export function mergeSecondaryAdapters(adapters: secondaryAdapter[]): moodleSecondary {
  return merge({}, ...adapters)
}
export function mergeCoreImplementations(primaryImpls: modPrimary<any_>[]): moodlePrimary {
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
      backgroundContext.log.info(`starting [${moduleName}] background process`)
      return Promise.resolve(startBackgroundProcess(backgroundContext)).catch(error => {
        backgroundContext.log.critical({ error, stack: error.stack })
        throw error
      })
    }),
  )
  return results
}
export async function accessDomain({
  configuration,
  loopbackDispatcher,
  domainAccess,
}: {
  configuration: configuration
  loopbackDispatcher: binderDispatcher
  domainAccess: domainAccess
}) {
  const { domainFsDirectories, loggerProvider, domain } = configuration
  // console.dir(current_domainAccess.endpoint)
  const domainLayer = domainAccess.endpoint[0] as domainLayer | undefined
  if (domainLayer === 'background') {
    throw TypeError(`won't handle background layer here`)
  }
  const moduleName = domainAccess.endpoint[domainLayer === 'watch' ? 3 : 1] as moodleModuleName | undefined
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
    currentDomainAccess: domainAccess,
    domain,
    loggerProvider,
    loopbackDispatcher,
  })
  // const { log } = currentDomainAccessContext
  // domainAccess.endpoint[0] === 'watch' &&
  //   domainAccess.endpoint.join(',').includes('useTempFileAsNewResourceDraftAsset') &&
  //   log.debug('***', { domainAccess })
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
    const primaryResult = await dispatchDomainMsg({ primary: domainPrimary }, domainAccess, currentDomainAccessContext.log, {
      optionalDispatch: false,
      watchable: true,
    })

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
    const serviceResult = await dispatchDomainMsg({ service: domainService }, domainAccess, currentDomainAccessContext.log, {
      optionalDispatch: false,
      watchable: false,
    })

    return serviceResult
  } else if (domainLayer === 'secondary') {
    const secondary = mergeSecondaryAdapters(
      configuration.secondaryProviders.map(provideSecondary => provideSecondary(currentDomainAccessContext)),
    )

    const secondaryResult = await dispatchDomainMsg({ secondary }, domainAccess, currentDomainAccessContext.log, {
      optionalDispatch: false,
      watchable: true,
    })
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
          currentDomainAccess: domainAccess,
          domain,
          loggerProvider,
          loopbackDispatcher,
        })
        const eventListener = event(eventAccessContext)
        const [_, ...restEndpoint] = domainAccess.endpoint
        return dispatchDomainMsg(eventListener, { ...domainAccess, endpoint: restEndpoint }, eventAccessContext.log, {
          watchable: false,
          optionalDispatch: true,
        })
      }),
    ) //.catch(error => log.critical({ domainAccess }, error))
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
          currentDomainAccess: domainAccess,
          domain,
          loggerProvider,
          loopbackDispatcher,
        })
        const watcher = watch(watchAccessContext)
        // mainLogger('debug', `triggerWatchers`, current_domainAccess.endpoint, maybe_watchImpl)
        const [_, watchType, ...restEndpoint] = domainAccess.endpoint

        const watcherLayer = watchType === 'result' || watchType === 'enqueue' ? watcher[watchType] : undefined
        if (!watcherLayer) {
          return
        }
        return dispatchDomainMsg(watcherLayer, { ...domainAccess, endpoint: restEndpoint }, watchAccessContext.log, {
          watchable: false,
          optionalDispatch: true,
        }) //.catch(error => watchAccessContext.log.critical({ error, stack: error.stack }))
      }),
    ) //.catch(error => log.critical({ domainAccess: currentDomainAccess }, error))
  } else {
    unreachable_never(domainLayer, `unknown handle layer [${domainLayer}]`)
  }

  async function dispatchDomainMsg(
    impl: any_, // primaryImpl | secondaryAdapter | eventImpl | watchImpl
    domainAccess: domainAccess,
    logMessage: Logger,
    opts: { watchable: boolean; optionalDispatch: boolean },
  ) {
    // mainLogger('debug', `dispatchMsg`, domainMsg.endpoint, domainMsg.payload)
    // const endpoint = domainMsg.endpoint.reduce((currProp, currPathSegment) => currProp?.[currPathSegment], impl)
    const [layer, moduleName, channelName, endpointName] = domainAccess.endpoint
    const endpointPromise = (async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const channelProp = impl[layer!]?.[moduleName!]?.[channelName!]
      if (!channelProp) {
        return
      }
      if (layer === 'primary') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (await channelProp())?.[endpointName!]
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return channelProp?.[endpointName!]
    })()
    endpointPromise.catch((error: unknown) => {
      logMessage('error', 'Error while getting domainAccess endpoint', { error, domainAccess })
      throw error
    })
    const endpoint = await endpointPromise
    if (typeof endpoint !== 'function') {
      const err_msg = `
      NOT IMPLEMENTED: ${domainAccess.endpoint.join('/')}
      FOUND: ${endpoint}
      `
      if (opts.optionalDispatch) {
        return
      }
      logMessage('warn', err_msg, endpoint)

      throw TypeError(err_msg)
    }
    // domainMsg.endpoint.join('/').includes('nges') &&
    // logMessage('debug', '😉 ===========================> payload', domainMsg.payload ?? 'NONE')
    const endpointResultPromise = endpoint(domainAccess.payload)
    endpointResultPromise.then((endpointResult: unknown) => {
      if (!opts.watchable) {
        return
      }
      loopbackWatch(loopbackDispatcher, {
        type: 'result',
        domainAccess,
        result: endpointResult,
      })
    })

    // domainMsg.endpoint.join('/').includes('nges') &&
    // logMessage('debug', '😉 ===========================> outcome', endpointOutcome ?? 'NONE')

    return endpointResultPromise
  }
}

async function generateAccessContext<moduleName extends moodleModuleName, layer extends domainLayer>({
  contextLayer,
  domain,
  domainFsDirectories,
  loggerProvider,
  moduleName,
  currentDomainAccess,
  loopbackDispatcher,
}: {
  contextLayer: layer
  moduleName: moduleName
  domainFsDirectories: domainFsDirectories
  currentDomainAccess?: domainAccess
  loggerProvider: loggerProvider
  domain: string
  loopbackDispatcher: binderDispatcher
}) {
  const id = generateUlid({ onDate: new Date().toISOString() })

  function getLoopbackProxy(enqueue?: boolean | undefined /* | asyncOptions */) {
    return createMoodleDomainProxy({
      async ctrl({ domainMsg: { endpoint, payload } }) {
        const ctx_track: ctxTrack = {
          ctxId: id,
          moduleName,
          layer: contextLayer,
        }
        const loopbackDomainAccess: domainAccess = {
          domain,
          endpoint,
          payload,
          callerContext: ctx_track,
          originEndpoint: currentDomainAccess?.endpoint,
          primarySession: currentDomainAccess?.primarySession,
          enqueue,
        }

        const result = await loopbackDispatcher({ domainAccess: loopbackDomainAccess })
        if (enqueue) {
          loopbackWatch(loopbackDispatcher, {
            type: 'enqueue',
            domainAccess: loopbackDomainAccess,
          })
          return
        }
        return result
      },
    })
  }
  const syncProxy = getLoopbackProxy()
  const asyncProxy = getLoopbackProxy(true /*asyncOptions */)

  const callerContext = currentDomainAccess?.callerContext
  const originEndpoint = currentDomainAccess?.originEndpoint
  const endpoint = currentDomainAccess?.endpoint
  const enqueue = currentDomainAccess?.enqueue
  const primarySessionId = currentDomainAccess?.primarySession?.id
  const log: Logger = (level, ...args) =>
    loggerProvider({
      domain,
      id,
      moduleName,
      originEndpoint,
      callerContext,
      contextLayer,
      enqueue,
      endpoint,
      primarySessionId,
    })(level, ...args.map(redact__))
  const accessContext: backgroundContext<moduleName> &
    primaryContext<moduleName> &
    eventContext<moduleName> &
    watchContext<moduleName> &
    secondaryContext = {
    id,
    domain,
    moduleName,
    domainFsDirectories,
    now: new Date().toISOString(),
    track: callerContext,
    from: originEndpoint,
    primarySession: currentDomainAccess?.primarySession as primarySession, // HACK : could be undefined - but this is a one-fit-all-context 😉
    emit: syncProxy.event,
    forward: syncProxy.primary,
    mod: syncProxy,
    // write: syncProxy.secondary[moduleName].write as any_,
    write: asyncProxy.secondary[moduleName].write as any_,
    sync: syncProxy.secondary[moduleName].sync,
    log,
    async enqueue(endopint_fn_proxy, payload /*, asyncOptions = true*/) {
      assert(currentDomainAccess, `ctx.async: needs a currentDomainAccess to enqueue a message`)
      const queueEndpoint = getProxyFnPath(endopint_fn_proxy)
      const fn = queueEndpoint.reduce((currProp, currPathSegment) => currProp?.[currPathSegment], asyncProxy as any_)
      assert(typeof fn === 'function', `ctx.async: endpoint[${queueEndpoint.join('.')}] fn is not a function`)
      await fn(payload)
      // console.log({ queueEndpoint, qwatchEndpoint, payload })
    },
  }
  return accessContext
}
function loopbackWatch(
  loopbackDispatcher: binderDispatcher,
  watching: { domainAccess: domainAccess } & d_u<{ result: { result: any_ }; enqueue: unknown }, 'type'>,
) {
  const watchEndpoint = ['watch', watching.type, ...watching.domainAccess.endpoint]

  // REVIEW: shall watchers be able to watch really everything? it gets very chatty !
  // REVIEW:   maybe watch only `secondary.write|queue|service.*`, `primary.*.*`
  // REVIEW:   avoiding at least `query` & `sync` (`sync` definitely not needed)

  const watchDomainAccess: domainAccess = {
    ...watching.domainAccess,
    endpoint: watchEndpoint,
    payload: watching.type === 'enqueue' ? watching.domainAccess.payload : [watching.result, watching.domainAccess.payload],
    enqueue: false, // maybe true by default
  }

  return loopbackDispatcher({ domainAccess: watchDomainAccess })
}
