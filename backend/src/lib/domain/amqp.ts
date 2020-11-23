// import { delay } from 'bluebird'
import { Message, Replies } from 'amqplib'
import { nodeLogger } from '.'
import { never } from '../helpers/misc'
import { channelPromise as channel } from './domain.env'
import { Path } from './transport/types'

const log = nodeLogger('transport')('amqp')

export type DomainPublishOpts =
  | { delay?: number; replyTo?: undefined }
  | { delay?: undefined; replyTo?: string }
export const domainPublish = (_: { path: Path; payload: any; opts?: DomainPublishOpts }) =>
  new Promise<void>(async (resolve, reject) => {
    const { path, payload, opts } = _
    const { dom, srv, topic, ex } = await getPathInfo(path)
    log([`publish ${ex} ${topic}`, { payload }], 0)

    const payloadBuf = json2Buffer(payload)
    const ch = await channel
    const confirmFn = (err: any) => (err ? reject(err) : resolve())

    if (opts?.delay) {
      const { ex: delayEx } = await assertDelayQX({ dom, srv })
      await ch.publish(
        delayEx,
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
      await ch.publish(
        ex,
        topic,
        payloadBuf,
        {
          replyTo: opts?.replyTo,
          deliveryMode: 2,
        },
        confirmFn
      )
    }
  })

const getPathInfo = async (path: Path) => {
  const [dom, srv, sect] = path
  return {
    dom,
    srv,
    sect,
    topic: path.join('.'),
    ex: await getDomainExchangeName(dom),
    payloadTypeName: getPayloadTypeName(path),
  }
}
export const getPayloadTypeName = (path: Path) => {
  const revIndex = path[2] === 'wf' && path[5] !== 'start' ? 1 : 0
  const payloadTypeName = (revIndex && path[path.length - revIndex]) || ''
  return payloadTypeName
}

export const domainConsume = async (_: {
  topic: string
  dom: string
  srv: string
  qName: string
  handler: (_: { msgJsonContent: any; msg: Message }) => Acks | Promise<Acks>
  opts?: { consume?: DomainConsumeOpts }
}) => {
  const { topic: _topic, handler, opts, dom, srv, qName } = _
  const topic = `${dom}.${srv}.${_topic}`

  log([`domainConsume`, { topic, qName }], 0)
  const errorAck = opts?.consume?.errorAck || Acks.reject
  const ch = await channel
  const consumer = await ch.consume(
    qName,
    async (msg) => {
      if (!msg) {
        return
      }
      log([`domainConsume got msg `, { topic, qName }, msg.fields, msg.properties])
      let msgJsonContent: any = `~~~NOT PARSED~~~`
      try {
        msgJsonContent = buffer2Json(msg.content)
        const ack = await handler({ msgJsonContent, msg })
        ch[ack](msg)
      } catch (err) {
        log([`domainConsume handler error ${qName}`, { msgJsonContent, err }], 0)
        ch[errorAck](msg)
      }
    },
    {}
  )
  return () => {
    ch.cancel(consumer.consumerTag)
    ch.deleteQueue(qName)
  }
}

export const bindPath = async (_: {
  qName: string
  dom: string
  topic: string
  opts?: { args: any; q: DomainQueueOpts }
}) => {
  const { dom, qName, topic, opts } = _

  const srcEx = await getDomainExchangeName(dom)
  log(['BindPath', { qName, topic }], 0)
  await assertQ({ name: qName, opts: opts?.q })
  await bindQ({
    name: qName,
    ex: srcEx,
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

export const bindQ = async (_: { name: string; ex: string; topic: string; args?: any }) => {
  const { args, ex, name, topic } = _
  if (!asserts.BQ[name]) {
    const ch = await channel
    asserts.BQ[bindQkey({ ex, name, topic })] = await ch.bindQueue(name, ex, topic, args)
  }
  return asserts.BQ[name]
}
const bindQkey = (_: { name: string; ex: string; topic: string }) => `${_.name}<-${_.ex}.${_.topic}`

export const unbindQ = async (_: { name: string; ex: string; topic: string; args?: any }) => {
  const { args, ex, name, topic } = _
  await (await channel).unbindQueue(name, ex, topic, args)
  delete asserts.BQ[bindQkey({ ex, name, topic })]
  return asserts.BQ[name]
}

// TODO: may remove BQ?
const asserts = { Q: {}, X: {}, BQ: {} } as {
  Q: Record<string, Replies.AssertQueue>
  X: Record<string, Replies.AssertExchange>
  BQ: Record<string, Replies.Empty>
}

const assertQ = async (_: { name: string; opts?: DomainQueueOpts }) => {
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

const assertDelayQX = async (_: { dom: string; srv: string }) => {
  const { dom, srv } = _
  const prefix = `${dom}${srv}:SERVICE_DELAY_`
  const domainEx = await getDomainExchangeName(dom)
  const srvDelayedQName = `${prefix}QUEUE`
  const srvDelayedX = `${prefix}EXCH`
  await assertX({ name: srvDelayedX, type: 'fanout' })
  const q = await assertQ({
    name: srvDelayedQName,
    opts: { deadLetterExchange: domainEx },
  })
  await bindQ({ name: srvDelayedQName, ex: srvDelayedX, topic: '' })
  log(['ass del q', { q: q.queue, ex: srvDelayedX }], 0)
  return {
    q: q.queue,
    ex: srvDelayedX,
  }
}

type DomainQueueOpts = /* Options.AssertQueue &  */ {}
type DomainConsumeOpts = /* Options.Consume &  */ {
  errorAck?: Acks.nack | Acks.reject
}

type DomainExchangeOpts = /* Options.AssertExchange &  */ {}

export enum Acks {
  nack = 'nack',
  reject = 'reject',
  ack = 'ack',
}
