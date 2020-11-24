import amqp, { Options } from 'amqplib'
import { resolve } from 'path'
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
export const mainNodePersistence = require(resolve(
  ...implPathBase,
  'persistence',
  env.persistenceModule
)) as DomainPersistence

export const channelPromise = amqp
  .connect({ ...env.amqpOpts })
  .then((connection) => connection.createConfirmChannel())
