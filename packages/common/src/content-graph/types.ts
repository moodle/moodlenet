import { EdgeType as E, NodeType as N } from '../pub-graphql/types.graphql.gen'
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
export const __ = (_: CtxAssertion) => _
export const _ = (_: Assertion) => _
export type CtxAssertion =
  | 'CtxExecutorIsSystem'
  | 'CtxExecutorIsAuthenticated'
  | 'CtxExecutorIsAdmin'
  | 'CtxExecutorIsAnonymous'

export type Assertion =
  //NODE
  | 'NodeExecutorCreatedThisNode'
  | 'NodeThisNodeIsExecutorProfile'
  //CONNECTION
  | 'ConnNoExistingSameEdgeBetweenTheTwoNodesInSameDirection'
  | 'ConnNoExistingSameEdgeTypeToNode'
