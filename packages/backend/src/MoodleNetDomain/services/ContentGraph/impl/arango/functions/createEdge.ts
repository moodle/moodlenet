import { Id, IdKey, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { getConnectionDef } from '../../../graphDefinition'
import { CreateEdgeData, ShallowEdgeByType, ShallowEdgeMeta } from '../../../types.node'
import { Persistence } from '../types'

export const createEdge = async <Type extends GQL.EdgeType>({
  persistence: { graph },
  data,
  edgeType,
  from,
  to,
  key,
}: {
  persistence: Persistence
  edgeType: Type
  key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
  data: CreateEdgeData<Type>
  from: Id
  to: Id
}) => {
  key = key ?? ulidKey()

  // const { auth } = ctx
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const connection = getConnectionDef({
    edge: edgeType,
    from: fromType,
    to: toType,
  })
  if (!connection) {
    return null
  }

  const collection = graph.edgeCollection(edgeType)
  const _meta: ShallowEdgeMeta = { created: new Date(), updated: new Date() }
  const { new: edge } = await collection.save(
    {
      ...data,
      _fromType: fromType,
      __typename: edgeType,
      _toType: toType,
      _meta,
      //
      _from: from,
      _to: to,
      _key: key,
    },
    { returnNew: true },
  )
  return edge as ShallowEdgeByType<Type>
}
