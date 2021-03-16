import amqp from 'amqplib'
import { v1 } from 'uuid'
import * as Yup from 'yup'

export const machineId = v1().split('-').slice(-1).pop()!

interface AMQPEnv {
  amqpUrl: string
}

const Validator = Yup.object<AMQPEnv>({
  amqpUrl: Yup.string().required(),
})

export const getConnection = /* memo( */ async ({ domainName }: { domainName: string }) => {
  const AMQP_URL = process.env.DOMAIN_AMQP_URL

  const env = Validator.validateSync({
    amqpUrl: AMQP_URL,
  })!

  const connection = await amqp.connect(env.amqpUrl)

  return [connection, domainName] as const
} /* ) */

export const getDefaultDomainName = () => process.env.DEFAULT_DOMAIN_NAME || 'DEFAULT'
