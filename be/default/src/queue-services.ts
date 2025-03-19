import { isError4xx } from '@moodle/domain/lib'
import { executionOutcome, jobConfig, provideQueueService, queueService, queueServiceWorkers } from '@moodle/lib-job-queue-service'
import { any_, map } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'
import moment from 'moment'
import timers from 'timers/promises'

type jobData = { envelope: moo.def.model.envelope<any_> }

type queueConfig = Omit<jobConfig, 'jobName'> & { maxRetries: number }
export function createQueueServices<jobNames extends string>({
  queueServiceWorkers,
  modelDispatcher,
  queues,
}: {
  modelDispatcher: moo.def.model.dispatcher<any_>
  queueServiceWorkers: queueServiceWorkers<jobData>
  queues: map<queueConfig, jobNames>
}) {
  const defaultQueue: queueConfig = {
    parallelism: 1,
    progressTimeoutSecs: 30,
    emptyQueueRescheduleSecs: 30,
    maxRetries: 3,
  }

  const allServices = Object.entries({ default: defaultQueue, ...queues }).map<queueService<jobData>>(([jobName, queueConfig]) => {
    const queueService = provideQueueService<jobData>({
      workers: queueServiceWorkers,
      async executeJob({
        job: {
          executionOutcomes,
          jobData: { envelope },
        },
      }) {
        return Promise.race([
          modelDispatcher(envelope)
            .then<executionOutcome>(outcome => {
              if (isLeft(outcome)) {
                throw outcome.left
              }

              return {
                result: 'done',
                outcome,
                date: new Date().toISOString(),
              }
            })
            .catch<executionOutcome>(error => ({
              result: 'failed',
              reason: isError4xx(error) ? 'applicative' : 'unhandledError',
              date: new Date().toISOString(),
              error: isError4xx(error) ? error.details : error,
              followUp:
                executionOutcomes.length >= queueConfig.maxRetries
                  ? {
                      action: 'abort',
                      details: 'Too many retries',
                    }
                  : {
                      action: 'retry',
                      fromDate: moment().add(queueConfig.progressTimeoutSecs, 'seconds').toISOString(),
                    },
            })),
          timers.setTimeout(queueConfig.progressTimeoutSecs * 1000).then<executionOutcome>(() => ({
            result: 'failed',
            reason: 'timeout',
            timeoutSecs: queueConfig.progressTimeoutSecs,
            date: new Date().toISOString(),
            followUp:
              executionOutcomes.length >= queueConfig.maxRetries
                ? {
                    action: 'abort',
                    details: 'Too many retries',
                  }
                : {
                    action: 'retry',
                    fromDate: new Date().toISOString(),
                  },
          })),
        ])
      },
      jobConfig: { ...queueConfig, jobName },
    })

    queueService.serviceEmitter.on('error', (context, error) => {
      // REVIEW: or process.exit ?
      console.error(`queue service error [${jobName}]`, { context, error })
    })

    return queueService
  })
  const [defaultService, ...namedServiceList] = allServices
  const services = namedServiceList.reduce(
    (_, qService) => {
      return {
        ..._,
        [qService.jobConfig.jobName]: qService,
      }
    },
    {} as map<queueService<jobData>, jobNames | 'default'>,
  )
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    defaultService: defaultService!,
    startAll,
    stopAndDrainAll,
    services,
  }

  function startAll() {
    return Promise.all(Object.values(allServices).map(({ startProcesses }) => startProcesses()))
  }
  function stopAndDrainAll() {
    console.log(`draining queues ...`)
    return Promise.allSettled(Object.values(allServices).map(({ stopAndDrain }) => stopAndDrain()))
  }
}
