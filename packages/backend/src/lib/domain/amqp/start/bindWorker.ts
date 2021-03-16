import { isArray } from 'lodash'
import { Acks } from '../../misc'
import { WorkerService, WrkConfig, wrkReplyError } from '../../wrk'
import { getMessagePayload, getTopicChannel, getWorkerQName, json2Buffer, NOT_PARSED } from '../helpers'
export const bindWorker = async (domainName: string, wrkSrv: WorkerService<any>, topic: string, cfg: WrkConfig) => {
  const [handler] = wrkSrv
  const [channel] = await getTopicChannel(domainName, topic, cfg.parallelism)
  const queue = getWorkerQName({ domainName, topic })
  const { consumerTag } = await channel.consume(queue, async msg => {
    if (!msg) {
      return
    }
    const args = getMessagePayload(msg)
    if (args === NOT_PARSED) {
      channel.reject(msg, false)
      console.error(
        `Rejecting amqp message[${msg.properties.messageId}] for ${domainName}:${topic}: cannot JSON.parse content`,
      )
      return
    }
    if (!isArray(args)) {
      channel.reject(msg, false)
      console.error(
        `Rejecting amqp message[${msg.properties.messageId}] for ${domainName}:${topic}: args should be an array : ${args}`,
      )
      return
    }

    // const flow = msgFlow(msg)
    handler(...args)
      .then(
        (resp: any) => {
          channel.ack(msg)
          return resp
        },
        (err: any) => {
          if (cfg.rejectionAck !== Acks.Done) {
            channel.reject(msg, cfg.rejectionAck === Acks.Requeue)
          } else {
            channel.ack(msg)
          }
          return wrkReplyError({ err, wrk: topic })
        },
      )
      .then((replyWith: any) => {
        const replyQ = msg.properties.replyTo
        if (replyQ) {
          channel.sendToQueue(replyQ, json2Buffer(replyWith), {
            correlationId: msg.properties.messageId,
          })
          return
        }
      })
  })
  return () => channel.cancel(consumerTag)
}
