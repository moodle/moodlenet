import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { ShallowNodeByType } from '../../../types.node'
import { Persistence } from '../types'

export const getNode = async <Type extends GQL.NodeType = GQL.NodeType>({
  persistence: { graph },
  nodeType,
  _key,
}: {
  persistence: Persistence
  _key: IdKey
  nodeType: Type
}) => {
  // console.log(`getNode`, { _key, nodeType })
  const collection = graph.vertexCollection(nodeType)
  const node = await collection.vertex({ _key }).catch(() => null)
  return node as ShallowNodeByType<Type> | null
}
