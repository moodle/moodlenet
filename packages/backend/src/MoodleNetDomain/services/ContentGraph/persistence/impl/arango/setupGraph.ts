import { Database } from 'arangojs'
import { EdgeDefinitionOptions } from 'arangojs/graph'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { contentGraph } from '../../../graphDefinition'
import { EdgeOptions } from '../../../graphDefinition/types'

const CONTENT_GRAPH_NAME = 'contentGraph'

const getEdgeDefinition = (edgeType: EdgeType, edgeOptions: EdgeOptions): EdgeDefinitionOptions => {
  const fromSet = new Set<NodeType>()
  const toSet = new Set<NodeType>()
  edgeOptions.connections.forEach(opt => {
    fromSet.add(opt.from)
    toSet.add(opt.to)
  })
  return {
    collection: edgeType,
    from: [...fromSet],
    to: [...toSet],
  }
}
export const setupGraph = async ({ db }: { db: Database }) => {
  const edgeDefinitionOptions = Object.entries(contentGraph).map(([edgeType, edgeOpts]) =>
    getEdgeDefinition(edgeType as EdgeType, edgeOpts),
  )
  const graph =
    (await db.graphs()).find(_graph => _graph.name == CONTENT_GRAPH_NAME) ||
    (await db.createGraph(CONTENT_GRAPH_NAME, edgeDefinitionOptions))

  await Promise.all(
    edgeDefinitionOptions.map(_ =>
      graph.removeEdgeDefinition(_.collection, false).then(() => graph.addEdgeDefinition(_)),
    ),
  )

  return graph
}
