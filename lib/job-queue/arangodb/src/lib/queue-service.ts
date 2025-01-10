import { date_time_string, map } from '@moodle/lib-types'
import { consumeJob, enqueueJob, fetchAndEngageSomeEnqueuedJobs, restoreTimedoutJobs } from './arangodb-queue-lib'
import { executeJob, jobCollection, jobConfig, pendingConsumptionObject } from './types'

export type queueServiceConfig<jobData> = {
  executeJob: executeJob<jobData>
  jobCollection: jobCollection<jobData>
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
export function provideQueueService<jobData>({ executeJob, jobCollection, jobConfig }: queueServiceConfig<jobData>) {
  const { jobName, parallelism, progressTimeoutSecs, schedulerTimeoutSecs } = jobConfig
  const pendingConsumptionObjects: pendingConsumptionObject<jobData>[] = []
  let consumeBatch_scheduler: NodeJS.Timeout | undefined
  let restoreTimedouts_scheduler: NodeJS.Timeout | undefined

  stopSchedulers()

  return {
    pendingConsumptionObjects,
    stopAndDrain() {
      stopSchedulers()
      return drainPending()
    },
    startProcesses() {
      consumeBatch()
      restoreTimedouts_scheduler = setTimeout(() => {
        restoreTimedoutJobs({ jobName, jobCollection, timeoutSecs: progressTimeoutSecs }).finally(() =>
          restoreTimedouts_scheduler?.refresh(),
        )
      }, progressTimeoutSecs * 1000)
    },
    enqueue,
  }

  function stopSchedulers() {
    clearTimeout(consumeBatch_scheduler)
    consumeBatch_scheduler = undefined
    clearTimeout(restoreTimedouts_scheduler)
  }

  function enqueue({
    jobData,
    enqueueDate,
    id,
  }: {
    jobData: jobData
    enqueueDate: date_time_string
    id?: string | undefined
  }) {
    return enqueueJob<jobData>({
      jobName: jobConfig.jobName,
      jobData,
      enqueueDate,
      id,
      jobCollection,
    })
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
        jobCollection,
        jobName,
        amount,
        parallelism,
      }).then(jobDocs => {
        console.log('2 consumeBatch', { jobDocs: jobDocs.length })
        resolve(
          Promise.all(
            jobDocs.map(jobDoc => {
              const pendingConsumptionPromise = consumeJob({
                jobDoc,
                jobCollection,
                executeJob,
                jobConfig: { progressTimeoutSecs },
              })
              const pendingConsumptionObject: pendingConsumptionObject<jobData> = {
                pendingConsumptionPromise,
                jobDoc,
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
  function drainPending() {
    return Promise.all([...pendingConsumptionObjects.map(({ pendingConsumptionPromise }) => pendingConsumptionPromise)])
  }
}
