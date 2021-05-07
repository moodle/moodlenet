export { ConnAssertion, CtxAssertion, NodeAssertion } from '../graphql/types.graphql.gen'
import { ConnAssertion, CtxAssertion, EdgeType as E, NodeAssertion, NodeType as N } from '../graphql/types.graphql.gen'

export type GlyphAssertion = NodeAssertion | ConnAssertion
export type Assertion = CtxAssertion | GlyphAssertion

export type AssertionExpr = string | boolean

export type EdgeOpAssertion = {
  ctx: AssertionExpr
  conn: AssertionExpr
  from: AssertionExpr
  to: AssertionExpr
}
export type EdgeOp = 'create' | 'delete' | 'traverse'
export type EdgeOpAssertionMap = {
  [op in EdgeOp]: EdgeOpAssertion
}
export type EdgeDef = [N[], N[], EdgeOpAssertionMap]

export type NodeOpAssertion = {
  ctx: AssertionExpr
  node: AssertionExpr
}

export type NodeOp = 'create' | 'delete' | 'update' | 'read'
export type NodeOpAssertionMap = {
  [op in NodeOp]: NodeOpAssertion
}

export type GraphDef = {
  edges: {
    [Edge in E]: EdgeDef
  }
  nodes: {
    [Node in N]: NodeOpAssertionMap
  }
}

//Assertions
export const ctx = (_: CtxAssertion) => _
export const node = (_: NodeAssertion) => _
export const conn = (_: ConnAssertion) => _
