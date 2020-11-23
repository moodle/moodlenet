import { DomainTopic } from './impl/persistence/types'

export type Topic<Type, Reply = void> = { type: Type; reply: Reply }
export type TopicArg<Type, Reply = void> = Topic<Type, Reply> & { _: string }

// prettier-ignore
type Prev = [never, 0, 1, 2, 3, 4, 5, 6,  7, 8, 9, 10,  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type Join<K, P> = K extends string /* | number */
  ? P extends string /* | number */
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

// type Paths<T, D extends number = 6> = [D] extends [never]
//   ? never
//   : T extends object
//   ? {
//       [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never
//     }[keyof T]
//   : ''

type TopicLeaves<T, D extends number = 6> = [D] extends [never]
  ? never
  : T extends Topic<any, any>
  ? ''
  : T extends object
  ? // ? { [K in keyof T]-?: Join<K, TopicLeaves<T[K], Prev[D]>> }[keyof T]
    { [K in keyof T]-?: TopicLeaves<T[K], Prev[D]> extends infer R ? Join<K, R> : never }[keyof T]
  : never // ''

export type TypeUnion<Hash, Prop extends keyof Hash = keyof Hash> = Prop extends infer Type
  ? Type extends Prop
    ? { t: Type; p: Hash[Type] }
    : never
  : never

export type WildTypeUnion<
  Hash,
  Prop extends '*' | keyof Hash = keyof Hash
> = Prop extends keyof Hash ? TypeUnion<Hash, Prop> : TypeUnion<Hash, keyof Hash>

export type TopicType<T, P extends TopicLeaves<T>> = TopicOf<T, P> extends Topic<infer Type, any>
  ? Type
  : never

export type TopicOf<
  T,
  L extends TopicLeaves<T>
> = L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}.${infer J}.${infer K}`
  ? //@ts-expect-error
    T[A][B][C][D][E][F][G][H][I][J][K]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}.${infer J}`
  ? //@ts-expect-error
    T[A][B][C][D][E][F][G][H][I][J]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}`
  ? //@ts-expect-error
    T[A][B][C][D][E][F][G][H][I]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}`
  ? //@ts-expect-error
    T[A][B][C][D][E][F][G][H]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}`
  ? //@ts-expect-error
    T[A][B][C][D][E][F][G]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}`
  ? //@ts-expect-error
    T[A][B][C][D][E][F]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}`
  ? //@ts-expect-error
    T[A][B][C][D][E]
  : L extends `${infer A}.${infer B}.${infer C}.${infer D}`
  ? //@ts-expect-error
    T[A][B][C][D]
  : L extends `${infer A}.${infer B}.${infer C}`
  ? //@ts-expect-error
    T[A][B][C]
  : L extends `${infer A}.${infer B}`
  ? //@ts-expect-error
    T[A][B]
  : L extends `${infer A}`
  ? //@ts-expect-error
    T[A]
  : never

export type ForwardTopicMsg<Domain> = <
  SrcTopicPath extends TopicLeaves<Domain>,
  TrgTopicPath extends TopicLeaves<Domain>
>(_: {
  source: TopicOf<Domain, SrcTopicPath> extends TopicArg<any, any>
    ? readonly [SrcTopicPath, string]
    : readonly [SrcTopicPath]
  target: TopicOf<Domain, SrcTopicPath> extends Topic<infer SrcT, any>
    ? TopicOf<Domain, TrgTopicPath> extends Topic<infer TrgT, any>
      ? TrgT extends SrcT
        ? TopicOf<Domain, TrgTopicPath> extends TopicArg<any, any>
          ? readonly [TrgTopicPath, string]
          : readonly [TrgTopicPath]
        : never
      : never
    : never
}) => unknown

export type Publish<Domain> = <TrgTopicPath extends TopicLeaves<Domain>>(_: {
  target: TrgTopicPath
  payload: TopicOf<Domain, TrgTopicPath> extends TopicArg<infer In, any>
    ? [string, In]
    : TopicOf<Domain, TrgTopicPath> extends Topic<infer In, any>
    ? In
    : never
  replyCb?(_: {
    payload: TopicOf<Domain, TrgTopicPath> extends Topic<any, infer Out> ? Out : never
    stop(): unknown
  }): unknown
}) => Promise<void>

export type Consume<Domain> = <TrgTopicPath extends TopicLeaves<Domain>>(_: {
  trgTopicPath: TrgTopicPath
  qName?: string
  handler(_: {
    payload: TopicOf<Domain, TrgTopicPath> extends Topic<infer In, any> ? In : never
    forward?:
      | {
          src: DomainTopic
          unforward(): unknown
        }
      | undefined
  }): Promise<TopicOf<Domain, TrgTopicPath> extends Topic<any, infer Out> ? Out : never>
}) => unknown

export type ReplyError = { ___ERROR: string }
