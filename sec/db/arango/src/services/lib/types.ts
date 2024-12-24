import { d_u, date_time_string } from '@moodle/lib-types'
import { DocumentCollection } from 'arangojs/collection'
import { Document } from 'arangojs/documents'

export type jobConfig = {
  jobName: string
  parallelism: number
  progressTimeoutSecs: number
  schedulerTimeoutSecs: number
}

export type jobCollection<jobData> = DocumentCollection<arangoDbJob<jobData>>

export type arangoDbJobDocument<jobData> = Document<arangoDbJob<jobData>>
export type arangoDbJob<jobData> = {
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
      onDate: date_time_string
    }
    abort: unknown
  },
  'action'
>

export type executionOutcome = {
  date: date_time_string
} & d_u<
  {
    done: unknown
    failed: d_u<
      {
        applicative: { details: unknown; followUp: failedExecutionFollowup }
        unhandledError: { error: unknown }
        timeout: { timeoutSecs: number }
      },
      'reason'
    >
  },
  'result'
>
export type executeJob<jobData> = (_: { job: arangoDbJobDocument<jobData> }) => Promise<executionOutcome>
export type consumptionResult<jobData> = {
  executionOutcome: executionOutcome
  newJobDoc: arangoDbJobDocument<jobData>
}

export type pendingConsumptionObject<jobData> = {
  pendingConsumptionPromise: Promise<consumptionResult<jobData>>
  jobDoc: arangoDbJobDocument<jobData>
  jobConfig: jobConfig
}
