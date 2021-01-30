import * as AMQP from './amqp'
import * as Apis from './api'
import { ApiDef, ApiLeaves } from './api/types'
import * as Bindings from './bindings'
import * as Events from './event'
import { EventLeaves } from './event/types'
import { flowId, newFlow } from './helpers'
import { Flow, PFlow } from './types/path'

export type Domain = ReturnType<typeof domain>
export type ApiLookupOpts = {}
export type ApiRespondOpts = {}
export type ApiCallOpts = {
  timeout?: number
}
export type ApiEnqueueOpts = {
  delaySecs?: number
}
export const domain = <DomainDef extends object>(_: { domain: string }) => {
  const { domain } = _

  const asserts = Promise.all([
    AMQP.assertDomainExchange({ domain }),
    AMQP.assertDomainDelayedQueueAndExchange({ domain }),
  ])

  const api = <ApiPath extends ApiLeaves<DomainDef>>(api: ApiPath) => {
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
      async call<Ret>(
        caller: ApiCaller<Ret>,
        pflow?: PFlow,
        opts?: ApiCallOpts
      ): Promise<Ret> {
        const flow = newFlow(pflow)
        return caller(getFn(flow, { timeout: opts?.timeout }), flow)
      },
      async enqueue(
        enqueuer: ApiCaller<any>,
        pflow?: PFlow,
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

  const event = <EventPath extends EventLeaves<DomainDef>>(
    eventPath: EventPath
  ) => {
    const emit = Events.emit<DomainDef>(domain)(eventPath)
    return { emit }
  }

  const routes = <Route extends string>() => {
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

  return {
    api,
    event,
    routes,
  }
}
