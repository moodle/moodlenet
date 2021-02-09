import amqp from 'amqplib'
import * as Yup from 'yup'

interface QueueEnv {
  amqpUrl: string
  logLevel: number
}

const Validator = Yup.object<QueueEnv>({
  amqpUrl: Yup.string().required(),
  logLevel: Yup.number().integer().min(0).max(5).required().default(0),
})

const LOG_LEVEL = process.env.DOMAIN_LOG_LEVEL
const AMQP_URL = process.env.DOMAIN_AMQP_URL

export const env = Validator.validateSync({
  amqpUrl: AMQP_URL,
  logLevel: LOG_LEVEL,
})!

export const channelPromise = amqp.connect(env.amqpUrl).then(connection => connection.createConfirmChannel())
