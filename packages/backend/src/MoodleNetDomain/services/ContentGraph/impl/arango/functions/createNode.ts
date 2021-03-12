import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { CreateNodeData, ShallowNodeByType, ShallowNodeMeta } from '../../../types.node'
import { Persistence } from '../types'

export const createNode = async <Type extends GQL.NodeType>({
  persistence: { graph },
  data,
  nodeType,
  key,
}: {
  persistence: Persistence
  key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
  nodeType: Type
  data: CreateNodeData<Type>
}) => {
  key = key ?? ulidKey()

  const collection = graph.vertexCollection(nodeType)
  const _meta: ShallowNodeMeta = { created: new Date(), updated: new Date() }
  const { new: node } = await collection.save({ ...data, _key: key, __typename: nodeType, _meta }, { returnNew: true })
  return node as ShallowNodeByType<Type>
}
