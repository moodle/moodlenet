export { ConnAssertion, CtxAssertion, NodeAssertion } from '../graphql/types.graphql.gen'
import { _conn, _ctx, _node } from '../assertions/op-chains'
import { ConnAssertion, CtxAssertion, EdgeType as E, NodeAssertion, NodeType as N } from '../graphql/types.graphql.gen'
import { AssertionOf } from '../utils/op-chain'

export type GlyphAssertion = NodeAssertion | ConnAssertion
export type Assertion = CtxAssertion | GlyphAssertion

export type AssertionExpr = string | boolean

export type EdgeOpAssertion = {
  ctx: AssertionOf<typeof _ctx> | boolean
  conn: AssertionOf<typeof _conn> | boolean
  from: AssertionOf<typeof _node> | boolean
  to: AssertionOf<typeof _node> | boolean
}
export type EdgeOp = 'create' | 'delete' | 'traverse'
export type EdgeOpAssertionMap = {
  [op in EdgeOp]: EdgeOpAssertion
}
export type EdgeDef = [N[], N[], EdgeOpAssertionMap]

export type NodeOpAssertion = {
  ctx: AssertionOf<typeof _ctx> | boolean
  node: AssertionOf<typeof _node> | boolean
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
