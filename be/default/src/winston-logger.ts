import { logLevelColors, logLevelMap, logSeverity, logger, loggerContext, loggerProvider } from '@moodle/domain'
import { any_, d_u__d, redacted_json_replacer, unsupportedProxyHandler } from '@moodle/lib-types'
import assert from 'assert'
import { inspect } from 'util'
import winston, { Logform } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

export type winstonLoggerConfigs = {
  consoleLevel: logSeverity
  file?: {
    path: string
    level: string
  }
}

export function createWinstonDomainLoggerProvider({ loggerConfigs }: { loggerConfigs: winstonLoggerConfigs }): {
  loggerProvider: loggerProvider
} {
  const winstonLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: loggerConfigs.consoleLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize({ colors: logLevelColors, message: false }),
          winston.format.printf(_info => format(_info as loggerContext & Logform.TransformableInfo)),
        ),
      }),
    ],
    levels: logLevelMap,
  })

  loggerConfigs.file &&
    winstonLogger.configure({
      transports: [
        ...winstonLogger.transports,
        new DailyRotateFile({
          filename: loggerConfigs.file.path,
          level: loggerConfigs.file.level,
          format: winston.format.combine(
            winston.format.padLevels(),
            winston.format.timestamp(),
            winston.format.colorize({ colors: logLevelColors, message: false }),
            winston.format.printf(_info => format(_info as loggerContext & Logform.TransformableInfo)),
          ),
        }),
      ],
    })

  const loggerProvider: loggerProvider = loggerContext => {
    const childLogger = winstonLogger.child(loggerContext)
    return new Proxy({} as logger, {
      ...unsupportedProxyHandler,
      get(_target, level) {
        assert(typeof level === 'string', `Unsupported log level ${typeof level}: ${String(level)}`)
        return (...args: any_[]) => {
          const message = args
            .map((arg: unknown) => {
              return typeof arg === 'object' ? inspect(_redact(arg), { breakLength: 120, colors: true, depth: 8 }) : arg
            })
            .join('\n')
          childLogger.log(level, message)
        }
      },
    })
  }

  return { loggerProvider }
}

function format(info: loggerContext & Logform.TransformableInfo) {
  return `
- - - - - - - - - -
${info.timestamp}
${info.level} [${info.for}]
${loggerContextFormatter[info.for](info as any_)}
${info.message}
- - - - - - - - - -
`
}

const loggerContextFormatter = {
  core(c: d_u__d<loggerContext, 'for', 'core'>) {
    const { id, permissionsInfo, now, gateRequest } = c.request
    return `Core Access:
id: ${id}
now: ${now}
sessionInfo:
  user: ${permissionsInfo.user.type}${
    permissionsInfo.user.type === 'anon'
      ? ''
      : `
    id: ${permissionsInfo.user.id}${'' /*  session personas: ${Object.keys(permissionsInfo.tree)} */}`
  }
gateRequest:
  path: ${gateRequest.path.join('.')}
  claims: ${inspect(gateRequest.info.claims, { breakLength: 300, maxStringLength: 600, colors: true, depth: 8 })}
  form: ${inspect(_redact(gateRequest.form), { breakLength: 300, maxStringLength: 600, colors: true, depth: 8 })}
`
  },
  model(c: d_u__d<loggerContext, 'for', 'model'>) {
    const { callTime, id, now, message, origin, target } = c.envelope
    return `Model Access:
id: ${id}
callTime: ${callTime} (now: ${now})
target:
  path: ${target.path.join('.')}
  opName: ${target.opName}
  type: ${target.type}
origin:
  gate: ${inspect(origin.gate, { colors: true })}
  from:
    ${
      origin.from ? inspect(origin.from, { breakLength: 300, maxStringLength: 600, colors: true, depth: 8 }) : '~'
      /*from: ${
    origin.from
      ? `
    id: ${origin.from.id}
    target:
      opName: ${origin.from.target.opName}
      type: ${origin.from.target.type}
      path: ${origin.from.target.path.join('.')}`
      : '~'*/
    }
message: ${inspect(_redact(message), { breakLength: 120, maxStringLength: 3000, colors: true, depth: 8 })}
`
  },
  infra(c: d_u__d<loggerContext, 'for', 'infra'>) {
    return `[${c.name}]`
  },
  setup(c: d_u__d<loggerContext, 'for', 'setup'>) {
    return `[${c.name}]`
  },
}

function _redact(o: any_) {
  return o && JSON.parse(JSON.stringify(o, redacted_json_replacer))
}
