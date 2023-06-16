import winston from 'winston'
import { coreConfigs } from '../main/env.mjs'
import type { PkgIdentifier } from '../types.mjs'

const mainLoggerConfigs = coreConfigs.mainLogger ?? {
  consoleLevel: 'info',
  file: {
    path: './moodlenet.log',
    level: 'info',
  },
}

const transports: winston.transport[] = []

mainLoggerConfigs.consoleLevel &&
  transports.push(
    new winston.transports.Console({
      level: mainLoggerConfigs.consoleLevel,
      format: winston.format.combine(winston.format.colorize()),
    }),
  )

mainLoggerConfigs.file &&
  transports.push(
    new winston.transports.File({
      filename: mainLoggerConfigs.file.path,
      level: mainLoggerConfigs.file.level,
    }),
  )

export const mainLogger = winston.createLogger({ transports })

export function getChildLogger(pkgId: PkgIdentifier): winston.Logger {
  return mainLogger.child({ pkg: pkgId.name })
}
