// import { EdgeType, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
// import { MoodleNetDomain } from '../../../MoodleNetDomain/MoodleNetDomain'
import { Flow } from '../flow'
import { publishError } from '../misc'
import {
  CallConfig,
  defaultCallConfig,
  isReplyError,
  LookupWorker,
  WrkLeaves,
  wrkReplyError,
  wrkTimeoutError,
} from '../wrk'
import { machineId } from './env'
import {
  DEFAULT_DOMAIN_NAME,
  downStream,
  getDomainExchangeName,
  getMachineChannel,
  json2Buffer,
  routingKeyFor,
} from './helpers'

let callCount = 0
const makeCallMessageId = () => `${machineId}.${Number(new Date())}.${(callCount = callCount++ & 65535)}`
const DEF_LAG_TIMEOUT = 300

export const call = <D>(domainName = DEFAULT_DOMAIN_NAME) => <WrkPath extends WrkLeaves<D>>(
  path: WrkPath,
  flow: Flow,
  _cfg?: Partial<CallConfig>,
) => {
  type Worker = LookupWorker<D, WrkPath>
  const cfg = defaultCallConfig(_cfg)
  // console.log(`prepare call publish`, { path,flow })
  return (async (...args: any[]) =>
    new Promise(async (res, _rej) => {
      // console.log(`call`, args)
      const rej = (err: any) => {
        _rej(err)
        unsub()
      }

      const channel = await getMachineChannel(domainName)
      const exchange = getDomainExchangeName({ domainName })
      const { queue: replyTo, sub } = await downStream(domainName)

      const messageId = makeCallMessageId()
      const unsub = sub({
        messageId,
        handler: ({ jsonContent /* , msg, messageId */ }) => {
          // console.log(`reply`, jsonContent)

          if (isReplyError(jsonContent)) {
            rej(wrkReplyError(jsonContent))
          } else {
            res(jsonContent)
          }
        },
      })

      setTimeout(() => rej(wrkTimeoutError(cfg.timeout)), cfg.timeout + DEF_LAG_TIMEOUT)

      const routingKey = routingKeyFor(path, flow)
      const content = json2Buffer(args)

      // console.log(`call publish`, { exchange, routingKey, messageId, replyTo })
      channel.publish(
        exchange,
        routingKey,
        content,
        { messageId, replyTo, expiration: cfg.timeout, persistent: true },
        (err: any) => {
          if (err) {
            console.log(`err`, err)
            rej(publishError(err))
          }
        },
      )
    })) as Worker
}

// const create = call<MoodleNetDomain>()('ContentGraph.Node.Create',newFlow(),2000)
// create<NodeType.Collection>({input:{name,summary,icon}})
// .then(_=>{
//   if(_.__typename=='CreateNodeMutationError'){

//   }else{
//     _.
//   }
// })
