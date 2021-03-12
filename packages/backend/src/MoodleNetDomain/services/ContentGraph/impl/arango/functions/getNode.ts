import { Id, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { ShallowNode } from '../../../types.node'
import { Persistence } from '../types'

export const getNode = async <Type extends GQL.Node = GQL.Node>({
  persistence: { graph },
  _id,
}: {
  persistence: Persistence
  _id: Id
}) => {
  const { nodeType, _key } = parseNodeId(_id)
  const collection = graph.vertexCollection(nodeType)
  const node = await collection.vertex({ _key })
  return node as ShallowNode<Type> | null
}
