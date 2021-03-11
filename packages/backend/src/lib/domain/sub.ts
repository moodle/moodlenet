import { EventPaths, LookupEventType } from './event'
import { Flow } from './flow'
import { Acks } from './misc'
import { Leaves, LookupPath } from './path'
import { Teardown } from './types'

type SubscriberUnionArg<D, EventPath extends EventPaths<D>> = EventPath extends infer Event
  ? Event extends EventPath
    ? { t: Event; p: LookupEventType<D, Event>; flow: Flow }
    : never
  : never

export type Subscriber<D, EventPath extends EventPaths<D>> = (a: SubscriberUnionArg<D, EventPath>) => Promise<Acks>
export type SubscriberService<D, EventPath extends EventPaths<D>> = readonly [
  subscriber: Subscriber<D, EventPath>,
  teardown?: Teardown,
]
export type SubDef<D, EventPath extends EventPaths<D>> = {
  kind: 'sub'
  events: EventPath[]
  cfg?: Partial<SubConfig>
}
export type SubTypes<D, EventPath extends EventPaths<D>> = {
  Event: EventPath
  Subscriber: Subscriber<D, EventPath>
  Init: SubscriberInit<D, EventPath>
}
export type SubscriberInit<D, EventPath extends EventPaths<D>> = (_: {
  cfg: SubConfig
}) => SubscriberService<D, EventPath> | Promise<SubscriberService<D, EventPath>>

export type LookupSubInit<D, SubPath extends SubPaths<D>> = LookupSubDef<D, SubPath> extends SubDef<
  any,
  infer EventPath
>
  ? EventPath extends EventPaths<D>
    ? SubscriberInit<D, EventPath>
    : never
  : never

export type SubPaths<Domain> = Leaves<Domain, SubDef<any, any>>

export type SubConfig = {
  rejectionAck: Acks
  parallelism: number
}
export const defaultSubSetupConfig = (cfg?: Partial<SubConfig>): SubConfig => ({
  rejectionAck: Acks.Reject,
  parallelism: 10,
  ...cfg,
})

export type LookupSubDef<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeSubDef
  ? MaybeSubDef extends SubDef<any, any>
    ? MaybeSubDef
    : never
  : never
