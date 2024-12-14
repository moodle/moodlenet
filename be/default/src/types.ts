import { binderDispatcher, domainAccess, LogSeverity } from '@moodle/domain'
import { configuration } from '@moodle/domain/lib'

export type configurator_deps = { domainAccess: domainAccess; loggerConfigs: loggerConfigs }
export type configurator = (_: configurator_deps) => Promise<configuration>

export type loopbackDispatcherProvider = (_: { configuration: configuration }) => Promise<binderDispatcher>

export type loggerConfigs = {
  consoleLevel?: LogSeverity
  file?: {
    path: string
    level: string
  }
}
