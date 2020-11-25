import * as AMQP from '../amqp'
import { getApiResponderQName } from '../api'
import API from '../api/types'
import { FlowId } from '../types/path'
import * as Types from './types'

export type EmitOpts = {}

export const emit = <Domain>(domain: string) => <EventPath extends Types.EventLeaves<Domain>>(_: {
  event: EventPath
  flowId: FlowId
  payload: Types.EventType<Domain, EventPath>
  opts?: EmitOpts
}) => {
  const { event, payload, flowId /* , opts */ } = _
  return AMQP.domainPublish({
    domain,
    flowId,
    topic: event,
    payload,
  })
}

// TODO: bind event path+key to APIpath with same type Req with no reply .. opts timeout (ttl esxpiration) ?
export const bindToApi = <Domain>(domain: string) => async <
  EventPath extends Types.EventLeaves<Domain>,
  ApiPath extends API.ApiLeaves<Domain>
>(_: {
  event: EventPath
  api: Types.EventType<Domain, EventPath> extends API.ApiReq<Domain, ApiPath> ? ApiPath : never
  tag?: string
  unbind?: boolean
}) => {
  const { unbind, api, tag = '*', event } = _
  const taggedTopic = `${event}.${tag}`
  const apiQname = getApiResponderQName<Domain>(api)

  return unbind
    ? AMQP.unbindQ({ topic: taggedTopic, domain, name: apiQname })
    : AMQP.bindQ({ topic: taggedTopic, domain, name: apiQname })
}

// type s = Types.EventRes<MoodleNetDomain, 'Accounting.Register_New_Account.Request'>
// type q = Types.EventReq<MoodleNetDomain, 'Accounting.Register_New_Account.Request'>

// emit<MoodleNetDomain>('')({
//   path: 'Accounting.Register_New_Account.Request',
//   req: { email: '', username: '' },
// }).then(({ id, res }) => {
//   if (!res.___ERROR) {
//     res.ciccio
//   } else {
//     res.___ERROR.msg
//   }
// })

// responder<MoodleNetDomain>('')({
//   path: 'Accounting.Register_New_Account.Request',
//   async handler({ req /* disposeResponder */ }) {
//     req.email
//     return { ciccio: 'pallo' } as const
//   },
// })
