import * as AMQP from './amqp'
import * as Apis from './api'
import { ApiDef, ApiLeaves } from './api/types'
import * as Bindings from './bindings'
import * as Events from './event'
import { EventLeaves } from './event/types'
import { flowId, newFlow } from './helpers'
import { Flow, PFlow } from './types/path'

export type ApiLookupOpts = {}
export type ApiRespondOpts = {}
export type ApiCallOpts = {
  timeout?: number
}
export type ApiEnqueueOpts = {
  delaySecs?: number
}
const domain = 'MoodleNet'

const asserts = Promise.all([
  AMQP.assertDomainExchange({ domain }),
  AMQP.assertDomainDelayedQueueAndExchange({ domain }),
])

export const api = <DomainDef>(pflow?: PFlow) => <
  ApiPath extends ApiLeaves<DomainDef>
>(
  api: ApiPath
) => {
  type ApiFn = ApiDef<DomainDef, ApiPath>
  type ApiCaller<Ret> = (apiFn: ApiFn, flow: Flow) => Ret
  //  type AfterCallRet<Ret> = Ret extends Promise<any> ? Ret : Promise<Ret>
  const getFn = (flow: Flow, opts?: Apis.CallOpts) =>
    Apis.call<DomainDef>(domain)({
      api,
      flow,
      opts,
    })

  return {
    async call<Ret>(caller: ApiCaller<Ret>, opts?: ApiCallOpts): Promise<Ret> {
      const flow = newFlow(pflow)
      return caller(getFn(flow, { timeout: opts?.timeout }), flow)
    },
    async enqueue(
      enqueuer: ApiCaller<any>,
      opts?: ApiEnqueueOpts
    ): Promise<void> {
      const flow = newFlow(pflow)
      return enqueuer(
        getFn(flow, { delaySecs: opts?.delaySecs, justEnqueue: true }),
        flow
      ).then(() => {})
    },
    async respond(handler: ApiFn, _opts?: ApiRespondOpts) {
      await asserts
      return Apis.respond<DomainDef>(domain)({
        api,
        handler,
        opts: {},
      })
    },
  }
}

export const event = <DomainDef>(flow: Flow) => <
  EventPath extends EventLeaves<DomainDef>
>(
  eventPath: EventPath
) => {
  const emit = Events.emit<DomainDef, EventPath>(domain, flow, eventPath)
  return { emit }
}

export const routes = <DomainDef, Route extends string>() => {
  const bind = async <
    EventPath extends EventLeaves<DomainDef>,
    ApiPath extends ApiLeaves<DomainDef>
  >(
    _: Bindings.BindApiArgs<DomainDef, EventPath, ApiPath, Route | '*'>
  ) => {
    await asserts
    return Bindings.bindApi<DomainDef>(domain)(_)
  }

  const setRoute = (flow: Flow, route: Route): Flow => [route, flowId(flow)]

  const flow = (route: Route, id?: string) => newFlow([route, id])

  return {
    bind,
    flow,
    setRoute,
  }
}
