import { domainLogger, logLevelColors, logLevelMap } from '@moodle/domain'
import { inspect } from 'util'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { loggerConfigs } from './types'

export function createDefaultDomainLoggerProvider({
  loggerConfigs,
  domainName,
}: {
  loggerConfigs: loggerConfigs
  domainName: string
}): {
  getChildLogger(_: { modName: string }): domainLogger
} {
  const mainLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: loggerConfigs.consoleLevel ?? 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize({ colors: logLevelColors, message: false }),
          winston.format.printf(({ level, message: args, modName, timestamp, tag }) => {
            return `${timestamp} [${level}] [${domainName}#${modName}#${tag}]: ${inspect(args, { colors: true, depth: 8 })}`
          }),
        ),
      }),
    ],
    levels: logLevelMap,
  })

  loggerConfigs.file &&
    mainLogger.configure({
      transports: [
        ...mainLogger.transports,
        new DailyRotateFile({
          filename: loggerConfigs.file.path,
          level: loggerConfigs.file.level,
          format: winston.format.combine(
            winston.format.padLevels(),
            winston.format.timestamp(),
            winston.format.uncolorize(),
            winston.format.printf(({ level, message: args, modName, tag, timestamp }) => {
              return `${timestamp} [${level}] [${domainName}#${modName}#${tag}]: ${args.map((arg: unknown) => JSON.stringify(arg, null, 2)).join('\n')}\n---\n`
            }),
          ),
        }),
      ],
    })
  return { getChildLogger }

  function getChildLogger({ modName }: { modName: string }): domainLogger {
    const winstonLogger = mainLogger.child
    return (level, tag) =>
      (...args) => {
        winstonLogger({ modName, tag }).log(level, args)
      }
  }
}
