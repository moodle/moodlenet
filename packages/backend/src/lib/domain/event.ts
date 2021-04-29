import { Leaves, LookupPath } from './path'

export type Event<Type> = {
  kind: 'evt'
  cfg?: Partial<EventConfig<Type>>
}

export type EventConfig<Type> = {
  __$do_not_set_me_Event_Type_placeholder?: Type
}
export const defaultEventConfig = <T>(cfg?: Partial<EventConfig<T>>): EventConfig<T> => ({
  ...cfg,
})

export type EventPaths<Domain> = Leaves<Domain, Event<any>>

export type LookupEvent<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeEvent
  ? MaybeEvent extends Event<any>
    ? MaybeEvent
    : never
  : never

export type LookupEventType<Domain, Path extends EventPaths<Domain>> = LookupEvent<Domain, Path> extends Event<
  infer Type
>
  ? Type
  : never
