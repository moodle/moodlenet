export type Topic<Type, Reply = void> = { type: Type; reply: Reply }
export type TopicArg<Type, Reply = void> = Topic<Type, Reply> & { _: string }

// prettier-ignore
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, /* 7, 8, 9, 10,  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, */ ...0[]]

type Join<K, P> = K extends string | number
  ? P extends string | number
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
type Leaves<T, D extends number = 6> = [D] extends [never]
  ? never
  : T extends Topic<any, any>
  ? ''
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : ''

//@ts-expect-error
const send = <T>() => <L extends Leaves<T>, Top = TopicOf<T, L>>(
  l: L,
  p: Top extends TopicArg<infer In, any>
    ? [string, In]
    : Top extends Topic<infer In, any>
    ? In
    : never
) => ({ l, p })

//@ts-expect-error
export const bind = <T>() => <Src extends Leaves<T>, Trg extends Leaves<T>>(
  src: TopicOf<T, Src> extends TopicArg<any, any> ? readonly [Src, string] : readonly [Src],
  trg: TopicOf<T, Src> extends Topic<infer SrcT, any>
    ? TopicOf<T, Trg> extends Topic<infer TrgT, any>
      ? TrgT extends SrcT
        ? TopicOf<T, Trg> extends TopicArg<any, any>
          ? readonly [Trg, string]
          : readonly [Trg]
        : never
      : never
    : never
) => ({ trg, src })

//@ts-ignore
export type TopicType<T, P extends Leaves<T>> = TopicOf<T, P> extends Topic<any, any>
  ? TopicOf<T, P>['type']
  : never

//@ts-nocheck
//@ts-ignore
export type TopicOf<T, L extends Leaves<T>> =
  // L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}.${infer J}.${infer K}`
  // //@ts-expect-error
  // ? T[A][B][C][D][E][F][G][H][I][J][K]
  // :L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}.${infer J}`
  // //@ts-expect-error
  // ? T[A][B][C][D][E][F][G][H][I][J]
  // :L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}.${infer I}`
  // //@ts-expect-error
  // ? T[A][B][C][D][E][F][G][H][I]
  // :L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}.${infer H}`
  // //@ts-expect-error
  // ? T[A][B][C][D][E][F][G][H]
  // :L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}.${infer G}`
  // //@ts-expect-error
  // ? T[A][B][C][D][E][F][G]
  L extends `${infer A}.${infer B}.${infer C}.${infer D}.${infer E}.${infer F}`
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

type MYDOM = {
  a: {
    b: {
      c: {
        d: TopicArg<TT, { r: string }>
        // d: TopicArg<TopicType<MYDOM, 'm.n.t'>        , { r: string }>
      }
      e: {
        f: TopicArg<{ f: number }, { r: string }>
      }
      j: {
        j: TopicArg<{ s: number }, { r: string }>
      }
    }
  }
  m: {
    n: {
      o: {
        p: {}
      }
      r: TopicArg<{ r: string }, { r: number }>
      s: Topic<{ s: number }, { s: string }>
      t: Topic<{ r: string }>
    }
  }
}
type TT = TopicType<MYDOM, 'm.n.t'>

const aa = bind<MYDOM>()(['m.n.r', 'sas'], ['a.b.c.d', ''])
const bb = bind<MYDOM>()(['m.n.r', 'sas'], ['a.b.e.f', 'sas'])
const cc = bind<MYDOM>()(['m.n.r', ''], ['a.b.j.j', 'ss'])

bind<MYDOM>()(['m.n.s'], ['a.b.j.j', ''])
