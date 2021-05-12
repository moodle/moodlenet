import { _conn } from '@moodlenet/common/lib/assertions/op-chains'
import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { aqlstr } from '../../../../lib/helpers/arango'
import { isMarkDeleted, markDeletedPatch, toDocumentEdgeOrNode } from './helpers'

export const deleteEdgeQ = <E extends EdgeType>({
  //assertions
  edgeType,
  edgeId,
  deleterProfileId,
}: {
  edgeId: Id
  edgeType: E
  deleterProfileId: Id
  assertions: Maybe<AssertionOf<typeof _conn>>
}) => {
  // const fromType = nodeTypeFromId(edge._from as Id)
  // const toType = nodeTypeFromId(edge._to as Id)
  // const aqlAssertionMaps = getEdgeOpAqlAssertions({ ctx, edgeType, edgeVar: 'edge', op: 'delete', fromType, toType })
  // if (typeof aqlAssertionMaps === 'string') {
  //   return aqlAssertionMaps
  // }

  const q = `
    LET edge = DOCUMENT(${aqlstr(edgeId)})
    LET from = DOCUMENT(edge._from)
    LET to = DOCUMENT(edge._to)

    FILTER !!edge AND !${isMarkDeleted('edge')}
      // AND( $ {aqlAssertionMaps.renderedAqlFilterExpr} )

    UPDATE edge with ${markDeletedPatch({ byId: deleterProfileId })} IN ${edgeType}

    RETURN ${toDocumentEdgeOrNode('NEW')}
  `
  return q
}

//   // Assertions failed
//   const assertionFailedQ = `
//     LET edge = DOCUMENT(${aqlstr(edgeId)})
//     LET from = DOCUMENT(edge._from)
//     LET to = DOCUMENT(edge._to)

//     ${aqlAssertionMaps.varAssignment}

//     RETURN MERGE(${aqlAssertionMaps.assertionMapVarName},{
//       edgeExists: !!edge
//     })
//   `
//   // console.log({ assertionFailedQ })
//   const assertionCursor = await db.query(assertionFailedQ)
//   const assertionResult = await assertionCursor.next()
//   const assertionMapValues: {
//     [a in Assertion | 'edgeExists']?: boolean
//   } = assertionResult

//   const assertionFailedQResult = {
//     ...assertionMapValues,
//     DeleteEdgeAssertionsFailed: 'DeleteEdgeAssertionsFailed',
//     edgeOpAssertions: aqlAssertionMaps.edgeOpAssertions,
//   } as const

//   // console.log({ assertionFailedQResult })

//   return assertionFailedQResult
// }
