import { lib, messageDispatcher } from '@moodle/domain'
import { mainMessageDispatcher as mainMessageDispatcherProvider } from './types'

const mainMessageDispatcherProvider: mainMessageDispatcherProvider = async ({
  configuration,
  domainAccess,
}) => {
  const feedbackDispatcher: messageDispatcher = lib.provideMessageDispatcher({
    coreProviderObjects: configuration.coreProviderObjects,
    secondaryProviders: configuration.secondaryProviders,
    log: configuration.mainLogger,
    feedbackDispatcher({ domainAccess }) {
      return feedbackDispatcher({ domainAccess })
    },
    start_background_processes: false,
  })

  return lib.provideMessageDispatcher({
    coreProviderObjects: configuration.coreProviderObjects,
    secondaryProviders: configuration.secondaryProviders,
    log: configuration.mainLogger,
    feedbackDispatcher,
    start_background_processes: configuration.start_background_processes,
  })({ domainAccess })
}
export default mainMessageDispatcherProvider
