import { any_ } from '@moodle/lib-types'
import { baseContext, domainLayer, moodleModuleName } from './concrete'
import { domainAccess, domainEndpoint } from './msg'

//https://datatracker.ietf.org/doc/html/rfc5424
export type LogSeverity = 'emergency' | 'alert' | 'critical' | 'error' | 'warn' | 'notice' | 'info' | 'debug'

export const logLevelMap: Record<LogSeverity, number> = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warn: 4,
  notice: 5,
  info: 6,
  debug: 7,
}
export type loggerContext = {
  primarySessionId?: string
  contextLayer: domainLayer
  endpoint?: domainEndpoint
  moduleName: moodleModuleName
} & Pick<baseContext, 'domain' | 'id'> &
  Pick<domainAccess, 'callerContext' | 'originEndpoint' | 'enqueue'>

export type loggerProvider = (_: loggerContext) => Logger
export type Logger = (level: LogSeverity, ..._: any_[]) => void

export const logLevelColors: Record<LogSeverity, string> = {
  emergency: 'magenta',
  alert: 'magenta',
  critical: 'red',
  error: 'red',
  warn: 'yellow',
  notice: 'green',
  info: 'blue',
  debug: 'cyan',
}
