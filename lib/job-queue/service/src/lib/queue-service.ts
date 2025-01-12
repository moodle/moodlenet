import { date_time_string, date_time_string_schema, map } from '@moodle/lib-types'
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

export function provideQueueServiceCluster<jobData>() {
  type job_name = string
  const services: map<queueService<jobData>, job_name> = {}
  return { get, stopAndDrainAll }
  async function get({
    jobName,
    getConfig,
    noAutoStart,
  }: {
    jobName: job_name
    getConfig: () => Promise<queueServiceConfig<jobData>>
    noAutoStart?: boolean
  }) {
    if (!services[jobName]) {
      const config = await getConfig()
      services[jobName] = provideQueueService<jobData>(config)
      if (!noAutoStart) {
        services[jobName].startProcesses()
      }
    }
    return services[jobName]
  }
  function stopAndDrainAll() {
    return Promise.all(Object.values(services).map(({ stopAndDrain }) => stopAndDrain()))
  }
}

export type queueService<jobData> = ReturnType<typeof provideQueueService<jobData>>
export function provideQueueService<jobData>({
  workers: { enqueueJob, fetchAndEngageSomeEnqueuedJobs, reEnqueueTimedoutInProgressJobs, updateJob },
  executeJob,
  jobConfig,
}: queueServiceConfig<jobData>) {
  const { jobName, parallelism, progressTimeoutSecs, schedulerTimeoutSecs } = jobConfig
  const pendingConsumptionObjects: pendingConsumptionObject<jobData>[] = []
  let consumeBatch_scheduler: NodeJS.Timeout | undefined
  let restoreTimedouts_scheduler: NodeJS.Timeout | undefined

  stopSchedulers()

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
  function startProcesses() {
    consumeBatch()
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

      reEnqueueTimedoutInProgressJobs({ jobName, lastEngagedDateBefore, timeoutOutcome }).finally(() =>
        restoreTimedouts_scheduler?.refresh(),
      )
    }, progressTimeoutSecs * 1000)
  }

  function stopSchedulers() {
    clearTimeout(consumeBatch_scheduler)
    consumeBatch_scheduler = undefined
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
    return Promise.all([...pendingConsumptionObjects.map(({ pendingConsumptionPromise }) => pendingConsumptionPromise)])
  }

  async function consumeBatch() {
    const amount = parallelism - pendingConsumptionObjects.length
    console.log('1 consumeBatch', {
      amount,
      parallelism,
      pendingConsumptionObjectsLength: pendingConsumptionObjects.length,
    })
    if (amount < 1) {
      return
    }

    new Promise(resolve => {
      fetchAndEngageSomeEnqueuedJobs({
        jobName,
        amount,
      }).then(jobs => {
        console.log('2 consumeBatch', { jobs: jobs.length })
        resolve(
          Promise.all(
            jobs.map(job => {
              const pendingConsumptionPromise = consumeJob({
                job,
              })
              const pendingConsumptionObject: pendingConsumptionObject<jobData> = {
                pendingConsumptionPromise,
                job: job,
                jobConfig,
              }
              pendingConsumptionObjects.push(pendingConsumptionObject)
              return pendingConsumptionPromise.then(result => {
                const pendingConsumptionIndex = pendingConsumptionObjects.indexOf(pendingConsumptionObject)
                console.log('2.5 consumeBatch awaitingBatch finally', { pendingConsumptionIndex })
                pendingConsumptionObjects.splice(pendingConsumptionIndex, 1)
                consumeBatch()
                return result
              })
            }),
          ).then(consumptionResults => {
            // ---- splice
            console.log('3 consumeBatch awaitingBatch finally', {
              consumptionResultsLenght: consumptionResults.length,
            })
            if (consumptionResults.length === 0) {
              clearTimeout(consumeBatch_scheduler)
              consumeBatch_scheduler = setTimeout(consumeBatch, schedulerTimeoutSecs * 1000)
            }
          }),
        )
      })
    })
  }

  async function consumeJob({ job }: { job: job<jobData> }) {
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

    const m_updatedJob = await updateJob({
      job,
      executionOutcome,
    })
    if (!m_updatedJob) {
      return null
    }
    const consumptionResult: consumptionResult<jobData> = { updatedJob: m_updatedJob, executionOutcome }
    return consumptionResult
  }
}
