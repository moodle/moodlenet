import * as AMQP from '../amqp'
import { Flow } from '../types/path'
import * as Event from './types'

export type EmitOpts = {}

export const emit = <Domain>(domain: string) => <
  EventPath extends Event.EventLeaves<Domain>
>(
  event: EventPath
) => (_: {
  flow: Flow
  payload: Event.LookupEventType<Domain, EventPath>
  opts?: EmitOpts
}) => {
  const { payload, flow /* , opts */ } = _
  log(flow, `\n\Event emit : ${event}`)
  return AMQP.domainPublish({
    domain,
    flow,
    topic: event,
    payload,
  })
}

function log(...args: any[]) {
  console.log('\n\n\n', ...args.map((_) => (_ instanceof Error ? _.stack : _)))
}
