import * as AMQP from '../amqp'
import { Flow } from '../types/path'
import * as Event from './types'

export type EmitOpts = {}

export const emit = <Domain>(domain: string) => <EventPath extends Event.EventLeaves<Domain>>(_: {
  event: EventPath
  flow: Flow
  payload: Event.LookupType<Domain, EventPath>
  opts?: EmitOpts
}) => {
  const { event, payload, flow /* , opts */ } = _
  return AMQP.domainPublish({
    domain,
    flow,
    topic: event,
    payload,
  })
}
