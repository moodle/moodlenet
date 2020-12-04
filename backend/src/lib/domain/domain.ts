import * as Apis from './api'
import { ApiLeaves } from './api/types'
import * as Bindings from './bindings'
import * as Events from './event'
import { EventLeaves } from './event/types'

export type DomainApiResponderOpts<Domain extends object> = {
  [api in ApiLeaves<Domain>]?: Apis.ApiResponderOpts
}

export const domain = <Domain extends object>(_: {
  name: string
  apiRespondersOpts?: DomainApiResponderOpts<Domain>
}) => {
  const { name, apiRespondersOpts } = _
  const callApi = Apis.call<Domain>(name)
  const emitEvent = Events.emit<Domain>(name)

  const respondApi = <ApiPath extends ApiLeaves<Domain>>(
    _: Pick<Apis.RespondApiArgs<Domain, ApiPath>, 'api' | 'handler'>
  ) => {
    const { api, handler } = _
    return Apis.respond<Domain>(name)({
      api,
      handler,
      opts: apiRespondersOpts ? apiRespondersOpts[api] : undefined,
    })
  }
  const bindApi = <EventPath extends EventLeaves<Domain>, ApiPath extends ApiLeaves<Domain>>(
    _: Pick<Bindings.BindApiArgs<Domain, EventPath, ApiPath>, 'api' | 'event' | 'flowKey'>
  ) => {
    const { api, event, flowKey } = _
    const apiOpts = apiRespondersOpts && apiRespondersOpts[api]
    return Bindings.bindApi<Domain>(name)({
      api,
      event,
      flowKey,
      opts: {
        apiQueue: apiOpts?.queue,
      },
    })
  }

  return {
    callApi,
    respondApi,
    emitEvent,
    bindApi,
  }
}
