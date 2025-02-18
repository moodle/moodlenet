import { logLevelColors, logLevelMap, logSeverity, logger, loggerProvider } from '@moodle/domain'
import { any_, redacted_json_replacer, unsupportedProxyHandler } from '@moodle/lib-types'
import assert from 'assert'
import { inspect } from 'util'
import winston from 'winston'
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
          winston.format.json({ replacer: redacted_json_replacer }),
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
              return typeof arg === 'object' ? inspect(arg, { colors: true, depth: 8 }) : arg
            })
            .join('\n')
          childLogger.log(level, message)
        }
      },
    })
  }

  return { loggerProvider }
}
