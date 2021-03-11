import { EventLeaves, LookupEventType } from './event'
import { Flow } from './flow'
import { Acks } from './misc'
import { Leaves, LookupPath } from './path'
import { EnqueueConfig, WrkConfig } from './wrk'

type SubscriberUnionArg<D, EventPath extends EventLeaves<D>> = EventPath extends infer Event
  ? Event extends EventPath
    ? { t: Event; p: LookupEventType<D, Event>; flow: Flow }
    : never
  : never

export type Subscriber<D, EventPath extends EventLeaves<D>> = (a: SubscriberUnionArg<D, EventPath>) => Promise<Acks>
export type SubscriberService<D, EventPath extends EventLeaves<D>> = [
  subscriber: Subscriber<D, EventPath>,
  teardown?: () => void,
]
export type Sub<D, EventPath extends EventLeaves<D>> = {
  kind: 'sub'
  events: EventPath[]
  init: SubscriberInit<D, EventPath>
  cfg?: SubConfig
}
export type SubTypes<D, Path extends EventLeaves<D>> = {
  Event: Path
  Subscriber: Subscriber<D, Path>
  Init: SubscriberInit<D, Path>
}
export type SubscriberInit<D, EventPath extends EventLeaves<D>> = (_: {
  cfg: SubConfig
}) => SubscriberService<D, EventPath> | Promise<SubscriberService<D, EventPath>>
export type SubscriberInitImpl<D, EventPath extends EventLeaves<D>> = SubscriberInit<D, EventPath>
export type SubLeaves<Domain> = Leaves<Domain, Sub<any, any>>

export type SubConfig = WrkConfig & EnqueueConfig

export const defaultSubscriberConfig = (cfg?: Partial<SubConfig>): SubConfig => ({
  rejectionAck: Acks.Reject,
  parallelism: 10,
  ...cfg,
})

export type LookupSub<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeSubscriber
  ? MaybeSubscriber extends Sub<any, any>
    ? MaybeSubscriber
    : never
  : never
