import { client } from './queue.env'
import { Service } from '../moleculer'
import {
  Job,
  JobsOptions,
  Queue,
  QueueBaseOptions,
  QueueOptions,
  Worker,
  WorkerOptions,
} from 'bullmq'

export type ErrorReply = { jobError: string; jobId?: string }
export const UNNAMED_JOB = 'UNNAMED_JOB'

export const BASE_Q_OPTS: QueueBaseOptions = {
  client,
}
export const DEFAULT_QUEUE_OPTS: QueueOptions = { ...BASE_Q_OPTS }
export const DEFAULT_WORKER_OPTS: WorkerOptions = { ...BASE_Q_OPTS }

export type ExtendedJobsOptions<Out> = JobsOptions & {
  replyTo?: Queue<Out | ErrorReply>
  linkTo?: ExtendedJob<any, Out>
}
export type ExtendedJob<In, Out> = Job<In, Out> & { __REPLY_TO_Q__?: string }

export const ServiceQueue = <S extends Service>(srvName: S['name']) => {
  type MakeQueueOpts<In, Out> = {
    qOpts?: QueueOptions
    defaultJobOpts?: JobsOptions
    addToQueueGuard?: (
      jobName: string,
      jobData: In,
      jobOpts?: ExtendedJobsOptions<Out>
    ) => [jobName: string, jobDdata: In, jobOpts: ExtendedJobsOptions<Out>]
  }

  const makeQueue = <In, Out, QName extends string = string>(
    qName: QName,
    { addToQueueGuard, defaultJobOpts, qOpts }: MakeQueueOpts<In, Out> = {}
  ) => {
    const q = new Queue<In>(`${srvName}.${qName}`, {
      ...DEFAULT_QUEUE_OPTS,
      ...qOpts,
    })

    const addToQueue = (
      _jobName: string,
      _jobData: In,
      _jobOpts?: ExtendedJobsOptions<Out>
    ): Promise<ExtendedJob<In, Out>> => {
      const [jobName, jobDdata, jobOpts] = addToQueueGuard
        ? addToQueueGuard(_jobName, _jobData, _jobOpts)
        : [_jobName, _jobData, _jobOpts]

      return q.add(
        jobName,
        {
          ...jobDdata,
          __REPLY_TO_Q__: jobOpts?.replyTo ? jobOpts.replyTo.name : jobOpts?.linkTo?.__REPLY_TO_Q__,
        },
        { ...defaultJobOpts, ...jobOpts }
      )
    }

    type WorkerHandler = (job: ExtendedJob<In, Out>) => Promise<Out>

    const makeWorker = (handler: WorkerHandler, mkWopts?: WorkerOptions) => {
      const wrappedHandler = async (job: ExtendedJob<In, Out>) => {
        const replyQueue = job.__REPLY_TO_Q__ && new Queue<Out | ErrorReply>(job.__REPLY_TO_Q__)
        try {
          const result = await handler(job)
          replyQueue && replyQueue.add(`${job.name}:Result`, result)
        } catch (err) {
          replyQueue &&
            replyQueue.add(`${job.name}:Error`, { jobError: String(err), jobId: job.id })
        }
        return {}
      }
      return new Worker(qName, wrappedHandler, {
        ...DEFAULT_WORKER_OPTS,
        ...mkWopts,
      })
    }

    return [q, addToQueue, makeWorker] as const
  }

  return makeQueue
}
