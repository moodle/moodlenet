import { binderDispatcher, domainAccess } from '@moodle/domain'
import { createMoodleDomainProxy, getProxyFnPath } from '@moodle/domain/lib'
import { executionOutcome, provideQueueService, queueService, queueServiceWorkers } from '@moodle/lib-job-queue-service'
import { map } from '@moodle/lib-types'
import moment from 'moment'
import timers from 'timers/promises'

type jobData = { domainAccess: domainAccess }
function getJobName(path: string[]) {
  return path.join('.')
}

const DEFAULT_WRITE_QUEUE = Symbol('default-write')
export function createQueueServices({
  queueServiceWorkers,
  binderDispatcher,
}: {
  binderDispatcher: binderDispatcher
  queueServiceWorkers: queueServiceWorkers<jobData>
}) {
  const _queue_moodleDomain_proxy = createMoodleDomainProxy({ ctrl: async () => null })

  const knownQProxyFns = [
    DEFAULT_WRITE_QUEUE,
    _queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser,
    _queue_moodleDomain_proxy.secondary.resourceIngestion.write.ingestResource,
  ] as const
  const allServices = knownQProxyFns.map<queueService<jobData>>(proxyFn => {
    // const jobIs = {
    //   sendMessageToUser: proxyFn === _queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser,
    //   ingestResource: proxyFn === _queue_moodleDomain_proxy.secondary.resourceIngestion.write.ingestResource,
    // }
    const isDefaultQ = DEFAULT_WRITE_QUEUE === proxyFn
    const path = isDefaultQ ? ['default-write-job'] : getProxyFnPath(proxyFn)
    const jobName = getJobName(path)
    const jobConfig = isDefaultQ
      ? {
          jobName,
          parallelism: 100,
          progressTimeoutSecs: 5,
          emptyQueueRescheduleSecs: 10,
        }
      : {
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
          jobData: { domainAccess },
        },
      }) {
        return Promise.race([
          binderDispatcher({ domainAccess: { ...domainAccess, enqueue: false } })
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
  function getNamedService({ domainAccess }: { domainAccess: domainAccess }) {
    const jobName = getJobName(domainAccess.endpoint)
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
