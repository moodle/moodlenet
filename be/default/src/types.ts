import { domainAccess, LogSeverity, messageDispatcher } from '@moodle/domain'
import { configuration } from '@moodle/domain/lib'

export type configurator_deps = { domainAccess: domainAccess; loggerConfigs: loggerConfigs }
export type configurator = (_: configurator_deps) => Promise<configuration>

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
