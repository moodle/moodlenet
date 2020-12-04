import * as AMQP from '../amqp'
import * as API from '../api/types'
import * as Event from '../event/types'
import { getApiResponderQName } from '../api'

export type Binding = {
  unbind(): void
  apiBindRoute: string
  routedTopic: string
}
export type BindApiArgs<
  Domain,
  EventPath extends Event.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>
> = {
  event: EventPath
  api: Event.LookupType<Domain, EventPath> extends API.ApiReq<Domain, ApiPath> ? ApiPath : never
  flowKey?: string
  opts?: {
    apiQueue?: AMQP.DomainQueueOpts
  }
}
export const bindApi = <Domain>(domain: string) => <
  EventPath extends Event.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>
>(
  _: BindApiArgs<Domain, EventPath, ApiPath>
): Binding => {
  const { api, event, flowKey = '*', opts } = _
  const apiBindRoute = getApiBindRoute(api)
  const routedTopic = `${event}.${apiBindRoute}.${flowKey}`
  const apiQname = getApiResponderQName<Domain>(api)

  const unbindPromise = AMQP.assertQ({ name: apiQname, opts: opts?.apiQueue }).then(() => {
    return AMQP.bindQ({ topic: routedTopic, domain, name: apiQname })
  }) // TODO: should catch and process.exit ?

  const unbind = () => unbindPromise.then(({ unbind }) => unbind())
  return {
    unbind,
    apiBindRoute,
    routedTopic,
  }
}

// export const unbindApi = <Domain>(domain: string) => async <
//   EventPath extends Event.EventLeaves<Domain>,
//   ApiPath extends API.ApiLeaves<Domain>
// >(_: {
//   event: EventPath
//   api: Event.LookupType<Domain, EventPath> extends API.ApiReq<Domain, ApiPath> ? ApiPath : never
//   flowKey?: string
// }) => {
//   const { api, event, flowKey = '*' } = _
//   const apiBindRoute = getApiBindRoute(api)
//   const routedTopic = `${event}.${apiBindRoute}.${flowKey}`
//   const apiQname = getApiResponderQName<Domain>(api)

//   return AMQP.unbindQ({ topic: routedTopic, domain, name: apiQname })
// }

export const getApiBindRoute = (apiPath: string) => apiPath.replace(/\./g, '/')
