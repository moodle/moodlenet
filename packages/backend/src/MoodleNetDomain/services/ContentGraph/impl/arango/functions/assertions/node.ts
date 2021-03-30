import { getNodeOpAssertions, NodeAssertion, NodeOp } from '@moodlenet/common/lib/content-graph'
import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { assertCtx } from '../../../../../../assertCtx'
import { getSessionExecutionContext, MoodleNetExecutionContext } from '../../../../../../types'
import { AssertionArg, toAqlAssertionExprMapAndAqlString } from './lib'

type NodeAssertionMap = {
  [a in NodeAssertion]: (_: AssertionArg) => string
}
export const nodeAssertionMap: NodeAssertionMap = {
  ExecutorCreatedThisNode: ({ ctx, thisNodeVar }) => {
    const sessionCtx = getSessionExecutionContext(ctx)
    if (!(sessionCtx && thisNodeVar)) {
      return `(false /*ExecutorCreatedThisNode thisNodeVar:${thisNodeVar}*/)`
    }
    return `${thisNodeVar}._meta.creator._id == ${aqlstr(sessionCtx.profileId)}`
  },
  ThisNodeIsExecutorProfile: ({ ctx, thisNodeVar }) => {
    const sessionCtx = getSessionExecutionContext(ctx)
    if (!(sessionCtx && thisNodeVar)) {
      return `(false /*ThisNodeIsExecutorProfile thisNodeVar:${thisNodeVar}*/)`
    }
    return `${thisNodeVar}._id == ${aqlstr(sessionCtx.profileId)}`
  },
}

export const getNodeOpAqlAssertions = ({
  nodeType,
  ctx,
  op,
  nodeVar,
}: {
  op: NodeOp
  nodeType: NodeType
  nodeVar: string | null
  ctx: MoodleNetExecutionContext
}) => {
  const nodeOpAssertions = getNodeOpAssertions({
    graph: contentGraphDef,
    nodeType,
    op,
  })
  if (!nodeOpAssertions) {
    return 'no assertions found' // as const
  }

  const m_ctxAssertionFailType = assertCtx({ ctx, ctxAssertion: nodeOpAssertions.ctx })
  if (!m_ctxAssertionFailType) {
    return 'unauthorized' // as const
  }

  const baseArg = { ctx, nodeType, thisNodeVar: nodeVar, edgeVar: null, edgeType: null }
  const nodeExprMap = toAqlAssertionExprMapAndAqlString({ expr: nodeOpAssertions.node, ...baseArg })

  const assertionMapVarName = 'assertionMaps'
  const varAssignment = `let ${assertionMapVarName} = {
    node: ${nodeExprMap.aqlExprMapString},
  }`
  const renderedAqlFilterExpr = `( ${nodeExprMap.aqlFilter} )`
  return {
    varAssignment,
    assertionMapVarName,
    renderedAqlFilterExpr,
    nodeOpAssertions,
  }
}
