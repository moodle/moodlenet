import { logLevelColors, logLevelMap, loggerContext, loggerProvider } from '@moodle/domain'
import { _any } from '@moodle/lib-types'
import { inspect } from 'util'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { loggerConfigs } from './types'

export function createDefaultDomainLoggerProvider({ loggerConfigs }: { loggerConfigs: loggerConfigs }): {
  loggerProvider: loggerProvider
} {
  const winstonLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: loggerConfigs.consoleLevel ?? 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize({ colors: logLevelColors, message: false }),
          winston.format.printf(extended_loggerContext => {
            return ctxString(extended_loggerContext as extended_loggerContext)
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
            winston.format.printf(extended_loggerContext => {
              return ctxString(extended_loggerContext as extended_loggerContext)
            }),
          ),
        }),
      ],
    })

  const loggerProvider: loggerProvider = loggerContext => {
    const childLogger = winstonLogger.child(loggerContext)
    return (level, ...args) => {
      const message = args.map((arg: unknown) => inspect(arg, { colors: true, depth: 8, })).join('\n')
      childLogger.log(level, message)
    }
  }
  return { loggerProvider }
}
type extended_loggerContext = loggerContext & { level: string; message: _any; timestamp: _any }
function ctxString({
  level,
  message,
  timestamp,
  domain,
  id,
  contextLayer,
  //
  originEndpoint,
  callerContext,
  primarySessionId,
  endpoint,
}: extended_loggerContext) {
  const NOT_AVAILABLE_CHAR = '~'
  return `${timestamp} [${level}]
  domain            : ${domain}
  context           : ${contextLayer} # ${id}
  callerContext     : ${callerContext ? `${callerContext.layer}.${callerContext.module} # ${callerContext.ctxId}` : NOT_AVAILABLE_CHAR}
  originEndpoint    : ${(originEndpoint ?? [NOT_AVAILABLE_CHAR]).join('.')}
  endpoint          : ${(endpoint ?? [NOT_AVAILABLE_CHAR]).join('.')}
  primarySessionId  : ${primarySessionId ?? NOT_AVAILABLE_CHAR}

${message}

---`
}
