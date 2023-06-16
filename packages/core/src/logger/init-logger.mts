import winston from 'winston'
import { coreConfigs } from '../main/env.mjs'
import type { PkgIdentifier } from '../types.mjs'
//https://datatracker.ietf.org/doc/html/rfc5424 + "event"
export type LogLevel = keyof typeof logLevelMap
export const logLevelMap = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warn: 4,
  event: 4,
  notice: 5,
  info: 6,
  debug: 7,
}
const mainLoggerConfigs = coreConfigs.mainLogger

const transports: winston.transport[] = []

transports.push(
  new winston.transports.Console({
    level: mainLoggerConfigs?.consoleLevel ?? 'debug',
    format: winston.format.combine(
      winston.format.padLevels(),
      winston.format.timestamp(),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`
      }),
    ),
  }),
)

mainLoggerConfigs?.file &&
  transports.push(
    new winston.transports.File({
      filename: mainLoggerConfigs.file.path,
      level: mainLoggerConfigs.file.level,
      format: winston.format.combine(
        winston.format.padLevels(),
        winston.format.timestamp(),
        winston.format.uncolorize(),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${message}`
        }),
      ),
    }),
  )

export const mainLogger = winston.createLogger({ transports, levels: logLevelMap })

export function getChildLogger(pkgId: PkgIdentifier): winston.Logger {
  const label = `${pkgId.name}@${pkgId.version}`
  return mainLogger.child({ label })
}
