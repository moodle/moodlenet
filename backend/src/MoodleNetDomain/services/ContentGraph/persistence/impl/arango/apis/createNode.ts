import { ContentGraphPersistence, ShallowNode } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode: ContentGraphPersistence['createNode'] = async (_: {
  data: ShallowNode
}) => {
  const { graph } = await DBReady
  const nodeType = _.data.__typename
  const collection = graph.vertexCollection(nodeType)
  const nodeAccessFilter = getGlyphBasicAccessFilter({
    glyphTag: 'node',
    policy,
    ctx,
    engine: basicAccessFilterEngine,
  })
  collection.save({})
}
