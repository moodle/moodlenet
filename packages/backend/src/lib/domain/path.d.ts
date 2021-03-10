// prettier-ignore
type Prev = [never, 0, 1, 2, 3, 4, 5, 6,  7, 8, 9, 10,  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type Join<K, P> = K extends string /* | number */
  ? P extends string /* | number */
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

export type Paths<Type, LeaveType, Depth extends number = 6> = [Depth] extends [never]
  ? never
  : Type extends LeaveType
  ? ''
  : Type extends object
  ? {
      [K in keyof Type]-?: K extends string | number
        ? `${K}` | Paths<Type[K], LeaveType, Prev[Depth]> extends infer R
          ? Join<K, R>
          : never
        : never
    }[keyof Type]
  : never

export type Leaves<Type, LeaveType, Depth extends number = 6> = [Depth] extends [never]
  ? never
  : Type extends LeaveType
  ? ''
  : Type extends object
  ? {
      [K in keyof Type]-?: Leaves<Type[K], LeaveType, Prev[Depth]> extends infer R ? Join<K, R> : never
    }[keyof Type]
  : never

export type TypeUnion<Hash, Prop extends keyof Hash = keyof Hash> = Prop extends infer Type
  ? Type extends Prop
    ? { t: Type; p: Hash[Type] }
    : never
  : never

export type WildTypeUnion<Hash, Prop extends '*' | keyof Hash = keyof Hash> = Prop extends keyof Hash
  ? TypeUnion<Hash, Prop>
  : TypeUnion<Hash, keyof Hash>

// export type TopicType<T, P extends Leaves<T>> = TopicOf<T, P> extends Topic<infer Type, any>
//   ? Type
//   : never

export type LookupPath<
  T,
  L extends string
> = /* L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}.${infer J}.${infer K}`
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
  :  */ L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}`
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
