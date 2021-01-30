// import { delay } from 'bluebird'
import { Message, MessagePropertyHeaders, Options } from 'amqplib'
import { EventEmitter } from 'events'
import { channelPromise as channel } from './domain.env'
import { flowId, flowRoute, nodeId } from './helpers'
import { Flow } from './types/path'

const defPubOpts: Options.Publish = {
  deliveryMode: 2,
}

type DomainMessageHeaders = {
  'x-flow-id': string
  'x-flow-route': string
  'x-flow-nodeId': string
}
const encodeMsgHeaders = (_: { flow: Flow }): DomainMessageHeaders => ({
  'x-flow-id': flowId(_.flow),
  'x-flow-route': flowRoute(_.flow),
  'x-flow-nodeId': nodeId,
})
const decodeMsgHeaders = (msg: Message | null) => {
  if (!msg) {
    return null
  }
  const headers = msg.properties.headers as MessagePropertyHeaders &
    Partial<DomainMessageHeaders>
  const flowId = headers[`x-flow-id`]
  const flowRoute = headers['x-flow-route']
  const nodeId = headers['x-flow-nodeId']
  const flow: Flow | undefined =
    flowId && flowRoute ? [flowRoute, flowId] : undefined
  return {
    flow,
    nodeId,
  }
}

const msgFlow = (msg: Message): Flow => {
  const [route, id] = msg.fields.routingKey.split('.').slice(-2)
  return [route, id]
}

export type DomainPublishOpts = Options.Publish & {
  replyToNodeQ?: boolean
  delay?: number
  messageId?: string
}
export const domainPublish = (_: {
  domain: string
  topic: string
  flow: Flow
  payload: any
  opts?: DomainPublishOpts
}) =>
  new Promise<void>(async (resolve, reject) => {
    const { topic, flow, payload, opts, domain } = _
    const taggedTopic = `${topic}.${flowRoute(flow)}.${flowId(flow)}`
    const payloadBuf = json2Buffer(payload)
    const ch = await channel
    const confirmFn = (err: any) => (err ? reject(err) : resolve())

    if (opts?.delay) {
      const delayedX = getDomainDelayExchangeName(domain)
      await ch.publish(
        delayedX,
        taggedTopic,
        payloadBuf,
        {
          ...opts,
          ...defPubOpts,
          headers: encodeMsgHeaders({ flow }),
          replyTo: opts.replyToNodeQ ? mainNodeQName : undefined,
          expiration: opts.delay,
        },
        confirmFn
      )
    } else {
      const domEx = await getDomainExchangeName(domain)
      await ch.publish(
        domEx,
        taggedTopic,
        payloadBuf,
        {
          ...opts,
          ...defPubOpts,
          headers: encodeMsgHeaders({ flow }),
          replyTo: opts?.replyToNodeQ ? mainNodeQName : undefined,
        },
        confirmFn
      )
    }
  })

export const queueConsume = async (_: {
  qName: string
  handler: (_: {
    msgJsonContent: any
    msg: Message
    flow: Flow
    stopConsume(): unknown
  }) => Acks | Promise<Acks>
  opts?: DomainConsumeOpts
}) => {
  const { handler, opts, qName } = _

  const ch = await channel
  const stopConsume = async () => {
    ch.cancel((await consumerPr).consumerTag)
    ch.deleteQueue(qName)
  }
  const consumerPr = ch.consume(
    qName,
    async (msg) => {
      if (!msg) {
        return
      }

      let msgJsonContent: any = `~~~NOT PARSED~~~`
      try {
        msgJsonContent = buffer2Json(msg.content)
        const flow = msgFlow(msg)
        const ack = await handler({ msgJsonContent, msg, stopConsume, flow })
        ch[ack](msg)
      } catch (err) {
        const errorAck = opts?.errorAck || Acks.reject
        ch[errorAck](msg, false)
      }
    },
    { ...opts }
  )
  return { stopConsume }
}

export const getDomainExchangeName = (domainName: string) =>
  `Domain.${domainName}`

export const assertDomainExchange = async (_: { domain: string }) => {
  const { domain } = _
  const exName = getDomainExchangeName(domain)
  return (await assertX({ name: exName, type: 'topic' })).exchange
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))
const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

