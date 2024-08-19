// prettier-ignore
type Prev = [never, 0, 1, 2, 3, 4, 5, 6,  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type Join<Core, P> = Core extends string /* | number */
  ? P extends string /* | number */
    ? `${Core}${'' extends P ? '' : '/'}${P}`
    : never
  : never

// export type TypePaths<Obj, SearchType, Depth extends number = 10> = [Depth] extends [never]
//   ? never
//   : Obj extends SearchType
//   ? ''
//   : Obj extends object
//   ? {
//       [Core in keyof Obj]-?: TypePaths<Obj[Core], SearchType, Prev[Depth]> extends infer R ? Join<Core, R> : never
//     }[keyof Obj]
//   : never

export type TypePaths<Obj, SearchType, Primitive, Depth extends number = 10> = Obj extends Primitive
  ? Obj extends SearchType
    ? ''
    : never
  : [Depth] extends [never]
    ? never
    : Obj extends SearchType
      ?
          | ''
          | (Obj extends object
              ? {
                  [Core in keyof Obj]-?: TypePaths<
                    Obj[Core],
                    SearchType,
                    Primitive,
                    Prev[Depth]
                  > extends infer R
                    ? Join<Core, R>
                    : never
                }[keyof Obj]
              : '')
      : // vv added this block
        Obj extends Primitive
        ? never
        : // ^^ added this block
          Obj extends object
          ? {
              [Core in keyof Obj]-?: TypePaths<
                Obj[Core],
                SearchType,
                Primitive,
                Prev[Depth]
              > extends infer R
                ? Join<Core, R>
                : never
            }[keyof Obj]
          : never

// export type TypeUnion<Hash, Prop extends keyof Hash = keyof Hash> = Prop extends infer Type
//   ? Type extends Prop
//     ? { t: Type; p: Hash[Type] }
//     : never
//   : never

// export type WildTypeUnion<Hash, Prop extends '*' | keyof Hash = keyof Hash> = Prop extends keyof Hash
//   ? TypeUnion<Hash, Prop>
//   : TypeUnion<Hash, keyof Hash>

export type TypeofPath<T, L extends string> = L extends `${infer P}/${infer Rest}`
  ? P extends keyof T
    ? TypeofPath<T[P], Rest>
    : never
  : L extends keyof T
    ? T[L]
    : never

// type X = {
//   a: number
//   b: {
//     c: number
//     d: string
//   }
// }

// type Q = TypeofPath<X, 'a'>

// declare const fn: <T, Core>() => <TP extends TypePaths<X, Core>>(p: TP) => { z: TypeofPath<T, TP> }
// const x = fn<X, { c: number }>()('b')
