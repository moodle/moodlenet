import { ConnAssertion, EdgeOp, getEdgeOpAssertions } from '@moodlenet/common/lib/content-graph'
import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { EdgeType, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { MoodleNetExecutionContext } from '../../../../../../types'
import { AssertionArg, toAqlAssertionExprMapAndAqlString } from './lib'

export type ConnAssertionMap = {
  [a in ConnAssertion]: (_: AssertionArg) => string
}

export const connAssertionMap: ConnAssertionMap = {
  NoExistingSameEdgeBetweenTheTwoNodesInSameDirection: ({ edgeType }) => {
    return `LENGTH(
      FOR edge  IN ${edgeType}  
        FILTER edge._from == from._id and edge._to == to._id
        limit 1
        return edge 
      ) < 1`
  },
  NoExistingSameEdgeTypeToThisNode: ({ edgeType, thisNodeVar }) => {
    if (!thisNodeVar) {
      return `(false /*NoExistingSameEdgeTypeToThisNode thisNodeVar:${thisNodeVar}*/)`
    }
    return `LENGTH(
      FOR edge IN ${edgeType}  
        FILTER edge._to == ${thisNodeVar}._id
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
  const assertionMapVarName = 'assertionMaps'
  if (!edgeOpAssertions) {
    return {
      varAssignment: `let ${assertionMapVarName} = {}`,
      assertionMapVarName,
      filter: `( false )`,
    }
  }
  const baseArg = { ctx, edgeType, edgeVar }
  const connExprMap = toAqlAssertionExprMapAndAqlString({ thisNodeVar: null, expr: edgeOpAssertions.conn, ...baseArg })
  const fromExprMap = toAqlAssertionExprMapAndAqlString({
    thisNodeVar: 'from',
    expr: edgeOpAssertions.from,
    ...baseArg,
  })
  const toExprMap = toAqlAssertionExprMapAndAqlString({ thisNodeVar: 'to', expr: edgeOpAssertions.to, ...baseArg })

  const varAssignment = `let ${assertionMapVarName} = {
    conn: ${connExprMap.aqlExprMapString},
    from: ${fromExprMap.aqlExprMapString},
    to: ${toExprMap.aqlExprMapString}
  }`
  const filter = `( ${connExprMap.aqlFilter} AND ${fromExprMap.aqlFilter} AND ${toExprMap.aqlFilter} )`
  return {
    varAssignment,
    assertionMapVarName,
    filter,
    edgeOpAssertions,
  }
}
