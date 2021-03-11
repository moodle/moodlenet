require('./env')
import { setup } from './src/lib/domain/amqp/setup'
import { start, StartServices } from './src/lib/domain/amqp/start'
import { DomainSetup } from './src/lib/domain/types'
import { defaultMoodlenetImpl, defaultMoodlenetStartServices } from './src/MoodleNetDomain/defaultDeploy'
import { MoodleNetDomain } from './src/MoodleNetDomain/MoodleNetDomain'

const implModule = process.env.MOODLENET_IMPL_MODULE
const impl: DomainSetup<MoodleNetDomain> = implModule ? require(implModule) : defaultMoodlenetImpl

const startServicesModule = process.env.MOODLENET_START_SERVICES_MODULE
const services: StartServices<MoodleNetDomain> = startServicesModule
  ? require(startServicesModule)
  : defaultMoodlenetStartServices

setup(impl).then(() => start(services))
