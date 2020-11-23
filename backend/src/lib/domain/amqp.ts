// import { delay } from 'bluebird'
import { Message, Options, Replies } from 'amqplib'
import { nodeLogger } from '.'
import { channelPromise as channel } from './domain.env'

const log = nodeLogger('amqp-transport')

export const domainPublish = (_: {
  domain: string
  topic: string
  payload: any
  opts?: DomainPublishOpts
}) =>
  new Promise<void>(async (resolve, reject) => {
    const { topic, payload, opts, domain } = _
    log([`publish ${domain} ${topic}`, { payload }], 0)

    const payloadBuf = json2Buffer(payload)
    const ch = await channel
    const confirmFn = (err: any) => (err ? reject(err) : resolve())

    if (opts?.delay) {
      const { delayedX } = await assertDelayQX({ domain })
      await ch.publish(
        delayedX,
        topic,
        payloadBuf,
        {
          ...opts,
          expiration: opts.delay,
          deliveryMode: 2,
        },
        confirmFn
      )
    } else {
      const domEx = await getDomainExchangeName(domain)
      await ch.publish(
        domEx,
        topic,
        payloadBuf,
        {
          ...opts,
          deliveryMode: 2,
        },
        confirmFn
      )
    }
  })

export const domainConsume = async (_: {
  topic: string
  domain: string
  qName: string
  handler: (_: { msgJsonContent: any; msg: Message }) => Acks | Promise<Acks>
  opts?: { consume?: QConsumeOpts; queue: QConsumeOpts }
}) => {
  const { topic, handler, domain, opts, qName } = _
  await bindPath({ topic, domain, qName })
  log([`def domainConsume`, { topic, qName }], 0)
  return queueConsume({
    handler,
    qName,
    opts: opts?.queue,
  })
}

export const queueConsume = async (_: {
  qName: string
  handler: (_: { msgJsonContent: any; msg: Message; stop(): unknown }) => Acks | Promise<Acks>
  opts?: QConsumeOpts
}) => {
  const { handler, opts, qName } = _

  log([`def queueConsume`, { qName }], 0)
  const ch = await channel
  const stop = async () => {
    ch.cancel((await consumerPr).consumerTag)
    ch.deleteQueue(qName)
  }
  const consumerPr = ch.consume(
    qName,
    async (msg) => {
      if (!msg) {
        return
      }

      log([`queueConsume got msg `, { qName }, msg.fields, msg.properties])
      let msgJsonContent: any = `~~~NOT PARSED~~~`
      try {
        msgJsonContent = buffer2Json(msg.content)
        const ack = await handler({ msgJsonContent, msg, stop })
        ch[ack](msg)
      } catch (err) {
        log([`queueConsume handler error ${qName}`, { msgJsonContent, err }], 0)
        const errorAck = opts?.errorAck || Acks.reject
        ch[errorAck](msg)
      }
    },
    { ...opts }
  )
  return stop
}

export const bindPath = async (_: {
  qName: string
  domain: string
  topic: string
  opts?: { args?: any }
}) => {
  const { domain, qName, topic, opts } = _

  log(['bindPath', { qName, topic }], 0)
  await bindQ({
    name: qName,
    domain,
    topic,
    args: opts?.args,
  })
}

const getDomainExchangeName = async (domainName: string) => {
  const exName = `Domain.${domainName}`
  return (await assertX({ name: exName, type: 'topic' })).exchange
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))
const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

export const bindQ = async (_: { name: string; domain: string; topic: string; args?: any }) => {
  const { args, domain, name, topic } = _
  const ex = await getDomainExchangeName(domain)
  if (!asserts.BQ[name]) {
    const ch = await channel
    asserts.BQ[bindQAssertCachekey({ ex, name, topic })] = await ch.bindQueue(name, ex, topic, args)
  }
  return asserts.BQ[name]
}
const bindQAssertCachekey = (_: { name: string; ex: string; topic: string }) =>
  `${_.name}<-${_.ex}.${_.topic}`

export const unbindQ = async (_: { name: string; ex: string; topic: string; args?: any }) => {
  const { args, ex, name, topic } = _
  await (await channel).unbindQueue(name, ex, topic, args)
  delete asserts.BQ[bindQAssertCachekey({ ex, name, topic })]
  return asserts.BQ[name]
}

export const sendToQueue = async (_: {
  name: string
  content: any
  opts?: DomainSendToQueueOpts
}) => {
  const { name, content } = _
  return (await channel).sendToQueue(name, json2Buffer(content), {})
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
  const domainEx = await getDomainExchangeName(domain)
  const prefix = `${domainEx}${tag && `[${tag}]`}:SERVICE_DELAY_`
  const delayedQName = `${prefix}QUEUE`
  const delayedX = `${prefix}EXCH`
  await assertX({ name: delayedX, type: 'fanout' })
  const q = await assertQ({
    name: delayedQName,
    opts: { deadLetterExchange: domainEx },
  })
  await bindQ({ name: delayedQName, domain, topic: '' })
  log(['assert delay q', { q: q.queue, ex: delayedX }], 0)
  return {
    q: q.queue,
    delayedX,
  }
}

export type DomainPublishOpts = Options.Publish & {
  delay?: number
  replyTo?: string
  messageId?: string
}
export type DomainSendToQueueOpts = {}
export type DomainQueueOpts = Options.AssertQueue & {}
export type QConsumeOpts = Options.Consume & { errorAck?: Acks.nack | Acks.reject }

type DomainExchangeOpts = {}

export enum Acks {
  nack = 'nack',
  reject = 'reject',
  ack = 'ack',
}
