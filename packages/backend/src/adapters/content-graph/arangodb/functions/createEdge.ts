import { _conn } from '@moodlenet/common/lib/assertions/op-chains'
import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { aqlstr, ulidKey } from '../../../../lib/helpers/arango'
import { createdByAtPatch, isMarkDeleted, toDocumentEdgeOrNode } from './helpers'
import { DocumentEdgeDataByType } from './types'

export const createEdgeQ = <Type extends EdgeType>({
  data,
  edgeType,
  from,
  to,
  creatorProfileId,
}: // assertions,
{
  edgeType: Type
  data: DocumentEdgeDataByType<Type>
  from: Id
  to: Id
  assertions: Maybe<AssertionOf<typeof _conn>>
  creatorProfileId: Id
}) => {
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  // const aqlAssertionMaps = getEdgeOpAqlAssertions({ ctx, edgeType, edgeVar: null, op: 'create', fromType, toType })
  // if (typeof aqlAssertionMaps === 'string') {
  //   return aqlAssertionMaps
  // }

  const newedge = {
    ...data,
    __typename: edgeType,
    _fromType: fromType,
    _toType: toType,
    //
    _from: from,
    _to: to,
    _key: ulidKey(),
  }

  const q = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    let newedge = ${createdByAtPatch(newedge, creatorProfileId)}

    FILTER !!from 
      AND !!to 
      AND !${isMarkDeleted('from')}
      AND !${isMarkDeleted('to')} 
      // AND ( $ {aqlAssertionMaps.renderedAqlFilterExpr} )

    INSERT newedge into ${edgeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  return q
}
// console.log(q)
//   const cursor = await db.query(q)
//   const result = await cursor.next()
//   if (result) {
//     return result as DocumentEdgeByType<Type>
//   }

//   // Assertions failed
//   const assertionFailedQ = `
//     let from = DOCUMENT(${aqlstr(from)})
//     let to = DOCUMENT(${aqlstr(to)})
//     ${aqlAssertionMaps.varAssignment}

//     return MERGE(${aqlAssertionMaps.assertionMapVarName},{
//       fromExists: !!from,
//       toExists: !!to,
//       fromDeleted: ${isMarkDeleted('from')},
//       toDeleted: ${isMarkDeleted('to')},
//     })
//   `
//   // console.log({ assertionFailedQ })
//   const assertionCursor = await db.query(assertionFailedQ)
//   const assertionResult = await assertionCursor.next()
//   // console.log({ assertionResult })
//   const assertionMapValues: {
//     [a in Assertion | 'fromExists' | 'toExists' | 'fromDeleted' | 'toDeleted']?: boolean
//   } = assertionResult

//   const assertionFailedQResult = {
//     ...assertionMapValues,
//     CreateEdgeAssertionsFailed: 'CreateEdgeAssertionsFailed',
//     edgeOpAssertions: aqlAssertionMaps.edgeOpAssertions,
//   } as const

//   // console.log({ assertionFailedQResult })

//   return assertionFailedQResult
// }
