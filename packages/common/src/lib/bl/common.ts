import { EdgeType } from '../../graphql/types.graphql.gen'
import { Key } from '../../utils/content-graph/id-key-type-guards'

export type W<T> = { _?: T }
export type BLVal<T> = T | W<T>
export type BLRule = BLVal<boolean>
//export type BLMap<K extends string> = Record<K, (...args: BLVal<any>[]) => BLVal<any>>

export type Cmp = '==' | '!=' | '<' | '>' | '<=' | '>='
export type BaseOperators = {
  cmp<T>(a: BLVal<T>, cmp: Cmp, b: BLVal<T>): BLVal<boolean>
  cond<T>(condition: BLVal<boolean>, right: BLVal<T>, left: BLVal<T>): BLVal<T>
  and(_: BLVal<boolean>, ...bools: BLVal<boolean>[]): BLVal<boolean>
  or(_: BLVal<boolean>, ...bools: BLVal<boolean>[]): BLVal<boolean>
  not(_: BLVal<boolean>): BLVal<boolean>
}

export type GraphOperators = {
  edgeExists(from: Key, edge: EdgeType, to: Key): BLVal<boolean>
  isCreator(ownerProfileId: Key, nodeId: Key): BLVal<boolean>
}
