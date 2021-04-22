import { Config } from 'arangojs/connection'
import { resolve } from 'path'
import { setup } from '../lib/domain/amqp/setup'
import { start } from '../lib/domain/amqp/start'
import { DomainSetup, DomainStart } from '../lib/domain/types'
import { MoodleNetDomain } from './MoodleNetDomain'
import {
  defaultArangoContentGraphSetup,
  defaultArangoContentGraphStartServices,
} from './services/ContentGraph/impl/arango/defaultDeploy'
import { defaultArangoEmailSetup, defaultArangoEmailStartServices } from './services/Email/impl/arango/defaultDeploy'
import { createMailgunSender } from './services/Email/sendersImpl/mailgun/mailgunSender'
import { attachGraphQLHTTPGateway } from './services/GraphQLHTTPGateway/GraphQLHTTPGateway'
import { prepareHttpServer } from './services/HTTPServer/HTTPServer'
import { createFSStaticAssets } from './services/StaticAssets/impl/fs/fsStaticAssets'
import { attachStaticAssetsHTTPGateway } from './services/StaticAssets/StaticAssetsHTTPGateway'
import {
  defaultArangoUserAuthImpl,
  defaultArangoUserAuthStartServices,
} from './services/UserAuth/impl/arango/defaultDeploy'

export const startDefaultMoodlenet = async () => {
  const httpGqlPort = Number(process.env.HTTP_GRAPHQL_PORT) || 8080
  const mailgunApiKey = process.env.MAILGUN_API_KEY
  const mailgunDomain = process.env.MAILGUN_DOMAIN
  const arangoUrl = process.env.ARANGO_HOST
  if (!(arangoUrl && mailgunApiKey && mailgunDomain)) {
    throw new Error(`missing env`)
  }
  const expressApp = await prepareHttpServer({ port: httpGqlPort })
  attachGraphQLHTTPGateway({ router: expressApp.serviceRouter })
  const staticAssetIo = createFSStaticAssets({ rootFolder: resolve(process.cwd(), '.staticAssetFs') })
  attachStaticAssetsHTTPGateway({ router: expressApp.serviceRouter, io: staticAssetIo })
  expressApp.start()
  const baseDbCfg: Config = {
    url: arangoUrl,
  }
  const mailgunSender = createMailgunSender({ apiKey: mailgunApiKey, domain: mailgunDomain })
  const defaultMoodlenetSetup: DomainSetup<MoodleNetDomain> = {
    ...defaultArangoContentGraphSetup,
    ...defaultArangoEmailSetup,
    ...defaultArangoUserAuthImpl,
  }

  const defaultMoodlenetStartServices: DomainStart<MoodleNetDomain> = {
    ...defaultArangoContentGraphStartServices({
      dbCfg: {
        ...baseDbCfg,
      },
      databaseName: 'ContentGraph',
    }),
    ...defaultArangoEmailStartServices({
      dbCfg: {
        ...baseDbCfg,
      },
      databaseName: 'Email',
      sender: mailgunSender,
    }),
    ...defaultArangoUserAuthStartServices({
      dbCfg: {
        ...baseDbCfg,
      },
      databaseName: 'UserAuth',
    }),
  }

  await setup(defaultMoodlenetSetup)
  await start(defaultMoodlenetStartServices)
}
