import * as D from '../types'

export type Event<Type extends object> = { type: Type }

export type EventLeaves<Domain> = D.Path.Leaves<Domain, Event<any>>

export type EventDef<Domain, Path extends string> = D.Path.TypeofPath<
  Domain,
  Path
> extends infer MaybeEvent
  ? MaybeEvent extends Event<any>
    ? MaybeEvent
    : never
  : never

export type EventType<Domain, Path extends string> = EventDef<Domain, Path> extends Event<
  infer Type
>
  ? Type
  : never
