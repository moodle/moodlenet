import { EdgeDefinitionOptions } from 'arangojs/graph'
import * as Yup from 'yup'
import { createDatabaseIfNotExists } from '../../../../../../lib/helpers/arango'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { contentGraph } from '../../../graphDefinition'
import { EdgeOptions } from '../../../graphDefinition/types'

interface ArangoContentGraphPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoContentGraphPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required().default('ContentGraph'),
})

const ARANGO_URL = process.env.CONTENTGRAPH_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.CONTENTGRAPH_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

export const database = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})

const getEdgeDefinition = (edgeType: EdgeType, edgeOptions: EdgeOptions): EdgeDefinitionOptions => {
  const [from, to] = edgeOptions.connections
    .reduce(
      (_from_to, opt) => {
        const [_from, _to] = _from_to
        _from.add(opt.from)
        _to.add(opt.to)
        return _from_to
      },
      [new Set<NodeType>(), new Set<NodeType>()],
    )
    .map(_ => [..._])
  return {
    collection: edgeType,
    from,
    to,
  }
}
const contentGraphName = 'contentGraph'
const graphP = database.then(async db => {
  const edgeDefinitionOptions = Object.entries(contentGraph).map(([edgeType, edgeOpts]) =>
    getEdgeDefinition(edgeType as EdgeType, edgeOpts),
  )
  const graph =
    (await db.graphs()).find(_ => _.name == contentGraphName) || (await db.createGraph(contentGraphName, []))
  await Promise.all(
    edgeDefinitionOptions.map(_ => {
      graph.replaceEdgeDefinition(_)
    }),
  )
  return graph
})

export const DBReady = Promise.all([database, graphP]).then(([db, graph]) => {
  return {
    db,
    graph,
  }
})
