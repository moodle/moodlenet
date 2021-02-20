import { Database } from 'arangojs'
import { EdgeDefinitionOptions } from 'arangojs/graph'
import { inspect } from 'util'
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
export const getGraph = async ({ db }: { db: Database }) => {
  const graphEntries = Object.entries(contentGraph)
  const edgeDefinitionOptions = graphEntries.map(([edgeType, edgeOpts]) => {
    return getEdgeDefinition(edgeType as EdgeType, edgeOpts)
  })

  console.log(inspect(edgeDefinitionOptions, false, 10, true))
  const graph =
    (await db.graphs()).find(_graph => _graph.name == CONTENT_GRAPH_NAME) ||
    (await db.createGraph(CONTENT_GRAPH_NAME, edgeDefinitionOptions))

  await Promise.all(
    graphEntries.map(([edgeType]) => {
      const coll = db.collection(edgeType as EdgeType)
      return coll.ensureIndex({ type: 'persistent', fields: ['from', 'to'], name: 'from_to_types' })
    }),
  )

  return graph
}
