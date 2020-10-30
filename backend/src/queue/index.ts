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
import { uuid } from '../services/email/helpers'

export type JobUnexpectedError = { jobError: string; jobId?: string }
type __JOB_PROGRESS_Q_PARAM_NAME__ = typeof __JOB_PROGRESS_Q_PARAM_NAME__
const __JOB_PROGRESS_Q_PARAM_NAME__ = '__JOB_PROGRESS_Q_PARAM_NAME__'

export const UNNAMED_JOB = 'UNNAMED_JOB'

export const BASE_Q_OPTS: QueueBaseOptions = {
  client,
}
export const DEFAULT_QUEUE_OPTS: QueueOptions = { ...BASE_Q_OPTS }
export const DEFAULT_WORKER_OPTS: WorkerOptions = { ...BASE_Q_OPTS }

export type ExtendedJobsOptions<JobProgress> = JobsOptions & {
  progressTo?: Queue<JobProgress | JobUnexpectedError> | string
}

export type WithProgressQName<Data> = Data & { [__JOB_PROGRESS_Q_PARAM_NAME__]?: string }

export type ExtendedJob<JobParams, JobProgress> = Job<WithProgressQName<JobParams>, JobProgress>

type QueueAdder<__JobParams, __JobProgress> = (
  _jobName: string,
  _jobData: __JobParams,
  _jobOpts?: ExtendedJobsOptions<__JobProgress>
) => Promise<ExtendedJob<__JobParams, __JobProgress>>

export const ServiceQueue = <S extends Service>(srvName: S['name']) => {
  type MakeQueueOpts<JobParams, JobProgress> = {
    qOpts?: QueueOptions
    defaultJobOpts?: JobsOptions
    addToQueueGuard?: (
      jobName: string,
      jobData: JobParams,
      jobOpts?: ExtendedJobsOptions<JobProgress>
    ) => [jobName: string, jobDdata: JobParams, jobOpts: ExtendedJobsOptions<JobProgress>]
  }

  const serviceQueue = <JobParams, JobProgress, QName extends string = string>(
    qName: QName,
    { addToQueueGuard, defaultJobOpts, qOpts }: MakeQueueOpts<JobParams, JobProgress> = {}
  ) => {
    // TODO: create Queue on demand ()=>{}
    const q = new Queue<JobParams>(`${srvName}.${qName}`, {
      ...DEFAULT_QUEUE_OPTS,
      ...qOpts,
    })

    const addToQueue: QueueAdder<JobParams, JobProgress> = (_jobName, _jobData, _jobOpts) => {
      const [jobName, jobDdata, jobOpts] = addToQueueGuard
        ? addToQueueGuard(_jobName, _jobData, _jobOpts)
        : [_jobName, _jobData, _jobOpts]

      return q.add(jobName, dataWithProgressQName(jobDdata, qOptsProgressQName(jobOpts)), {
        ...defaultJobOpts,
        ...jobOpts,
        jobId: uuid(),
      })
    }

    const forwardJob = <QAdder extends QueueAdder<T, JobProgress>, T>(
      queueAdder: QAdder,
      job: ExtendedJob<JobParams, JobProgress>,
      jobName: string,
      jobData: T,
      jobOpts?: ExtendedJobsOptions<JobProgress> | undefined
    ) => {
      return queueAdder(jobName, jobData, { ...jobOpts, progressTo: jobProgressQName(job) })
    }

    type WorkerHandler = (
      job: ExtendedJob<JobParams, JobProgress>,
      forward: typeof forwardJob
    ) => Promise<JobProgress>

    const makeWorker = (handler: WorkerHandler, mkWopts?: WorkerOptions) => {
      return new Worker(qName, wrappedHandler, {
        ...DEFAULT_WORKER_OPTS,
        ...mkWopts,
      })

      async function wrappedHandler(job: ExtendedJob<JobParams, JobProgress>) {
        const resultP = handler(job, forwardJob)
        resultP.then((result) => {
          const progressQueueName = jobProgressQName(job)
          if (progressQueueName === undefined) {
            return
          }

          const progressQueue = new Queue(progressQueueName)
          progressQueue.add(job.name, result)
        })
        return resultP
      }
    }

    return [q, addToQueue, makeWorker] as const
  }

  return serviceQueue
}

export const dataWithProgressQName = <T>(
  data: T,
  qName: string | undefined
): WithProgressQName<T> | T =>
  typeof qName === 'string'
    ? {
        ...data,
        [__JOB_PROGRESS_Q_PARAM_NAME__]: qName,
      }
    : data

export const jobProgressQName = (job: Job) => dataProgressQName(job.data)

export const dataProgressQName = (data: any): string | undefined =>
  data ? data[__JOB_PROGRESS_Q_PARAM_NAME__] : undefined

export const qOptsProgressQName = (opts: ExtendedJobsOptions<any> | undefined) =>
  opts && ('string' === typeof opts.progressTo ? opts.progressTo : opts.progressTo?.name)
