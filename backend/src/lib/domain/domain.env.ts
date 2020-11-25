import amqp, { Options } from 'amqplib'
import * as Yup from 'yup'

type AmqpOptsEnv = Pick<Options.Connect, 'hostname' | 'port' | 'password' | 'username'>

interface QueueEnv {
  amqpOpts: AmqpOptsEnv
  logLevel: number
}

const Validator = Yup.object<QueueEnv>({
  amqpOpts: Yup.object<AmqpOptsEnv>({
    hostname: Yup.string().required().default('localhost'),
    username: Yup.string(),
    password: Yup.string(),
    port: Yup.number().default(5672),
  }).required(),
  logLevel: Yup.number().integer().min(0).max(5).required().default(0),
})

const LOG_LEVEL = process.env.DOMAIN_LOG_LEVEL
const AMQP_HOST = process.env.DOMAIN_AMQP_HOST
const AMQP_USERNAME = process.env.DOMAIN_AMQP_USERNAME
const AMQP_PASSWORD = process.env.DOMAIN_AMQP_PASSWORD
const AMQP_PORT = process.env.DOMAIN_AMQP_PORT

export const env = Validator.validateSync({
  amqpOpts: {
    hostname: AMQP_HOST,
    username: AMQP_USERNAME,
    password: AMQP_PASSWORD,
    port: AMQP_PORT,
  },
  logLevel: LOG_LEVEL,
})!

export const channelPromise = amqp
  .connect({ ...env.amqpOpts })
  .then((connection) => connection.createConfirmChannel())
