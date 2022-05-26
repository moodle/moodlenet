import { ExtDef, Port } from '@moodlenet/kernel'

export type LogLevels = ['debug', 'log', 'info', 'warn', 'error', 'fatal']
export type LogLevel = LogLevels[number]
export type LogOptions = {}

export type Log = {} | { _logOpts: LogOptions }

export type MoodlenetSysLogExt = ExtDef<'moodlenet.sys-log', '0.1.10', { [level in LogLevel]: Port<'in', Log> }>

export type MoodlenetSysLogLib = {
  [level in LogLevel]: (log: Log) => void
}
