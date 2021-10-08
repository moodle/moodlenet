// export const _ = <T>(__ser__: string, __type__?: T): _<T> => ({ __ser__, __type__ })

// export type __unfold__<T> = T extends __ser__<T> ? T : T | __ser__<T>
const _TSym = Symbol()
export type _T<__> = __ extends BV<infer T> ? T : never
export type BV<T> = { readonly [_TSym]?: T }
export type GetBV = <T extends any>(_: BV<T>) => Promise<T>
export type Assumptions = Record<string, BV<boolean>>

export type BaseOperators = {
  cmp<T>(a: BV<T>, cmp: BV<Cmp>, b: BV<T>): BV<boolean>
  cond<R, L>(condition: BV<boolean>, right: BV<R>, left: BV<L>): BV<R | L>
  and(...bools: [BV<boolean>, ...BV<boolean>[]]): BV<boolean>
  or(...bools: [BV<boolean>, ...BV<boolean>[]]): BV<boolean>
  not(bool: BV<boolean>): BV<boolean>
  _<T>(val: T): BV<T>
  getBV: GetBV
}

export type Cmp = '==' | '!=' | '<' | '>' | '<=' | '>='
