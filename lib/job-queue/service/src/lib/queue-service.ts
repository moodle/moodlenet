import { d_u, date_time_string, date_time_string_schema } from '@moodle/lib-types'
import moment from 'moment'
import {
  consumptionResult,
  executeJob,
  executionOutcome,
  job,
  jobConfig,
  pendingConsumptionObject,
  queueServiceWorkers,
} from './types'

export type queueServiceConfig<jobData> = {
  workers: queueServiceWorkers<jobData>
  executeJob: executeJob<jobData>
  jobConfig: jobConfig
}

// REMOVE_ME============> export function provideQueueServiceCluster<jobData>() {
//   type job_name = string
//   const services: map<queueService<jobData>, job_name> = {}
//   return { get, stopAndDrainAll }
//   async function get({
//     jobName,
//     getConfig,
//     noAutoStart,
//   }: {
//     jobName: job_name
//     getConfig: () => Promise<queueServiceConfig<jobData>>
//     noAutoStart?: boolean
//   }) {
//     if (!services[jobName]) {
//       const config = await getConfig()
//       services[jobName] = provideQueueService<jobData>(config)
//       if (!noAutoStart) {
//         services[jobName].startProcesses()
//       }
//     }
//     return services[jobName]
//   }
//   function stopAndDrainAll() {
//     return Promise.all(Object.values(services).map(({ stopAndDrain }) => stopAndDrain()))
//   }
// }

export type queueService<jobData> = ReturnType<typeof provideQueueService<jobData>>

export function provideQueueService<jobData>({
  workers: { enqueueJob, fetchAndEngageSomeEnqueuedJobs, reEnqueueTimedoutInProgressJobs, updateJob },
  executeJob,
  jobConfig,
}: queueServiceConfig<jobData>) {
  const { jobName, parallelism, progressTimeoutSecs, emptyQueueRescheduleSecs } = jobConfig
  const pendingConsumptionObjects: pendingConsumptionObject<jobData>[] = []
  let consume_scheduler: NodeJS.Timeout | undefined
  let restoreTimedouts_scheduler: NodeJS.Timeout | undefined

  return {
    pendingConsumptionObjects,
    stopAndDrain,
    startProcesses,
    enqueue,
  }
  function stopAndDrain() {
    stopSchedulers()
    return drainPending()
  }

  type errorContext = d_u<
    {
      updateJob: { consumptionResult: consumptionResult<jobData> }
      reEnqueueTimedoutInProgressJobs: unknown
      fetchAndEngageSomeEnqueuedJobs: unknown
    },
    'type'
  >
  type withErrorHandler = {
    onError: (errorContext: errorContext) => (error: unknown) => void
  }

  function startProcesses(withErrorHandler: withErrorHandler) {
    consumeProcess(withErrorHandler)
    restoreTimedouts_scheduler = setTimeout(() => {
      const timeoutOutcome: executionOutcome = {
        date: date_time_string('now'),
        result: 'failed',
        reason: 'timeout',
        timeoutSecs: progressTimeoutSecs,
      }

      const lastEngagedDateBefore = date_time_string_schema.parse(
        moment(date_time_string('now')).subtract(progressTimeoutSecs, 'seconds').toISOString(),
      )

      reEnqueueTimedoutInProgressJobs({ jobName, lastEngagedDateBefore, timeoutOutcome })
        .catch(
          withErrorHandler.onError({
            type: 'reEnqueueTimedoutInProgressJobs',
          }),
        )
        .finally(() => restoreTimedouts_scheduler?.refresh())
    }, progressTimeoutSecs * 1000)
  }

  function stopSchedulers() {
    clearTimeout(consume_scheduler)
    consume_scheduler = undefined
    clearTimeout(restoreTimedouts_scheduler)
  }

  function enqueue({ jobData, enqueueDate, jobId }: { jobData: jobData; enqueueDate: date_time_string; jobId: string }) {
    const job: job<jobData> = {
      id: jobId,
      name: jobName,
      status: 'enqueued',
      enqueueDate,
      retryOnDate: enqueueDate,
      executionOutcomes: [],
      lastEngagedDate: null,
      jobData,
    }

    return enqueueJob({
      job,
    })
  }

  function drainPending() {
    return Promise.all([
      ...pendingConsumptionObjects.map(
        ({ pendingConsumptionResultPromise: pendingConsumptionPromise }) => pendingConsumptionPromise,
      ),
    ])
  }

  function consumeProcess(withErrorHandler: withErrorHandler) {
    const amount = parallelism - pendingConsumptionObjects.length
    // console.log('1 consume', {
    //   amount,
    //   parallelism,
    //   pendingConsumptionObjectsLength: pendingConsumptionObjects.length,
    // })
    if (amount < 1) {
      return
    }

    const engageDate = date_time_string('now')
    fetchAndEngageSomeEnqueuedJobs({
      jobName,
      amount,
      engageDate,
    })
      .then(jobs => {
        // console.log('2 consume', { jobs: jobs.length })
        if (jobs.length === 0) {
          clearTimeout(consume_scheduler)
          consume_scheduler = setTimeout(() => consumeProcess(withErrorHandler), emptyQueueRescheduleSecs * 1000)
          return
        }
        jobs.map(job => {
          const pendingConsumptionResultPromise = execute({ job })

          const pendingConsumptionObject: pendingConsumptionObject<jobData> = {
            pendingConsumptionResultPromise,
            job,
            jobConfig,
          }

          pendingConsumptionObjects.push(pendingConsumptionObject)

          return pendingConsumptionResultPromise.then(consumptionResult => {
            updateJob(consumptionResult).catch(
              withErrorHandler.onError({
                type: 'updateJob',
                consumptionResult,
              }),
            )
            const pendingConsumptionIndex = pendingConsumptionObjects.indexOf(pendingConsumptionObject)
            // console.log('2.5 consume awaitingBatch finally', { pendingConsumptionIndex })
            pendingConsumptionObjects.splice(pendingConsumptionIndex, 1)
            consumeProcess(withErrorHandler)
            return consumptionResult
          })
        })
      })
      .catch(withErrorHandler.onError({ type: 'fetchAndEngageSomeEnqueuedJobs' }))
  }

  async function execute({ job }: { job: job<jobData> }) {
    const executionOutcome = await Promise.race([
      executeJob({ job }).catch<executionOutcome>(
        error =>
          ({
            date: date_time_string('now'),
            result: 'failed',
            reason: 'unhandledError',
            error,
          }) satisfies executionOutcome,
      ),
      new Promise<executionOutcome>((_resolve, reject) =>
        setTimeout(
          () =>
            reject({
              result: 'failed',
              reason: 'timeout',
              timeoutSecs: progressTimeoutSecs,
              date: date_time_string('now'),
            } satisfies executionOutcome),
          progressTimeoutSecs * 1000,
        ),
      ),
    ])
    const consumptionResult: consumptionResult<jobData> = { job, executionOutcome }

    return consumptionResult
  }
}
