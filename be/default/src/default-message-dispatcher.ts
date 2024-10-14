import { lib, messageDispatcher } from '@moodle/domain'
import { mainMessageDispatcher as mainMessageDispatcherProvider } from './types'

const mainMessageDispatcherProvider: mainMessageDispatcherProvider = async ({
  configuration,
  domainAccess,
}) => {
  const defaultMessageDispatcher: messageDispatcher = lib.provideMessageDispatcher({
    coreProviders: configuration.coreProviders,
    secondaryProviders: configuration.secondaryProviders,
    log: configuration.mainLogger,
    feedbackDispatcher({ domainAccess }) {
      return defaultMessageDispatcher({ domainAccess })
    },
    start_background_processes: configuration.start_background_processes,
  })

  return defaultMessageDispatcher({ domainAccess })
}
export default mainMessageDispatcherProvider
