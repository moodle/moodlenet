// import { Id } from '@moodlenet/common/lib/utils/content-graph'
// import { MoodleNetDomain } from '../../../MoodleNetDomain/MoodleNetDomain'
// import { Acks } from '../misc'
import { DomainImpl } from '../impl'
import { Sub } from '../sub'
import { defaultWrkConfig, Wrk } from '../wrk'
import {
  DEFAULT_DOMAIN_NAME,
  delayedTopology,
  downStream,
  getDomainExchangeName,
  getSubscriberQName,
  getTopicChannel,
  getWorkerQName,
  mainSetup,
  registerImpl,
} from './helpers'

export const setup = async <D>(impl: DomainImpl<D>, domainName = DEFAULT_DOMAIN_NAME) => {
  await mainSetup({ domainName })
  await downStream(domainName)
  await delayedTopology(domainName)

  await Promise.all(Object.keys(impl).map(setupWorkerOrSubscriber({ domainName, impl })))
  registerImpl(domainName, impl)
}

const setupWorkerOrSubscriber = <D>({ domainName, impl }: { impl: DomainImpl<D>; domainName: string }) => async (
  topic: string,
) => {
  console.log(`setting up ${topic} worker`)
  const domainExchange = getDomainExchangeName({ domainName })

  const item: Wrk<any> | Sub<D, any> = impl[topic as keyof typeof impl]
  const cfg = defaultWrkConfig(item.cfg)
  const queue = item.kind === 'wrk' ? getWorkerQName({ domainName, topic }) : getSubscriberQName({ domainName, topic })

  const [channel] = await getTopicChannel(domainName, topic, cfg.parallelism)
  await channel.assertQueue(queue, { durable: true })
  await channel.bindQueue(queue, domainExchange, `${topic}.*.*`)
  console.log(`* ${topic} worker done`)
}

// setup<MoodleNetDomain>({
//   'ContentGraph.Counters.GlyphCreate': {
//     kind: 'sub',
//     events: ['ContentGraph.Edge.Created', 'ContentGraph.Node.Created'],
//     init: () => [
//       async evt => {
//         if (evt.t === 'ContentGraph.Edge.Created') {
//           evt.p.edge
//         } else {
//           evt.p.node
//         }
//         return Acks.Done
//       },
//       () => {},
//     ],
//     cfg: { parallelism: 10, rejectionAck: Acks.Reject, timeout: 10 },
//   },
//   'ContentGraph.Edge.Create': {
//     kind: 'wrk',
//     init: () => [
//       async s => {
//         return { __typename: s.edgeType, _id: '' as Id }
//       },
//       () => {},
//     ],
//     cfg: { call: { rejectionAck: Acks.Done }, consumer: { parallelism: 10 } },
//   },
//   'ContentGraph.GQL': {} as any,
//   'ContentGraph.Node.ById': {} as any,
//   'ContentGraph.Node.Create': {} as any,
//   'UserAccount.GQL': {} as any,
// })
