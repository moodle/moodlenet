import * as Apis from './api'
import * as AMQP from './amqp'
import { ApiLeaves } from './api/types'
import * as Bindings from './bindings'
import * as Events from './event'
import { EventLeaves } from './event/types'
import { newFlow } from './helpers'
import { Flow } from './types/path'

export type Domain = ReturnType<typeof domain>

export const domain = <DomainDef extends object>(_: { domain: string }) => {
  const { domain } = _

  const asserts = Promise.all([
    AMQP.assertDomainExchange({ domain }),
    AMQP.assertDomainDelayedQueueAndExchange({ domain }),
  ])

  const callApi = async <ApiPath extends ApiLeaves<DomainDef>>(
    _: Apis.ApiCallArgs<DomainDef, ApiPath>
  ) => {
    await asserts
    return Apis.call<DomainDef>(domain)(_)
  }
  const emitEvent = Events.emit<DomainDef>(domain)

  const respondApi = async <ApiPath extends ApiLeaves<DomainDef>>(
    _: Apis.RespondApiArgs<DomainDef, ApiPath>
  ) => {
    const { api, handler, opts } = _
    await asserts

    return Apis.respond<DomainDef>(domain)({
      api,
      handler,
      opts,
    })
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

    const setRoute = (flow: Flow, route: Route): Flow => ({
      ...flow,
      _route: route,
    })

    const flow = (_route: Route, _key?: string) => newFlow({ _route, _key })

    return {
      bind,
      flow,
      setRoute,
    }
  }

  return {
    routes,
    callApi,
    respondApi,
    emitEvent,
  }
}
