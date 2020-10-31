// import {
//   Job,
//   JobsOptions,
//   Queue,
//   QueueBaseOptions,
//   QueueOptions,
//   Worker,
//   WorkerOptions,
// } from 'bullmq'
import { Message, Options, Replies } from 'amqplib'
import { Service } from '../moleculer'
import { uuid } from '../services/email/helpers'
import { channelP } from './queue.env'
export const SERVICE_DELAY_Q_PREFIX = 'SRV_DELAY_Q'
export type JobUnexpectedError = { jobError: string; jobId?: string }

export type MNQPublishOpts = Options.Publish & {
  jobName?: string
  // delay?: number
  // 'x-dead-letter-exchange'?: string
  // 'x-dead-letter-routing-key'?: string
  // 'x-message-ttl'?: string
}
export type MNQAssertQueueOpts = Options.AssertQueue & {}
export type MNQConsumeOpts = Options.Consume & {}
export type MNQJsonMessage<T> = Message & {
  json: T
}

export const BASE_ASSERT_Q_OPTS = (): MNQAssertQueueOpts => ({
  durable: true,
})
export const DEFAULT_SEND_TO_QUEUE_OPTS = (): MNQPublishOpts => ({
  // persistent: true, // won't work ..
  deliveryMode: 2,
})
export const DEFAULT_CONSUME_OPTS = (): MNQConsumeOpts => ({})

type QueueAdder<JobParams> = (
  _jobData: JobParams,
  _jobOpts?: MNQPublishOpts
) => Promise<string | false>

export const ServiceQueue = <S extends Service>(srvName: S['name']) => {
  type AssertServiceQueueOpts<JobParams> = {
    qOpts?: MNQAssertQueueOpts
    defaultJobOpts?: MNQPublishOpts
    addToQueueGuard?: (
      jobData: JobParams,
      jobOpts?: MNQPublishOpts
    ) => [jobDdata: JobParams, jobOpts: MNQPublishOpts]
  }

  const serviceQueue = <
    JobParams,
    JobProgress extends { type: string },
    QName extends string = string
  >(
    qName: QName,
    { addToQueueGuard, defaultJobOpts, qOpts }: AssertServiceQueueOpts<JobParams> = {}
  ) => {
    const fullQName = `${srvName}.${qName}`
    const srvDelayedQName = `${srvName}:${SERVICE_DELAY_Q_PREFIX}`
    const ch_Q = (() => {
      // on demand asserrts Queue and returns it with channel
      let _q: Replies.AssertQueue
      return async () => {
        const channel = await channelP
        if (!_q) {
          _q = await (await channelP).assertQueue(fullQName, {
            ...BASE_ASSERT_Q_OPTS(),
            ...qOpts,
          })
        }
        return [channel, _q] as const
      }
    })()

    const assertDelayQueue = async () =>
      (await channelP).assertQueue(srvDelayedQName, {
        ...BASE_ASSERT_Q_OPTS(),
        deadLetterRoutingKey: fullQName,
        deadLetterExchange: '',
      })

    const addToQueue: QueueAdder<JobParams> = async (_jobData, _jobOpts) => {
      const [jobDdata, jobOpts] = addToQueueGuard
        ? addToQueueGuard(_jobData, _jobOpts)
        : [_jobData, _jobOpts]
      const [channel, q] = await ch_Q()
      const messageId = uuid()
      const publishOpts: MNQPublishOpts = {
        ...DEFAULT_SEND_TO_QUEUE_OPTS(),
        ...defaultJobOpts,
        ...jobOpts,
        contentType: 'application/json',
        messageId,
      }
      console.log('publishOpts', publishOpts)
      if (publishOpts.expiration) {
        const delayedQ = await assertDelayQueue()
        return channel.sendToQueue(delayedQ.queue, json2Buffer(jobDdata), publishOpts) && messageId
      } else {
        return channel.sendToQueue(q.queue, json2Buffer(jobDdata), publishOpts) && messageId
      }
    }

    type ForwardJob = <QAdder extends QueueAdder<any>>(
      queueAdder: QAdder,
      sourceMsg: MNQJsonMessage<JobParams>,
      jobData: QAdder extends QueueAdder<infer T> ? T : never,
      jobOpts?: MNQPublishOpts | undefined
    ) => Promise<string | false>
    const forwardJob: ForwardJob = (queueAdder, sourceMsg, jobData, jobOpts) => {
      return queueAdder(jobData, { ...jobOpts, replyTo: sourceMsg.properties.replyTo })
    }
    type ProgressJob = (
      sourceMsg: MNQJsonMessage<JobParams>,
      progress: JobProgress
    ) => Promise<boolean>

    const progressJob: ProgressJob = async (sourceMsg, progress) => {
      const [channel] = await ch_Q()
      const replyToQ = sourceMsg.properties.replyTo
      return typeof replyToQ === 'string'
        ? channel.sendToQueue(replyToQ, json2Buffer(progress), DEFAULT_SEND_TO_QUEUE_OPTS())
        : false
    }

    type WorkerHandler = (
      msg: MNQJsonMessage<JobParams>,
      progress: ProgressJob,
      forward: ForwardJob
    ) => Promise<any>

    const makeWorker = async (handler: WorkerHandler, mkWConsuleopts?: MNQConsumeOpts) => {
      const [channel] = await ch_Q()
      return channel.consume(
        fullQName,
        (msg) => {
          msg &&
            handler({ ...msg, json: buffer2Json(msg.content) }, progressJob, forwardJob).then(
              () => {
                channel.ack(msg)
              },
              () => {
                channel.nack(msg)
              }
            )
        },
        {
          ...DEFAULT_CONSUME_OPTS(),
          ...mkWConsuleopts,
        }
      )
    }

    return [addToQueue, makeWorker] as const
  }

  return serviceQueue
}
export const json2Buffer = (json: any) => Buffer.from(JSON.stringify(json))
export const buffer2Json = (buf: Buffer) => JSON.parse(buf.toString('utf-8'))
