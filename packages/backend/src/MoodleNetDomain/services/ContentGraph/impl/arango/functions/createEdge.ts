import { Assertion } from '@moodlenet/common/lib/content-graph'
import { EdgeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Id, IdKey, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { aqlstr, ulidKey } from '../../../../../../lib/helpers/arango'
import { getSessionContext } from '../../../../../MoodleNetGraphQL'
import { MoodleNetAuthenticatedExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { CreateEdgeData, ShallowEdgeByType, ShallowEdgeMeta } from '../../../types.node'
import { Persistence } from '../types'
import { getEdgeOpAqlAssertions } from './assertions/edge'

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
  data: CreateEdgeData<Type>
  from: Id
  to: Id
}) => {
  key = key ?? ulidKey()

  const { profileId: creatorId } = getSessionContext(ctx)
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const aqlAssertionMaps = getEdgeOpAqlAssertions({ ctx, edgeType, edgeVar: null, op: 'create', fromType, toType })
  if (typeof aqlAssertionMaps === 'string') {
    return aqlAssertionMaps
  }

  const _meta: ShallowEdgeMeta = {
    creator: { _id: creatorId } as GQL.Profile,
    created: new Date(),
    updated: new Date(),
  }
  const newedge = {
    ...data,
    __typename: edgeType,
    _fromType: fromType,
    _toType: toType,
    _meta,
    //
    _from: from,
    _to: to,
    _key: key,
  }

  const q = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    let newedge = ${aqlstr(newedge)}

    FILTER !!from AND !!to AND ( ${aqlAssertionMaps.filter} )

    INSERT newedge into ${edgeType}

    return NEW
  `
  console.log(q)
  const cursor = await db.query(q)
  const result = await cursor.next()
  if (result) {
    return result as ShallowEdgeByType<Type>
  }

  // Assertions failed
  const assertionFailedQ = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    ${aqlAssertionMaps.varAssignment} 

    return MERGE(${aqlAssertionMaps.assertionMapVarName},{
      fromExists: !!from,
      toExists: !!to,
    })
  `
  console.log({ assertionFailedQ })
  const assertionCursor = await db.query(assertionFailedQ)
  const assertionResult = await assertionCursor.next()
  const assetionMapValues: {
    [a in Assertion | 'fromExists' | 'toExists']?: boolean
  } = assertionResult

  const assertionFailedQResult = {
    ...assetionMapValues,
    CreateEdgeAssertionsFailed: 'CreateEdgeAssertionsFailed',
    edgeOpAssertions: aqlAssertionMaps.edgeOpAssertions,
  } as const

  console.log({ assertionFailedQResult })

  return assertionFailedQResult
}
