import * as AMQP from '../amqp'
import { getApiResponderQName } from '../api'
import * as API from '../api/types'
import * as Event from '../event/types'

export type Binding = {
  unbind(): void
  route: string
  routedTopic: string
}
export type BindApiArgs<
  Domain,
  EventPath extends Event.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>,
  Route extends string
> = {
  event: EventPath
  api: Event.LookupType<Domain, EventPath> extends API.ApiReq<Domain, ApiPath> ? ApiPath : never
  route: Route
}
export const bindApi = <Domain>(domain: string) => async <
  EventPath extends Event.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>,
  Route extends string
>(
  _: BindApiArgs<Domain, EventPath, ApiPath, Route>
): Promise<Binding> => {
  const { api, event, route } = _
  const routedTopic = `${event}.${route}.*`
  const apiQname = getApiResponderQName<Domain>(api)

  const { unbind } = await AMQP.bindQ({ topic: routedTopic, domain, name: apiQname })

  return {
    unbind,
    route,
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
