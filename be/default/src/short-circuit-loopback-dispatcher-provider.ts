import { binderDispatcher } from '@moodle/domain'
import { accessDomain } from '@moodle/domain/lib'
import { loopbackProvider } from './types'

const shortCircuitLoopbackProvider: loopbackProvider = async () => {
  const pendingPromises: Promise<unknown>[] = []
  return {
    async loopbackDispatcherProvider({ configuration }) {
      const shortCircuitLoopbackDispatcher: binderDispatcher = ({ domainAccess }) =>
        accessDomain({
          domainAccess,
          configuration,
          async loopbackDispatcher({ domainAccess }) {
            const syncResultPromise = shortCircuitLoopbackDispatcher({ domainAccess })
            pendingPromises.push(syncResultPromise)
            syncResultPromise.finally(() => pendingPromises.splice(pendingPromises.indexOf(syncResultPromise), 1))
            return syncResultPromise
          },
        })

      return {
        loopbackDispatcher: shortCircuitLoopbackDispatcher,
      }
    },
    async drain() {
      console.log(`draining short circuit loopback pending: ${pendingPromises.length}`)
      await Promise.all(pendingPromises)
      console.log('drained short circuit loopback pending')
    },
  }
}
export default shortCircuitLoopbackProvider
