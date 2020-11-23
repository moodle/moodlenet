import amqp, { Options } from 'amqplib'
import { resolve } from 'path'
import { inspect } from 'util'
import * as Yup from 'yup'
import { DomainPersistence } from './impl/persistence/types'

type AmqpOptsEnv = Pick<Options.Connect, 'hostname' | 'port' | 'password' | 'username'>

interface QueueEnv {
  amqpOpts: AmqpOptsEnv
  persistenceModule: string
  logLevel: number
}

const Validator = Yup.object<QueueEnv>({
  amqpOpts: Yup.object<AmqpOptsEnv>({
    hostname: Yup.string().required().default('localhost'),
    username: Yup.string(),
    password: Yup.string(),
    port: Yup.number().default(5672),
  }).required(),
  persistenceModule: Yup.string().required().default('arango'),
  logLevel: Yup.number().integer().min(0).max(5).required().default(0),
})

const LOG_LEVEL = process.env.DOMAIN_LOG_LEVEL
const AMQP_HOST = process.env.DOMAIN_AMQP_HOST
const AMQP_USERNAME = process.env.DOMAIN_AMQP_USERNAME
const AMQP_PASSWORD = process.env.DOMAIN_AMQP_PASSWORD
const AMQP_PORT = process.env.DOMAIN_AMQP_PORT
const PERSISTENCE_IMPL = process.env.DOMAIN_PERSISTENCE_IMPL

export const env = Validator.validateSync({
  amqpOpts: {
    hostname: AMQP_HOST,
    username: AMQP_USERNAME,
    password: AMQP_PASSWORD,
    port: AMQP_PORT,
  },
  persistenceModule: PERSISTENCE_IMPL,
  logLevel: LOG_LEVEL,
})!

const implPathBase = [__dirname, 'impl']
export const persistence = require(resolve(
  ...implPathBase,
  'persistence',
  env.persistenceModule
)) as DomainPersistence

export const logger = (baseTag: string) => (tag: string) => (
  objs: any,
  level?: 0 | 1 | 2 | 3 | 4
) => {
  const _level = typeof level === 'number' ? level : 2
  if (_level < env.logLevel) {
    return
  }
  setTimeout(() => {
    const pad = 7
    const fn = (['debug', 'log', 'info', 'warn', 'error'] as const)[_level]
    const fnStr = fn
      .toUpperCase()
      .padStart(fn.length + Math.floor((pad - fn.length) / 2), ' ')
      .padEnd(pad, ' ')
    const objStr = Array.isArray(objs)
      ? objs
      : [objs].map((obj) => inspect(obj, false, null, true)).join('\n')
    console[fn](`
[${fnStr}] @${new Date()} ${baseTag}.${tag}
${objStr}
--++--
`)
  }, 0)
}

export const channelPromise = amqp
  .connect({ ...env.amqpOpts })
  .then((connection) => connection.createConfirmChannel())
