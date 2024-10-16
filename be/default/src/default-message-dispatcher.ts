import { messageDispatcher } from '@moodle/domain'
import { provideMessageDispatcher } from '@moodle/domain/lib'
import { mainMessageDispatcher as mainMessageDispatcherProvider } from './types'

const mainMessageDispatcherProvider: mainMessageDispatcherProvider = async ({
  configuration,
  domainAccess: mainDomainAccess,
}) => {
  const mainFeedbackDispatcher: messageDispatcher = provideMessageDispatcher({
    coreProviderObjects: configuration.coreProviderObjects,
    secondaryProviders: configuration.secondaryProviders,
    log: configuration.mainLogger,
    feedbackDispatcher({ domainAccess }) {
      return mainFeedbackDispatcher({ domainAccess })
    },
    start_background_processes: false,
  })

  return provideMessageDispatcher({
    coreProviderObjects: configuration.coreProviderObjects,
    secondaryProviders: configuration.secondaryProviders,
    log: configuration.mainLogger,
    feedbackDispatcher: mainFeedbackDispatcher,
    start_background_processes: configuration.start_background_processes,
  })({ domainAccess: mainDomainAccess })
}
export default mainMessageDispatcherProvider
