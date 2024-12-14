import { provideDomainAccessDispatcher } from '@moodle/domain/lib'
import { loopbackDispatcherProvider } from './types'

const shortCircuitLoopbackDispatcherProvider: loopbackDispatcherProvider = async ({ configuration }) => {
  const shortCircuitLoopbackDispatcher = provideDomainAccessDispatcher({
    configuration: {
      ...configuration,
      start_background_processes: false,
    },
    loopbackDispatcher({ domainAccess: loopbackDomainAccess }) {
      return shortCircuitLoopbackDispatcher({ domainAccess: loopbackDomainAccess })
    },
  })

  return shortCircuitLoopbackDispatcher
}
export default shortCircuitLoopbackDispatcherProvider
