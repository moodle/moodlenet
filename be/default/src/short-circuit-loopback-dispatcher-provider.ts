import { provideDomainAccessDispatcher } from '@moodle/domain/lib'
import { loopbackDispatcherProvider } from './types'

const shortCircuitLoopbackDispatcherProvider: loopbackDispatcherProvider = async ({ configuration }) => {
  const shortCircuitLoopbackDispatcher = provideDomainAccessDispatcher({
    configuration,
    loopbackDispatcher({ domainAccess }) {
      return shortCircuitLoopbackDispatcher({ domainAccess })
    },
  })

  return shortCircuitLoopbackDispatcher
}
export default shortCircuitLoopbackDispatcherProvider
