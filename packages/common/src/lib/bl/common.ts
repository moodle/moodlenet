import { GraphNodeIdentifier } from '../../content-graph/types/node'
import { EdgeType } from '../../graphql/types.graphql.gen'

export type GraphOperators = {
  edgeExists(from: GraphNodeIdentifier, edge: EdgeType, to: GraphNodeIdentifier): BLVal<boolean>
  isCreator(ownerProfileId: GraphNodeIdentifier, nodeId: GraphNodeIdentifier): BLVal<boolean>
}

type Wrapper<T> = { _?: T }
export type BLVal<T> = T | Wrapper<T>
export type BLRule = BLVal<boolean>
//export type BLMap<K extends string> = Record<K, (...args: BLVal<any>[]) => BLVal<any>>

export type Cmp = '==' | '!=' | '<' | '>' | '<=' | '>='
export type BaseOperators = {
  cmp<T>(a: BLVal<T>, cmp: Cmp, b: BLVal<T>): BLVal<boolean>
  cond<T>(condition: BLVal<boolean>, right: BLVal<T>, left: BLVal<T>): BLVal<T>
  and(bool: BLVal<boolean>, ...moreBools: BLVal<boolean>[]): BLVal<boolean>
  or(bool: BLVal<boolean>, ...moreBools: BLVal<boolean>[]): BLVal<boolean>
  not(bool: BLVal<boolean>): BLVal<boolean>
}
