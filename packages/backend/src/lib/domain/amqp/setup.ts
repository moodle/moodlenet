// import { Id } from '@moodlenet/common/lib/utils/content-graph'
// import { MoodleNetDomain } from '../../../MoodleNetDomain/MoodleNetDomain'
// import { Acks } from '../misc'
import { SubDef } from '../sub'
import { DomainSetup } from '../types'
import { WrkDef } from '../wrk'
import {
  DEFAULT_DOMAIN_NAME,
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
  await mainSetup({ domainName })
  await downStream(domainName)
  await delayedTopology(domainName)

  await Promise.all(Object.keys(impl).map(() => setupWorkerOrSubscriber({ domainName, impl })))
  registerImpl(domainName, impl)
}

const setupWorkerOrSubscriber = <D>({ domainName, impl }: { impl: DomainSetup<D>; domainName: string }) => async (
  topic: string,
) => {
  console.log(`setting up ${topic} worker`)
  const domainExchange = getDomainExchangeName({ domainName })

  const item: WrkDef<any> | SubDef<D, any> = impl[topic as keyof typeof impl]

  //const cfg = defaultWrkSetupConfig(item.setupCfg)
  const queue = item.kind === 'wrk' ? getWorkerQName({ domainName, topic }) : getSubscriberQName({ domainName, topic })

  const channel = await getMachineChannel(domainName)
  await channel.assertQueue(queue, { durable: true })
  await channel.bindQueue(queue, domainExchange, `${topic}.*.*`)
  console.log(`* ${topic} worker done`)
}
