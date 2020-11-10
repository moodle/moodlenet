import { Message, Replies } from 'amqplib'
import { uuid } from '../helpers/misc'
import { Service } from '../moleculer'
import { channelPromise } from './queue.env'
import {
  ForwardJob,
  JobProgressStates,
  MNQAssertQueueOpts,
  MNQConsumeOpts,
  MNQJsonMessage,
  MNQPublishOpts,
  ProgressJob,
  WorkerHandler,
  QueueAdder,
  MNQJobMeta,
  ServiceQueueOpts,
  QueueWorkerMaker,
  WorkflowMap,
} from './types'
export const DELAYED_Q_POSTFIX = 'DELAYED'

export const BASE_ASSERT_Q_OPTS = (): MNQAssertQueueOpts => ({
  durable: true,
})
export const DEFAULT_PUBLISH_OPTS = <JobProgress>(
  _: Pick<MNQJsonMessage<JobProgress>, 'jobName' | 'jobId'>
): MNQPublishOpts<JobProgress> => ({
  // persistent: true, // won't work ... deliveryMode:2 is ok
  deliveryMode: 2,
  correlationId: _.jobId,
  type: _.jobName,
})
export const DEFAULT_CONSUME_OPTS = (): MNQConsumeOpts => ({})

export const ServiceQueue = <S extends Service>(srvName: S['name']) => {
  const makeServiceWorkflow = <JobProgress extends JobProgressStates, QueueParamsMap>(
    _: {
      [QNM in keyof QueueParamsMap]: ServiceQueueOpts<QueueParamsMap[QNM], JobProgress> | null
    }
  ): WorkflowMap<JobProgress, QueueParamsMap> =>
    Object.entries(_).reduce(
      (red, [qname, opts]) => ({
        ...red,
        [qname]: makeServiceQueue(qname, (opts as any) || {}),
      }),
      {} as any
    )

  const makeServiceQueue = <
    JobParams,
    JobProgress extends JobProgressStates,
    QName extends string = string
  >(
    qName: QName,
    { addToQueueGuard, defaultJobOpts, qOpts }: ServiceQueueOpts<JobParams, JobProgress> = {}
  ) => {
    const fullQName = `${srvName}.${qName}`
    const delayedQName = `${fullQName}:${DELAYED_Q_POSTFIX}`
    const ch_Q = (() => {
      // on demand asserts Queue and returns it with channel (local) singletons
      let _q: Replies.AssertQueue
      return async () => {
        const channel = await channelPromise
        if (!_q) {
          _q = await (await channelPromise).assertQueue(fullQName, {
            ...BASE_ASSERT_Q_OPTS(),
            ...qOpts,
          })
        }
        return [channel, _q] as const
      }
    })()

    const assertDelayQueue = async () =>
      (await channelPromise).assertQueue(delayedQName, {
        ...BASE_ASSERT_Q_OPTS(),
        deadLetterRoutingKey: fullQName,
        deadLetterExchange: '',
      })

    const enqueue: QueueAdder<JobParams, JobProgress> = async (jobName, _jobData, _jobOpts) => {
      const [jobDdata, jobOpts] = addToQueueGuard
        ? addToQueueGuard(jobName, _jobData, _jobOpts)
        : [_jobData, _jobOpts]
      const [channel, q] = await ch_Q()
      const jobId = jobOpts?.correlationId || uuid()
      const publishOpts: MNQPublishOpts<JobProgress> = {
        ...DEFAULT_PUBLISH_OPTS<JobProgress>({ jobName, jobId }),
        ...defaultJobOpts,
        ...jobOpts,
        contentType: 'application/json',
      }
      if (publishOpts.expiration) {
        const delayedQ = await assertDelayQueue()
        const sent = channel.sendToQueue(delayedQ.queue, json2Buffer(jobDdata), publishOpts)
        if (!sent) {
          throw new Error(`couldn't send message to Queue ${delayedQ.queue}`)
        }
        return getMNQJobMeta(publishOpts)
      } else {
        const sent = channel.sendToQueue(q.queue, json2Buffer(jobDdata), publishOpts)
        if (!sent) {
          throw new Error(`couldn't send message to Queue ${q.queue}`)
        }
        return getMNQJobMeta(publishOpts)
      }
    }

    const forwardJob: ForwardJob<JobProgress> = (
      workflow,
      stepName,
      sourceMsg,
      jobData,
      jobOpts
    ) => {
      return workflow[stepName].enqueue(sourceMsg.jobName, jobData, {
        ...jobOpts,
        ...DEFAULT_PUBLISH_OPTS(sourceMsg),
        messageId: jobOpts?.messageId || uuid(),
        replyTo: sourceMsg.properties.replyTo,
      })
    }

    const progressJob: ProgressJob<JobParams, JobProgress> = async (sourceMsg, progress) => {
      const replyToQ = getProgresQName(sourceMsg)
      if (typeof replyToQ !== 'string') {
        return null
      }
      const [channel] = await ch_Q()
      const sent = channel.sendToQueue(
        replyToQ,
        json2Buffer(progress),
        DEFAULT_PUBLISH_OPTS(sourceMsg)
      )
      return sent && getMNQJobMeta(sourceMsg)
    }

    const consume: QueueWorkerMaker<JobParams, JobProgress> = async (
      handler: WorkerHandler<JobParams, JobProgress>,
      mkWConsuleopts?: MNQConsumeOpts
    ) => {
      const [channel] = await ch_Q()
      return channel.consume(
        fullQName,
        (msg) => {
          msg &&
            handler(
              {
                ...msg,
                jobName: getJobName(msg),
                json: buffer2Json(msg.content),
                jobId: getJobId(msg),
              },
              progressJob,
              forwardJob
            ).then(
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

    return { enqueue, consume }
  }

  return {
    makeServiceWorkflow,
    makeServiceQueue,
  }
}

//  const setJobName=<PO extends Options.Publish>(pubOpts:PO, jobName:string):PO=>({...pubOpts,type:jobName})
//  const setJobId=<PO extends Options.Publish>(pubOpts:PO, jobId:string):PO=>({...pubOpts,correlationId:jobId})

const getJobName = (_: Message | MNQJsonMessage<any> | MNQPublishOpts<any>) =>
  'jobName' in _ ? _.jobName : 'properties' in _ ? String(_.properties.type) : String(_.type)

const getJobId = (_: Message | MNQJsonMessage<any> | MNQPublishOpts<any>) =>
  'jobId' in _
    ? _.jobId
    : 'properties' in _
    ? String(_.properties.correlationId)
    : String(_.correlationId)

const getMessageId = (_: Message | MNQPublishOpts<any>) =>
  'properties' in _ ? String(_.properties.messageId) : String(_.messageId)

const getProgresQName = (msg: Message) =>
  msg.properties.replyTo ? String(msg.properties.replyTo) : undefined

const json2Buffer = (json: any) => Buffer.from(JSON.stringify(json))

const buffer2Json = (buf: Buffer) => JSON.parse(buf.toString('utf-8'))

export const getMNQJobMeta = (
  _: Message | MNQJsonMessage<any> | MNQPublishOpts<any>
): MNQJobMeta => ({
  id: getJobId(_),
  name: getJobName(_),
  msgId: getMessageId(_),
})
