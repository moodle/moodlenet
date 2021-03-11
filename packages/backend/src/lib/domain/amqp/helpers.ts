import { Message } from 'amqplib'
import { EventEmitter } from 'events'
import { memoize } from 'lodash'
import { Flow } from '../flow'
import { DomainSetup } from '../types'
import { getConnection, machineId } from './env'

export const DEFAULT_DOMAIN_NAME = 'MoodleNet'
export const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))
export const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

export const NOT_PARSED = Symbol()
export const getMessagePayload = (msg: Message) => {
  let payload: any = NOT_PARSED

  try {
    // msgFlow(msg)
    payload = buffer2Json(msg.content)
  } catch (err) {}

  return payload
}

export const msgFlow = (msg: Message): Flow => {
  const [route, id] = msg.fields.routingKey.split('.').slice(-2)
  return [route, id]
}
export const registeredImpl: Record<string, DomainSetup<any>> = {}
export const registerImpl = (domainName: string, impl: DomainSetup<any>) => (registeredImpl[domainName] = impl)
export const getRegisteredImpl = (domainName: string): DomainSetup<any> | undefined => registeredImpl[domainName]

export const getTopicChannel = memoize(async (domainName: string, topic: string, prefetch: number) => {
  const [connection] = await getConnection({ domainName })
  const channel = await connection.createConfirmChannel()
  channel.prefetch(prefetch, false)
  return [channel, topic, domainName, prefetch] as const
})

export const getMachineChannel = memoize(async (domainName: string) => {
  const [connection] = await getConnection({ domainName })
  return connection.createConfirmChannel()
})

export const downStream = memoize(async (domainName: string) => {
  const downstreamQName = `MachineDownStreamQueue:${machineId}`
  const downStreamEmitter = new EventEmitter()

  const machineChannel = await getMachineChannel(domainName)

  await machineChannel.assertQueue(downstreamQName, {
    durable: false,
    exclusive: true,
    autoDelete: true,
  })
  machineChannel.consume(downstreamQName, msg => {
    msg && machineChannel.ack(msg)
    const messageId = msg?.properties.correlationId
    if (!messageId) {
      return
    }

    downStreamEmitter.emit(messageId, msg)
  })

  const sub = (_: { messageId: string; handler(_: EventEmitterHandlerArgType): unknown }) => {
    const { messageId, handler } = _

    downStreamEmitter.once(messageId, listener)
    return unsub
    function unsub() {
      downStreamEmitter.removeListener(messageId, listener)
    }
    function listener(msg: Message) {
      handler({
        jsonContent: buffer2Json(msg.content),
        msg,
        messageId,
      })
    }
  }
  return { sub, queue: downstreamQName }
})
export type EventEmitterHandlerArgType = {
  msg: Message
  jsonContent: any
  messageId: string
}

export const delayedTopology = memoize(async (domainName: string) => {
  const delayedQName = getDomainDelayQueueName({ domainName })
  const delayedExchangeName = getDomainDelayExchangeName({ domainName })

  const machineChannel = await getMachineChannel(domainName)

  await machineChannel.assertQueue(delayedQName, {
    durable: false,
    exclusive: true,
    autoDelete: true,
  })

  await machineChannel.assertExchange(delayedExchangeName, 'fanout', { durable: true })
  await machineChannel.bindQueue(delayedQName, delayedExchangeName, '')
})

export const mainSetup = async ({ domainName }: { domainName: string }) => {
  const domainExchange = getDomainExchangeName({ domainName })
  const channel = await getMachineChannel(domainName)
  await channel.assertExchange(domainExchange, 'topic', { durable: true })
}

export const getDomainExchangeName = ({ domainName }: { domainName: string }) => `${domainName}.Exchange`
export const getDomainDelayExchangeName = ({ domainName }: { domainName: string }) =>
  `${getDomainDelayExchangeAndQueuePrefix({ domainName })}EXCHANGE`
export const getDomainDelayQueueName = ({ domainName }: { domainName: string }) =>
  `${getDomainDelayExchangeAndQueuePrefix({ domainName })}QUEUE`
export const getDomainDelayExchangeAndQueuePrefix = ({ domainName }: { domainName: string }) =>
  `${domainName}:SERVICE_DELAY_`
export const getWorkerQName = ({ domainName, topic }: { domainName: string; topic: string }) =>
  `WORKER_QUEUE:${domainName}:${topic}`
export const getSubscriberQName = ({ domainName, topic }: { domainName: string; topic: string }) =>
  `SUBSCRIBER_QUEUE:${domainName}:${topic}`

export const routingKeyFor = (path: string, [route, id]: Flow) => `${path}.${route}.${id}`
