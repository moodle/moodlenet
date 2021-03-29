import { Message } from 'amqplib'
import { EventEmitter } from 'events'
import { memo } from '../../helpers/misc'
import { Flow } from '../flow'
import { DomainSetup } from '../types'
import { getConnection, machineId } from './env'

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
  if (!(route && id)) {
    throw new Error('should never happen')
  }
  return [route, id]
}
export const registeredImpl: Record<string, DomainSetup<any>> = {}
export const registerImpl = (domainName: string, impl: DomainSetup<any>) => (registeredImpl[domainName] = impl)
export const getRegisteredImpl = (domainName: string): DomainSetup<any> | undefined => registeredImpl[domainName]

export const getTopicChannel = memo(async (domainName: string, topic: string, prefetch: number) => {
  const [connection] = await getConnection({ domainName })
  const channel = await connection.createConfirmChannel()
  channel.prefetch(prefetch, false)
  return [channel, topic, domainName, prefetch] as const
})

export const getMachineChannel = memo(async (domainName: string) => {
  const [connection] = await getConnection({ domainName })
  const channel = await connection.createConfirmChannel()
  return channel
})

export const downStream = memo(async (domainName: string) => {
  const downstreamQName = `${domainName}:MachineDownStreamQueue:${machineId}`
  const downStreamEmitter = new EventEmitter()

  const machineChannel = await getMachineChannel(domainName)

  await machineChannel.assertQueue(downstreamQName, {
    durable: false,
    exclusive: true,
    autoDelete: true,
  })
  machineChannel.consume(downstreamQName, msg => {
    if (!msg) {
      return
    }
    machineChannel.ack(msg)
    const messageId = msg.properties.correlationId
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

export const delayedTopology = memo(async (domainName: string) => {
  const delayedQName = getDomainDelayQueueName({ domainName })
  const delayedExchangeName = getDomainDelayExchangeName({ domainName })

  const machineChannel = await getMachineChannel(domainName)

  await machineChannel.assertQueue(delayedQName, {
    durable: true,
  })

  await machineChannel.assertExchange(delayedExchangeName, 'fanout', { durable: true })
  await machineChannel.bindQueue(delayedQName, delayedExchangeName, '')
})

export const mainSetup = async ({ domainName }: { domainName: string }) => {
  const domainExchange = getDomainExchangeName({ domainName })
  const channel = await getMachineChannel(domainName)
  await channel.assertExchange(domainExchange, 'topic', { durable: true })
}

export const getDomainExchangeName = ({ domainName }: { domainName: string }) => `${domainName}.MainExchange`
export const getDomainDelayExchangeName = ({ domainName }: { domainName: string }) =>
  `${getDomainDelayExchangeAndQueuePrefix({ domainName })}Exchange`
export const getDomainDelayQueueName = ({ domainName }: { domainName: string }) =>
  `${getDomainDelayExchangeAndQueuePrefix({ domainName })}Queue`
export const getDomainDelayExchangeAndQueuePrefix = ({ domainName }: { domainName: string }) => `${domainName}:Delay`
export const getWorkerQName = ({ domainName, topic }: { domainName: string; topic: string }) =>
  `${domainName}:${topic}:WorkerQueue`
export const getSubscriberQName = ({ domainName, topic }: { domainName: string; topic: string }) =>
  `${domainName}:${topic}:SubscriberQueue`

export const routingKeyFor = (path: string, [route, id]: Flow) => `${path}.${route}.${id}`
