import { Id, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const getNode: ContentGraphPersistence['getNode'] = async (_: { _id: Id }) => {
  const { graph } = await DBReady()
  const { nodeType, _key } = parseNodeId(_._id)
  const collection = graph.vertexCollection(nodeType)
  const node = await collection.vertex({ _key })
  return node
}
