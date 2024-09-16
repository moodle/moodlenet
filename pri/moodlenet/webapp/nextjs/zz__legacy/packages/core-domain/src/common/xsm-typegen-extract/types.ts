export type EventOf<
  T extends TypegenT,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EvMap extends Record<EffEventNames<T>, any>,
> =
  keyof EvMap extends EffEventNames<T>
    ? keyof EvMap extends infer type
      ? type extends EffEventNames<T>
        ? { type: type } & EvMap[type]
        : never
      : never
    : `UNKNOWN EVENT [${Exclude<keyof EvMap, EffEventNames<T>> & string}]`

type EffPrp =
  | 'eventsCausingActions'
  | 'eventsCausingDelays'
  | 'eventsCausingGuards'
  | 'eventsCausingServices'

export type TypegenT = Record<EffPrp, Record<string, string>> & {
  internalEvents: Record<string, { type: string }>
  matchesStates: string
}
type EffEventNames<T extends TypegenT> = Exclude<
  EffPrp extends infer K ? (K extends EffPrp ? T[K][keyof T[K]] : never) : never,
  T['internalEvents'][keyof T['internalEvents']]['type']
>

export type StateOf<T extends TypegenT> = T['matchesStates']
export type StateContext<
  T extends TypegenT,
  TypeStates extends Record<string, { state: StateOf<T> }>,
  Common = unknown,
> = Common &
  {
    [type in keyof TypeStates]: { type: type } & TypeStates[type]
  }[keyof TypeStates]
