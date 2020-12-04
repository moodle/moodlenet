import * as Apis from './api'
import { ApiLeaves } from './api/types'
import * as Bindings from './bindings'
import * as Events from './event'
import { EventLeaves } from './event/types'
import { Flow } from './types/path'

export type DomainApiResponderOpts<Domain extends object> = {
  [api in ApiLeaves<Domain>]?: Apis.ApiResponderOpts
}

export const domain = <Domain extends object>(_: {
  name: string
  apiRespondersOpts?: DomainApiResponderOpts<Domain>
}) => {
  const { name, apiRespondersOpts } = _
  const assertApiResponderQ = async (_: { api: ApiLeaves<Domain> }) => {
    const { api } = _
    const thisResponderOpts = apiRespondersOpts ? apiRespondersOpts[api] : undefined
    await Apis.assertApiResponderQueue<Domain>({
      api,
      qOpts: thisResponderOpts && thisResponderOpts.queue,
    })
  }
  const callApi = async <ApiPath extends ApiLeaves<Domain>>(
    _: Apis.ApiCallArgs<Domain, ApiPath>
  ) => {
    const { api } = _
    await assertApiResponderQ({ api })
    return Apis.call<Domain>(name)(_)
  }
  const emitEvent = Events.emit<Domain>(name)

  const respondApi = async <ApiPath extends ApiLeaves<Domain>>(
    _: Pick<Apis.RespondApiArgs<Domain, ApiPath>, 'api' | 'handler'>
  ) => {
    const { api, handler } = _
    await assertApiResponderQ({ api })
    return Apis.respond<Domain>(name)({
      api,
      handler,
      opts: apiRespondersOpts ? apiRespondersOpts[api] : undefined,
    })
  }

  const routes = <Route extends string>() => {
    const bind = async <EventPath extends EventLeaves<Domain>, ApiPath extends ApiLeaves<Domain>>(
      _: Bindings.BindApiArgs<Domain, EventPath, ApiPath, Route>
    ) => {
      const { api } = _
      await assertApiResponderQ({ api }).catch((err) => {
        console.error(`Error asserting api-responder-queue for ${api} :\n${err}`)
        throw err
      })
      return Bindings.bindApi<Domain>(name)(_)
    }
    const reflow = (flow: Flow, route: Route): Flow => ({
      ...flow,
      _route: route,
    })
    return {
      bind,
      reflow,
    }
  }

  return {
    routes,
    callApi,
    respondApi,
    emitEvent,
  }
}
