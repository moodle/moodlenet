import { Acks } from '../../misc'
import { SubConfig, SubscriberService } from '../../sub'
import { isReplyError, wrkReplyError } from '../../wrk'
import { getMessagePayload, getSubscriberQName, getTopicChannel, msgFlow, NOT_PARSED } from '../helpers'

export const bindSubscriber = async (
  domainName: string,
  subSrv: SubscriberService<any, any>,
  topic: string,
  cfg: SubConfig,
) => {
  const [handler] = subSrv
  const [channel] = await getTopicChannel(domainName, topic, cfg.parallelism)
  const queue = getSubscriberQName({ domainName, topic })
  const { consumerTag } = await channel.consume(queue, async msg => {
    if (!msg) {
      return
    }
    const payload = getMessagePayload(msg)
    if (payload === NOT_PARSED) {
      channel.reject(msg, false)
      return
    }
    const flow = msgFlow(msg)
    handler(payload, flow)
      .then(resp => {
        if (isReplyError(resp)) {
          return Promise.reject(resp)
        }
        channel.ack(msg)
        return resp
      })
      .catch((err: any) => {
        if (cfg.rejectionAck !== Acks.Done) {
          channel.reject(msg, cfg.rejectionAck === Acks.Requeue)
        } else {
          channel.ack(msg)
        }
        return wrkReplyError(err)
      })
  })
  return () => channel.cancel(consumerTag)
}
