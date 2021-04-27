import { Assertion } from '@moodlenet/common/lib/content-graph'
import { EdgeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Id, IdKey, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { aqlstr, ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetAuthenticatedExecutionContext } from '../../../../../types'
import { Persistence } from '../types'
import { getEdgeOpAqlAssertions } from './assertions/edge'
import { isMarkDeleted, toDocumentEdgeOrNode } from './helpers'
import { DocumentEdgeByType, DocumentEdgeDataByType } from './types'

export const createEdge = async <Type extends EdgeType>({
  persistence: { db },
  data,
  edgeType,
  from,
  to,
  key,
  ctx,
}: {
  persistence: Persistence
  ctx: MoodleNetAuthenticatedExecutionContext
  edgeType: Type
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  data: DocumentEdgeDataByType<Type>
  from: Id
  to: Id
}) => {
  key = key ?? ulidKey()

  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const aqlAssertionMaps = getEdgeOpAqlAssertions({ ctx, edgeType, edgeVar: null, op: 'create', fromType, toType })
  if (typeof aqlAssertionMaps === 'string') {
    return aqlAssertionMaps
  }

  const newedge = {
    ...data,
    __typename: edgeType,
    _fromType: fromType,
    _toType: toType,
    //
    _from: from,
    _to: to,
    _key: key,
    _created: {},
  }

  const q = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    let newedge = ${aqlstr(newedge)}

    FILTER !!from 
      AND !!to 
      AND !${isMarkDeleted('from')}
      AND !${isMarkDeleted('to')} 
      AND ( ${aqlAssertionMaps.renderedAqlFilterExpr} )

    INSERT newedge into ${edgeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  // console.log(q)
  const cursor = await db.query(q)
  const result = await cursor.next()
  if (result) {
    return result as DocumentEdgeByType<Type>
  }

  // Assertions failed
  const assertionFailedQ = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    ${aqlAssertionMaps.varAssignment} 

    return MERGE(${aqlAssertionMaps.assertionMapVarName},{
      fromExists: !!from,
      toExists: !!to,
      fromDeleted: ${isMarkDeleted('from')},
      toDeleted: ${isMarkDeleted('to')},
    })
  `
  // console.log({ assertionFailedQ })
  const assertionCursor = await db.query(assertionFailedQ)
  const assertionResult = await assertionCursor.next()
  // console.log({ assertionResult })
  const assertionMapValues: {
    [a in Assertion | 'fromExists' | 'toExists' | 'fromDeleted' | 'toDeleted']?: boolean
  } = assertionResult

  const assertionFailedQResult = {
    ...assertionMapValues,
    CreateEdgeAssertionsFailed: 'CreateEdgeAssertionsFailed',
    edgeOpAssertions: aqlAssertionMaps.edgeOpAssertions,
  } as const

  // console.log({ assertionFailedQResult })

  return assertionFailedQResult
}
