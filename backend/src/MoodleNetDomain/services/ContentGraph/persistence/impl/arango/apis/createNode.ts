import { ShallowNode } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode = async (_: { data: ShallowNode }) => {
  const { graph } = await DBReady
  graph.vertexCollection(_.data.__typename)
}
