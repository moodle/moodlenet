import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { Database } from 'arangojs'
import { EdgeDefinitionOptions } from 'arangojs/graph'
import { EdgeType } from '../../ContentGraph.graphql.gen'

const CONTENT_GRAPH_NAME = 'contentGraph'

export const getGraph = async ({ db }: { db: Database }) => {
  const graphEntries = Object.entries(contentGraphDef.edges)
  const edgeDefinitionOptions: EdgeDefinitionOptions[] = graphEntries.map(([edgeType, [from, to]]) => ({
    collection: edgeType,
    from,
    to,
  }))

  // console.log(inspect(edgeDefinitionOptions, false, 10, true))
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
