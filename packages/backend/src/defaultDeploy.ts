import { Config } from 'arangojs/connection'
import { startMNHttpServer } from './adapters/http/MNHTTPServer'
import { activate, deployer } from './lib/qmino/root'
import { getContentNodeById } from './ports/content-graph/queries'

export const startDefaultMoodlenet = async () => {
  const httpGqlPort = Number(process.env.HTTP_GRAPHQL_PORT) || 8080
  const mailgunApiKey = process.env.MAILGUN_API_KEY
  const mailgunDomain = process.env.MAILGUN_DOMAIN
  const arangoUrl = process.env.ARANGO_HOST
  deployActions()
  activateActions()
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

const deployActions = () => {
  deployer(getContentNodeById, async () => [
    (command /* , args, action */) => () => command(async () => 'ciccio'),
    async () => {},
  ])
}

const activateActions = () => {
  activate(getContentNodeById)
}
