import { error4xxDetails } from '@moodle/domain/lib'
import { d_u, date_time_string } from '@moodle/lib-types'

export type jobConfig = {
  jobName: string
  parallelism: number
  progressTimeoutSecs: number
  emptyQueueRescheduleSecs: number
}

export type job<jobData> = {
  id: string
  name: string
  jobData: jobData
  status: jobStatus
  enqueueDate: date_time_string
  lastEngagedDate: null | date_time_string
  executionOutcomes: executionOutcome[]
  retryOnDate: date_time_string
  // aborted: null | d_u<
  //   {
  //     executionOutcomeAction: unknown
  //     executorUnhandledError: { details: unknown }
  //   },
  //   'reason'
  // >
}
export type jobStatus = 'enqueued' | 'inProgress' | 'aborted' | 'done'

export type failedExecutionFollowup = d_u<
  {
    retry: {
      fromDate: date_time_string
    }
    abort: { details?: unknown }
  },
  'action'
>

export type executionOutcome = {
  date: date_time_string
} & d_u<
  {
    done: { outcome: unknown }
    failed: {
      followUp: failedExecutionFollowup
    } & d_u<
      {
        applicative: { error: error4xxDetails }
        unhandledError: { error: unknown }
        timeout: { timeoutSecs: number }
      },
      'reason'
    >
  },
  'result'
>
export type executeJob<jobData> = (_: { job: job<jobData> }) => Promise<executionOutcome>
export type consumptionResult<jobData> = {
  executionOutcome: executionOutcome
  job: job<jobData>
}

export type pendingConsumptionObject<jobData> = {
  pendingConsumptionResultPromise: Promise<consumptionResult<jobData> | null>
  job: job<jobData>
  jobConfig: jobConfig
}

// service workers

export type queueServiceWorkers<jobData> = {
  enqueueJob: enqueueJob<jobData>
  fetchAndEngageSomeEnqueuedJobs: fetchAndEngageSomeEnqueuedJobs<jobData>
  updateJob: updateJob<jobData>
  reEnqueueTimedoutInProgressJobs: reEnqueueTimedoutInProgressJobs<jobData>
}

export type enqueueJob<jobData> = (_: { job: job<jobData> }) => Promise<void>

export type updateJob<jobData> = (_: consumptionResult<jobData>) => Promise<job<jobData> | null>

export type reEnqueueTimedoutInProgressJobs<jobData> = (_: {
  jobName: string
  lastEngagedDateBefore: date_time_string
  timeoutOutcome: executionOutcome
}) => Promise<job<jobData>[]>

export type fetchAndEngageSomeEnqueuedJobs<jobData> = (_: { jobName: string; amount: number; engageDate: date_time_string }) => Promise<job<jobData>[]>
