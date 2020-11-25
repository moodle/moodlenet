import * as api from './api'
import * as event from './event'

export const domain = <Domain extends object>(domain: string) => {
  return {
    api: {
      ...api,
      call: api.call<Domain>(domain),
      respond: api.responder<Domain>(domain),
    },
    event: {
      ...event,
      emit: event.emit<Domain>(domain),
      bindToApi: event.bindToApi<Domain>(domain),
    },
  }
}
