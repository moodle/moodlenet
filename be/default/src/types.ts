import {
  coreProvider,
  domainAccess,
  domainLogger,
  LogSeverity,
  messageDispatcher,
  secondaryProvider,
} from '@moodle/domain'
import { _any } from '@moodle/lib-types'

export type configurator_deps = { domainAccess: domainAccess; loggerConfigs: loggerConfigs }
export type configurator = (_: configurator_deps) => Promise<configuration>
export type configuration = {
  coreProviders: coreProvider<_any>[]
  secondaryProviders: secondaryProvider[]
  start_background_processes: boolean
  mainLogger: domainLogger
}

export type mainMessageDispatcherDeps = {
  domainAccess: domainAccess
  configuration: configuration
}
export type mainMessageDispatcher = (_: mainMessageDispatcherDeps) => Promise<unknown>

export type binder_deps = { messageDispatcher: messageDispatcher }

export type binder = (_: binder_deps) => void
export type loggerConfigs = {
  consoleLevel?: LogSeverity
  file?: {
    path: string
    level: string
  }
}
