import { Message, Options, Replies } from 'amqplib'
export type JobUnexpectedError = { jobError: string; jobId: string }

export type MNQJobMeta = {
  msgId: string
  id: string
  name: string
}
export type MNQPublishOpts<JobProgress extends JobProgressStates> = Options.Publish & {
  progress?: QueueAdder<AnyProgressOf<JobProgress>, any>
}
export type MNQAssertQueueOpts = Options.AssertQueue & {}
export type MNQConsumeOpts = Options.Consume & {}
export type MNQJsonMessage<T> = Message & {
  json: T
  jobId: string
  jobName: string
}

export type QueueAdder<JobParams, JobProgress extends JobProgressStates> = (
  jobName: string,
  jobData: JobParams,
  jobOpts?: MNQPublishOpts<JobProgress>
) => Promise<MNQJobMeta>

export type QueueWorkerMaker<JobParams, JobProgress extends JobProgressStates> = (
  handler: WorkerHandler<JobParams, JobProgress>,
  mkWConsumeOpts?: Options.Consume | undefined
) => Promise<Replies.Consume>

export type JobProgressStates = { [State: string]: any }
type JobProgressMap<JobProgress extends JobProgressStates> = {
  [State in keyof JobProgress]: (JobProgress[State] extends null | undefined | void
    ? {}
    : JobProgress[State]) & {
    _state: State
  }
}
export type AnyProgressOf<
  JobProgress extends JobProgressStates,
  Key extends keyof JobProgress = keyof JobProgress
> = JobProgressMap<JobProgress>[Key]

export type ForwardJob<JobProgress extends JobProgressStates> = <
  WFM extends WorkflowMap<JobProgress, any>,
  QName extends keyof WFM
>(
  wfm: WFM,
  qname: QName,
  sourceMsg: MNQJsonMessage<any>,
  jobData: WFM[QName]['enqueue'] extends QueueAdder<infer Params, any> ? Params : never,
  jobOpts?: MNQPublishOpts<JobProgress> | undefined
) => Promise<MNQJobMeta>

export type ProgressJob<JobParams, JobProgress extends JobProgressStates> = <
  State extends keyof JobProgress
>(
  sourceMsg: MNQJsonMessage<JobParams>,
  progress: JobProgressMap<JobProgress>[State]
) => Promise<MNQJobMeta | false | null>

export type WorkerHandler<JobParams, JobProgress extends JobProgressStates> = (
  msg: MNQJsonMessage<JobParams>,
  progress: ProgressJob<JobParams, JobProgress>,
  forward: ForwardJob<JobProgress>
) => Promise<unknown>

export type ServiceQueueOpts<JobParams, JobProgress extends JobProgressStates> = {
  qOpts?: MNQAssertQueueOpts
  defaultJobOpts?: MNQPublishOpts<JobProgress>
  addToQueueGuard?: (
    jobName: string,
    jobData: JobParams,
    jobOpts?: MNQPublishOpts<JobProgress>
  ) => [jobDdata: JobParams, jobOpts: MNQPublishOpts<JobProgress>]
}

export type WorkflowMap<JobProgress extends JobProgressStates, QueueParamsMap> = {
  [QNM in keyof QueueParamsMap]: {
    enqueue: QueueAdder<QueueParamsMap[QNM], JobProgress>
    consume: QueueWorkerMaker<QueueParamsMap[QNM], JobProgress>
  }
}
