import { ConnAssertion, EdgeOp, getEdgeOpAssertions } from '@moodlenet/common/lib/content-graph'
import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { EdgeType, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { assertCtx } from '../../../executionContext/assertCtx'
import { MoodleNetExecutionContext } from '../../../executionContext/types'
import { isMarkDeleted } from '../helpers'
import { AssertionArg, toAqlAssertionExprMapAndAqlString } from './lib'

export type ConnAssertionMap = {
  [a in ConnAssertion]: (_: AssertionArg) => string
}

export const connAssertionMap: ConnAssertionMap = {
  NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes: ({ edgeType }) => {
    if (!edgeType) {
      return `(false /*NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes edgeType:${edgeType}*/)`
    }
    // BEWARE: this assertion assumes to be used in "createNode" where `from` and `to` variables are defined
    return `LENGTH(
      FOR edge  IN ${edgeType}  
        
        FILTER !${isMarkDeleted('edge')}
          AND edge._from == from._id 
          AND edge._to == to._id

        limit 1
        return edge 
      ) < 1`
  },
  NoExistingSameEdgeTypeToThisNode: ({ edgeType, thisNodeVar }) => {
    if (!(thisNodeVar && edgeType)) {
      return `(false /*NoExistingSameEdgeTypeToThisNode thisNodeVar:${thisNodeVar} edgeType:${edgeType}*/)`
    }
    return `LENGTH(
      FOR edge IN ${edgeType}  
        
        FILTER !${isMarkDeleted('edge')}
          AND edge._to == ${thisNodeVar}._id
        
        limit 1
        return edge
      ) < 1`
  },
}

export const getEdgeOpAqlAssertions = ({
  edgeType,
  fromType,
  toType,
  ctx,
  op,
  edgeVar,
}: {
  op: EdgeOp
  edgeType: EdgeType
  fromType: NodeType
  toType: NodeType
  edgeVar: string | null
  ctx: MoodleNetExecutionContext
}) => {
  const edgeOpAssertions = getEdgeOpAssertions({
    graph: contentGraphDef,
    edge: edgeType,
    from: fromType,
    to: toType,
    op,
  })
  if (!edgeOpAssertions) {
    console.warn(`no assertions found for Edge`, { edgeType, fromType, toType, op })
    return 'no assertions found' // as const
  }

  const m_ctxAssertionFailType = assertCtx({ ctx, ctxAssertion: edgeOpAssertions.ctx })
  if (!m_ctxAssertionFailType) {
    return 'unauthorized' // as const
  }

  const baseArg = { ctx, edgeType, edgeVar }
  const connExprMap = toAqlAssertionExprMapAndAqlString({ thisNodeVar: null, expr: edgeOpAssertions.conn, ...baseArg })
  const fromExprMap = toAqlAssertionExprMapAndAqlString({
    thisNodeVar: 'from',
    expr: edgeOpAssertions.from,
    ...baseArg,
  })
  const toExprMap = toAqlAssertionExprMapAndAqlString({ thisNodeVar: 'to', expr: edgeOpAssertions.to, ...baseArg })

  const assertionMapVarName = 'assertionMaps'
  const varAssignment = `LET ${assertionMapVarName} = {
    conn: ${connExprMap.aqlExprMapString},
    from: ${fromExprMap.aqlExprMapString},
    to: ${toExprMap.aqlExprMapString}
  }`
  const renderedAqlFilterExpr = `( ${connExprMap.aqlFilter} AND ${fromExprMap.aqlFilter} AND ${toExprMap.aqlFilter} )`
  return {
    varAssignment,
    assertionMapVarName,
    renderedAqlFilterExpr,
    edgeOpAssertions,
  }
}
