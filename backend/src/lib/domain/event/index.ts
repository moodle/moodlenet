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
  log(flow, `\n\Event emit : ${event}`)
  return AMQP.domainPublish({
    domain,
    flow,
    topic: event,
    payload,
  })
}
const log = (flow: Flow, ...args: any[]) =>
  console.log(
    `\n\n\n`,
    args.map((_) => `\n${_}`),
    `\nflow : ${flow._key} - ${flow._route}`
  )