export const bindQ = async (_: {
  exchange: string
  name: string
  topic: string
  args?: any
}) => {
  const { args, name, topic, exchange } = _
  const ch = await channel
  const {} = await ch.bindQueue(name, exchange, topic, args)

  return {
    unbind,
  }
  function unbind() {
    unbindQ({ exchange, name, topic, args })
  }
}

export const unbindQ = async (_: {
  name: string
  exchange: string
  topic: string
  args?: any
}) => {
  const { args, exchange, name, topic } = _
  const ch = await channel
  await ch.unbindQueue(name, exchange, topic, args)
}

export const sendToQueue = async (_: {
  name: string
  content: any
  flow: Flow
  opts?: DomainSendToQueueOpts
}) => {
  const { name, content, opts, flow } = _
  return (await channel).sendToQueue(name, json2Buffer(content), {
    ...defPubOpts,
    ...opts,
    headers: encodeMsgHeaders({ flow }),
  })
}

export const assertQ = async (_: { name: string; opts?: DomainQueueOpts }) => {
  const { opts, name } = _
  const ch = await channel
  return ch.assertQueue(name, {
    ...opts,
  })
}

const assertX = async (_: {
  name: string
  type: '' | 'topic' | 'direct' | 'headers' | 'fanout' | 'match'
  opts?: DomainExchangeOpts
}) => {
  const { opts, name, type } = _
  const ch = await channel
  return await ch.assertExchange(name, type, opts)
}

const getDomainDelayExchangeAndQueuePrefix = (domain: string) =>
  `${getDomainExchangeName(domain)}:SERVICE_DELAY_`
const getDomainDelayExchangeName = (domain: string) =>
  `${getDomainDelayExchangeAndQueuePrefix(domain)}EXCHANGE`
const getDomainDelayQueueName = (domain: string) =>
  `${getDomainDelayExchangeAndQueuePrefix(domain)}QUEUE`

export const assertDomainDelayedQueueAndExchange = async (_: {
  domain: string
}) => {
  const { domain } = _
  const domainExchangeName = getDomainExchangeName(domain)
  const delayedQName = getDomainDelayQueueName(domain)
  const delayedX = getDomainDelayExchangeName(domain)
  await assertX({ name: delayedX, type: 'fanout' })
  const q = await assertQ({
    name: delayedQName,
    opts: { deadLetterExchange: domainExchangeName },
  })
  await bindQ({ name: delayedQName, exchange: delayedX, topic: '' })
  return {
    q: q.queue,
    delayedX,
  }
}

const NodeEmitter = new EventEmitter()

const mainNodeQName = `MachineQueue:${nodeId}`
channel.then(async (ch) => {
  const mainNodeQ = await assertQ({
    name: mainNodeQName,
    opts: { exclusive: true, autoDelete: true },
  })
  ch.consume(mainNodeQ.queue, (msg) => {
    msg && ch.ack(msg)
    const headers = decodeMsgHeaders(msg)
    if (!headers) {
      return
    }
    const { flow } = headers
    if (!flow) {
      return
    }
    const ev = flowId(flow)
    NodeEmitter.emit(ev, msg)
  })
})

export const mainNodeQEmitter = {
  sub<T>(_: {
    flow: Flow
    handler(_: EventEmitterHandlerArgType<T>): unknown
  }) {
    const { flow, handler } = _
    const ev = flowId(flow)

    NodeEmitter.addListener(ev, listener)
    return unsub
    function unsub() {
      ev && NodeEmitter.removeListener(ev, listener)
    }
    function listener(msg: Message) {
      handler({
        jsonContent: buffer2Json(msg.content),
        msg,
        unsub,
      })
    }
  },
}

export type EventEmitterHandlerArgType<T> = {
  msg: Message
  jsonContent: T
  unsub(): void
}

export type DomainSendToQueueOpts = Options.Publish & {}
export type DomainQueueOpts = Options.AssertQueue & {}
export type DomainConsumeOpts = Options.Consume & {
  errorAck?: Acks.nack | Acks.reject
}

export type DomainExchangeOpts = Options.AssertExchange & {}

export enum Acks {
  nack = 'nack',
  reject = 'reject',
  ack = 'ack',
}
