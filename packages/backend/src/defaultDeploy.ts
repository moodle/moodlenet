import { Database } from 'arangojs'
import { Config } from 'arangojs/connection'
import { getNode } from './adapters/content-graph/arangodb/functions/getNode'
import { startMNHttpServer } from './adapters/http/MNHTTPServer'
import { bind, deploy } from './lib/qmino/root'
import { QMDeployerProvider } from './lib/qmino/types'
import { byId } from './ports/queries/content-graph/get-content-node'

let contentGraphDatabase: Database
export const startDefaultMoodlenet = async () => {
  const httpGqlPort = Number(process.env.HTTP_GRAPHQL_PORT) || 8080
  const mailgunApiKey = process.env.MAILGUN_API_KEY
  const mailgunDomain = process.env.MAILGUN_DOMAIN
  const arangoUrl = process.env.ARANGO_HOST
  contentGraphDatabase = new Database({ url: arangoUrl, databaseName: 'ContentGraph' })
  bindPorts()
  activateActions(contentGraphDatabase)
  if (!(arangoUrl && mailgunApiKey && mailgunDomain)) {
    throw new Error(`missing env`)
  }
  /* const expressApp = */ await startMNHttpServer({
    port: httpGqlPort,
    startServices: ['graphql'],
  })

  const baseDbCfg: Config = {
    url: arangoUrl,
  }
  return baseDbCfg
}

const bindPorts = () => {
  bind(byId, getNodeByIdArangoAdapter)
}

const getNodeByIdArangoAdapter: QMDeployerProvider<typeof byId> = async () => [
  (_action, args, port) => () => {
    /*_action({ getNodeByIdAndAssertions ...*/
    return port(...args)({
      getNodeByIdAndAssertions: async ({ _key, nodeType, assertions }) => {
        const q = getNode({ _key, nodeType, assertions })
        return getOneResult(q, contentGraphDatabase)
      },
    })
  },
  async () => {},
]
const getOneResult = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  const result = await cursor.next()
  cursor.kill()
  return result
}
const activateActions = (_database: Database) => {
  deploy(byId)
}
