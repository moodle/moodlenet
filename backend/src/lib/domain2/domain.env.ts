import amqp, { Options } from 'amqplib'
import * as Yup from 'yup'

type AmqpOptsEnv = Pick<Options.Connect, 'hostname' | 'port' | 'password' | 'username'>

interface QueueEnv {
  amqpOpts: AmqpOptsEnv
}

const AMQP_HOST = process.env.QUEUE_AMQP_HOST
const AMQP_USERNAME = process.env.QUEUE_AMQP_USERNAME
const AMQP_PASSWORD = process.env.QUEUE_AMQP_PASSWORD
const AMQP_PORT = process.env.QUEUE_AMQP_PORT

const Validator = Yup.object<QueueEnv>({
  amqpOpts: Yup.object<AmqpOptsEnv>({
    hostname: Yup.string().default('localhost'),
    username: Yup.number(),
    password: Yup.string(),
    port: Yup.number().default(5672),
  }).required(),
})

export const env = Validator.validateSync({
  redisOpts: {
    hostname: AMQP_HOST,
    username: AMQP_USERNAME,
    password: AMQP_PASSWORD,
    port: AMQP_PORT,
  },
})!

export const channelPromise = amqp
  .connect({ ...env.amqpOpts })
  .then((connection) => connection.createChannel())
