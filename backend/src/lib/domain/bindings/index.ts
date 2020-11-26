import * as AMQP from '../amqp'
import * as API from '../api/types'
import * as Event from '../event/types'
import { getApiResponderQName } from '../api'

export const bindApi = <Domain>(domain: string) => async <
  EventPath extends Event.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>
>(_: {
  event: EventPath
  api: Event.LookupType<Domain, EventPath> extends API.ApiReq<Domain, ApiPath> ? ApiPath : never
  flowKey?: string
}) => {
  const { api, event, flowKey = '*' } = _
  const apiBindRoute = getApiBindRoute(api)
  const routedTopic = `${event}.${apiBindRoute}.${flowKey}`
  const apiQname = getApiResponderQName<Domain>(api)

  const { unbind } = await AMQP.bindQ({ topic: routedTopic, domain, name: apiQname })
  return {
    unbind,
    apiBindRoute,
    routedTopic,
  }
}

export const unbindApi = <Domain>(domain: string) => async <
  EventPath extends Event.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>
>(_: {
  event: EventPath
  api: Event.LookupType<Domain, EventPath> extends API.ApiReq<Domain, ApiPath> ? ApiPath : never
  flowKey?: string
}) => {
  const { api, event, flowKey = '*' } = _
  const apiBindRoute = getApiBindRoute(api)
  const routedTopic = `${event}.${apiBindRoute}.${flowKey}`
  const apiQname = getApiResponderQName<Domain>(api)

  return AMQP.unbindQ({ topic: routedTopic, domain, name: apiQname })
}

export const getApiBindRoute = (apiPath: string) => apiPath.replace(/\./g, '/')
