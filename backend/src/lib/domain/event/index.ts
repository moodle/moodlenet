import * as AMQP from '../amqp'
import { Flow } from '../types/path'
import * as Event from './types'

export type EmitOpts = {}

export const emit = <Domain, EventPath extends Event.EventLeaves<Domain>>(
  domain: string,
  flow: Flow,
  event: EventPath
) => (_: {
  payload: Event.LookupEventType<Domain, EventPath>
  opts?: EmitOpts
}) => {
  const { payload /* , opts */ } = _
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
