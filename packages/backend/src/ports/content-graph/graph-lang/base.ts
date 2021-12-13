import { ns } from '../../../lib/ns/namespace'
import { value } from '../../../lib/plug'

declare const _TSym: unique symbol
export type _T<__> = __ extends BV<infer T> ? T : never
export type BV<T> = { readonly [_TSym]?: T }
export type GetBV = <T>(bv: BV<T>, assertions: Assertions) => Promise<T | null>
export type Assertions<Rules extends string = string> =
  | {
      [r in Rules]?: BV<boolean>
    }

export type BaseOperators = {
  cmp<T>(a: BV<T>, cmp: Cmp, b: BV<T>): BV<boolean>
  cond<R, L>(condition: BV<boolean>, right: BV<R>, left: BV<L>): BV<R | L>
  and(...bools: [BV<boolean>, ...BV<boolean>[]]): BV<boolean>
  or(...bools: [BV<boolean>, ...BV<boolean>[]]): BV<boolean>
  not(bool: BV<boolean>): BV<boolean>
  bv<T>(val: T): BV<T>
  getBV: GetBV
}

export type Cmp = '==' | '!=' | '<' | '>' | '<=' | '>='

export const baseOperators = value<BaseOperators>(ns(module, 'base-operators'))
