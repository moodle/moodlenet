import { _any } from '@moodle/lib-types'

//https://datatracker.ietf.org/doc/html/rfc5424
export type LogSeverity =
  | 'emergency'
  | 'alert'
  | 'critical'
  | 'error'
  | 'warn'
  | 'notice'
  | 'info'
  | 'debug'

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
export type domainLogger = (level: LogSeverity, tag?: _any) => (..._: _any[]) => void

export const logLevelColors: Record<LogSeverity, string> = {
  emergency: '#ff00d9',
  alert: '#cc00ff',
  critical: '#ff0000',
  error: '#ff5500',
  warn: '#ffc900',
  notice: '#6bc400',
  info: '#0075c4',
  debug: '#00c4ba',
}
