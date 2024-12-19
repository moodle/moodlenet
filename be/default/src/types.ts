import { binderDispatcher, binderReceiver, LogSeverity } from '@moodle/domain'
import { configuration } from '@moodle/domain/lib'

export type configurator_deps = {
  domainName: string
  loopbackDispatcherProvider: loopbackDispatcherProvider
}
export type configuratorResult = {
  configuration: configuration
  loopbackDispatcher: binderDispatcher
}

export type configurator = (_: configurator_deps) => Promise<configuratorResult>

export type loopbackDispatcherProvider = (_: {
  configuration: Omit<configuration, 'loopbackDispatcher'>
}) => Promise<{ loopbackDispatcher: binderDispatcher }>

export type loopbackProvider = () => Promise<{
  drain?: drain
  loopbackDispatcherProvider: loopbackDispatcherProvider
}>

type drain = () => Promise<void>

export type binderReceiverProvider = () => Promise<{ binderReceiver: binderReceiver; drain?: drain }>

export type loggerConfigs = {
  consoleLevel?: LogSeverity
  file?: {
    path: string
    level: string
  }
}
