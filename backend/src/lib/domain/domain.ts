import * as api from './api'
import * as bindings from './bindings'
import * as event from './event'

export const domain = <Domain extends object>(domain: string) => {
  return {
    callApi: api.call<Domain>(domain),
    respondApi: api.respond<Domain>(domain),
    emitEvent: event.emit<Domain>(domain),
    bindApi: bindings.bindApi<Domain>(domain),
  }
}
