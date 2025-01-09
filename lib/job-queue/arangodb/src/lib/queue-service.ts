import { d_u, date_time_string } from '@moodle/lib-types'
import { consumeJob, enqueueJob, fetchAndEngageSomeEnqueuedJobs, restoreTimedoutJobs } from './arangodb-queue-lib'
import { consumptionResult, executeJob, jobCollection, jobConfig, pendingConsumptionObject } from './types'

export type queueServiceConfig<jobData> = {
  executeJob: executeJob<jobData>
  jobCollection: jobCollection<jobData>
  jobConfig: jobConfig
}

export function provideQueueService<jobData>({ executeJob, jobCollection, jobConfig }: queueServiceConfig<jobData>) {
  const { jobName, parallelism, progressTimeoutSecs, schedulerTimeoutSecs } = jobConfig
  const pendingConsumptionObjects: pendingConsumptionObject<jobData>[] = []
  const consumeBatch_scheduler = setTimeout(consumeBatch, schedulerTimeoutSecs * 1000)
  const restoreTimedouts_scheduler = setTimeout(() => {
    restoreTimedoutJobs({ jobName, jobCollection, timeoutSecs: progressTimeoutSecs }).finally(() =>
      restoreTimedouts_scheduler.refresh(),
    )
  }, progressTimeoutSecs * 1000)
  stopSchedulers()
  let batchSemaphore: d_u<{ green: unknown; red: { awaitingBatch: Promise<consumptionResult<jobData>[]> } }, 'color'> = {
    color: 'green',
  }

  return {
    pendingConsumptionObjects,
    stopAndDrain() {
      stopSchedulers()
      return drainPending()
    },
    startProcesses() {
      consumeBatch()
      restoreTimedouts_scheduler.refresh()
    },
    enqueue,
  }

  function stopSchedulers() {
    clearTimeout(consumeBatch_scheduler)
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
    if (batchSemaphore.color === 'red' || amount < 1) {
      return
    }

    // batchSemaphore needed for async call only
    batchSemaphore = {
      color: 'red',
      awaitingBatch: fetchAndEngageSomeEnqueuedJobs({
        jobCollection,
        jobName,
        amount,
        parallelism,
      }).then(jobDocs =>
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
            pendingConsumptionPromise.finally(() => {
              pendingConsumptionObjects.splice(pendingConsumptionObjects.indexOf(pendingConsumptionObject), 1)
              if (batchSemaphore.color === 'red') {
                consumeBatch()
              }
            })
            return pendingConsumptionPromise
          }),
        ),
      ),
    }

    pendingConsumptionObjects.length === 0 && consumeBatch_scheduler.refresh()
  }
  function drainPending() {
    return Promise.all(pendingConsumptionObjects.map(({ pendingConsumptionPromise }) => pendingConsumptionPromise))
  }
}
