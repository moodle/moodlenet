import { any_, d_u } from '@moodle/lib-types'

//https://datatracker.ietf.org/doc/html/rfc5424
export type logSeverity = 'emergency' | 'alert' | 'critical' | 'error' | 'warn' | 'notice' | 'info' | 'debug'

export const logLevelMap: Record<logSeverity, number> = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warn: 4,
  notice: 5,
  info: 6,
  debug: 7,
}
export type loggerContext = { more?: any_ } & d_u<
  {
    core: {
      request: moo.core.request<moo.persona.endpoint<any_>>
    }
    model: {
      envelope: moo.model.envelope<moo.model.ops.opDef>
    }
    infra: {
      name: string
    }
    setup: {
      name: string
    }
  },
  'for'
>

export type loggerProvider = (_: loggerContext) => logger
export type logger = {
  [level in logSeverity]: (..._: any_[]) => void
}

export const logLevelColors: Record<logSeverity, string> = {
  emergency: 'magenta',
  alert: 'magenta',
  critical: 'red',
  error: 'red',
  warn: 'yellow',
  notice: 'green',
  info: 'blue',
  debug: 'cyan',
}
