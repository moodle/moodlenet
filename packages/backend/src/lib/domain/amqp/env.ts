import amqp from 'amqplib'
import { memoize } from 'lodash'
import { v1 } from 'uuid'
import * as Yup from 'yup'

export const machineId = v1().split('-').slice(-1).pop()!

interface AMQPEnv {
  amqpUrl: string
}

const Validator = Yup.object<AMQPEnv>({
  amqpUrl: Yup.string().required(),
})

const AMQP_URL = process.env.DOMAIN_AMQP_URL

export const env = Validator.validateSync({
  amqpUrl: AMQP_URL,
})!

export const getConnection = memoize(
  async ({ domainName }: { domainName: string }) => [await amqp.connect(env.amqpUrl), domainName] as const,
)

export const DEFAULT_DOMAIN_NAME = process.env.DEFAULT_DOMAIN_NAME || 'DEFAULT'
