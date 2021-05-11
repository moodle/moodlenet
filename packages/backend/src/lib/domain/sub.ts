import { EventPaths, LookupEventType } from './event'
import { Flow } from './flow'
import { Acks } from './misc'
import { Leaves, LookupPath } from './path'
type Teardown = any

// type SubscriberUnionArg<D, EventPath extends EventPaths<D>> = EventPath extends infer Event
//   ? Event extends EventPath
//     ? { t: Event; p: LookupEventType<D, Event>; flow: Flow }
//     : never
//   : never
// export type Subscriber<D, EventPath extends EventPaths<D>> = (a: SubscriberUnionArg<D, EventPath>) => Promise<Acks>

export type Subscriber<D, EventPath extends EventPaths<D>> = (
  payload: LookupEventType<D, EventPath>,
  flow: Flow,
) => Promise<Acks>

export type SubscriberService<D, EventPath extends EventPaths<D>> = readonly [
  subscriber: Subscriber<D, EventPath>,
  teardown?: Teardown,
]
export type SubDef<D, EventPath extends EventPaths<D>> = {
  kind: 'sub'
  event: EventPath //[]
  cfg?: Partial<SubConfig>
}

export type SubscriberInit<D, EventPath extends EventPaths<D>> = (_: {
  cfg: SubConfig
}) => Promise<SubscriberService<D, EventPath>>

export type LookupSubInit<D, SubPath extends SubPaths<D>> = SubscriberInit<D, LookupSubDef<D, SubPath>['event']>

export type SubPaths<Domain> = Leaves<Domain, SubDef<any, any>>

export type SubConfig = {
  rejectionAck: Acks
  parallelism: number
}
export const defaultSubConfig = (cfg?: Partial<SubConfig>): SubConfig => ({
  rejectionAck: Acks.Reject,
  parallelism: 10,
  ...cfg,
})

export type LookupSubDef<D, Path extends SubPaths<D>> = LookupPath<D, Path> extends infer MaybeSubDef
  ? MaybeSubDef extends SubDef<D, any>
    ? MaybeSubDef
    : never
  : never

export type LookupSubscriber<D, Path extends SubPaths<D>> = LookupPath<D, Path> extends infer MaybeSubDef
  ? MaybeSubDef extends SubDef<D, any>
    ? Subscriber<D, MaybeSubDef['event']>
    : never
  : never
