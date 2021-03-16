import { Config } from 'arangojs/connection'
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
import {
  defaultArangoUserAuthImpl,
  defaultArangoUserAuthStartServices,
} from './services/UserAuth/impl/arango/defaultDeploy'

export const startDefaultMoodlenet = async ({
  arangoUrl,
  mailgunApiKey,
  mailgunDomain,
}: {
  arangoUrl: string
  mailgunApiKey: string
  mailgunDomain: string
}) => {
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
