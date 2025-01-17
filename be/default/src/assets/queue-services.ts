import { binderDispatcher, domainAccess } from '@moodle/domain'
import { createMoodleDomainProxy, getProxyFnPath } from '@moodle/domain/lib'
import { executionOutcome, provideQueueService, queueService, queueServiceWorkers } from '@moodle/lib-job-queue-service'
import { map } from '@moodle/lib-types'
import moment from 'moment'
import timers from 'timers/promises'

type jobData = { domainAccess: domainAccess }
export function getJobName(path: string[]) {
  return path.join('.')
}

export function createQueueServices({
  queueServiceWorkers,
  binderDispatcher,
}: {
  binderDispatcher: binderDispatcher
  queueServiceWorkers: queueServiceWorkers<jobData>
}) {
  const _queue_moodleDomain_proxy = createMoodleDomainProxy({ ctrl: async () => null })

  const knownQProxyFns = [
    _queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser,
    _queue_moodleDomain_proxy.secondary.resourceIngestion.write.ingestResource,
  ]
  const services = knownQProxyFns.reduce<map<queueService<jobData>>>((_, proxyFn) => {
    // const jobIs = {
    //   sendMessageToUser: proxyFn === _queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser,
    //   ingestResource: proxyFn === _queue_moodleDomain_proxy.secondary.resourceIngestion.write.ingestResource,
    // }
    const path = getProxyFnPath(proxyFn)
    const jobName = getJobName(path)
    const jobConfig = {
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
                      fromDate: moment().add(5, 'seconds').toISOString(),
                    },
            })),
          timers.setTimeout(jobConfig.progressTimeoutSecs * 1000).then<executionOutcome>(() => ({
            result: 'failed',
            reason: 'timeout',
            timeoutSecs: jobConfig.progressTimeoutSecs,
            date: new Date().toISOString(),
            followUp: {
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

    return {
      ..._,
      [jobName]: queueService,
    }
  }, {})

  return {
    services,
    startAll,
    stopAndDrainAll,
  }
  function startAll() {
    return Promise.all(Object.values(services).map(({ startProcesses }) => startProcesses()))
  }
  function stopAndDrainAll() {
    console.log(`draining queues ...`)
    return Promise.allSettled(Object.values(services).map(({ stopAndDrain }) => stopAndDrain()))
  }
}
