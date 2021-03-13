// import { Id } from '@moodlenet/common/lib/utils/content-graph'
// import { MoodleNetDomain } from '../../../MoodleNetDomain/MoodleNetDomain'
// import { Acks } from '../misc'
import { SubDef } from '../sub'
import { DomainSetup } from '../types'
import { WrkDef } from '../wrk'
import { DEFAULT_DOMAIN_NAME } from './env'
import {
  delayedTopology,
  downStream,
  getDomainExchangeName,
  getMachineChannel,
  getSubscriberQName,
  getWorkerQName,
  mainSetup,
  registerImpl,
} from './helpers'

export const setup = async <D>(impl: DomainSetup<D>, domainName = DEFAULT_DOMAIN_NAME) => {
  console.log(`\n\n setup ${domainName}\n`)
  await mainSetup({ domainName })
  await downStream(domainName)
  await delayedTopology(domainName)

  await Object.keys(impl).reduce<Promise<void>>(
    (last, topic) => last.then(() => setupWorkerOrSubscriber({ domainName, impl, topic })),
    Promise.resolve(),
  )
  registerImpl(domainName, impl)
}

const setupWorkerOrSubscriber = async <D>({
  domainName,
  impl,
  topic,
}: {
  impl: DomainSetup<D>
  domainName: string
  topic: string
}) => {
  console.log(`setting up ${topic} worker`)
  const domainExchange = getDomainExchangeName({ domainName })

  const item: WrkDef<any> | SubDef<D, any> = impl[topic as keyof typeof impl]

  //const cfg = defaultWrkSetupConfig(item.setupCfg)
  const queue = item.kind === 'wrk' ? getWorkerQName({ domainName, topic }) : getSubscriberQName({ domainName, topic })
  const bindTopic = item.kind === 'wrk' ? topic : item.event

  const channel = await getMachineChannel(domainName)
  await channel.assertQueue(queue, { durable: true })
  await channel.bindQueue(queue, domainExchange, `${bindTopic}.*.*`)
  console.log(`* ${topic} worker setup done\n`)
}
