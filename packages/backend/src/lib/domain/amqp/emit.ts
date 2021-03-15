// import { Id } from '@moodlenet/common/lib/pub-graphql/types'
// import { MoodleNetDomain } from '../../../MoodleNetDomain/MoodleNetDomain'
import { EventPaths, LookupEventType } from '../event'
import { Flow /* , newFlow */ } from '../flow'
import { publishError } from '../misc'
import { getDefaultDomainName } from './env'
import { getDomainExchangeName, getMachineChannel, json2Buffer, routingKeyFor } from './helpers'

export const emit = <D>(domainName = getDefaultDomainName()) => <EventPath extends EventPaths<D>>(
  path: EventPath,
  payload: LookupEventType<D, EventPath>,
  flow: Flow,
) =>
  new Promise(async (res, rej) => {
    const channel = await getMachineChannel(domainName)
    const exchange = getDomainExchangeName({ domainName })

    const routingKey = routingKeyFor(path, flow)
    const content = json2Buffer(payload)
    channel.publish(exchange, routingKey, content, { persistent: true }, (err: any) => {
      if (err) {
        rej(publishError(err))
      } else {
        res(null)
      }
    })
  })

// emit<MoodleNetDomain>()(
//   'ContentGraph.Node.Created',
//   {
//     node: { __typename: 'Subject', name: '', _id: '' as Id, _rel: {} as any, summary: '', _meta: {} as any, icon: '' },
//   },
//   newFlow(),
// )
