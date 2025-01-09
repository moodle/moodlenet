import { binderDispatcher, domainAccess } from '@moodle/domain'
import { accessDomain } from '@moodle/domain/lib'
import { map } from '@moodle/lib-types'
import { promise as fastQueuePromise, queueAsPromised } from 'fastq'
import { loopbackProvider } from './types'

const DEFAULT_QUEUE_CONCURRENCY = 1

const shortCircuitLoopbackProvider: loopbackProvider = async () => {
  const queues: map<queueAsPromised<{ domainAccess: domainAccess }>> = {}
  const syncs: Promise<unknown>[] = []
  return {
    drain,
    async loopbackDispatcherProvider({ configuration }) {
      const shortCircuitLoopbackDispatcher: binderDispatcher = ({ domainAccess }) =>
        accessDomain({
          domainAccess,
          configuration,
          async loopbackDispatcher({ domainAccess }) {
            if (domainAccess.enqueue) {
              enqueue({ enqueueDomainAccess: domainAccess })
              return
            }
            const syncResultPromise = shortCircuitLoopbackDispatcher({ domainAccess })
            syncs.push(syncResultPromise)
            syncResultPromise.finally(() => syncs.splice(syncs.indexOf(syncResultPromise), 1))
            return syncResultPromise
          },
        })

      return {
        loopbackDispatcher: shortCircuitLoopbackDispatcher,
      }
      function enqueue({ enqueueDomainAccess }: { enqueueDomainAccess: domainAccess }) {
        // const queueName = `${enqueueDomainAccess.domain}::${enqueueDomainAccess.endpoint.join('.')}`
        const queueName = enqueueDomainAccess.endpoint.join('.')
        if (!queues[queueName]) {
          console.log('creating queue', queueName)
          queues[queueName] = fastQueuePromise(async ({ domainAccess }) => {
            console.log('pulled from queue')

            return accessDomain({
              domainAccess,
              configuration,
              loopbackDispatcher: shortCircuitLoopbackDispatcher,
            })
          }, DEFAULT_QUEUE_CONCURRENCY)
        }

        queues[queueName].push({ domainAccess: enqueueDomainAccess })
      }
    },
  }
  async function drain() {
    const drainPromises = [...syncs, ...Object.values(queues).map(q => q.drained())]
    console.log(
      `draining short circuit
syncs: ${syncs.length}
${Object.entries(queues)
  .map(([name, q]) => console.log(name, q.length()))
  .join('\n')}`,
    )

    await Promise.all(drainPromises)
    console.log('++ drained short circuit loopback')
  }
}
export default shortCircuitLoopbackProvider
