import { provideDomainAccessDispatcher } from '@moodle/domain/lib'
import { loopbackDispatcherProvider } from './types'

const shortCircuitLoopbackDispatcherProvider: loopbackDispatcherProvider = async ({ configuration }) => {
  const shortCircuitLoopbackDispatcher = provideDomainAccessDispatcher({
    configuration,
    async loopbackDispatcher({ domainAccess }) {
      const promise = shortCircuitLoopbackDispatcher({ domainAccess })

      return domainAccess.async ? void 0 : promise
    },
  })

  return shortCircuitLoopbackDispatcher
}
export default shortCircuitLoopbackDispatcherProvider
