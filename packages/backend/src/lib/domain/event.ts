import { Leaves, LookupPath } from './path'

export type Event<Type> = {
  kind: 'evt'
  __type?: Type
  cfg?: Partial<EventConfig>
}

export type EventConfig = {}
export const defaultEventConfig = (cfg?: Partial<EventConfig>): EventConfig => ({
  ...cfg,
})

export type EventLeaves<Domain> = Leaves<Domain, Event<any>>

export type LookupEvent<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeEvent
  ? MaybeEvent extends Event<any>
    ? MaybeEvent
    : never
  : never

export type LookupEventType<Domain, Path extends EventLeaves<Domain>> = LookupEvent<Domain, Path> extends Event<
  infer Type
>
  ? Type
  : never
