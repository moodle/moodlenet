import * as AMQP from '../amqp'
import { getApiResponderQName } from '../api'
import * as API from '../api/types'
import * as Event from '../event/types'

export type Binding = {
  unbind(): void
  route: string
  topic: string
  api: string
  event: string
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
  const topic = `${event}.${route}.*`
  const apiQname = getApiResponderQName<Domain>(api)
  const exchange = AMQP.getDomainExchangeName(domain)

  const { unbind } = await AMQP.bindQ({ topic, exchange, name: apiQname })

  return {
    unbind,
    route,
    topic,
    api,
    event,
  }
}

export const getApiBindRoute = (apiPath: string) => apiPath.replace(/\./g, '/')
