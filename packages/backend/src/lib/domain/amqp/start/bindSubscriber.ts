import { Acks } from '../../misc'
import { SubConfig, SubscriberService } from '../../sub'
import { isReplyError, wrkReplyError } from '../../wrk'
import { getMessagePayload, getSubscriberQName, getTopicChannel, msgFlow, NOT_PARSED } from '../helpers'

export const bindSubscriber = async (
  domainName: string,
  subSrv: SubscriberService<any, any>,
  src: string,
  targetTopic: string,
  cfg: SubConfig,
) => {
  const [handler] = subSrv
  const [channel] = await getTopicChannel(domainName, targetTopic, cfg.parallelism)
  const queue = getSubscriberQName({ domainName, topic: targetTopic })
  const { consumerTag } = await channel.consume(queue, async msg => {
    if (!msg) {
      return
    }
    const payload = getMessagePayload(msg)
    if (payload === NOT_PARSED) {
      return channel.reject(msg, false)
    }
    const flow = msgFlow(msg)
    handler({ t: src, p: payload, flow })
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
