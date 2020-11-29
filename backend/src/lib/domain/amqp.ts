// import { delay } from 'bluebird'
import { Message, Options, Replies } from 'amqplib'
import { EventEmitter } from 'events'
import { newUuid } from '../helpers/misc'
import { channelPromise as channel } from './domain.env'
import { Flow } from './types/path'

const defPubOpts: Options.Publish = {
  deliveryMode: 2,
}

type MessageHeaders = {
  'x-flow-key': string
  'x-flow-route': string
}
const encodeMsgHeaders = (_: { flow: Flow }): MessageHeaders => ({
  'x-flow-key': _.flow._key,
  'x-flow-route': _.flow._route,
})
const decodeMsgHeaders = (msg: Message | null): null | { flow: Flow } => {
  if (!msg) {
    return null
  }
  const flowKey: string | undefined = msg.properties.headers[`x-flow-key`]
  const flowRoute: string | undefined = msg.properties.headers['x-flow-route']
  if (!(flowKey && flowRoute)) {
    return null
  }
  return {
    flow: { _key: flowKey, _route: flowRoute },
  }
}

const msgFlow = (msg: Message): Flow => {
  const [_route, _key] = msg.fields.routingKey.split('.').slice(-2)
  return {
    _key,
    _route,
  }
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
    const taggedTopic = `${topic}.${flow._route}.${flow._key}`
    const payloadBuf = json2Buffer(payload)
    const ch = await channel
    const confirmFn = (err: any) => (err ? reject(err) : resolve())

    if (opts?.delay) {
      const { delayedX } = await assertDelayQX({ domain })
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
      const domEx = await getAssertDomainExchangeName(domain)
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
  // flow:Flow // TODO: needs it ?
  handler: (_: {
    msgJsonContent: any
    msg: Message
    flow: Flow
    stopConsume(): unknown
  }) => Acks | Promise<Acks>
  opts?: QConsumeOpts
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

export const getAssertDomainExchangeName = async (domainName: string) => {
  const exName = `Domain.${domainName}`
  return (await assertX({ name: exName, type: 'topic' })).exchange
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))
const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

export const bindQ = async (
  _: ({ exchange: string; domain?: undefined } | { exchange?: undefined; domain: string }) & {
    name: string
    topic: string
    args?: any
  }
) => {
  const { args, domain = '', name, topic, exchange = '' } = _
  const ex = exchange || (await getAssertDomainExchangeName(domain))
  if (!asserts.BQ[name]) {
    const ch = await channel
    asserts.BQ[bindQAssertCachekey({ ex, name, topic })] = await ch.bindQueue(name, ex, topic, args)
  }

  return {
    unbind,
  }
  function unbind() {
    unbindQ({ domain, name, topic, args })
  }
}
const bindQAssertCachekey = (_: { name: string; ex: string; topic: string }) =>
  `${_.name}<-${_.ex}.${_.topic}`

export const unbindQ = async (_: { name: string; domain: string; topic: string; args?: any }) => {
  const { args, domain, name, topic } = _
  const ex = await getAssertDomainExchangeName(domain)
  await (await channel).unbindQueue(name, ex, topic, args)
  delete asserts.BQ[bindQAssertCachekey({ ex, name, topic })]
  return asserts.BQ[name]
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

// TODO: may remove BQ?
const asserts = { Q: {}, X: {}, BQ: {} } as {
  Q: Record<string, Replies.AssertQueue>
  X: Record<string, Replies.AssertExchange>
  BQ: Record<string, Replies.Empty>
}

export const assertQ = async (_: { name: string; opts?: DomainQueueOpts }) => {
  const { opts, name } = _
  if (!asserts.Q[name]) {
    const ch = await channel
    asserts.Q[name] = await ch.assertQueue(name, {
      ...opts,
    })
  }
  return asserts.Q[name]
}

const assertX = async (_: {
  name: string
  type: '' | 'topic' | 'direct' | 'headers' | 'fanout' | 'match'
  opts?: DomainExchangeOpts
}) => {
  const { opts, name, type } = _
  if (!asserts.X[name]) {
    const ch = await channel
    asserts.X[name] = await ch.assertExchange(name, type, opts)
  }
  return asserts.X[name]
}

const assertDelayQX = async (_: { domain: string; tag?: string }) => {
  const { domain, tag = '' } = _
  const domainEx = await getAssertDomainExchangeName(domain)
  const prefix = `${domainEx}${tag && `[${tag}]`}:SERVICE_DELAY_`
  const delayedQName = `${prefix}QUEUE`
  const delayedX = `${prefix}EXCH`
  await assertX({ name: delayedX, type: 'fanout' })
  const q = await assertQ({
    name: delayedQName,
    opts: { deadLetterExchange: domainEx },
  })
  await bindQ({ name: delayedQName, exchange: delayedX, topic: '' })
  return {
    q: q.queue,
    delayedX,
  }
}

const NodeEmitter = new EventEmitter()

const mainNodeQName = `MainNode:${newUuid()}`
channel.then(async (ch) => {
  const mainNodeQ = await assertQ({
    name: mainNodeQName,
    opts: { exclusive: true, autoDelete: true },
  })
  ch.consume(mainNodeQ.queue, (msg) => {
    const headers = decodeMsgHeaders(msg)
    if (!headers) {
      return
    }
    const { flow } = headers

    const ev = flow._key
    msg && ch.ack(msg)
    if (!ev) {
      return
    }
    NodeEmitter.emit(ev, msg)
  })
})

export const mainNodeQEmitter = {
  sub<T>(_: { flow: Flow; handler(_: EventEmitterType<T>): unknown }) {
    const { flow, handler } = _
    const ev = flow._key

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

export type EventEmitterType<T> = {
  msg: Message
  jsonContent: T
  unsub(): unknown
}

export type DomainSendToQueueOpts = Options.Publish & {}
export type DomainQueueOpts = Options.AssertQueue & {}
export type QConsumeOpts = Options.Consume & { errorAck?: Acks.nack | Acks.reject }

type DomainExchangeOpts = {}

export enum Acks {
  nack = 'nack',
  reject = 'reject',
  ack = 'ack',
}
