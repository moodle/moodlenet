import { binderDispatcher, domainAccess } from '@moodle/domain'
import { accessDomain, configuration } from '@moodle/domain/lib'

export function shortCircuitLoopbackProvider() {
  const pendingPromises: Promise<unknown>[] = []
  return {
    async shortCircuitLoopbackDispatcher({
      configuration,
      domainAccess,
    }: {
      configuration: configuration
      domainAccess: domainAccess
    }) {
      const shortCircuit: binderDispatcher = async ({ domainAccess }) => {
        const syncResultPromise = shortCircuit({ domainAccess })
        pendingPromises.push(syncResultPromise)
        syncResultPromise.finally(() => pendingPromises.splice(pendingPromises.indexOf(syncResultPromise), 1))
        return syncResultPromise
      }
      return accessDomain({
        domainAccess,
        configuration,
        loopbackDispatcher: shortCircuit,
      })
    },
    async shortCircuitLoopbackDispatcherDrain() {
      console.log(`draining short circuit loopback [#${pendingPromises.length}] pending replies ...`)
      await Promise.all(pendingPromises)
      console.log('drained short circuit loopback pending replies')
    },
  }
}
