import { Assertion } from '@moodlenet/common/lib/content-graph'
import { EdgeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { edgeTypeFromId, Id, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { MoodleNetAuthenticatedExecutionContext } from '../../../../../types'
import { ShallowEdgeByType } from '../../../types.node'
import { Persistence } from '../types'
import { getEdgeOpAqlAssertions } from './assertions/edge'
import { isMarkDeleted, markDeletedPatch } from './helpers'

export const deleteEdge = async ({
  persistence: { db, graph },

  ctx,
  edgeId,
}: {
  persistence: Persistence
  ctx: MoodleNetAuthenticatedExecutionContext
  edgeId: Id
}) => {
  const edgeType = edgeTypeFromId(edgeId)
  const edgeCollection = graph.edgeCollection<ShallowEdgeByType<EdgeType>>(edgeType)
  const edge = await edgeCollection.edge(edgeId).catch(() => null)
  if (!edge) {
    return 'edge not found'
  }
  const fromType = nodeTypeFromId(edge._from as Id)
  const toType = nodeTypeFromId(edge._to as Id)
  const aqlAssertionMaps = getEdgeOpAqlAssertions({ ctx, edgeType, edgeVar: 'edge', op: 'delete', fromType, toType })
  if (typeof aqlAssertionMaps === 'string') {
    return aqlAssertionMaps
  }

  const q = `
    LET edge = DOCUMENT(${aqlstr(edgeId)})
    LET from = DOCUMENT(edge._from)
    LET to = DOCUMENT(edge._to)

    FILTER !!edge AND !${isMarkDeleted('edge')}
      AND( ${aqlAssertionMaps.renderedAqlFilterExpr} )

    UPDATE edge with ${markDeletedPatch()} IN ${edgeType}

    RETURN NEW
  `
  // console.log(q)
  const cursor = await db.query(q, {}, { count: true })
  // console.log({ c: cursor.count })
  if (cursor.count === 1) {
    return edge as ShallowEdgeByType<EdgeType>
  }

  // Assertions failed
  const assertionFailedQ = `
    LET edge = DOCUMENT(${aqlstr(edgeId)})
    LET from = DOCUMENT(edge._from)
    LET to = DOCUMENT(edge._to)

    ${aqlAssertionMaps.varAssignment} 

    RETURN MERGE(${aqlAssertionMaps.assertionMapVarName},{
      edgeExists: !!edge
    })
  `
  // console.log({ assertionFailedQ })
  const assertionCursor = await db.query(assertionFailedQ)
  const assertionResult = await assertionCursor.next()
  const assertionMapValues: {
    [a in Assertion | 'edgeExists']?: boolean
  } = assertionResult

  const assertionFailedQResult = {
    ...assertionMapValues,
    DeleteEdgeAssertionsFailed: 'DeleteEdgeAssertionsFailed',
    edgeOpAssertions: aqlAssertionMaps.edgeOpAssertions,
  } as const

  // console.log({ assertionFailedQResult })

  return assertionFailedQResult
}
