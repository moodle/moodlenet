import { d_u, date_time_string } from '@moodle/lib-types'
import EventEmitter from 'events'
import moment from 'moment'
import timers from 'timers/promises'
import TypedEmitter from 'typed-emitter'
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
export type serviceContext<jobData> = d_u<
  {
    enqueueJob: unknown
    updateJob: { consumptionResult: consumptionResult<jobData> }
    reEnqueueTimedoutInProgressJobs: unknown
    fetchAndEngageSomeEnqueuedJobs: unknown
  },
  'type'
>
export type serviceEmitter<jobData> = TypedEmitter<{
  error: (context: serviceContext<jobData>, error: unknown) => void
  message: (body: string, from: string) => void
}>

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
  const serviceEmitter = new EventEmitter() as serviceEmitter<jobData>

  return {
    pendingConsumptionObjects,
    serviceEmitter,
    stopAndDrain,
    startProcesses,
    enqueue,
  }
  function stopAndDrain() {
    stopSchedulers()
    return drainPending()
  }

  function emitError(errorContext: serviceContext<jobData>) {
    return (error: unknown) => serviceEmitter.emit('error', errorContext, error)
  }

  function startProcesses() {
    console.log(`starting processes for ${jobName}`)
    consumeProcess()
    restoreTimedouts_scheduler = setTimeout(() => {
      const timeoutOutcome: executionOutcome = {
        date: new Date().toISOString(),
        result: 'failed',
        reason: 'timeout',
        timeoutSecs: progressTimeoutSecs,
        followUp: {
          action: 'retry',
          fromDate: new Date().toISOString(),
        },
      }

      const lastEngagedDateBefore = moment().subtract(progressTimeoutSecs, 'seconds').toISOString()

      reEnqueueTimedoutInProgressJobs({ jobName, lastEngagedDateBefore, timeoutOutcome })
        .catch(
          emitError({
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

    const enqueuePromise = enqueueJob({ job })
    enqueuePromise.catch(emitError({ type: 'enqueueJob' }))
    return enqueuePromise
  }

  function drainPending() {
    return Promise.all([
      ...pendingConsumptionObjects.map(
        ({ pendingConsumptionResultPromise: pendingConsumptionPromise }) => pendingConsumptionPromise,
      ),
    ])
  }

  function consumeProcess() {
    const amount = parallelism - pendingConsumptionObjects.length
    // console.log('1 consume', {
    //   amount,
    //   parallelism,
    //   pendingConsumptionObjectsLength: pendingConsumptionObjects.length,
    // })
    if (amount < 1) {
      return
    }

    const engageDate = new Date().toISOString()
    fetchAndEngageSomeEnqueuedJobs({
      jobName,
      amount,
      engageDate,
    })
      .then(jobs => {
        // console.log('2 consume', { jobs: jobs.length })
        if (jobs.length === 0) {
          clearTimeout(consume_scheduler)
          consume_scheduler = setTimeout(() => consumeProcess(), emptyQueueRescheduleSecs * 1000)
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
              emitError({
                type: 'updateJob',
                consumptionResult,
              }),
            )
            const pendingConsumptionIndex = pendingConsumptionObjects.indexOf(pendingConsumptionObject)
            // console.log('2.5 consume awaitingBatch finally', { pendingConsumptionIndex })
            pendingConsumptionObjects.splice(pendingConsumptionIndex, 1)
            consumeProcess()
            return consumptionResult
          })
        })
      })
      .catch(emitError({ type: 'fetchAndEngageSomeEnqueuedJobs' }))
  }

  async function execute({ job }: { job: job<jobData> }) {
    const executionOutcome = await Promise.race([
      executeJob({ job }).catch<executionOutcome>(error => ({
        date: new Date().toISOString(),
        result: 'failed',
        reason: 'unhandledError',
        error,
        followUp: {
          action: 'retry',
          fromDate: new Date().toISOString(),
        },
      })),
      timers.setTimeout(progressTimeoutSecs * 1000).then<executionOutcome>(() => ({
        result: 'failed',
        reason: 'timeout',
        timeoutSecs: progressTimeoutSecs,
        date: new Date().toISOString(),
        followUp: {
          action: 'retry',
          fromDate: new Date().toISOString(),
        },
      })),
    ])
    const consumptionResult: consumptionResult<jobData> = { job, executionOutcome }

    return consumptionResult
  }
}
