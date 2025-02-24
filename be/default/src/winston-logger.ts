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
          winston.format.printf(_info => {
            const info = _info as loggerContext & Logform.TransformableInfo
            return `---- ${info.for} ----
${info.timestamp}: [${info.level}]
${loggerContextFormatter[info.for](info as any_)}
${info.message}
`
          }),
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
            winston.format.uncolorize(),
            winston.format.json({ replacer: redacted_json_replacer }),
          ),
        }),
      ],
    })

  const loggerProvider: loggerProvider = loggerContext => {
    const childLogger = winstonLogger.child(loggerContext)
    return new Proxy({} as logger, {
      ...unsupportedProxyHandler,
      get(_target, level) {
        assert(typeof level === 'string', `Unsupported log level ${typeof level}:${String(level)}`)
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

const loggerContextFormatter = {
  core(c: d_u__d<loggerContext, 'for', 'core'>) {
    const { id, sessionInfo, now, gateAccess } = c.access
    return `Core Access:
id:${id}
now:${now}
sessionInfo:
  user:${sessionInfo.user.type}${
    sessionInfo.user.type === 'anon'
      ? ''
      : `
    id:${sessionInfo.user.id}
  session personas:${Object.keys(sessionInfo.session)}
gateAccess:
  path:${gateAccess.path.join('.')}
  claims:${inspect(gateAccess.claims, { breakLength: 120, maxStringLength: 3000, colors: true, depth: 8 })}
  form:${inspect(_redact(gateAccess.form), { breakLength: 120, maxStringLength: 3000, colors: true, depth: 8 })}
`
  }

`
  },
  model(c: d_u__d<loggerContext, 'for', 'model'>) {
    const { callTime, id, now, message, origin, target } = c.access
    return `Model Access:
id:${id}
callTime:${callTime} (now:${now})
target:
  opName:${target.opName}
  type:${target.type}
  path:${target.path.join('.')}
origin:
  useCase: ${origin.useCase}
  from:${
    origin.from
      ? `
    opName:${origin.from.opName}
    type:${origin.from.type}
    path:${origin.from.path.join('.')}
  `
      : '~'
  }
message:${inspect(_redact(message), { breakLength: 120, maxStringLength: 3000, colors: true, depth: 8 })}
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
