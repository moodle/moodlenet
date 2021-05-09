import { Database } from 'arangojs'
import { graphqlArangoContentGraphResolvers } from './adapters/content-graph/arangodb/graphql/additional-resolvers'
import { globalSearch } from './adapters/content-graph/arangodb/queries/globalSearch'
import { getNodeByIdArangoAdapter } from './adapters/content-graph/arangodb/queries/node'
import { createGraphQLApp } from './adapters/http/graphqlApp'
import { startMNHttpServer } from './adapters/http/MNHTTPServer'
import { deploy } from './lib/qmino'
import { byId } from './ports/queries/content-graph/get-content-node'
import { search } from './ports/queries/content-graph/global-search'

export const startDefaultMoodlenet = async () => {
  const httpPort = Number(process.env.HTTP_GRAPHQL_PORT) || 8080
  const mailgunApiKey = process.env.MAILGUN_API_KEY
  const mailgunDomain = process.env.MAILGUN_DOMAIN
  const arangoUrl = process.env.ARANGO_HOST
  if (!(arangoUrl && mailgunApiKey && mailgunDomain)) {
    throw new Error(`missing env`)
  }
  const contentGraphDatabase = new Database({ url: arangoUrl, databaseName: 'ContentGraph' })
  const arangoContentGraphAdditionalGQLResolvers = graphqlArangoContentGraphResolvers(contentGraphDatabase)
  const graphqlApp = createGraphQLApp({
    additionalResolvers: { ...arangoContentGraphAdditionalGQLResolvers },
  })
  /* const expressApp = */ await startMNHttpServer({
    httpPort,
    startServices: { graphql: graphqlApp },
  })
  graphqlArangoContentGraphResolvers

  deployPorts(contentGraphDatabase)
}

const deployPorts = (db: Database) => {
  deploy(byId, getNodeByIdArangoAdapter(db))
  deploy(search, globalSearch(db))
}
