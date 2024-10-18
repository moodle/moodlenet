import { provideDomainAccessDispatcher } from '@moodle/domain/lib'
import { mainMessageDispatcher as feedbackLoopMessageDispatcherProvider } from './types'

const feedbackLoopMessageDispatcherProvider: feedbackLoopMessageDispatcherProvider = async ({
  configuration,
  domainAccess: currentDomainAccess,
}) => {
  const feedbackDispatcher = provideDomainAccessDispatcher({
    domain: configuration.domain,
    moduleCores: configuration.moduleCores,
    secondaryProviders: configuration.secondaryProviders,
    loggerProvider: configuration.loggerProvider,
    feedbackDispatcher({ domainAccess: feedbackDomainAccess }) {
      return feedbackDispatcher({ domainAccess: feedbackDomainAccess })
    },
    start_background_processes: false,
  })

  return provideDomainAccessDispatcher({
    ...configuration,
    feedbackDispatcher,
  })({ domainAccess: currentDomainAccess })
}
export default feedbackLoopMessageDispatcherProvider
