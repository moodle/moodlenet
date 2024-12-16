import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { coreConfigs } from '../main/env.mjs'
import type { PkgIdentifier } from '../types.mjs'
//https://datatracker.ietf.org/doc/html/rfc5424
export type LogLevel =
  | 'event'
  | 'emergency'
  | 'alert'
  | 'critical'
  | 'error'
  | 'warn'
  | 'notice'
  | 'info'
  | 'debug'
type AllLogLevel = LogLevel | 'event'
export const logLevelMap: Record<AllLogLevel, number> = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warn: 4,
  notice: 5,
  info: 6,
  debug: 7,
  event: 8,
}
const mainLoggerConfigs = coreConfigs.mainLogger

const colors: Record<AllLogLevel, string> = {
  event: 'blue',
  emergency: 'red',
  alert: 'red',
  critical: 'red',
  error: 'red',
  warn: 'yellow',
  notice: 'green',
  info: 'blue',
  debug: 'cyan',
}

export const mainLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: mainLoggerConfigs?.consoleLevel ?? 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ colors, message: false }),
        winston.format.printf(({ level, message, pkgId, timestamp }) => {
          return `${timestamp} [${level}] [${label(pkgId as PkgIdentifier)}]: ${message}`
        }),
      ),
    }),
  ],
  levels: logLevelMap,
})

mainLoggerConfigs?.file &&
  mainLogger.configure({
    transports: [
      ...mainLogger.transports,
      new DailyRotateFile({
        filename: mainLoggerConfigs.file.path,
        level: mainLoggerConfigs.file.level,
        format: winston.format.combine(
          winston.format.padLevels(),
          winston.format.timestamp(),
          winston.format.uncolorize(),
          winston.format.printf(({ level, message, pkgId, timestamp }) => {
            return `${timestamp} [${level}] [${label(pkgId as PkgIdentifier)}]: ${message}`
          }),
        ),
      }),
    ],
  })

export function getChildLogger(pkgId: PkgIdentifier): winston.Logger {
  return mainLogger.child({ pkgId })
}
function label(pkgId: PkgIdentifier) {
  return `${pkgId.name}@${pkgId.version}`
}
