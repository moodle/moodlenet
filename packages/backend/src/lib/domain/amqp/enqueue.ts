// import { NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
// import { MoodleNetDomain } from '../../../MoodleNetDomain/MoodleNetDomain'
import { Flow /* , newFlow */ } from '../flow'
import { publishError } from '../misc'
import { defaultEnqueueConfig, EnqueueConfig, LookupWorker, WrkPaths } from '../wrk'
import { getDefaultDomainName } from './env'
import {
  getDomainDelayExchangeName,
  getDomainExchangeName,
  getMachineChannel,
  json2Buffer,
  routingKeyFor,
} from './helpers'

export const enqueue = <D>(domainName = getDefaultDomainName()) => <WrkPath extends WrkPaths<D>>(
  path: WrkPath,
  flow: Flow,
  _cfg?: Partial<EnqueueConfig>,
) => {
  type Worker = LookupWorker<D, WrkPath>
  const cfg = defaultEnqueueConfig(_cfg)
  return (async (...args: any[]) =>
    new Promise(async (res, rej) => {
      const channel = await getMachineChannel(domainName)
      const idDelayed = !!cfg.delayDeliverSecs
      const exchange = idDelayed ? getDomainDelayExchangeName({ domainName }) : getDomainExchangeName({ domainName })

      const routingKey = routingKeyFor(path, flow)
      const content = json2Buffer(args)

      channel.publish(
        exchange,
        routingKey,
        content,
        {
          expiration: idDelayed ? cfg.delayDeliverSecs : undefined,
          persistent: true,
        },
        (err: any) => {
          if (err) {
            rej(publishError(err))
          } else {
            res(null) // should never `.then` on enqueue
          }
        },
      )
    })) as Worker
}

// const create = enqueue<MoodleNetDomain>()('ContentGraph.Node.Create',newFlow(),{})
// create<NodeType.Subject>({input:{name:'',summary:'',icon:''},ctx,nodeType:NodeType.Subject})
// .then(_=>{
//   if(_.__typename=='CreateNodeMutationError'){

//   }else{
//     _.__typename
//   }
// })
