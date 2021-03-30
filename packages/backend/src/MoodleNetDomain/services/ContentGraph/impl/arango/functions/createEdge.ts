import { GlyphAssertion } from '@moodlenet/common/lib/content-graph'
import { ConnAssertion, EdgeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Id, IdKey, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { aqlstr, ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetExecutionContext } from '../../../../../types'
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
  ctx: MoodleNetExecutionContext
  edgeType: Type
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  data: CreateEdgeData<Type>
  from: Id
  to: Id
}) => {
  key = key ?? ulidKey()

  // const { auth } = ctx
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const assertions = getEdgeOpAqlAssertions({ ctx, edgeType, fromType, toType, edgeVar: null, op: 'create' })
  if (!assertions) {
    return null
  }

  const _meta: ShallowEdgeMeta = { created: new Date(), updated: new Date() }
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
  const aqlAssertionMaps = getEdgeOpAqlAssertions({ ctx, edgeType, edgeVar: null, op: 'create', fromType, toType })

  const q = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})

    FILTER !!from AND !!to AND ( ${aqlAssertionMaps.filter} )

    INSERT ${aqlstr(newedge)} into ${edgeType}

    return NEW
  `
  console.log(q)
  const cursor = await db.query(q)
  const result = await cursor.next()
  if (result) {
    return result as ShallowEdgeByType<Type>
  }
  const assertionQ = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    ${aqlAssertionMaps.varAssignment} 

    return MERGE(${aqlAssertionMaps.assertionMapVarName},{
      fromExists: !!from,
      toExists: !!to,
    })
  `
  console.log(assertionQ)
  const assertionCursor = await db.query(assertionQ)
  const assertionResult = await assertionCursor.next()
  const assetionMapValues: {
    [a in ConnAssertion | GlyphAssertion | 'fromExists' | 'toExists']: boolean
  } = assertionResult

  const assertionFailedResult = {
    ...assetionMapValues,
    CreateEdgeAssertionsFailed: 'CreateEdgeAssertionsFailed',
    edgeOpAssertions: aqlAssertionMaps.edgeOpAssertions,
  } as const

  console.log({ assertionFailedResult })

  return assertionFailedResult
}
