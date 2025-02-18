import {
  executionOutcome,
  jobConfig,
  provideQueueService,
  queueService,
  queueServiceWorkers,
} from '@moodle/lib-job-queue-service'
import { any_, map } from '@moodle/lib-types'
import moment from 'moment'
import timers from 'timers/promises'

type jobData = { access: moo.model.access<any_> }
function getJobName(path: string[]) {
  return path.join('.')
}

export function createQueueServices({
  queueServiceWorkers,
  modelDispatcher,
  queues,
}: {
  modelDispatcher: moo.model.dispatcher
  queueServiceWorkers: queueServiceWorkers<jobData>
  queues: string[]
}) {
  const allServices = queues.map<queueService<jobData>>(jobName => {
    const jobConfig: jobConfig = {
      jobName,
      parallelism: 1,
      progressTimeoutSecs: 30,
      emptyQueueRescheduleSecs: 30,
    }

    const queueService = provideQueueService<jobData>({
      workers: queueServiceWorkers,
      async executeJob({
        job: {
          executionOutcomes,
          jobData: { access },
        },
      }) {
        return Promise.race([
          modelDispatcher(access)
            .then<executionOutcome>(outcome => ({
              result: 'done',
              outcome,
              date: new Date().toISOString(),
            }))
            .catch<executionOutcome>(error => ({
              result: 'failed',
              reason: 'unhandledError',
              date: new Date().toISOString(),
              error,
              followUp:
                executionOutcomes.length > 2
                  ? {
                      action: 'abort',
                      details: 'Too many retries',
                    }
                  : {
                      action: 'retry',
                      fromDate: moment().add(jobConfig.progressTimeoutSecs, 'seconds').toISOString(),
                    },
            })),
          timers.setTimeout(jobConfig.progressTimeoutSecs * 1000).then<executionOutcome>(() => ({
            result: 'failed',
            reason: 'timeout',
            timeoutSecs: jobConfig.progressTimeoutSecs,
            date: new Date().toISOString(),
            followUp:
              executionOutcomes.length > 2
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
      jobConfig,
    })

    queueService.serviceEmitter.on('error', (context, error) => {
      // REVIEW: or process.exit ?
      console.error(`queue service error [${jobName}]`, { context, error })
    })

    return queueService
  })
  const [defaultService, ...namedServiceList] = allServices
  const services = namedServiceList.reduce<map<queueService<jobData>>>((_, qService) => {
    return {
      ..._,
      [qService.jobConfig.jobName]: qService,
    }
  }, {})
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    defaultService: defaultService!,
    startAll,
    stopAndDrainAll,
    getNamedService,
  }
  function getNamedService({ access }: { access: moo.model.access<any_> }) {
    const jobName = getJobName(access.target.path)
    return services[jobName]
  }
  function startAll() {
    return Promise.all(Object.values(allServices).map(({ startProcesses }) => startProcesses()))
  }
  function stopAndDrainAll() {
    console.log(`draining queues ...`)
    return Promise.allSettled(Object.values(allServices).map(({ stopAndDrain }) => stopAndDrain()))
  }
}
